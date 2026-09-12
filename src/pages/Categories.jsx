import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const empty = { nameEn: '', nameAr: '', image: '', isActive: true, sortOrder: 0 };

const Categories = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = () => api.get('/categories', { params: { all: true } }).then((res) => setCategories(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
      } else {
        await api.post('/categories', form);
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || t('categories.save_failed'));
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((f) => ({ ...f, image: res.data.url }));
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setForm({ nameEn: c.nameEn, nameAr: c.nameAr, image: c.image || '', isActive: c.isActive, sortOrder: c.sortOrder });
  };

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
        </div>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <form onSubmit={handleSubmit} className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px 90px 90px auto', gap: 12, alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>{t('categories.name_en')}</label>
            <input required value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>{t('categories.name_ar')}</label>
            <input required value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} dir="rtl" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>{t('categories.image')}</label>
            <input type="file" accept="image/*" onChange={handleUpload} />
            {uploading && <span>{t('banners_page.uploading')}</span>}
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>{t('categories.sort')}</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>{t('categories.active')}</label>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          </div>
          <button type="submit" className="btn">
            {editingId ? t('categories.update') : t('common.add')}
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}
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
              .filter(
                (c) =>
                  !search ||
                  c.nameEn.toLowerCase().includes(search.toLowerCase()) ||
                  c.nameAr.includes(search)
              )
              .map((c) => (
              <tr key={c.id}>
                <td>{c.image && <img src={c.image} alt="" style={{ height: 32, borderRadius: 4 }} />}</td>
                <td>{c.nameEn}</td>
                <td dir="rtl">{c.nameAr}</td>
                <td>
                  <span className={`badge ${c.isActive ? 'on' : 'off'}`}>{c.isActive ? t('categories.active') : t('categories.hidden')}</span>
                </td>
                <td>
                  <button className="btn btn-outline" onClick={() => handleEdit(c)} style={{ marginRight: 8 }}>
                    {t('common.edit')}
                  </button>
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
