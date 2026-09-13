import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const empty = { nameEn: '', nameAr: '', image: '', isActive: true, sortOrder: 0 };

const CategoryForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loaded, setLoaded] = useState(isNew);

  useEffect(() => {
    if (isNew) return;
    api.get('/categories', { params: { all: true } }).then((res) => {
      const c = res.data.find((x) => x.id === Number(id));
      if (c) setForm({ nameEn: c.nameEn, nameAr: c.nameAr, image: c.image || '', isActive: c.isActive, sortOrder: c.sortOrder });
      setLoaded(true);
    });
  }, [id, isNew]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isNew) {
        await api.post('/categories', form);
      } else {
        await api.put(`/categories/${id}`, form);
      }
      navigate('/categories');
    } catch (err) {
      setError(err.response?.data?.message || t('categories.save_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!loaded) return <p>{t('common.loading')}</p>;

  return (
    <div>
      <div className="toolbar">
        <h1>{isNew ? t('categories.add_category') : t('categories.edit_category')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 560 }}>
        <div className="form-group">
          <label>{t('categories.name_en')}</label>
          <input required value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t('categories.name_ar')}</label>
          <input required value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} dir="rtl" />
        </div>
        <div className="form-group">
          <label>{t('categories.image')}</label>
          <input type="file" accept="image/*" onChange={handleUpload} />
          {uploading && <span>{t('banners_page.uploading')}</span>}
          {form.image && <img src={form.image} alt="" style={{ height: 60, marginTop: 8, display: 'block', borderRadius: 6 }} />}
        </div>
        <div className="form-group">
          <label>{t('categories.sort')}</label>
          <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        </div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} style={{ width: 'auto' }} />
            {t('categories.active')}
          </label>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="toolbar-actions">
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? t('common.saving') : isNew ? t('common.add') : t('categories.update')}
          </button>
          <Link to="/categories" className="btn btn-outline">
            {t('common.cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
