const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/authmiddleware'); // ✅ Import auth middleware

// ✅ Load sample data from file
const dataPath = path.join(__dirname, '../data/sample_data.json');

router.get('/', auth, (req, res) => {
    try {
        const rawData = fs.readFileSync(dataPath);
        const data = JSON.parse(rawData);

        // ✅ Filter based on logged-in user's email
        const userData = data.find(user => user.email === req.user.email);

        if (!userData || !userData.moodData) {
            return res.status(404).json({ error: 'Mood data not found for this user' });
        }

        res.json(userData.moodData);
    } catch (error) {
        console.error('❌ Error fetching mood data:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;


