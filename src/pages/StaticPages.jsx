import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const StaticPages = () => {
  const { t } = useTranslation();
  const [pages, setPages] = useState([]);

  const load = () => api.get('/pages', { params: { all: true } }).then((res) => setPages(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('static_pages.confirm_delete'))) return;
    await api.delete(`/pages/${id}`);
    load();
  };

  return (
    <div>
      <div className="toolbar">
        <h1>{t('static_pages.title')}</h1>
        <div className="toolbar-actions">
          <Link to="/pages/new" className="btn">
            {t('static_pages.add_page')}
          </Link>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>{t('static_pages.slug')}</th>
              <th>{t('static_pages.title_en')}</th>
              <th>{t('common.status')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id}>
                <td>{p.slug}</td>
                <td>{p.titleEn}</td>
                <td>
                  <span className={`badge ${p.isActive ? 'on' : 'off'}`}>{p.isActive ? t('brands.active') : t('brands.hidden')}</span>
                </td>
                <td>
                  <Link to={`/pages/${p.id}`} className="btn btn-outline" style={{ marginRight: 8 }}>
                    {t('common.edit')}
                  </Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
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

export default StaticPages;
