// server/server.cjs
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const authMiddleware = require('./authMiddleware'); // Import the middleware

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}).promise();

// --- AUTH ROUTES (Unchanged) ---
app.post('/api/signup', async (req, res) => { /* ... your existing signup code ... */ });
app.post('/api/login', async (req, res) => { /* ... your existing login code ... */ });


// --- NEW PROTECTED ROUTES ---

// GET USER PROFILE
app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, email, full_name, dob, gender, phone FROM users WHERE id = ?', [req.user.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE USER PROFILE
app.put('/api/profile', authMiddleware, async (req, res) => {
    const { fullName, dob, gender, phone } = req.body;
    try {
        await db.query(
            'UPDATE users SET full_name = ?, dob = ?, gender = ?, phone = ? WHERE id = ?',
            [fullName, dob, gender, phone, req.user.id]
        );
        res.json({ message: 'Profile updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating profile' });
    }
});

// SAVE AN EXPENSE PLAN
app.post('/api/plans', authMiddleware, async (req, res) => {
    const { salary, totalExpenses, grade, planData } = req.body;
    try {
        await db.query(
            'INSERT INTO expense_plans (user_id, salary, total_expenses, grade, plan_data) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, salary, totalExpenses, grade, JSON.stringify(planData)]
        );
        res.status(201).json({ message: 'Plan saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error saving plan' });
    }
});

// GET ALL SAVED PLANS FOR A USER
app.get('/api/plans', authMiddleware, async (req, res) => {
    try {
        const [plans] = await db.query('SELECT * FROM expense_plans WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching plans' });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));