const express = require('express');
const multer = require('multer');
const { createWorker } = require('tesseract.js');
const axios = require('axios');
const User = require('../models/User');
const ChatHistory = require('../models/ChatHistory');
const Question = require('../models/Question');
const Concept = require('../models/Concept');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const GROQ_API_KEY = 'gsk_8tCEB632JJARPISdyb3FYI2j0WawlMpTxVA0XgbJgiFoJ'; // Replace with your Groq API key
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

router.post('/ask', async (req, res) => {
    const { userId, question, subject } = req.body;

    try {
        const prompt = `You are a teacher. Solve the following ${subject} question step by step and recommend related concepts: ${question}`;

        const response = await axios.post(GROQ_API_URL, {
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.1-8b-instant",
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const aiResponse = response.data.choices[0].message.content;

        if (userId) {
            const newQuestion = new Question({ text: question, subject });
            await newQuestion.save();

            const newChat = new ChatHistory({
                userId,
                questionId: newQuestion._id,
                response: aiResponse
            });
            await newChat.save();
        }

        res.json({ success: true, response: aiResponse });
    } catch (error) {
        console.error("Error in /ask route:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: 'Error processing your question.' });
    }
});

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const worker = await createWorker();
        const { file } = req;
        const { data: { text } } = await worker.recognize(file.path);
        await worker.terminate();
        res.json({ success: true, text });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error processing image.' });
    }
});

router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await ChatHistory.find({ userId }).populate('questionId');
        res.json({ success: true, history });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching chat history.' });
    }
});

router.get('/concepts/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;
        const concepts = await Concept.find({ relatedQuestions: questionId });
        res.json({ success: true, concepts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching concepts.' });
    }
});

module.exports = router;
