import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-3.06 2.6A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 4.22-5.94" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, remember);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || t('login.failed'));
    }
  };

  return (
    <div className="login-page">
      <div className="login-ribbon login-ribbon-1" />
      <div className="login-ribbon login-ribbon-2" />

      <div className="login-stack">
        <form onSubmit={handleSubmit} className="login-card">
          <div className="login-brand">
            <img src="/logo-icon.svg" alt="Pantry" className="login-logo" />
            <div className="login-wordmark">Pantry</div>
          </div>

          <h2 className="login-welcome">{t('login.welcome_back')}</h2>
          <p className="login-subtitle">{t('login.subtitle')}</p>

          <div className="form-group">
            <label>{t('login.email')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pantry@gmail.com"
              className="login-input"
            />
          </div>

          <div className="form-group">
            <label>{t('login.password')}</label>
            <div className="login-password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <label className="login-remember">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            {t('login.remember_me')}
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn login-submit">
            {t('login.sign_in')}
          </button>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <LanguageSwitcher />
          </div>
        </form>

        <div className="login-powered">{t('login.powered_by')}</div>
      </div>
    </div>
  );
};

export default Login;
