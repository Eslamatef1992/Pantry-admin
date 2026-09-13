import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const TYPES = [
  { value: 'gtm', labelKey: 'seo_pixel_form.type_gtm', hintKey: 'seo_pixel_form.hint_gtm', placeholder: 'GTM-XXXXXXX' },
  { value: 'ga4', labelKey: 'seo_pixel_form.type_ga4', hintKey: 'seo_pixel_form.hint_ga4', placeholder: 'G-XXXXXXXXXX' },
  { value: 'snap_pixel', labelKey: 'seo_pixel_form.type_snap', hintKey: 'seo_pixel_form.hint_snap', placeholder: 'a1b2c3d4-...' },
  { value: 'facebook_pixel', labelKey: 'seo_pixel_form.type_facebook', hintKey: 'seo_pixel_form.hint_facebook', placeholder: '1234567890' },
  { value: 'tiktok_pixel', labelKey: 'seo_pixel_form.type_tiktok', hintKey: 'seo_pixel_form.hint_tiktok', placeholder: 'C4A...' },
  { value: 'custom', labelKey: 'seo_pixel_form.type_custom', hintKey: 'seo_pixel_form.hint_custom', placeholder: '' },
];

const empty = { type: 'gtm', label: '', pixelId: '', code: '', isActive: true };

const SeoPixelForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/seo/pixels/${id}`).then((res) => {
      setForm({
        type: res.data.type,
        label: res.data.label,
        pixelId: res.data.pixelId || '',
        code: res.data.code || '',
        isActive: res.data.isActive,
      });
      setLoaded(true);
    });
  }, [id, isEdit]);

  const current = TYPES.find((tp) => tp.value === form.type) || TYPES[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/seo/pixels/${id}`, form);
      } else {
        await api.post('/seo/pixels', form);
      }
      navigate('/seo');
    } catch (err) {
      setError(err.response?.data?.message || t('seo_pixel_form.save_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!loaded) return <p>{t('common.loading')}</p>;

  return (
    <div>
      <div className="toolbar">
        <h1>{isEdit ? t('seo_pixel_form.edit_title') : t('seo_pixel_form.add_title')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 560 }}>
        <div className="form-group">
          <label>{t('seo_pixel_form.type')}</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {TYPES.map((tp) => (
              <option key={tp.value} value={tp.value}>
                {t(tp.labelKey)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{t('seo_pixel_form.label')}</label>
          <input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        </div>

        {form.type === 'custom' ? (
          <div className="form-group">
            <label>{t('seo_pixel_form.code')}</label>
            <p className="muted-text" style={{ marginBottom: 6 }}>
              {t(current.hintKey)}
            </p>
            <textarea
              required
              rows={8}
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                border: '1.5px solid var(--color-border)',
                borderRadius: 10,
                font: 'inherit',
                fontFamily: 'monospace',
                fontSize: 13,
              }}
            />
          </div>
        ) : (
          <div className="form-group">
            <label>{t('seo_pixel_form.pixel_id')}</label>
            <p className="muted-text" style={{ marginBottom: 6 }}>
              {t(current.hintKey)}
            </p>
            <input
              required
              value={form.pixelId}
              onChange={(e) => setForm({ ...form, pixelId: e.target.value })}
              placeholder={current.placeholder}
            />
          </div>
        )}

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} style={{ width: 'auto' }} />
            {t('seo_pixel_form.active')}
          </label>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="toolbar-actions">
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? t('common.saving') : t('common.save')}
          </button>
          <Link to="/seo" className="btn btn-outline">
            {t('common.cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SeoPixelForm;
