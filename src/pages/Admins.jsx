import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Admins = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => api.get('/users/admins', { params: { search: search || undefined } }).then((res) => setAdmins(res.data));

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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
          <Link to="/admins/new" className="btn">
            {t('admins_page.add_new')}
          </Link>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

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
                  <Link to={`/admins/${a.id}`} className="btn btn-outline" style={{ marginRight: 8 }}>
                    {t('common.edit')}
                  </Link>
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
