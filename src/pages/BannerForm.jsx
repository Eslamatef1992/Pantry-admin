import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const empty = {
  titleEn: '',
  titleAr: '',
  subtitleEn: '',
  subtitleAr: '',
  image: '',
  linkUrl: '/shop',
  isActive: true,
  sortOrder: 0,
};

// Derive the admin-friendly link picker state (type + selected slug) from a stored linkUrl.
const parseLinkUrl = (linkUrl) => {
  if (!linkUrl) return { linkType: 'shop', linkSlug: '' };
  const categoryMatch = linkUrl.match(/^\/shop\?category=(.+)$/);
  if (categoryMatch) return { linkType: 'category', linkSlug: decodeURIComponent(categoryMatch[1]) };
  const productMatch = linkUrl.match(/^\/product\/(.+)$/);
  if (productMatch) return { linkType: 'product', linkSlug: decodeURIComponent(productMatch[1]) };
  if (linkUrl === '/shop') return { linkType: 'shop', linkSlug: '' };
  return { linkType: 'custom', linkSlug: '' };
};

const buildLinkUrl = (linkType, linkSlug, customUrl) => {
  if (linkType === 'category') return linkSlug ? `/shop?category=${linkSlug}` : '/shop';
  if (linkType === 'product') return linkSlug ? `/product/${linkSlug}` : '/shop';
  if (linkType === 'shop') return '/shop';
  return customUrl || '/shop';
};

const BannerForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [linkType, setLinkType] = useState('shop');
  const [linkSlug, setLinkSlug] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(isNew);

  useEffect(() => {
    api.get('/categories', { params: { all: true } }).then((res) => setCategories(res.data));
    api.get('/products', { params: { all: true, limit: 200 } }).then((res) => setProducts(res.data.products));
    if (!isNew) {
      api.get('/banners/admin/all').then((res) => {
        const b = res.data.find((x) => x.id === Number(id));
        if (b) {
          const parsed = parseLinkUrl(b.linkUrl);
          setLinkType(parsed.linkType);
          setLinkSlug(parsed.linkSlug);
          setForm({
            titleEn: b.titleEn || '',
            titleAr: b.titleAr || '',
            subtitleEn: b.subtitleEn || '',
            subtitleAr: b.subtitleAr || '',
            image: b.image,
            linkUrl: b.linkUrl || '/shop',
            isActive: b.isActive,
            sortOrder: b.sortOrder,
          });
        }
        setLoaded(true);
      });
    }
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
    if (!form.image) return setError(t('banners_page.image_required'));
    setSubmitting(true);
    const payload = { ...form, linkUrl: buildLinkUrl(linkType, linkSlug, form.linkUrl) };
    try {
      if (isNew) {
        await api.post('/banners', payload);
      } else {
        await api.put(`/banners/${id}`, payload);
      }
      navigate('/banners');
    } catch (err) {
      setError(err.response?.data?.message || t('banners_page.save_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!loaded) return <p>{t('common.loading')}</p>;

  return (
    <div>
      <div className="toolbar">
        <h1>{isNew ? t('banners_page.add_banner') : t('banners_page.edit_banner')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 640 }}>
        <div className="form-group">
          <label>{t('banners_page.image_label')}</label>
          <input type="file" accept="image/*" onChange={handleUpload} />
          {uploading && <span>{t('banners_page.uploading')}</span>}
          {form.image && <img src={form.image} alt="" style={{ height: 60, marginTop: 8, display: 'block' }} />}
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>{t('banners_page.title_en')}</label>
            <input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('banners_page.title_ar')}</label>
            <input dir="rtl" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('banners_page.subtitle_en')}</label>
            <input value={form.subtitleEn} onChange={(e) => setForm({ ...form, subtitleEn: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('banners_page.subtitle_ar')}</label>
            <input dir="rtl" value={form.subtitleAr} onChange={(e) => setForm({ ...form, subtitleAr: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('banners_page.sort_order')}</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </div>
        </div>

        <div className="form-group">
          <label>{t('banners_page.link_type')}</label>
          <select
            value={linkType}
            onChange={(e) => {
              setLinkType(e.target.value);
              setLinkSlug('');
            }}
          >
            <option value="shop">{t('banners_page.link_type_shop')}</option>
            <option value="category">{t('banners_page.link_type_category')}</option>
            <option value="product">{t('banners_page.link_type_product')}</option>
            <option value="custom">{t('banners_page.link_type_custom')}</option>
          </select>
        </div>

        {linkType === 'category' && (
          <div className="form-group">
            <label>{t('banners_page.choose_category')}</label>
            <select value={linkSlug} onChange={(e) => setLinkSlug(e.target.value)}>
              <option value="">{t('banners_page.choose_placeholder')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.nameEn}
                </option>
              ))}
            </select>
          </div>
        )}

        {linkType === 'product' && (
          <div className="form-group">
            <label>{t('banners_page.choose_product')}</label>
            <select value={linkSlug} onChange={(e) => setLinkSlug(e.target.value)}>
              <option value="">{t('banners_page.choose_placeholder')}</option>
              {products.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.nameEn}
                </option>
              ))}
            </select>
          </div>
        )}

        {linkType === 'custom' && (
          <div className="form-group">
            <label>{t('banners_page.link_url')}</label>
            <input value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} />
          </div>
        )}

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} style={{ width: 'auto' }} />
            {t('banners_page.active')}
          </label>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="toolbar-actions">
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? t('common.saving') : isNew ? t('banners_page.add') : t('banners_page.update')}
          </button>
          <Link to="/banners" className="btn btn-outline">
            {t('banners_page.cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default BannerForm;
