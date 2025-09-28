// server/server.cjs
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const authMiddleware = require('./authMiddleware.cjs');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}).promise();

// --- AUTH ROUTES ---
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    try {
        const [userExists] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const payload = { id: user.id, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'Logged in successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- PROFILE ROUTES ---
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

// --- PLAN ROUTES ---
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