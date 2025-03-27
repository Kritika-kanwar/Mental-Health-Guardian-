const express = require('express');
const router = express.Router();
const { getScreenTimeData } = require('../models/screentime');
const authMiddleware = require('../middleware/authmiddleware'); // ✅ Ensure authentication

// ✅ Fetch screen time data for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const email = req.user.email; // ✅ Get email from token
        const screenTimeData = await getScreenTimeData(email);
        res.json(screenTimeData);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

module.exports = router;