const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const User = require("./models/user");

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(helmet({ 
  contentSecurityPolicy: false 
})); // Fix CSP issues
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/DigitalMentalHealthGuardian")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Serve Static Files
app.use(express.static(path.join(__dirname, "frontend", "public")));

// ✅ Import Routes
const screenTimeRoutes = require("./routes/screentimeroutes");
const moodRoutes = require("./routes/moodroutes");
const quoteRoutes = require("./routes/quoteroutes");
const recommendationRoutes = require("./routes/recommendroutes");
const loginRoutes = require("./routes/loginroutes");
const userRoutes = require("./routes/userroutes");
const authRoutes = require("./routes/authroutes");

// ✅ Register Routes
app.use("/api/screentime", screenTimeRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/personalized", recommendationRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/user", userRoutes);
app.use('/api/auth', authRoutes);

// ✅ Serve JSON Data
const dataPath = path.join(__dirname, 'data', 'sample_data.json');

app.get("/api/data", (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("❌ Error loading JSON data:", err);
            res.status(500).json({ error: "Failed to load user data" });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// ✅ Static Page Routes
app.get("/", (req, res) => 
  res.sendFile(path.join(__dirname, "frontend", "public", "welcome page.html"))
);

app.get("/dashboard", (req, res) => 
  res.sendFile(path.join(__dirname, "frontend", "public", "dashboard.html"))
);

// ✅ Test Route
app.get("/test", (req, res) => res.send("✅ Test route is working!"));

// ✅ Fetch User Data by Email (Exclude Sensitive Info)
app.get("/api/user/data", async (req, res) => {
  const { email } = req.query;

  app.get("/api/screentime", (req, res) => {
    res.json({ message: "Screen Time Data" });
});


  try {
    const user = await User.findOne({ email }).select('-password'); // ✅ Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user data:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Start the Server
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
