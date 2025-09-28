import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TrackExpense.css'; // Reusing styles for layout
import './Profile.css';     // Specific styles for the profile form

const Profile = () => {
    const [user, setUser] = useState({ fullName: '', dob: '', gender: '', email: '', phone: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        navigate('/'); // MODIFIED: Navigates to the home page after logout
    };

    useEffect(() => {
        if (!token) { navigate('/login'); return; }

        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    const formattedData = { ...data, dob: data.dob ? data.dob.split('T')[0] : '' };
                    setUser(formattedData);
                }
            } catch (error) {
                setMessage('Failed to fetch profile data.');
            }
        };
        fetchProfile();
    }, [token, navigate]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    fullName: user.fullName,
                    dob: user.dob,
                    gender: user.gender,
                    phone: user.phone
                }),
            });
            const data = await response.json();
            setMessage(data.message || "An error occurred.");
        } catch (error) {
            setMessage("Failed to update profile.");
        }
    };

    return (
        <div className="page-container">
            <nav className="sidebar">
                <div>
                    <h3 className="sidebar-title">Services</h3>
                    <Link to="/track-expense" className="nav-link">Track Expense</Link>
                    <Link to="/generate-plan" className="nav-link">Generate Plan</Link>
                    <Link to="/previous-plans" className="nav-link">Previous Plans</Link>
                    <Link to="/profile" className="nav-link-active">Profile</Link>
                </div>
                <div style={{ marginTop: 'auto' }}>
                    <button onClick={handleLogout} className="nav-link logout-button" style={{width: '100%', border: 'none'}}>Logout</button>
                </div>
            </nav>
            <main className="main-content">
                <div className="profile-content">
                    <div className="profile-header">
                        <h2>My Profile</h2>
                        <p>Update your personal details and manage your account.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="profile-form-grid">
                        <div className="form-item">
                            <label className="label">Full Name</label>
                            <input type="text" name="fullName" value={user.fullName || ''} onChange={handleChange} className="input" />
                        </div>
                        <div className="form-item">
                            <label className="label">Date of Birth</label>
                            <input type="date" name="dob" value={user.dob || ''} onChange={handleChange} className="input" />
                        </div>
                        <div className="form-item">
                            <label className="label">Gender</label>
                            <input type="text" name="gender" value={user.gender || ''} onChange={handleChange} className="input" />
                        </div>
                        <div className="form-item">
                            <label className="label">Phone</label>
                            <input type="tel" name="phone" value={user.phone || ''} onChange={handleChange} className="input" />
                        </div>
                        <div className="form-item form-item-full">
                            <label className="label">Email</label>
                            <input type="email" name="email" value={user.email || ''} disabled className="input" />
                        </div>
                        <button type="submit" className="button">Save Details</button>
                    </form>
                    {message && <p className="profile-message">{message}</p>}
                </div>
            </main>
        </div>
    );
};

export default Profile;