import { useState } from 'react';
import PropTypes from 'prop-types';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [role, setRole] = useState('employee');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    onLogin({ username, role });
  };

  return (
    <div className="login-page">
      <div className="login-banner">
        <h1>Expiro</h1>
        <p>Store Inventory and Expiry Tracker</p>
      </div>
      <div className="login-body">
        <div className="login-card">
          <h2>User Login</h2>
          {error && <p className="login-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon">✉</span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
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
