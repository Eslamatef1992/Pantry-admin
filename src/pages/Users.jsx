import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const empty = { name: '', email: '', phone: '' };

const Users = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () =>
    api.get('/users/customers', { params: { search: search || undefined, limit: 100 } }).then((res) => {
      setItems(res.data.items);
      setTotal(res.data.total);
      setLoaded(true);
    });

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const toggleActive = async (id, isActive) => {
    await api.put(`/users/customers/${id}/active`, { isActive });
    load();
  };

  const handleEdit = (u) => {
    setEditingId(u.id);
    setForm({ name: u.name, email: u.email, phone: u.phone || '' });
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(empty);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/users/customers/${editingId}`, form);
      setEditingId(null);
      setForm(empty);
      load();
    } catch (err) {
      setError(err.response?.data?.message || t('users_page.save_failed'));
    }
  };

  return (
    <div>
      <div className="toolbar">
        <h1>
          {t('users_page.title')} ({total})
        </h1>
        <div className="toolbar-actions">
          <input
            className="search-input"
            placeholder={t('users_page.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {editingId && (
        <div className="card" style={{ marginBottom: 20, maxWidth: 640 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('users_page.name')}</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('users_page.email')}</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('users_page.phone')}</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            {error && <p className="error-text">{error}</p>}
            <div className="toolbar-actions">
              <button type="submit" className="btn">
                {t('common.save')}
              </button>
              <button type="button" className="btn btn-outline" onClick={handleCancelEdit}>
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>{t('users_page.name')}</th>
              <th>{t('users_page.email')}</th>
              <th>{t('users_page.phone')}</th>
              <th>{t('users_page.orders')}</th>
              <th>{t('users_page.joined')}</th>
              <th>{t('users_page.status')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || '—'}</td>
                <td>{u.orderCount}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${u.isActive ? 'on' : 'off'}`}>
                    {u.isActive ? t('common.active') : t('common.inactive')}
                  </span>
                </td>
                <td>
                  <button className="btn btn-outline" onClick={() => handleEdit(u)} style={{ marginInlineEnd: 8 }}>
                    {t('common.edit')}
                  </button>
                  <button className="btn btn-outline" onClick={() => toggleActive(u.id, !u.isActive)}>
                    {u.isActive ? t('common.block') : t('common.unblock')}
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={7}>{loaded ? '—' : t('common.loading')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
