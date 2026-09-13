import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const Brands = () => {
  const { t } = useTranslation();
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => api.get('/brands', { params: { all: true } }).then((res) => setBrands(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('brands.confirm_delete'))) return;
    await api.delete(`/brands/${id}`);
    load();
  };

  return (
    <div>
      <div className="toolbar">
        <h1>{t('brands.title')}</h1>
        <div className="toolbar-actions">
          <input className="search-input" placeholder={t('common.search')} value={search} onChange={(e) => setSearch(e.target.value)} />
          <Link to="/brands/new" className="btn">
            {t('brands.add_brand')}
          </Link>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>{t('brands.image')}</th>
              <th>{t('brands.name_en')}</th>
              <th>{t('brands.name_ar')}</th>
              <th>{t('common.status')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {brands
              .filter((b) => !search || b.nameEn.toLowerCase().includes(search.toLowerCase()) || b.nameAr.includes(search))
              .map((b) => (
                <tr key={b.id}>
                  <td>{b.image && <img src={b.image} alt="" style={{ height: 32, borderRadius: 4 }} />}</td>
                  <td>{b.nameEn}</td>
                  <td dir="rtl">{b.nameAr}</td>
                  <td>
                    <span className={`badge ${b.isActive ? 'on' : 'off'}`}>{b.isActive ? t('brands.active') : t('brands.hidden')}</span>
                  </td>
                  <td>
                    <Link to={`/brands/${b.id}`} className="btn btn-outline" style={{ marginRight: 8 }}>
                      {t('common.edit')}
                    </Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(b.id)}>
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

export default Brands;
