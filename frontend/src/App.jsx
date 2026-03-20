import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm/LoginForm.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import { logout, getMe } from './services/authAPI.js';
import './App.css';

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