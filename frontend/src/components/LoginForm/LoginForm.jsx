import { useState } from 'react';
import PropTypes from 'prop-types';
import { ShieldCheck, UserRound } from 'lucide-react';
import { login, register } from '../../services/authAPI.js';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [role, setRole] = useState(null);
  const [mode, setMode] = useState('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      setError('Please select a role');
      return;
    }
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (role === 'manager') {
        const user = await login(username, password);
        if (user.role !== 'manager') {
          setError('Invalid manager credentials');
          return;
        }
        onLogin(user);
      } else {
        if (mode === 'signup') {
          if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
          }
          const user = await register(username, password);
          onLogin(user);
        } else {
          const user = await login(username, password);
          if (user.role !== 'employee') {
            setError('Invalid employee credentials');
            return;
          }
          onLogin(user);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setMode('signin');
    setError('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-page">
      <div className="bubble" aria-hidden="true" />
      <div className="login-card">
        {/* Left green panel */}
        <div className="login-left">
          <div className="login-left-content">
            <div className="login-brand">
              <div className="brand-dot" aria-hidden="true">
                E
              </div>
              <h1>Expiro</h1>
            </div>
            <h2>Welcome</h2>
            <p>Select your role to get started.</p>
            <div
              className="role-selector"
              role="group"
              aria-label="Select your role"
            >
              <button
                type="button"
                className={`role-card ${role === 'manager' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('manager')}
                aria-pressed={role === 'manager'}
              >
                <ShieldCheck size={20} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="role-title">Manager</p>
                  <p className="role-sub">Admin access</p>
                </div>
              </button>
              <button
                type="button"
                className={`role-card ${role === 'employee' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('employee')}
                aria-pressed={role === 'employee'}
              >
                <UserRound size={20} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="role-title">Employee</p>
                  <p className="role-sub">Staff access</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right white panel */}
        <div className="login-right">
          <div className="login-right-decoration" aria-hidden="true" />
          <div className="login-form-wrap">
            <h2>{mode === 'signup' ? 'Create Account' : 'Welcome'}</h2>
            <p className="login-sub">
              {mode === 'signup'
                ? 'Sign up as an employee'
                : 'Login to your account to continue'}
            </p>

            {role === 'manager' && mode === 'signin' && (
              <div className="login-hint">
                <p>
                  Please use your assigned manager credentials to log in.
                  Contact your system administrator if you need access.
                </p>
              </div>
            )}

            {role === 'employee' && mode === 'signin' && (
              <div className="login-hint">
                <p>
                  Don't have an account? Switch to <strong>Sign Up</strong> to
                  register.
                </p>
              </div>
            )}

            {/* Sign In / Sign Up toggle — employees only */}
            {role === 'employee' && (
              <div
                className="auth-toggle"
                role="group"
                aria-label="Authentication mode"
              >
                <button
                  className={`toggle-btn ${mode === 'signin' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('signin');
                    setError('');
                  }}
                  type="button"
                  aria-pressed={mode === 'signin'}
                >
                  Sign In
                </button>
                <button
                  className={`toggle-btn ${mode === 'signup' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  type="button"
                  aria-pressed={mode === 'signup'}
                >
                  Sign Up
                </button>
              </div>
            )}

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  className="login-input"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="login-field">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  className="login-input"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    mode === 'signup' ? 'new-password' : 'current-password'
                  }
                  required
                />
              </div>
              {mode === 'signup' && role === 'employee' && (
                <div className="login-field">
                  <label htmlFor="confirmPassword" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    className="login-input"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                className="login-btn"
                disabled={loading}
                aria-busy={loading}
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'signup'
                    ? 'CREATE ACCOUNT'
                    : 'LOG IN'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginForm;
