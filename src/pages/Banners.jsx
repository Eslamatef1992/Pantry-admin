import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const Banners = () => {
  const { t } = useTranslation();
  const [banners, setBanners] = useState([]);

  const load = () => api.get('/banners/admin/all').then((res) => setBanners(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('banners_page.confirm_delete'))) return;
    await api.delete(`/banners/${id}`);
    load();
  };

  const activeSorted = [...banners].filter((b) => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  const positionLabel = (index) => {
    if (index === 0) return t('banners_page.position_main');
    if (index === 1 || index === 2) return t('banners_page.position_side');
    if (index === 3) return t('banners_page.position_promo');
    return t('banners_page.position_hidden');
  };

  return (
    <div>
      <div className="toolbar">
        <h1>{t('banners_page.title')}</h1>
        <div className="toolbar-actions">
          <Link to="/banners/new" className="btn">
            {t('banners_page.add_banner')}
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 14, background: '#f7f8f6' }}>
        <p style={{ margin: 0 }}>{t('banners_page.layout_hint')}</p>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>{t('banners_page.image_col')}</th>
              <th>{t('banners_page.title_col')}</th>
              <th>{t('banners_page.sort_col')}</th>
              <th>{t('banners_page.position_col')}</th>
              <th>{t('banners_page.link_col')}</th>
              <th>{t('common.status')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => {
              const activeIndex = activeSorted.findIndex((x) => x.id === b.id);
              return (
                <tr key={b.id}>
                  <td>
                    <img src={b.image} alt="" style={{ height: 36, borderRadius: 4 }} />
                  </td>
                  <td>{b.titleEn}</td>
                  <td>{b.sortOrder}</td>
                  <td>{b.isActive ? positionLabel(activeIndex) : t('banners_page.position_hidden')}</td>
                  <td style={{ fontSize: 12, color: '#666' }}>{b.linkUrl}</td>
                  <td>
                    <span className={`badge ${b.isActive ? 'on' : 'off'}`}>{b.isActive ? t('common.active') : t('categories.hidden')}</span>
                  </td>
                  <td>
                    <Link to={`/banners/${b.id}`} className="btn btn-outline" style={{ marginRight: 8 }}>
                      {t('common.edit')}
                    </Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(b.id)}>
                      {t('common.delete')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Banners;
