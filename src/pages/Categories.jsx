import { useEffect, useState } from 'react';
import api from '../api/axios';

const empty = { nameEn: '', nameAr: '', isActive: true, sortOrder: 0 };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/categories', { params: { all: true } }).then((res) => setCategories(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
      } else {
        await api.post('/categories', form);
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setForm({ nameEn: c.nameEn, nameAr: c.nameAr, isActive: c.isActive, sortOrder: c.sortOrder });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div>
      <h1>Categories</h1>
      <div className="card" style={{ marginBottom: 20 }}>
        <form onSubmit={handleSubmit} className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 100px auto', gap: 12, alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Name (EN)</label>
            <input required value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Name (AR)</label>
            <input required value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} dir="rtl" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Sort</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Active</label>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          </div>
          <button type="submit" className="btn">
            {editingId ? 'Update' : 'Add'}
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>EN</th>
              <th>AR</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.nameEn}</td>
                <td dir="rtl">{c.nameAr}</td>
                <td>
                  <span className={`badge ${c.isActive ? 'on' : 'off'}`}>{c.isActive ? 'Active' : 'Hidden'}</span>
                </td>
                <td>
                  <button className="btn btn-outline" onClick={() => handleEdit(c)} style={{ marginRight: 8 }}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>
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

export default Categories;
