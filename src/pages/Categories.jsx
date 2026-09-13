import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const Categories = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => api.get('/categories', { params: { all: true } }).then((res) => setCategories(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('categories.confirm_delete'))) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div>
      <div className="toolbar">
        <h1>{t('categories.title')}</h1>
        <div className="toolbar-actions">
          <input className="search-input" placeholder={t('common.search')} value={search} onChange={(e) => setSearch(e.target.value)} />
          <Link to="/categories/new" className="btn">
            {t('categories.add_category')}
          </Link>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>{t('categories.image')}</th>
              <th>{t('categories.name_en')}</th>
              <th>{t('categories.name_ar')}</th>
              <th>{t('common.status')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories
              .filter((c) => !search || c.nameEn.toLowerCase().includes(search.toLowerCase()) || c.nameAr.includes(search))
              .map((c) => (
                <tr key={c.id}>
                  <td>{c.image && <img src={c.image} alt="" style={{ height: 32, borderRadius: 4 }} />}</td>
                  <td>{c.nameEn}</td>
                  <td dir="rtl">{c.nameAr}</td>
                  <td>
                    <span className={`badge ${c.isActive ? 'on' : 'off'}`}>{c.isActive ? t('categories.active') : t('categories.hidden')}</span>
                  </td>
                  <td>
                    <Link to={`/categories/${c.id}`} className="btn btn-outline" style={{ marginRight: 8 }}>
                      {t('common.edit')}
                    </Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>
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

export default Categories;
