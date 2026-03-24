import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm/LoginForm.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import { logout, getMe } from './services/authAPI.js';
import './App.css';
// Peer Review Comment:
// Instructions on how to use this application are missing.
// Please include clear steps for login, dashboard usage, and overall app flow
// to improve usability for new users.
// The application does not persist login sessions
function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getMe()
      .then((userData) => {
        if (userData) setUser(userData);
      })
      .finally(() => setChecking(false));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
    setUser(null);
  };

  if (checking) return null;

  return (
    <div className="app">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
