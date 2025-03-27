const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/user");  // Ensure the User model is imported
const router = express.Router();

// ✅ Load sample data JSON file
const dataPath = path.join(__dirname, "../data/sample_data.json");
let sampleData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// ✅ Register a New User
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database or sample data
        let user = await User.findOne({ email });
        const existingSampleUser = sampleData.find((u) => u.email === email);

        if (user || existingSampleUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password and save the user in MongoDB
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Login User (Database or sample_data.json)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Check if the user exists in the database
        let user = await User.findOne({ email });

        if (user) {
            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

            // Generate JWT token
            const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });

            return res.status(200).json({
                token,
                user: { email: user.email, userId: user._id }
            });
        }

        // Check sample_data.json if not found in the database
        const sampleUser = sampleData.find((u) => u.email === email && u.password === password);

        if (!sampleUser) return res.status(401).json({ message: "Invalid credentials" });

        // Generate JWT token for sample user
        const token = jwt.sign({ email: sampleUser.email }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        res.status(200).json({
            token,
            user: {
                username: sampleUser.username,
                email: sampleUser.email,
                moodData: sampleUser.moodData || []
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Save Data for Both Database and Sample Users
router.post("/save-data", async (req, res) => {
    const { email, data } = req.body;

    try {
        // Try to find the user in the MongoDB database
        let user = await User.findOne({ email });

        if (user) {
            // Save data for database user
            user.data = user.data || [];
            user.data.push(data);

            await user.save();
            return res.status(200).json({ message: "Data saved for new user!" });
        }

        // If not found, check in sample_data.json
        let sampleUserIndex = sampleData.findIndex((u) => u.email === email);

        if (sampleUserIndex !== -1) {
            sampleData[sampleUserIndex].moodData = sampleData[sampleUserIndex].moodData || [];
            sampleData[sampleUserIndex].moodData.push(data);

            // Write updated data to sample_data.json
            fs.writeFileSync(dataPath, JSON.stringify(sampleData, null, 2));
            return res.status(200).json({ message: "Data saved for old user!" });
        }

        res.status(404).json({ message: "User not found" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
