// src/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

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
                localStorage.setItem('token', data.token);
                localStorage.setItem('isLoggedIn', 'true');
                setMessage({ text: data.message, type: 'success' });
                setTimeout(() => navigate('/track-expense'), 1000);
            } else {
                setMessage({ text: data.message + ' Please log in.', type: 'success' });
                setIsLoginView(true);
            }
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
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
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="submit-button">
                        {isLoginView ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
                <button onClick={() => setIsLoginView(!isLoginView)} className="toggle-button">
                    {isLoginView ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                </button>
            </div>
        </div>
    );
};

export default Login;