const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const filePath = path.join(__dirname, '../data/quotes.json');

router.get('/', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('❌ Error reading quotes:', err);
            return res.status(500).json({ error: 'Failed to load quotes' });
        }

        try {
            const quotes = JSON.parse(data);
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            res.json(randomQuote);
        } catch (parseError) {
            console.error('❌ Error parsing quotes:', parseError);
            res.status(500).json({ error: 'Invalid JSON format' });
        }
    });
});

module.exports = router;
