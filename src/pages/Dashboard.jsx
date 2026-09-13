import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const StatCard = ({ value, label, color }) => (
  <div className="card stat-card" style={{ '--stat-color': color }}>
    <div className="value">{value}</div>
    <div className="label">{label}</div>
    <div className="stat-wave" />
  </div>
);

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    customers: 0,
    products: 0,
    pending: 0,
    delivered: 0,
    cancelled: 0,
    topProduct: null,
  });

  useEffect(() => {
    Promise.all([
      api.get('/reports/summary'),
      api.get('/products', { params: { all: true, limit: 1 } }),
      api.get('/users/customers', { params: { limit: 1 } }),
    ]).then(([summaryRes, productsRes, customersRes]) => {
      const s = summaryRes.data;
      setStats({
        orders: s.totalOrders,
        revenue: s.totalRevenue,
        customers: customersRes.data.total,
        products: productsRes.data.total,
        pending: s.byStatus.pending || 0,
        delivered: s.byStatus.delivered || 0,
        cancelled: s.byStatus.cancelled || 0,
        topProduct: s.topProducts && s.topProducts[0] ? s.topProducts[0] : null,
      });
    });
  }, []);

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <div className="stat-grid">
        <StatCard value={stats.orders} label={t('dashboard.total_orders')} color="#6366f1" />
        <StatCard value={`${stats.revenue.toFixed(3)} KWD`} label={t('dashboard.revenue')} color="#22c55e" />
        <StatCard value={stats.customers} label={t('dashboard.total_customers')} color="#0ea5e9" />
        <StatCard value={stats.products} label={t('dashboard.products')} color="#f59e0b" />
        <StatCard value={stats.pending} label={t('dashboard.pending_orders')} color="#ef4444" />
        <StatCard value={stats.delivered} label={t('dashboard.delivered_orders')} color="#14b8a6" />
        <StatCard value={stats.cancelled} label={t('dashboard.cancelled_orders')} color="#a855f7" />
        <StatCard
          value={stats.topProduct ? stats.topProduct.nameEn : '—'}
          label={stats.topProduct ? `${t('dashboard.top_product')} (${stats.topProduct.unitsSold} ${t('dashboard.units_sold')})` : t('dashboard.top_product')}
          color="#ec4899"
        />
      </div>
    </div>
  );
};

export default Dashboard;
