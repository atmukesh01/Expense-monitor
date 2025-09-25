// src/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState({ fullName: '', dob: '', gender: '', email: '', phone: '' });
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch user data when component loads
        const fetchProfile = async () => {
            const response = await fetch('http://localhost:3001/api/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                // Format date for input field
                const formattedData = { ...data, dob: data.dob ? data.dob.split('T')[0] : '' };
                setUser(formattedData);
            }
        };
        fetchProfile();
    }, [token]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3001/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(user),
        });
        const data = await response.json();
        setMessage(data.message);
    };

    return (
        <div className="page-container">
            <nav className="sidebar">
                {/* Your other links can go here */}
                <Link to="/login" className="nav-link" style={{ marginTop: 'auto' }}>Login</Link>
            </nav>
            <main className="main-content">
                <div className="left-content">
                    <h2>My Profile</h2>
                    <form onSubmit={handleSubmit}>
                        <label className="label">Full Name: <input type="text" name="fullName" value={user.fullName} onChange={handleChange} className="input" /></label>
                        <label className="label">Date of Birth: <input type="date" name="dob" value={user.dob} onChange={handleChange} className="input" /></label>
                        <label className="label">Gender: <input type="text" name="gender" value={user.gender} onChange={handleChange} className="input" /></label>
                        <label className="label">Email: <input type="email" name="email" value={user.email} disabled className="input" /></label>
                        <label className="label">Phone: <input type="tel" name="phone" value={user.phone} onChange={handleChange} className="input" /></label>
                        <button type="submit" className="button">Save Details</button>
                    </form>
                    {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
                </div>
            </main>
        </div>
    );
};

export default Profile;