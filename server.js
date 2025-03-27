const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const response = await axios.post('http://localhost:8085/chat', { message: userMessage });

        res.json({ response: response.data.response });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch AI response" });
    }
});

app.listen(8085, () => {
    console.log('Smart Drive Edu Chatbot running on port 8085');
});
