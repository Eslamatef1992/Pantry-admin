import { useEffect, useState } from 'react';
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

const Banners = () => {
  const { t } = useTranslation();
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [linkType, setLinkType] = useState('shop');
  const [linkSlug, setLinkSlug] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = () => api.get('/banners/admin/all').then((res) => setBanners(res.data));

  useEffect(() => {
    load();
    api.get('/categories', { params: { all: true } }).then((res) => setCategories(res.data));
    api.get('/products', { params: { all: true, limit: 200 } }).then((res) => setProducts(res.data.products));
  }, []);

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
    const payload = { ...form, linkUrl: buildLinkUrl(linkType, linkSlug, form.linkUrl) };
    try {
      if (editingId) {
        await api.put(`/banners/${editingId}`, payload);
      } else {
        await api.post('/banners', payload);
      }
      setForm(empty);
      setLinkType('shop');
      setLinkSlug('');
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || t('banners_page.save_failed'));
    }
  };

  const handleEdit = (b) => {
    setEditingId(b.id);
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
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(empty);
    setLinkType('shop');
    setLinkSlug('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('banners_page.confirm_delete'))) return;
    await api.delete(`/banners/${id}`);
    load();
  };

  const activeSorted = [...banners].filter((b) => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  const positionLabel = (index) => {
    if (index === 0) return t('banners_page.position_main');
    if (index === 1 || index === 2) return t('banners_page.position_side');
    if (index === 3) return t('banners_page.position_promo');
    return t('banners_page.position_hidden');
  };

  return (
    <div>
      <h1>{t('banners_page.title')}</h1>

      <div className="card" style={{ marginBottom: 20, padding: 14, background: '#f7f8f6' }}>
        <p style={{ margin: 0 }}>{t('banners_page.layout_hint')}</p>
      </div>

      <div className="card" style={{ marginBottom: 20, maxWidth: 640 }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? t('banners_page.edit_banner') : t('banners_page.add_banner')}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('banners_page.image_label')}</label>
            <input type="file" accept="image/*" onChange={handleUpload} />
            {uploading && <span>{t('banners_page.uploading')}</span>}
            {form.image && <img src={form.image} alt="" style={{ height: 60, marginTop: 8, display: 'block' }} />}
          </div>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
            <select value={linkType} onChange={(e) => { setLinkType(e.target.value); setLinkSlug(''); }}>
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
            <label>
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />{' '}
              {t('banners_page.active')}
            </label>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn">
            {editingId ? t('banners_page.update') : t('banners_page.add')}
          </button>
          {editingId && (
            <button type="button" className="btn btn-outline" style={{ marginLeft: 8 }} onClick={handleCancel}>
              {t('banners_page.cancel')}
            </button>
          )}
        </form>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>{t('banners_page.image_col')}</th>
              <th>{t('banners_page.title_col')}</th>
              <th>{t('banners_page.sort_col')}</th>
              <th>{t('banners_page.position_col')}</th>
              <th>{t('banners_page.link_col')}</th>
              <th>{t('common.status')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => {
              const activeIndex = activeSorted.findIndex((x) => x.id === b.id);
              return (
                <tr key={b.id}>
                  <td>
                    <img src={b.image} alt="" style={{ height: 36, borderRadius: 4 }} />
                  </td>
                  <td>{b.titleEn}</td>
                  <td>{b.sortOrder}</td>
                  <td>{b.isActive ? positionLabel(activeIndex) : t('banners_page.position_hidden')}</td>
                  <td style={{ fontSize: 12, color: '#666' }}>{b.linkUrl}</td>
                  <td>
                    <span className={`badge ${b.isActive ? 'on' : 'off'}`}>{b.isActive ? t('common.active') : t('categories.hidden')}</span>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Banners;
