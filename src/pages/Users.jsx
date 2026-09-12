import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const Users = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);

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
