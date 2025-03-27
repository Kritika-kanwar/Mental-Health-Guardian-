const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const filePath = path.join(__dirname, '../data/recommendations.json');

router.get('/', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('❌ Error reading recommendations:', err);
            return res.status(500).json({ error: 'Failed to load recommendations' });
        }

        try {
            const recommendations = JSON.parse(data);
            res.json(recommendations);
        } catch (parseError) {
            console.error('❌ Error parsing recommendations:', parseError);
            res.status(500).json({ error: 'Invalid JSON format' });
        }
    });
});

module.exports = router;
