import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const empty = { name: '', email: '', phone: '', password: '', adminRole: 'staff', isActive: true };

const AdminForm = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(isNew);

  useEffect(() => {
    if (isNew) return;
    api.get('/users/admins').then((res) => {
      const a = res.data.find((x) => x.id === Number(id));
      if (a) {
        setForm({ name: a.name, email: a.email, phone: a.phone || '', password: '', adminRole: a.adminRole || 'staff', isActive: a.isActive });
      }
      setLoaded(true);
    });
  }, [id, isNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!isNew && !payload.password) delete payload.password;
      if (isNew) {
        await api.post('/users/admins', payload);
      } else {
        await api.put(`/users/admins/${id}`, payload);
      }
      navigate('/admins');
    } catch (err) {
      setError(err.response?.data?.message || t('admins_page.save_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const editingSelf = !isNew && Number(id) === user?.id;

  if (!loaded) return <p>{t('common.loading')}</p>;

  return (
    <div>
      <div className="toolbar">
        <h1>{isNew ? t('admins_page.add_new') : t('admins_page.edit_admin')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 560 }}>
        <div className="form-group">
          <label>{t('admins_page.name')}</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t('admins_page.email')}</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!isNew} />
        </div>
        <div className="form-group">
          <label>{t('admins_page.phone')}</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t('admins_page.password')}</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder={!isNew ? t('admins_page.password_hint') : ''}
            required={isNew}
          />
        </div>
        <div className="form-group">
          <label>{t('admins_page.role')}</label>
          <select value={form.adminRole} onChange={(e) => setForm({ ...form, adminRole: e.target.value })} disabled={editingSelf}>
            <option value="staff">{t('admins_page.staff')}</option>
            <option value="super_admin">{t('admins_page.super_admin')}</option>
          </select>
        </div>
        {!isNew && (
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                disabled={editingSelf}
                style={{ width: 'auto' }}
              />
              {t('admins_page.active')}
            </label>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}

        <div className="toolbar-actions">
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? t('common.saving') : isNew ? t('admins_page.add_new') : t('admins_page.update')}
          </button>
          <Link to="/admins" className="btn btn-outline">
            {t('common.cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;
