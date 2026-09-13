import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const empty = { slug: '', titleEn: '', titleAr: '', contentEn: '', contentAr: '', isActive: true };

const StaticPageForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(isNew);

  useEffect(() => {
    if (isNew) return;
    api.get('/pages', { params: { all: true } }).then((res) => {
      const p = res.data.find((x) => x.id === Number(id));
      if (p) {
        setForm({
          slug: p.slug,
          titleEn: p.titleEn,
          titleAr: p.titleAr,
          contentEn: p.contentEn || '',
          contentAr: p.contentAr || '',
          isActive: p.isActive,
        });
      }
      setLoaded(true);
    });
  }, [id, isNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isNew) {
        await api.post('/pages', form);
      } else {
        await api.put(`/pages/${id}`, form);
      }
      navigate('/pages');
    } catch (err) {
      setError(err.response?.data?.message || t('static_pages.save_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!loaded) return <p>{t('common.loading')}</p>;

  return (
    <div>
      <div className="toolbar">
        <h1>{isNew ? t('static_pages.add_page') : t('static_pages.edit_page')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 720 }}>
        <div className="form-group">
          <label>{t('static_pages.slug')}</label>
          <input required value={form.slug} disabled={!isNew} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="about-us" />
        </div>
        <div className="form-grid">
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
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} style={{ width: 'auto' }} />
            {t('brands.active')}
          </label>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="toolbar-actions">
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? t('common.saving') : isNew ? t('common.add') : t('static_pages.update')}
          </button>
          <Link to="/pages" className="btn btn-outline">
            {t('common.cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default StaticPageForm;
