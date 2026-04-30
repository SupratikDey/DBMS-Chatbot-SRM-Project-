import React, { useState } from 'react';
import Chat from './Chat';
import Login from './Login';
import './App.css';

function App() {
  const [user, setUser]           = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setShowLogin(false);
  };

  return (
    <div className="app-root">

      {/* ── Header ── */}
      <header className="chat-header">
        <div className="header-left">
          <div className="header-icon">🎓</div>
          <div>
            <div className="header-title">StudyBot</div>
            <div className="header-subtitle">Intelligent doubt solving assistant</div>
          </div>
        </div>

        <div className="header-actions">
          {user && (
            <span className="header-user">👤 {user.name || user.email}</span>
          )}
          {!user && !showLogin && (
            <button className="header-btn" onClick={() => setShowLogin(true)}>
              Login / Register
            </button>
          )}
          {user && (
            <button className="header-btn header-btn-logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main className="app-main">
        {showLogin && !user
          ? <Login onLogin={setUser} />
          : <Chat user={user} />
        }
      </main>

    </div>
  );
}

export default App;