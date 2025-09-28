import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import ExpenseResults from "./ExpenseResults";
import "./TrackExpense.css";

const regularExpenseOptions = ["House Rent", "Food", "Groceries", "Electricity", "Water", "Cooking Gas", "Fuel"];

const TrackExpense = () => {
    const navigate = useNavigate();
    const [salary, setSalary] = useState('');
    const [regularExpense, setRegularExpense] = useState({ category: regularExpenseOptions[0], amount: '' });
    const [regularExpenses, setRegularExpenses] = useState([]);
    const [additionalExpenses, setAdditionalExpenses] = useState([{ name: '', amount: '' }]);
    const [alertMessage, setAlertMessage] = useState(null);
    const [showFinal, setShowFinal] = useState(false);

    // --- Logic for Dynamic Sidebar ---
    const isLoggedIn = !!localStorage.getItem('token');
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        navigate('/'); // MODIFIED: Navigates to the home page after logout
    };

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => setAlertMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    // --- All component logic and calculations remain in the parent ---
    const houseRentAlreadyAdded = regularExpenses.some(exp => exp.category === "House Rent");

    const confirmRegularExpense = () => {
        if (!regularExpense.amount || Number(regularExpense.amount) <= 0) return setAlertMessage("Please enter a valid regular expense amount.");
        if (regularExpense.category === "House Rent" && houseRentAlreadyAdded) return setAlertMessage("You can only add House Rent once.");
        setRegularExpenses([...regularExpenses, { ...regularExpense, amount: Number(regularExpense.amount) }]);
        const nextOption = regularExpenseOptions.find(opt => !regularExpenses.some(re => re.category === opt));
        setRegularExpense({ category: nextOption || regularExpenseOptions[0], amount: '' });
    };

    const deleteRegularExpense = (index) => setRegularExpenses(regularExpenses.filter((_, i) => i !== index));

    const addAdditionalExpense = () => {
        const lastExpense = additionalExpenses[additionalExpenses.length - 1];
        if (!lastExpense.name.trim() || !lastExpense.amount || Number(lastExpense.amount) <= 0) return setAlertMessage("Please fill in the current additional expense before adding another.");
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
        if (regularExpenses.length === 0 && additionalExpenses.every(e => !e.name.trim() || !e.amount)) return setAlertMessage("Please add at least one valid expense.");
        setShowFinal(true);
    };

    const totalRegular = regularExpenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
    const totalAdditional = additionalExpenses.filter(e => e.amount).reduce((acc, e) => acc + Number(e.amount), 0);
    const totalExpenses = totalRegular + totalAdditional;
    
    let grade = 100;
    if (salary > 0 && totalAdditional > 0) {
        const ratio = totalAdditional / salary;
        grade = Math.max(0, (1 - ratio) * 100);
        const penalty = additionalExpenses.filter(e => e.amount > 0).reduce((acc, exp) => acc + (Number(exp.amount) * 0.001), 0);
        grade -= penalty;
        grade = Math.max(0, Math.round(Math.min(grade, 100)));
    }
    
    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAlertMessage("Please log in to save your data.");
            setTimeout(() => navigate("/login"), 1500);
            return;
        }
        
        const planData = {
            salary: salary,
            regularExpenses: regularExpenses,
            additionalExpenses: additionalExpenses.filter(e => e.name.trim() && e.amount > 0),
        };

        try {
            const response = await fetch('http://localhost:3001/api/plans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ salary, totalExpenses, grade, planData })
            });
            const data = await response.json();
            setAlertMessage(data.message);
        } catch (error) {
            setAlertMessage('Failed to save plan. Please try again.');
        }
    };

    const remainingAmount = salary - totalExpenses;
    const expenseData = [
        ...regularExpenses.map(e => ({ name: e.category, value: e.amount })),
        ...additionalExpenses.filter(e => e.name.trim() && e.amount > 0).map(e => ({ name: e.name, value: Number(e.amount) })),
    ];
    
    return (
        <div className="page-container">
            {alertMessage && <div className="alert-banner">{alertMessage}</div>}
            
            <nav className="sidebar">
                <div>
                    <h3 className="sidebar-title">Services</h3>
                    <Link to="/track-expense" className="nav-link-active">Track Expense</Link>
                    <Link to="/generate-plan" className="nav-link">Generate Plan</Link>
                    <Link to="/previous-plans" className="nav-link">Previous Plans</Link>
                    <Link to="/profile" className="nav-link">Profile</Link>
                </div>
                <div style={{ marginTop: 'auto' }}>
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="nav-link logout-button" style={{width: '100%', border: 'none'}}>Logout</button>
                    ) : (
                        <Link to="/login" className="nav-link login-link">Login</Link>
                    )}
                </div>
            </nav>

            <main className="main-content">
                <div className="title-container">
                    <h2>Track Your Expenses</h2>
                    {salary > 0 && !showFinal && (
                        <div className={`amount-display ${remainingAmount < 0 ? 'negative' : 'positive'}`}>
                            Remaining: ₹{remainingAmount.toFixed(2)}
                        </div>
                    )}
                </div>
                
                {!showFinal ? (
                    <ExpenseForm 
                        salary={salary} setSalary={setSalary}
                        regularExpense={regularExpense} setRegularExpense={setRegularExpense}
                        regularExpenses={regularExpenses} confirmRegularExpense={confirmRegularExpense}
                        deleteRegularExpense={deleteRegularExpense}
                        additionalExpenses={additionalExpenses} handleAdditionalChange={handleAdditionalChange}
                        addAdditionalExpense={addAdditionalExpense} deleteAdditionalExpense={deleteAdditionalExpense}
                        handleFinish={handleFinish}
                    />
                ) : (
                    <ExpenseResults 
                        expenseData={expenseData}
                        grade={grade}
                        handleSave={handleSave}
                    />
                )}
            </main>
        </div>
    );
};

export default TrackExpense;