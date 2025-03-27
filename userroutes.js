const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

const dataPath = path.join(__dirname, '../data/sample_data.json'); // ✅ Path to user data

// ✅ Middleware to Authenticate Token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded; // Attach user info to request
        next();
    });
};

// ✅ GET Endpoint to Fetch User Data
router.get('/userdata', authenticateToken, (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('❌ Error reading user data:', err);
            return res.status(500).json({ message: 'Failed to load user data' });
        }

        try {
            const users = JSON.parse(data);
            const user = users.find(user => user.email === req.user.email);

            if (user) {
                const { password, ...safeUserData } = user; // Exclude password
                return res.status(200).json(safeUserData);
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (parseError) {
            console.error('❌ Error parsing JSON data:', parseError);
            return res.status(500).json({ message: 'Server error' });
        }
    });
});

module.exports = router;
