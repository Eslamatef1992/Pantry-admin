import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const empty = { name: '', email: '', phone: '', password: '', adminRole: 'staff', isActive: true };

const Admins = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => api.get('/users/admins', { params: { search: search || undefined } }).then((res) => setAdmins(res.data));

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form };
      if (editingId && !payload.password) delete payload.password;
      if (editingId) {
        await api.put(`/users/admins/${editingId}`, payload);
      } else {
        await api.post('/users/admins', payload);
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || t('admins_page.save_failed'));
    }
  };

  const handleEdit = (a) => {
    setEditingId(a.id);
    setForm({ name: a.name, email: a.email, phone: a.phone || '', password: '', adminRole: a.adminRole || 'staff', isActive: a.isActive });
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(empty);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admins_page.confirm_delete'))) return;
    try {
      await api.delete(`/users/admins/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || t('admins_page.save_failed'));
    }
  };

  return (
    <div>
      <div className="toolbar">
        <h1>{t('admins_page.title')}</h1>
        <div className="toolbar-actions">
          <input className="search-input" placeholder={t('common.search')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, maxWidth: 640 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('admins_page.name')}</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('admins_page.email')}</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!!editingId} />
          </div>
          <div className="form-group">
            <label>{t('admins_page.phone')}</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('admins_page.password')}</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={editingId ? t('admins_page.password_hint') : ''}
              required={!editingId}
            />
          </div>
          <div className="form-group">
            <label>{t('admins_page.role')}</label>
            <select
              value={form.adminRole}
              onChange={(e) => setForm({ ...form, adminRole: e.target.value })}
              disabled={editingId === user?.id}
            >
              <option value="staff">{t('admins_page.staff')}</option>
              <option value="super_admin">{t('admins_page.super_admin')}</option>
            </select>
          </div>
          {editingId && (
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  disabled={editingId === user?.id}
                  style={{ width: 'auto', marginInlineEnd: 8 }}
                />
                {t('admins_page.active')}
              </label>
            </div>
          )}
          {error && <p className="error-text">{error}</p>}
          <div className="toolbar-actions">
            <button type="submit" className="btn">
              {editingId ? t('admins_page.update') : t('admins_page.add_new')}
            </button>
            {editingId && (
              <button type="button" className="btn btn-outline" onClick={handleCancelEdit}>
                {t('common.cancel')}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>{t('admins_page.name')}</th>
              <th>{t('admins_page.email')}</th>
              <th>{t('admins_page.role')}</th>
              <th>{t('common.status')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>
                  {a.name} {a.id === user?.id && <span style={{ color: '#9ca3af' }}>({t('admins_page.you')})</span>}
                </td>
                <td>{a.email}</td>
                <td>
                  <span className={`badge ${a.adminRole === 'super_admin' ? 'role-super' : 'role-staff'}`}>
                    {a.adminRole === 'super_admin' ? t('admins_page.super_admin') : t('admins_page.staff')}
                  </span>
                </td>
                <td>
                  <span className={`badge ${a.isActive ? 'on' : 'off'}`}>{a.isActive ? t('common.active') : t('common.inactive')}</span>
                </td>
                <td>
                  <button className="btn btn-outline" onClick={() => handleEdit(a)} style={{ marginRight: 8 }}>
                    {t('common.edit')}
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(a.id)} disabled={a.id === user?.id}>
                    {t('common.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admins;
