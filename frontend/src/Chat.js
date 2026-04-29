import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const Chat = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchHistory = async () => {
            if (user?._id) {
                try {
                    const { data } = await axios.get(`${API_URL}/history/${user._id}`);
                    if (data.success) {
                        const historyMessages = data.history.flatMap(item => [
                            { sender: 'user', text: item.questionId.text },
                            { sender: 'ai', text: item.response }
                        ]);
                        setMessages(historyMessages);
                    }
                } catch (error) {
                    console.error("Failed to fetch history");
                }
            }
        };
        fetchHistory();
    }, [user]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await axios.post(`${API_URL}/ask`, {
                userId: user?._id, // Pass userId if user is logged in
                question: input,
                subject: 'Math' // Dummy subject
            });
            const aiMessage = { sender: 'ai', text: response.data.response };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = { sender: 'ai', text: 'Sorry, I encountered an error.' };
            setMessages(prev => [...prev, errorMessage]);
        }
        setInput('');
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setInput(response.data.text);
        } catch (error) {
            const errorMessage = { sender: 'ai', text: 'Sorry, I could not read the image.' };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your question..."
                />
                <button onClick={sendMessage}>Send</button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                />
                <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
                    Upload Image
                </button>
            </div>
        </div>
    );
};

export default Chat;
