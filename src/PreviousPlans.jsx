// src/PreviousPlans.jsx
import React, { useState, useEffect } from 'react';

const PreviousPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPlans = async () => {
            const response = await fetch('http://localhost:3001/api/plans', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setPlans(data);
            }
            setLoading(false);
        };
        fetchPlans();
    }, [token]);

    if (loading) return <p>Loading plans...</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>My Saved Plans</h1>
            {plans.length === 0 ? (
                <p>You have no saved plans.</p>
            ) : (
                plans.map(plan => (
                    <div key={plan.id} style={{ border: '1px solid #374151', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
                        <h3>Plan from {new Date(plan.created_at).toLocaleDateString()}</h3>
                        <p><strong>Salary:</strong> ₹{plan.salary}</p>
                        <p><strong>Total Expenses:</strong> ₹{plan.total_expenses}</p>
                        <p><strong>Grade:</strong> {plan.grade}/100</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default PreviousPlans;