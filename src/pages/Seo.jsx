import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const TYPE_LABELS = {
  gtm: 'Google Tag Manager',
  ga4: 'Google Analytics (GA4)',
  snap_pixel: 'Snapchat Pixel',
  facebook_pixel: 'Facebook Pixel',
  tiktok_pixel: 'TikTok Pixel',
  custom: 'Custom Script',
};

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const Seo = () => {
  const { t } = useTranslation();
  const [metaForm, setMetaForm] = useState({
    metaTitleEn: '',
    metaTitleAr: '',
    metaDescriptionEn: '',
    metaDescriptionAr: '',
    metaKeywords: '',
  });
  const [metaSaved, setMetaSaved] = useState(false);
  const [metaError, setMetaError] = useState('');
  const [pixels, setPixels] = useState([]);

  const loadMeta = () =>
    api.get('/seo/public').then((res) => {
      const m = res.data.meta;
      setMetaForm({
        metaTitleEn: m.metaTitleEn || '',
        metaTitleAr: m.metaTitleAr || '',
        metaDescriptionEn: m.metaDescriptionEn || '',
        metaDescriptionAr: m.metaDescriptionAr || '',
        metaKeywords: m.metaKeywords || '',
      });
    });

  const loadPixels = () => api.get('/seo/pixels').then((res) => setPixels(res.data));

  useEffect(() => {
    loadMeta();
    loadPixels();
  }, []);

  const handleMetaSubmit = async (e) => {
    e.preventDefault();
    setMetaError('');
    try {
      await api.put('/seo/meta', metaForm);
      setMetaSaved(true);
      setTimeout(() => setMetaSaved(false), 2000);
    } catch (err) {
      setMetaError(err.response?.data?.message || t('seo_page.save_failed'));
    }
  };

  const toggleActive = async (pixel) => {
    await api.put(`/seo/pixels/${pixel.id}`, { isActive: !pixel.isActive });
    loadPixels();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('common.confirm_delete'))) return;
    await api.delete(`/seo/pixels/${id}`);
    loadPixels();
  };

  return (
    <div>
      <div className="toolbar">
        <h1>{t('seo_page.title')}</h1>
      </div>
      <p style={{ color: 'var(--color-muted)', marginBottom: 20 }}>{t('seo_page.description')}</p>

      <div className="card" style={{ marginBottom: 24, maxWidth: 720 }}>
        <h3>{t('seo_page.meta_title')}</h3>
        <form onSubmit={handleMetaSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>{t('seo_page.meta_title_en')}</label>
              <input value={metaForm.metaTitleEn} onChange={(e) => setMetaForm({ ...metaForm, metaTitleEn: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('seo_page.meta_title_ar')}</label>
              <input value={metaForm.metaTitleAr} onChange={(e) => setMetaForm({ ...metaForm, metaTitleAr: e.target.value })} dir="rtl" />
            </div>
          </div>
          <div className="form-group">
            <label>{t('seo_page.meta_description_en')}</label>
            <textarea
              rows={2}
              value={metaForm.metaDescriptionEn}
              onChange={(e) => setMetaForm({ ...metaForm, metaDescriptionEn: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--color-border)', borderRadius: 10, font: 'inherit' }}
            />
          </div>
          <div className="form-group">
            <label>{t('seo_page.meta_description_ar')}</label>
            <textarea
              rows={2}
              dir="rtl"
              value={metaForm.metaDescriptionAr}
              onChange={(e) => setMetaForm({ ...metaForm, metaDescriptionAr: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--color-border)', borderRadius: 10, font: 'inherit' }}
            />
          </div>
          <div className="form-group">
            <label>{t('seo_page.meta_keywords')}</label>
            <input
              value={metaForm.metaKeywords}
              onChange={(e) => setMetaForm({ ...metaForm, metaKeywords: e.target.value })}
              placeholder={t('seo_page.meta_keywords_hint')}
            />
          </div>
          {metaError && <p className="error-text">{metaError}</p>}
          <button type="submit" className="btn">
            {t('common.save')}
          </button>
          {metaSaved && <span style={{ marginInlineStart: 10, color: '#16a34a' }}>{t('seo_page.saved')}</span>}
        </form>
      </div>

      <div className="toolbar">
        <h3 style={{ margin: 0 }}>{t('seo_page.pixels_title')}</h3>
        <div className="toolbar-actions">
          <Link to="/seo/pixels/new" className="btn">
            <PlusIcon />
            <span style={{ marginInlineStart: 6 }}>{t('seo_page.add_pixel')}</span>
          </Link>
        </div>
      </div>
      <p style={{ color: 'var(--color-muted)', marginBottom: 16 }}>{t('seo_page.pixels_description')}</p>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>{t('seo_page.label')}</th>
              <th>{t('seo_page.type')}</th>
              <th>{t('seo_page.value')}</th>
              <th>{t('common.status')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pixels.map((p) => (
              <tr key={p.id}>
                <td>{p.label}</td>
                <td>{TYPE_LABELS[p.type] || p.type}</td>
                <td className="order-address-cell">{p.type === 'custom' ? t('seo_page.custom_code') : p.pixelId}</td>
                <td>
                  <span className={`badge ${p.isActive ? 'on' : 'off'}`}>{p.isActive ? t('common.active') : t('common.inactive')}</span>
                </td>
                <td>
                  <Link to={`/seo/pixels/${p.id}`} className="btn btn-outline" style={{ marginInlineEnd: 8 }}>
                    {t('common.edit')}
                  </Link>
                  <button className="btn btn-outline" onClick={() => toggleActive(p)} style={{ marginInlineEnd: 8 }}>
                    {p.isActive ? t('common.block') : t('common.unblock')}
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
                    {t('common.delete')}
                  </button>
                </td>
              </tr>
            ))}
            {!pixels.length && (
              <tr>
                <td colSpan={5}>{t('seo_page.no_pixels')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Seo;
