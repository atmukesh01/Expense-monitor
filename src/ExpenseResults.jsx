// src/ExpenseResults.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#FFBB28", "#8884D8", "#D84B4B"];

const ExpenseResults = ({ expenseData, grade, handleSave }) => {
    return (
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
    );
};

export default ExpenseResults;