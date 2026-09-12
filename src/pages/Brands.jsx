import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const empty = { nameEn: '', nameAr: '', image: '', isActive: true, sortOrder: 0 };

const Brands = () => {
  const { t } = useTranslation();
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = () => api.get('/brands', { params: { all: true } }).then((res) => setBrands(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/brands/${editingId}`, form);
      } else {
        await api.post('/brands', form);
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || t('brands.save_failed'));
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

  const handleEdit = (b) => {
    setEditingId(b.id);
    setForm({ nameEn: b.nameEn, nameAr: b.nameAr, image: b.image || '', isActive: b.isActive, sortOrder: b.sortOrder });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('brands.confirm_delete'))) return;
    await api.delete(`/brands/${id}`);
    load();
  };

  return (
    <div>
      <h1>{t('brands.title')}</h1>
      <div className="card" style={{ marginBottom: 20 }}>
        <form onSubmit={handleSubmit} className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px 90px 90px auto', gap: 12, alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>{t('brands.name_en')}</label>
            <input required value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>{t('brands.name_ar')}</label>
            <input required value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} dir="rtl" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>{t('brands.image')}</label>
            <input type="file" accept="image/*" onChange={handleUpload} />
            {uploading && <span>{t('banners_page.uploading')}</span>}
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>{t('brands.sort')}</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>{t('brands.active')}</label>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          </div>
          <button type="submit" className="btn">
            {editingId ? t('brands.update') : t('common.add')}
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}
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
            {brands.map((b) => (
              <tr key={b.id}>
                <td>{b.image && <img src={b.image} alt="" style={{ height: 32, borderRadius: 4 }} />}</td>
                <td>{b.nameEn}</td>
                <td dir="rtl">{b.nameAr}</td>
                <td>
                  <span className={`badge ${b.isActive ? 'on' : 'off'}`}>{b.isActive ? t('brands.active') : t('brands.hidden')}</span>
                </td>
                <td>
                  <button className="btn btn-outline" onClick={() => handleEdit(b)} style={{ marginRight: 8 }}>
                    {t('common.edit')}
                  </button>
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
