import React, { useState } from 'react';
import Chat from './Chat';
import Login from './Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setShowLogin(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Intelligent Student Doubt Solving Chatbot</h1>
        {!user && !showLogin && (
          <button onClick={() => setShowLogin(true)} className="login-prompt-btn">
            Login/Register to Save History
          </button>
        )}
        {user && <button onClick={handleLogout} className="logout-btn">Logout</button>}
      </header>
      <main>
        {showLogin && !user ? <Login onLogin={setUser} /> : <Chat user={user} />}
      </main>
    </div>
  );
}

export default App;
