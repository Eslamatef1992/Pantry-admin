import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || t('login.failed'));
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f7f8f6' }}>
      <form onSubmit={handleSubmit} className="card" style={{ width: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <img src="/logo-colored.svg" alt="Pantry" style={{ height: 48 }} />
          <h2>{t('login.title')}</h2>
        </div>
        <div className="form-group">
          <label>{t('login.email')}</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('login.password')}</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn" style={{ width: '100%' }}>
          {t('login.sign_in')}
        </button>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <LanguageSwitcher />
        </div>
      </form>
    </div>
  );
};

export default Login;
