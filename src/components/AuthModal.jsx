import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { authenticateUser, registerUser } from '../utils/auth';

const AVATAR_OPTIONS = ['👨‍💻', '👩‍💻', '🚀', '🎨', '⚡', '🦊', '🌟', '💼'];

function AuthModal({ isOpen, initialMode = 'login', onClose, onAuthSuccess, onTriggerToast }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAvatar, setRegAvatar] = useState('👨‍💻');
  const [regRole, setRegRole] = useState('Product Designer');
  const [regError, setRegError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setLoginError('');
      setRegError('');
    }
  }, [isOpen, initialMode]);

  // Quick fill with pre-seeded demo credentials
  const handleFillDemo = () => {
    setLoginEmail('alex.morgan@example.com');
    setLoginPassword('password123');
    setLoginError('');
  };

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your email address.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password.');
      return;
    }

    setIsLoggingIn(true);
    setTimeout(() => {
      const res = authenticateUser(loginEmail, loginPassword);
      setIsLoggingIn(false);
      if (res.success) {
        onAuthSuccess(res.user);
        onTriggerToast('success', `Welcome back, ${res.user.name}!`);
        onClose();
      } else {
        setLoginError(res.error || 'Authentication failed.');
      }
    }, 400);
  };

  const handleRegisterSubmit = (e) => {
    if (e) e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Please provide your full name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please provide a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    setIsRegistering(true);
    setTimeout(() => {
      const res = registerUser({
        name: regName,
        email: regEmail,
        password: regPassword,
        avatar: regAvatar,
        role: regRole
      });
      setIsRegistering(false);
      if (res.success) {
        onAuthSuccess(res.user);
        onTriggerToast('success', `Account created! Welcome, ${res.user.name}!`);
        onClose();
      } else {
        setRegError(res.error || 'Registration failed.');
      }
    }, 500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Sign In to Your Account' : 'Create Free Account'}
      subtitle={
        mode === 'login'
          ? 'Enter your credentials to access your projects & modals.'
          : 'Join thousands of developers customizing modern modals.'
      }
      icon={mode === 'login' ? '🔐' : '🚀'}
      showFooter={false}
      size="md"
      animation="scaleUp"
    >
      <div className="auth-modal-wrapper">
        {/* Auth Mode Switcher Tab Buttons */}
        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setLoginError('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setRegError('');
            }}
          >
            Register
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form" noValidate>
            <div className="demo-hint-box">
              <div className="demo-hint-text">
                <strong>⚡ Try 1-Click Demo:</strong>
                <span> alex.morgan@example.com / password123</span>
              </div>
              <button
                type="button"
                className="btn btn-xs btn-outline-accent"
                onClick={handleFillDemo}
              >
                Auto-fill
              </button>
            </div>

            {loginError && <div className="form-alert-error">{loginError}</div>}

            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                Email Address
              </label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  data-autofocus="true"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-with-aside">
                <label htmlFor="login-password" className="form-label">
                  Password
                </label>
                <button
                  type="button"
                  className="link-subtle"
                  onClick={() =>
                    alert('Demo Mode: Use password123 or click "Auto-fill" above to sign in!')
                  }
                >
                  Forgot?
                </button>
              </div>
              <div className="input-with-icon">
                <span className="input-icon">🔑</span>
                <input
                  id="login-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-eye-btn"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Keep me signed in</span>
              </label>
            </div>

            <div className="form-actions-stacked">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <span className="btn-spinner-wrapper">
                    <span className="spinner"></span> Signing in...
                  </span>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </div>

            <p className="auth-switch-text">
              Don't have an account yet?{' '}
              <button
                type="button"
                className="auth-inline-link"
                onClick={() => setMode('register')}
              >
                Create one for free
              </button>
            </p>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="auth-form" noValidate>
            {regError && <div className="form-alert-error">{regError}</div>}

            <div className="form-group">
              <label className="form-label">Choose Avatar</label>
              <div className="avatar-picker-grid">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    className={`avatar-choice ${regAvatar === av ? 'selected' : ''}`}
                    onClick={() => setRegAvatar(av)}
                    aria-label={`Select avatar ${av}`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-name" className="form-label">
                Full Name
              </label>
              <div className="input-with-icon">
                <span className="input-icon">👤</span>
                <input
                  id="reg-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sarah Connor"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  data-autofocus="true"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email" className="form-label">
                Email Address
              </label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input
                  id="reg-email"
                  type="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-role" className="form-label">
                Your Role / Specialty
              </label>
              <select
                id="reg-role"
                className="form-select"
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
              >
                <option value="Product Designer">Product Designer</option>
                <option value="Full-Stack Developer">Full-Stack Developer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Student / Learner">Student / Learner</option>
                <option value="Tech Enthusiast">Tech Enthusiast</option>
              </select>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="reg-password" className="form-label">
                  Password
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">🔒</span>
                  <input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Min 6 chars"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirm-password" className="form-label">
                  Confirm
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">🔒</span>
                  <input
                    id="reg-confirm-password"
                    type={showRegPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Repeat"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-options">
              <button
                type="button"
                className="link-subtle"
                onClick={() => setShowRegPassword(!showRegPassword)}
              >
                {showRegPassword ? 'Hide Passwords' : 'Show Passwords'}
              </button>
            </div>

            <div className="form-actions-stacked">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <span className="btn-spinner-wrapper">
                    <span className="spinner"></span> Creating Account...
                  </span>
                ) : (
                  'Create My Account'
                )}
              </button>
            </div>

            <p className="auth-switch-text">
              Already registered?{' '}
              <button
                type="button"
                className="auth-inline-link"
                onClick={() => setMode('login')}
              >
                Sign in here
              </button>
            </p>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default AuthModal;

