// src/ExpenseForm.jsx
import React from "react";

const regularExpenseOptions = ["House Rent", "Food", "Groceries", "Electricity", "Water", "Cooking Gas", "Fuel"];
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24" fill="currentColor" cursor="pointer" style={{ marginLeft: 8 }}><path d="M3 6h18v2H3V6zm2 3h14v11c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9zm3 3v6h2v-6H8zm4 0v6h2v-6h-2zm3-10H8v1h7V2z" /></svg>);

const ExpenseForm = (props) => {
    const {
        salary, setSalary, regularExpense, setRegularExpense,
        regularExpenses, confirmRegularExpense, deleteRegularExpense,
        additionalExpenses, handleAdditionalChange, addAdditionalExpense,
        deleteAdditionalExpense, handleFinish
    } = props;

    const availableOptions = regularExpenseOptions.map(opt => ({ 
        value: opt, 
        disabled: regularExpenses.some(exp => exp.category === opt) 
    }));

    return (
        <div className="left-content">
            <label className="label">
                Monthly Salary:
                <input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} min="0" className="input" placeholder="Enter your salary" />
            </label>

            <h3>Regular Expenses</h3>
            <div className="input-group">
                <select value={regularExpense.category} onChange={(e) => setRegularExpense({ ...regularExpense, category: e.target.value })} className="input regular-expense-select">
                    {availableOptions.map(opt => (<option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.value}</option>))}
                </select>
                <input type="number" min="0" value={regularExpense.amount} onChange={(e) => setRegularExpense({ ...regularExpense, amount: e.target.value })} placeholder="Amount" className="input amount-input" />
                <button onClick={confirmRegularExpense} className="button small-button">ADD</button>
            </div>
            {regularExpenses.length > 0 && (
                <div className="expense-list">
                    <h4>Confirmed Regular Expenses</h4>
                    {regularExpenses.map((e, i) => (
                        <div key={i} className="expense-list-item">
                            <span>{e.category}</span>
                            <span>₹{Number(e.amount).toFixed(2)}</span>
                            <button onClick={() => deleteRegularExpense(i)} className="delete-button"><TrashIcon /></button>
                        </div>
                    ))}
                </div>
            )}

            <h3>Additional Expenses</h3>
            {additionalExpenses.map((expense, i) => (
                <div key={i} className="expense-row">
                    <input type="text" placeholder="Expense Name" value={expense.name} onChange={(e) => handleAdditionalChange(i, "name", e.target.value)} className="input" />
                    <input type="number" placeholder="Amount" value={expense.amount} onChange={(e) => handleAdditionalChange(i, "amount", e.target.value)} min="0" className="input amount-input" />
                    {additionalExpenses.length > 1 && <button onClick={() => deleteAdditionalExpense(i)} className="delete-button"><TrashIcon /></button>}
                </div>
            ))}
            <button onClick={addAdditionalExpense} className="button small-button outline-button">Add Additional Expense</button>
            <button className="button finish-button" onClick={handleFinish} disabled={!salary}>Finish</button>
        </div>
    );
};

export default ExpenseForm;