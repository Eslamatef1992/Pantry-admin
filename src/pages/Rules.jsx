import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const empty = { minOrderAmount: '0', deliveryFee: '1.5', freeDeliveryThreshold: '' };

const Rules = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState(empty);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/settings/site').then((res) => {
      setForm({
        minOrderAmount: res.data.minOrderAmount ?? '0',
        deliveryFee: res.data.deliveryFee ?? '1.5',
        freeDeliveryThreshold: res.data.freeDeliveryThreshold ?? '',
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put('/settings/admin/rules', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || t('rules_page.super_admin_only'));
    }
  };

  return (
    <div>
      <h1>{t('rules_page.title')}</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>{t('rules_page.description')}</p>
      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 480 }}>
        <div className="form-group">
          <label>{t('rules_page.min_order_amount')}</label>
          <input
            type="number"
            step="0.001"
            min="0"
            value={form.minOrderAmount}
            onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>{t('rules_page.delivery_fee')}</label>
          <input
            type="number"
            step="0.001"
            min="0"
            value={form.deliveryFee}
            onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>{t('rules_page.free_delivery_threshold')}</label>
          <input
            type="number"
            step="0.001"
            min="0"
            value={form.freeDeliveryThreshold}
            onChange={(e) => setForm({ ...form, freeDeliveryThreshold: e.target.value })}
            placeholder={t('rules_page.free_delivery_hint')}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn">
          {t('common.save')}
        </button>
        {saved && <span style={{ marginLeft: 10, color: '#16a34a' }}>{t('rules_page.saved')}</span>}
      </form>
    </div>
  );
};

export default Rules;
