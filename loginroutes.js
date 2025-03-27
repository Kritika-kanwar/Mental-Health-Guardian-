const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // ✅ Load environment variables

const router = express.Router();

const dataPath = path.join(__dirname, '../data/sample_data.json'); // ✅ Path to JSON file

// ✅ POST Endpoint for Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('❌ Error reading user data:', err);
            return res.status(500).json({ message: 'Failed to load user data' });
        }

        try {
            const users = JSON.parse(data);
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                // ✅ Generate JWT Token
                const token = jwt.sign(
                    { id: user.id, email: user.email }, 
                    process.env.JWT_SECRET, 
                    { expiresIn: '30d' }
                );

                console.log("✅ Generated Token:", token); // 🔥 Logs the actual token

                // ✅ Exclude password from response
                const { password, ...safeUserData } = user;

                return res.status(200).json({
                    token,  // ✅ Send actual JWT token instead of "sample-jwt-token"
                    user: safeUserData
                });
            } else {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (parseError) {
            console.error('❌ Error parsing JSON data:', parseError);
            return res.status(500).json({ message: 'Server error' });
        }
    });
});

module.exports = router;
