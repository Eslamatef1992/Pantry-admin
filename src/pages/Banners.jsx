import { useEffect, useState } from 'react';
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

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = () => api.get('/banners/admin/all').then((res) => setBanners(res.data));

  useEffect(() => {
    load();
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
    if (!form.image) return setError('Please upload a banner image.');
    try {
      if (editingId) {
        await api.put(`/banners/${editingId}`, form);
      } else {
        await api.post('/banners', form);
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save banner');
    }
  };

  const handleEdit = (b) => {
    setEditingId(b.id);
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    await api.delete(`/banners/${id}`);
    load();
  };

  return (
    <div>
      <h1>Homepage Banners</h1>
      <div className="card" style={{ marginBottom: 20, maxWidth: 640 }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Banner' : 'Add Banner'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Banner Image (recommended ~1200x400)</label>
            <input type="file" accept="image/*" onChange={handleUpload} />
            {uploading && <span>Uploading...</span>}
            {form.image && <img src={form.image} alt="" style={{ height: 60, marginTop: 8, display: 'block' }} />}
          </div>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Title (EN)</label>
              <input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Title (AR)</label>
              <input dir="rtl" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Subtitle (EN)</label>
              <input value={form.subtitleEn} onChange={(e) => setForm({ ...form, subtitleEn: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Subtitle (AR)</label>
              <input dir="rtl" value={form.subtitleAr} onChange={(e) => setForm({ ...form, subtitleAr: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Link URL</label>
              <input value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
            </div>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
            </label>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn">
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-outline" style={{ marginLeft: 8 }} onClick={handleCancel}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title (EN)</th>
              <th>Sort</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id}>
                <td>
                  <img src={b.image} alt="" style={{ height: 36, borderRadius: 4 }} />
                </td>
                <td>{b.titleEn}</td>
                <td>{b.sortOrder}</td>
                <td>
                  <span className={`badge ${b.isActive ? 'on' : 'off'}`}>{b.isActive ? 'Active' : 'Hidden'}</span>
                </td>
                <td>
                  <button className="btn btn-outline" onClick={() => handleEdit(b)} style={{ marginRight: 8 }}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(b.id)}>
                    Delete
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

export default Banners;
