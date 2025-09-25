// server/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const token = authHeader.split(' ')[1]; // Expects "Bearer [token]"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user payload (e.g., { id: user.id }) to the request
        next();
    } catch (e) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};