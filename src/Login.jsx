// src/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const LoginPage = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        const url = isLoginView ? 'http://localhost:3001/api/login' : 'http://localhost:3001/api/signup';
        const payload = isLoginView ? { email, password } : { username, email, password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            if (isLoginView) {
                // On successful login, store token and redirect
                localStorage.setItem('token', data.token);
                localStorage.setItem('isLoggedIn', 'true'); // From your previous code
                setMessage(data.message);
                // Redirect to the main app page after a short delay
                setTimeout(() => navigate('/track-expense'), 1000);
            } else {
                // On successful signup, show message and switch to login view
                setMessage(data.message + ' Please log in.');
                setIsLoginView(true);
            }
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-form-container">
                <h2>{isLoginView ? 'Login' : 'Sign Up'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLoginView && (
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        {isLoginView ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                {message && <p className="message">{message}</p>}
                <button
                    onClick={() => setIsLoginView(!isLoginView)}
                    className="toggle-button"
                >
                    {isLoginView ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                </button>
            </div>
        </div>
    );
};

export default LoginPage;