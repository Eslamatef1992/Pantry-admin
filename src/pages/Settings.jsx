import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const emptySite = { phone1: '', phone2: '', email: '' };

const Settings = () => {
  const { t } = useTranslation();
  const [methods, setMethods] = useState([]);
  const [site, setSite] = useState(emptySite);
  const [siteSaved, setSiteSaved] = useState(false);

  const load = () => api.get('/settings/admin/payment-methods').then((res) => setMethods(res.data));
  const loadSite = () =>
    api.get('/settings/site').then((res) =>
      setSite({ phone1: res.data.phone1 || '', phone2: res.data.phone2 || '', email: res.data.email || '' })
    );

  useEffect(() => {
    load();
    loadSite();
  }, []);

  const toggle = async (method, isEnabled) => {
    await api.put(`/settings/admin/payment-methods/${method}`, { isEnabled });
    load();
  };

  const handleSiteSubmit = async (e) => {
    e.preventDefault();
    await api.put('/settings/admin/site', site);
    setSiteSaved(true);
    setTimeout(() => setSiteSaved(false), 2000);
  };

  return (
    <div>
      <h1>{t('payment_settings.title')}</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>{t('payment_settings.description')}</p>
      <div className="card" style={{ marginBottom: 20 }}>
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

      <h1>{t('site_settings.title')}</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>{t('site_settings.description')}</p>
      <form onSubmit={handleSiteSubmit} className="card" style={{ maxWidth: 480 }}>
        <div className="form-group">
          <label>{t('site_settings.phone1')}</label>
          <input value={site.phone1} onChange={(e) => setSite({ ...site, phone1: e.target.value })} placeholder="+965 ..." />
        </div>
        <div className="form-group">
          <label>{t('site_settings.phone2')}</label>
          <input value={site.phone2} onChange={(e) => setSite({ ...site, phone2: e.target.value })} placeholder="+965 ..." />
        </div>
        <div className="form-group">
          <label>{t('site_settings.email')}</label>
          <input type="email" value={site.email} onChange={(e) => setSite({ ...site, email: e.target.value })} placeholder="info@pantryfoods.store" />
        </div>
        <button type="submit" className="btn">
          {t('common.save')}
        </button>
        {siteSaved && <span style={{ marginLeft: 10, color: '#16a34a' }}>{t('site_settings.saved')}</span>}
      </form>
    </div>
  );
};

export default Settings;
