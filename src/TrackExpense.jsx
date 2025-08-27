import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import "./TrackExpense.css";

const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#FFBB28", "#8884D8", "#D84B4B"];

const regularExpenseOptions = [
  "House Rent",
  "Food",
  "Groceries",
  "Electricity",
  "Water",
  "Cooking Gas",
  "Fuel"
];

// Simulate authentication check (replace with real logic in production)
const isUserLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";

const TrackExpense = () => {
  const navigate = useNavigate();

  const [salary, setSalary] = useState('');
  const [regularExpense, setRegularExpense] = useState({ category: regularExpenseOptions[0], amount: '' });
  const [regularExpenses, setRegularExpenses] = useState([]);
  const [additionalExpenses, setAdditionalExpenses] = useState([{ name: '', amount: '' }]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const isEmptyRegularExpense = () => !regularExpense.amount || Number(regularExpense.amount) <= 0;
  const isEmptyAdditionalExpense = () => additionalExpenses.some(exp => (!exp.name.trim() || !exp.amount || Number(exp.amount) <= 0));

  // Check if 'House Rent' has already been added
  const houseRentAlreadyAdded = regularExpenses.some(exp => exp.category === "House Rent");

  const confirmRegularExpense = () => {
    if (isEmptyRegularExpense()) {
      setAlertMessage("Please enter a valid regular expense and amount before confirming.");
      return;
    }
    if (regularExpense.category === "House Rent" && houseRentAlreadyAdded) {
      setAlertMessage("You can only add House Rent once.");
      return;
    }
    if (getCurrentGrade() < 0) {
      setAlertMessage("Grade too low! Cannot add more expenses.");
      return;
    }
    setRegularExpenses([...regularExpenses, { ...regularExpense, amount: Number(regularExpense.amount) }]);
    setRegularExpense({ category: regularExpenseOptions.find(opt => 
      opt !== "House Rent" || !houseRentAlreadyAdded
    ), amount: '' });
  };

  const deleteRegularExpense = (index) => {
    const newRegularExpenses = regularExpenses.filter((_, i) => i !== index);
    setRegularExpenses(newRegularExpenses);
  };

  const addAdditionalExpense = () => {
    if (isEmptyAdditionalExpense()) {
      setAlertMessage("Please enter a valid name and amount for the additional expense before adding a new one.");
      return;
    }
    if (getCurrentGrade() < 0) {
      setAlertMessage("Grade too low! Cannot add more expenses.");
      return;
    }
    setAdditionalExpenses([...additionalExpenses, { name: '', amount: '' }]);
  };

  const handleAdditionalChange = (index, field, value) => {
    const newExpenses = [...additionalExpenses];
    newExpenses[index][field] = value;
    setAdditionalExpenses(newExpenses);
  };

  const deleteAdditionalExpense = (index) => {
    const newExpenses = additionalExpenses.filter((_, i) => i !== index);
    setAdditionalExpenses(newExpenses);
  };

  const totalRegular = regularExpenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const totalAdditional = additionalExpenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const totalExpenses = totalRegular + totalAdditional;
  let grade = 100;
  if (salary && totalExpenses > 0) {
    const ratio = totalExpenses / salary;
    grade = Math.max(0, Math.round((1 - ratio) * 100));
    grade -= 5 * regularExpenses.length;
    grade -= 10 * additionalExpenses.filter(e => e.name.trim() !== '' && Number(e.amount) > 0).length;
    grade = Math.max(0, Math.min(grade, 100));
  }
  const getCurrentGrade = () => grade;

  const expenseData = [
    ...regularExpenses.map(e => ({ name: e.category, value: e.amount })),
    ...additionalExpenses.filter(e => e.name.trim() !== '' && Number(e.amount) > 0)
      .map(e => ({ name: e.name, value: Number(e.amount) })),
  ];

  const TrashIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      width="20"
      viewBox="0 0 24 24"
      fill="#FF6600"
      cursor="pointer"
      style={{ marginLeft: 8 }}
    >
      <path d="M3 6h18v2H3V6zm2 3h14v11c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 3v6h2v-6H8zm4 0v6h2v-6h-2zm3-10H8v1h7V2z" />
    </svg>
  );

  const handleFinish = () => {
    if (!salary || totalRegular === 0 && totalAdditional === 0) {
      setAlertMessage("Please fill your salary and at least one valid expense before finishing.");
      return;
    }
    if (additionalExpenses.some(exp => exp.name.trim() === '' && exp.amount !== '')) {
      setAlertMessage("Please fill both name and amount for each additional expense before finishing.");
      return;
    }
    setShowFinal(true);
  };

  const handleSave = () => {
    if (!isUserLoggedIn()) {
      setAlertMessage("Please log in to save your data.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    setAlertMessage("Your data has been saved!");
  };

  // Button styles
  const smallButtonStyle = {
    fontSize: "0.85rem",
    padding: "6px 12px",
    borderRadius: "5px",
    minWidth: 0,
  };
  const saveButtonStyle = {
    display: "block",
    margin: "18px auto 0 auto",
    width: 120,
    fontSize: "0.9rem",
    padding: "8px 0",
    borderRadius: "6px",
    backgroundColor: "#0088FE",
    color: "#fff",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  };

  // Make "House Rent" option disabled if already added
  const availableOptions = houseRentAlreadyAdded
    ? regularExpenseOptions.map(opt =>
        opt === "House Rent" ? { value: opt, disabled: true } : { value: opt, disabled: false }
      )
    : regularExpenseOptions.map(opt => ({ value: opt, disabled: false }));

  return (
    <div className="page-container">
      {alertMessage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "#ffdddd",
            color: "#a00",
            padding: "12px 20px",
            fontWeight: "600",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
          }}
        >
          {alertMessage}
        </div>
      )}
      <nav className="sidebar">
        <h3 className="sidebar-title">Services</h3>
        <Link to="/track-expense" className="nav-link-active">
          Track Expense
        </Link>
        <Link to="/generate-plan" className="nav-link">
          Generate Plan
        </Link>
        <Link to="/previous-plans" className="nav-link">
          Previous Plans
        </Link>
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </nav>
      <main className="main-content" style={{ paddingTop: alertMessage ? 50 : 0 }}>
        <div className="left-content">
          <h2>Track Your Expenses</h2>
          <label className="label">
            Monthly Salary:
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              min="0"
              className="input"
              placeholder="Enter your salary"
              disabled={showFinal}
            />
          </label>
          <h3>Regular Expenses</h3>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 10,
              alignItems: "center"
            }}
          >
            <select
              value={regularExpense.category}
              onChange={(e) => setRegularExpense({ ...regularExpense, category: e.target.value })}
              style={{ flex: 2, padding: 10, fontSize: 14, borderRadius: 6, border: "1px solid #ccc" }}
              disabled={showFinal}
            >
              {availableOptions.map(opt => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.value}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              value={regularExpense.amount}
              onChange={(e) => setRegularExpense({ ...regularExpense, amount: e.target.value })}
              placeholder="Amount"
              style={{ flex: 1, padding: 10, fontSize: 14, borderRadius: 6, border: "1px solid #ccc" }}
              disabled={showFinal}
            />
            <button
              onClick={confirmRegularExpense}
              className="button"
              style={smallButtonStyle}
              disabled={showFinal}
            >
              ADD
            </button>
          </div>
          {regularExpenses.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <h4>Confirmed Regular Expenses</h4>
              {regularExpenses.map((e, i) => (
                <div
                  key={i}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}
                >
                  <span>{e.category}</span>
                  <span>₹{e.amount.toFixed(2)}</span>
                  {!showFinal && (
                    <button
                      onClick={() => deleteRegularExpense(i)}
                      style={{ ...smallButtonStyle, background: "none", color: "#FF6600" }}
                      aria-label="Delete regular expense"
                      title="Delete regular expense"
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
              ))}
              {!showFinal && (
                <button
                  className="button"
                  style={{ ...smallButtonStyle, marginTop: 10, width: "100%" }}
                  onClick={confirmRegularExpense}
                >
                  Add Another Regular Expense
                </button>
              )}
            </div>
          )}
          <h3>Additional Expenses</h3>
          {additionalExpenses.map((expense, i) => (
            <div key={i} className="expense-row" style={{ alignItems: "center" }}>
              <input
                type="text"
                placeholder="Expense Name"
                value={expense.name}
                onChange={(e) => handleAdditionalChange(i, "name", e.target.value)}
                className="input"
                style={{ flex: 2, marginRight: 10 }}
                disabled={showFinal}
              />
              <input
                type="number"
                placeholder="Amount"
                value={expense.amount}
                onChange={(e) => handleAdditionalChange(i, "amount", e.target.value)}
                min="0"
                className="input"
                style={{ flex: 1 }}
                disabled={showFinal}
              />
              {!showFinal && (
                <button
                  onClick={() => deleteAdditionalExpense(i)}
                  style={{ ...smallButtonStyle, background: "none", color: "#FF6600" }}
                  aria-label="Delete expense"
                  title="Delete expense"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          ))}
          {!showFinal && (
            <button
              onClick={addAdditionalExpense}
              className="button"
              style={{ ...smallButtonStyle, marginTop: 5 }}
            >
              Add Additional Expense
            </button>
          )}
          {!showFinal && (
            <button
              className="button"
              style={{ ...smallButtonStyle, marginTop: 20, width: "100%" }}
              onClick={handleFinish}
              disabled={totalExpenses === 0 || !salary}
            >
              Finish
            </button>
          )}
        </div>
        {showFinal && (
          <div className="right-content" style={{ paddingTop: 20, maxWidth: 420, minWidth: 300 }}>
            {expenseData.length > 0 ? (
              <>
                <PieChart width={380} height={380}>
                  <Pie
                    data={expenseData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={150}
                    label
                    fontSize={14}
                    fontWeight="bold"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 13 }} />
                </PieChart>
                <div style={{ marginTop: 20, textAlign: "center", fontWeight: "600", fontSize: 18 }}>
                  Expense Grade: {grade} / 100
                </div>
                <button
                  className="button"
                  style={saveButtonStyle}
                  onClick={handleSave}
                >
                  Save
                </button>
              </>
            ) : (
              <p style={{ color: "#888" }}>No expenses entered.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TrackExpense;
