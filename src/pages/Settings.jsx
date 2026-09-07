import { useEffect, useState } from 'react';
import api from '../api/axios';

const Settings = () => {
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
      <h1>Payment Settings</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>
        Enable or disable checkout payment methods. Customers only see enabled methods at checkout. KNET and Sadad
        require merchant credentials to be added on the server (.env) before going live.
      </p>
      <div className="card">
        {methods.map((m) => (
          <div className="switch-row" key={m.method}>
            <div>
              <strong>{m.displayNameEn || m.method.toUpperCase()}</strong>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{m.displayNameAr}</div>
            </div>
            <label>
              <input type="checkbox" checked={m.isEnabled} onChange={(e) => toggle(m.method, e.target.checked)} /> Enabled
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
