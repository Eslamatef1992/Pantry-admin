import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const Settings = () => {
  const { t } = useTranslation();
  const [methods, setMethods] = useState([]);

  const load = () => api.get('/settings/admin/payment-methods').then((res) => setMethods(res.data));

  useEffect(() => {
    load();
  }, []);

  const toggle = async (method, isEnabled) => {
    await api.put(`/settings/admin/payment-methods/${method}`, { isEnabled });
    load();
  };

  return (
    <div>
      <h1>{t('payment_settings.title')}</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>{t('payment_settings.description')}</p>
      <div className="card">
        {methods.map((m) => (
          <div className="switch-row" key={m.method}>
            <div>
              <strong>{m.displayNameEn || m.method.toUpperCase()}</strong>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{m.displayNameAr}</div>
            </div>
            <label>
              <input type="checkbox" checked={m.isEnabled} onChange={(e) => toggle(m.method, e.target.checked)} />{' '}
              {t('payment_settings.enabled')}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
