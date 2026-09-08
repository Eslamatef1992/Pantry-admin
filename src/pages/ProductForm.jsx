import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const empty = {
  nameEn: '',
  nameAr: '',
  descriptionEn: '',
  descriptionAr: '',
  price: '',
  compareAtPrice: '',
  stock: 0,
  unit: 'pc',
  categoryId: '',
  isActive: true,
  isFeatured: false,
  isBestSeller: false,
  isNewArrival: false,
  isBundle: false,
  image: '',
};

const ProductForm = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/categories', { params: { all: true } }).then((res) => setCategories(res.data));
    if (!isNew) {
      api.get('/products').then(async () => {
        // fetch by id via admin listing since /products/:slug expects slug; use all list and find by id
        const res = await api.get('/products', { params: { all: true, limit: 200 } });
        const product = res.data.products.find((p) => p.id === Number(id));
        if (product) setForm({ ...empty, ...product });
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
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      };
      if (isNew) {
        await api.post('/products', payload);
      } else {
        await api.put(`/products/${id}`, payload);
      }
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  return (
    <div>
      <h1>{isNew ? 'Add Product' : 'Edit Product'}</h1>
      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 640 }}>
        <div className="form-group">
          <label>Name (EN)</label>
          <input required value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Name (AR)</label>
          <input required dir="rtl" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Description (EN)</label>
          <textarea rows={3} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Description (AR)</label>
          <textarea rows={3} dir="rtl" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} />
        </div>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label>Category</label>
            <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Select...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameEn}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Unit</label>
            <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Price (KWD)</label>
            <input type="number" step="0.001" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label>Compare-at Price (optional, shows as a strikethrough "Offer" price)</label>
            <input
              type="number"
              step="0.001"
              value={form.compareAtPrice || ''}
              onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Image</label>
          <input type="file" accept="image/*" onChange={handleUpload} />
          {uploading && <span>Uploading...</span>}
          {form.image && <img src={form.image} alt="" style={{ height: 60, marginTop: 8 }} />}
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured on homepage
          </label>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
            />{' '}
            Show in "Best Sellers" on homepage
          </label>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={form.isNewArrival}
              onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })}
            />{' '}
            Show in "New Arrivals" on homepage
          </label>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={form.isBundle}
              onChange={(e) => setForm({ ...form, isBundle: e.target.checked })}
            />{' '}
            Show in "Bundles" on homepage
          </label>
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn">
          Save
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
