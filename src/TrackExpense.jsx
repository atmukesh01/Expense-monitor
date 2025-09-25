import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./TrackExpense.css";

const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#FFBB28", "#8884D8", "#D84B4B"];
const regularExpenseOptions = ["House Rent", "Food", "Groceries", "Electricity", "Water", "Cooking Gas", "Fuel"];
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

    const houseRentAlreadyAdded = regularExpenses.some(exp => exp.category === "House Rent");

    const confirmRegularExpense = () => {
        if (!regularExpense.amount || Number(regularExpense.amount) <= 0) {
            return setAlertMessage("Please enter a valid regular expense amount.");
        }
        if (regularExpense.category === "House Rent" && houseRentAlreadyAdded) {
            return setAlertMessage("You can only add House Rent once.");
        }
        setRegularExpenses([...regularExpenses, { ...regularExpense, amount: Number(regularExpense.amount) }]);
        const nextOption = regularExpenseOptions.find(opt => !regularExpenses.some(re => re.category === opt));
        setRegularExpense({ category: nextOption || regularExpenseOptions[0], amount: '' });
    };

    const deleteRegularExpense = (index) => setRegularExpenses(regularExpenses.filter((_, i) => i !== index));

    const addAdditionalExpense = () => {
        const lastExpense = additionalExpenses[additionalExpenses.length - 1];
        if (!lastExpense.name.trim() || !lastExpense.amount || Number(lastExpense.amount) <= 0) {
            return setAlertMessage("Please fill in the current additional expense before adding another.");
        }
        setAdditionalExpenses([...additionalExpenses, { name: '', amount: '' }]);
    };
    
    const handleAdditionalChange = (index, field, value) => {
        const newExpenses = [...additionalExpenses];
        newExpenses[index][field] = value;
        setAdditionalExpenses(newExpenses);
    };

    const deleteAdditionalExpense = (index) => setAdditionalExpenses(additionalExpenses.filter((_, i) => i !== index));

    const handleFinish = () => {
        if (!salary) return setAlertMessage("Please fill in your salary.");
        if (regularExpenses.length === 0 && additionalExpenses.every(e => !e.name.trim() || !e.amount)) {
            return setAlertMessage("Please add at least one valid expense.");
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

    // --- CALCULATIONS ---
    const totalRegular = regularExpenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
    const totalAdditional = additionalExpenses.filter(e => e.amount).reduce((acc, e) => acc + Number(e.amount), 0);
    const totalExpenses = totalRegular + totalAdditional;
    const remainingAmount = salary - totalExpenses;
    let grade = 100;
    if (salary && totalAdditional > 0) {
        const ratio = totalAdditional / salary;
        grade = Math.max(0, (1 - ratio) * 100);
        const penalty = additionalExpenses.filter(e => e.amount > 0).reduce((acc, exp) => acc + (Number(exp.amount) * 0.001), 0);
        grade -= penalty;
        grade = Math.max(0, Math.round(Math.min(grade, 100)));
    }
    const expenseData = [
        ...regularExpenses.map(e => ({ name: e.category, value: e.amount })),
        ...additionalExpenses.filter(e => e.name.trim() && e.amount > 0).map(e => ({ name: e.name, value: Number(e.amount) })),
    ];
    
    const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="currentColor" cursor="pointer" style={{ marginLeft: 8 }}><path d="M3 6h18v2H3V6zm2 3h14v11c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 3v6h2v-6H8zm4 0v6h2v-6h-2zm3-10H8v1h7V2z" /></svg>);
    
    const availableOptions = regularExpenseOptions.map(opt => ({ value: opt, disabled: regularExpenses.some(exp => exp.category === opt) }));
    
    return (
        <div className="page-container">
            {alertMessage && (
                <div className="alert-banner">{alertMessage}</div>
            )}
            
            <nav className="sidebar">
                <div>
                    <h3 className="sidebar-title">Services</h3>
                    <Link to="/track-expense" className="nav-link-active">Track Expense</Link>
                    <Link to="/generate-plan" className="nav-link">Generate Plan</Link>
                    <Link to="/previous-plans" className="nav-link">Previous Plans</Link>
                    <Link to="/profile" className="nav-link">Profile</Link>
                    <Link to="/login" className="nav-link">Login</Link>
                </div>
            </nav>

            <main className="main-content">
                <div className="left-content">
                    <div className="title-container">
                        <h2>Track Your Expenses</h2>
                        {salary > 0 && (
                            <div className={`amount-display ${remainingAmount < 0 ? 'negative' : 'positive'}`}>
                                Remaining: ₹{remainingAmount.toFixed(2)}
                            </div>
                        )}
                    </div>
                    <label className="label">
                        Monthly Salary:
                        <input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} min="0" className="input" placeholder="Enter your salary" disabled={showFinal} />
                    </label>

                    {!showFinal && (
                        <>
                            <h3>Regular Expenses</h3>
                            <div className="input-group">
                                <select value={regularExpense.category} onChange={(e) => setRegularExpense({ ...regularExpense, category: e.target.value })} className="input regular-expense-select" disabled={showFinal}>
                                    {availableOptions.map(opt => (<option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.value}</option>))}
                                </select>
                                <input type="number" min="0" value={regularExpense.amount} onChange={(e) => setRegularExpense({ ...regularExpense, amount: e.target.value })} placeholder="Amount" className="input amount-input" disabled={showFinal} />
                                <button onClick={confirmRegularExpense} className="button small-button" disabled={showFinal}>ADD</button>
                            </div>
                            {regularExpenses.length > 0 && (
                                <div className="expense-list">
                                    <h4>Confirmed Regular Expenses</h4>
                                    {regularExpenses.map((e, i) => (
                                        <div key={i} className="expense-list-item">
                                            <span>{e.category}</span>
                                            <span>₹{Number(e.amount).toFixed(2)}</span>
                                            {!showFinal && <button onClick={() => deleteRegularExpense(i)} className="delete-button"><TrashIcon /></button>}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <h3>Additional Expenses</h3>
                            {additionalExpenses.map((expense, i) => (
                                <div key={i} className="expense-row">
                                    <input type="text" placeholder="Expense Name" value={expense.name} onChange={(e) => handleAdditionalChange(i, "name", e.target.value)} className="input" disabled={showFinal} />
                                    <input type="number" placeholder="Amount" value={expense.amount} onChange={(e) => handleAdditionalChange(i, "amount", e.target.value)} min="0" className="input amount-input" disabled={showFinal} />
                                    {additionalExpenses.length > 1 && !showFinal && <button onClick={() => deleteAdditionalExpense(i)} className="delete-button"><TrashIcon /></button>}
                                </div>
                            ))}
                           {!showFinal && <button onClick={addAdditionalExpense} className="button small-button outline-button" disabled={showFinal}>Add Additional Expense</button>}
                           {!showFinal && <button className="button finish-button" onClick={handleFinish} disabled={!salary}>Finish</button>}
                        </>
                    )}
                </div>
                {showFinal && (
                     <div className="right-content">
                        {expenseData.length > 0 ? (
                            <>
                                <button className="button save-button" onClick={handleSave}>Save</button>
                                <PieChart width={380} height={380}>
                                    <Pie data={expenseData} dataKey="value" nameKey="name" outerRadius={150} label fontSize={14} fontWeight="bold">
                                        {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none', borderRadius: '8px' }} />
                                    <Legend wrapperStyle={{ fontSize: 13 }} />
                                </PieChart>
                                <div className="grade-display">Expense Grade: {grade} / 100</div>
                            </>
                        ) : <p>No valid expenses to display.</p>}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TrackExpense;