import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const API_URL = 'http://localhost:5000';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        const url = isLogin ? `${API_URL}/login` : `${API_URL}/register`;
        const payload = isLogin ? { email } : { username, email };

        try {
            const { data } = await axios.post(url, payload);
            if (data.success) {
                onLogin(data.user);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleAuth} className="login-form">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                {error && <p className="error-message">{error}</p>}
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
                <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
                    {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
                </p>
            </form>
        </div>
    );
};

export default Login;
