import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import BotAnswer from './components/BotAnswer';

const API_URL = 'http://localhost:5000';

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Fetch chat history for logged-in users (unchanged)
  useEffect(() => {
    const fetchHistory = async () => {
      if (user?._id) {
        try {
          const { data } = await axios.get(`${API_URL}/history/${user._id}`);
          if (data.success) {
            const historyMessages = data.history.flatMap(item => [
              { sender: 'user', text: item.questionId.text },
              { sender: 'ai',   text: item.response }
            ]);
            setMessages(historyMessages);
          }
        } catch (error) {
          console.error('Failed to fetch history');
        }
      }
    };
    fetchHistory();
  }, [user]);

  // Send text question (unchanged API call)
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/ask`, {
        userId: user?._id,
        question: input,
        subject: 'Math'
      });
      const aiMessage = { sender: 'ai', text: response.data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Upload image (unchanged API call)
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setInput(response.data.text);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I could not read the image.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-body">

      {/* Empty state */}
      {messages.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <p className="empty-title">Ask me anything</p>
          <p className="empty-sub">
            Math, Science, History — I'll walk you through it step by step.
          </p>
        </div>
      )}

      {/* Message list */}
      {messages.map((msg, index) => (
        msg.sender === 'user' ? (
          <div key={index} className="bubble-user-wrapper">
            <div className="bubble-user">{msg.text}</div>
          </div>
        ) : (
          <div key={index} className="bubble-bot">
            <div className="bot-header">
              <div className="bot-avatar">AI</div>
              <span className="bot-label">StudyBot</span>
            </div>
            <BotAnswer rawText={msg.text} />
          </div>
        )
      ))}

      {/* Typing indicator while waiting */}
      {loading && (
        <div className="bubble-bot">
          <div className="bot-header">
            <div className="bot-avatar">AI</div>
            <span className="bot-label">StudyBot</span>
          </div>
          <div className="typing-indicator">
            <span /><span /><span />
          </div>
        </div>
      )}

      <div ref={bottomRef} />

      {/* Input bar */}
      <div className="chat-input-row">
        <div className="input-inner">
          <input
            className="chat-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your question..."
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button className="btn-img" onClick={() => fileInputRef.current.click()}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2.5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="5.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M1 11l3.5-3 3 3 2.5-2.5 4 4" stroke="currentColor" strokeWidth="1.2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Upload
          </button>
          <button className="btn-send" onClick={sendMessage} disabled={loading}>
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Chat;