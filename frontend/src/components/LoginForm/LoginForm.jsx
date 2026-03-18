import { useState } from 'react';
import PropTypes from 'prop-types';
import { ShieldCheck, UserRound } from 'lucide-react';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!role) { setError('Please select a role'); return; }
        if (!username || !password) { setError('Please fill in all fields'); return; }
        onLogin({ username, role });
    };

    return (
        <div className="login-page">
            <div className="login-banner">
                <h1>Expiro</h1>
                <p>STORE INVENTORY AND EXPIRY TRACKER</p>
            </div>
            <div className="login-body">
                <div className="login-card">
                    <h2>User Login</h2>

                    {/* Role Selection */}
                    <div className="role-selector">
                        <div
                            className={`role-card ${role === 'manager' ? 'active' : ''}`}
                            onClick={() => { setRole('manager'); setError(''); }}
                        >
                            <ShieldCheck size={32} strokeWidth={1.5} className="role-icon" />
                            <span className="role-title">Manager</span>
                            <span className="role-sub">Admin access</span>
                        </div>
                        <div
                            className={`role-card ${role === 'employee' ? 'active' : ''}`}
                            onClick={() => { setRole('employee'); setError(''); }}
                        >
                            <UserRound size={32} strokeWidth={1.5} className="role-icon" />
                            <span className="role-title">Employee</span>
                            <span className="role-sub">Staff access</span>
                        </div>
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <span className="input-icon">👤</span>
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="input-icon">🔒</span>
                        </div>
                        <button type="submit" className="login-btn">LOGIN</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

LoginForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default LoginForm;