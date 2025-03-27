const fs = require("fs");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "DigitalMentalHealthGuardian";
const COLLECTION_NAME = "users";
const SALT_ROUNDS = 12;
const PASSWORD_LOG_FILE = "passwords_log.txt";
const SAMPLE_DATA_FILE = "./data/sample_data.json";

// Function to hash passwords
const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

// Function to read `sample_data.json` and hash passwords
const processUsers = async () => {
    const users = JSON.parse(fs.readFileSync(SAMPLE_DATA_FILE, "utf-8"));
    let passwordLog = "User Credentials (Plain Text Passwords)\n===================================\n";

    for (let user of users) {
        const plainPassword = user.password; // Get plain text password from JSON
        passwordLog += `Email: ${user.email} | Password: ${plainPassword}\n`; // Save for testing

        user.password = await hashPassword(plainPassword); // Hash password before saving to MongoDB
    }

    // Save plain text passwords to log file
    fs.writeFileSync(PASSWORD_LOG_FILE, passwordLog);
    console.log(`🔑 Plain text passwords saved to ${PASSWORD_LOG_FILE}`);

    return users;
};

// Function to insert users into MongoDB
const insertIntoMongoDB = async () => {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        console.log("🔄 Deleting existing users...");
        await collection.deleteMany({}); // Remove old users

        console.log("🚀 Processing and inserting new users...");
        const users = await processUsers();
        await collection.insertMany(users);

        console.log("✅ Users inserted into MongoDB with hashed passwords");

        await client.close();
    } catch (error) {
        console.error("❌ Error inserting data into MongoDB:", error);
    }
};

// Run the function
insertIntoMongoDB();
