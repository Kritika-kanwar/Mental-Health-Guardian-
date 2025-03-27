const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // ✅ Should show email here
        
        req.user = {
            id: decoded.id,
            email: decoded.email // ✅ Add email to req.user
        };

        next();
    } catch (error) {
        console.error("❌ Token Verification Failed:", error.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
