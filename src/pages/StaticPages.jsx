import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const empty = { slug: '', titleEn: '', titleAr: '', contentEn: '', contentAr: '', isActive: true };

const StaticPages = () => {
  const { t } = useTranslation();
  const [pages, setPages] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/pages', { params: { all: true } }).then((res) => setPages(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/pages/${editingId}`, form);
      } else {
        await api.post('/pages', form);
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || t('static_pages.save_failed'));
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      slug: p.slug,
      titleEn: p.titleEn,
      titleAr: p.titleAr,
      contentEn: p.contentEn || '',
      contentAr: p.contentAr || '',
      isActive: p.isActive,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(empty);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('static_pages.confirm_delete'))) return;
    await api.delete(`/pages/${id}`);
    if (editingId === id) handleCancel();
    load();
  };

  return (
    <div>
      <h1>{t('static_pages.title')}</h1>
      <div className="card" style={{ marginBottom: 20, maxWidth: 720 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('static_pages.slug')}</label>
            <input
              required
              value={form.slug}
              disabled={!!editingId}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="about-us"
            />
          </div>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>{t('static_pages.title_en')}</label>
              <input required value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('static_pages.title_ar')}</label>
              <input required dir="rtl" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>{t('static_pages.content_en')}</label>
            <textarea rows={6} value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('static_pages.content_ar')}</label>
            <textarea rows={6} dir="rtl" value={form.contentAr} onChange={(e) => setForm({ ...form, contentAr: e.target.value })} />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />{' '}
              {t('brands.active')}
            </label>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn">
            {editingId ? t('static_pages.update') : t('common.add')}
          </button>
          {editingId && (
            <button type="button" className="btn btn-outline" style={{ marginLeft: 8 }} onClick={handleCancel}>
              {t('common.cancel')}
            </button>
          )}
        </form>
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
                  <button className="btn btn-outline" onClick={() => handleEdit(p)} style={{ marginRight: 8 }}>
                    {t('common.edit')}
                  </button>
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
