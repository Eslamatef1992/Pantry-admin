import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const StatCard = ({ value, label, color, compact }) => (
  <div className="card stat-card" style={{ '--stat-color': color }}>
    <div className={compact ? 'value value-compact' : 'value'}>{value}</div>
    <div className="label">{label}</div>
    <div className="stat-wave" />
  </div>
);

const startOfMonthStr = () => {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().slice(0, 10);
};

const todayStr = () => new Date().toISOString().slice(0, 10);

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    todayOrders: 0,
    monthRevenue: 0,
    customers: 0,
    products: 0,
    outOfStock: 0,
    categories: 0,
    brands: 0,
    pending: 0,
    delivered: 0,
    cancelled: 0,
    unreadMessages: 0,
    topProduct: null,
  });

  useEffect(() => {
    const today = todayStr();
    const monthStart = startOfMonthStr();

    Promise.all([
      api.get('/reports/summary'),
      api.get('/reports/summary', { params: { from: today, to: today } }),
      api.get('/reports/summary', { params: { from: monthStart, to: today } }),
      api.get('/products', { params: { all: true, limit: 1000 } }),
      api.get('/users/customers', { params: { limit: 1 } }),
      api.get('/categories', { params: { all: true } }),
      api.get('/brands', { params: { all: true } }),
      api.get('/contact/admin/all', { params: { unreadOnly: true } }),
    ]).then(([summaryRes, todayRes, monthRes, productsRes, customersRes, categoriesRes, brandsRes, messagesRes]) => {
      const s = summaryRes.data;
      const products = productsRes.data.products || [];
      setStats({
        orders: s.totalOrders,
        revenue: s.totalRevenue,
        todayOrders: todayRes.data.totalOrders,
        monthRevenue: monthRes.data.totalRevenue,
        customers: customersRes.data.total,
        products: productsRes.data.total,
        outOfStock: products.filter((p) => Number(p.stock) <= 0).length,
        categories: categoriesRes.data.length,
        brands: brandsRes.data.length,
        pending: s.byStatus.pending || 0,
        delivered: s.byStatus.delivered || 0,
        cancelled: s.byStatus.cancelled || 0,
        unreadMessages: messagesRes.data.length,
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
        <StatCard value={stats.todayOrders} label={t('dashboard.today_orders')} color="#3b82f6" />
        <StatCard value={`${stats.monthRevenue.toFixed(3)} KWD`} label={t('dashboard.month_revenue')} color="#10b981" />
        <StatCard value={stats.customers} label={t('dashboard.total_customers')} color="#0ea5e9" />
        <StatCard value={stats.products} label={t('dashboard.products')} color="#f59e0b" />
        <StatCard value={stats.outOfStock} label={t('dashboard.out_of_stock')} color="#dc2626" />
        <StatCard value={stats.categories} label={t('dashboard.total_categories')} color="#8b5cf6" />
        <StatCard value={stats.brands} label={t('dashboard.total_brands')} color="#06b6d4" />
        <StatCard value={stats.pending} label={t('dashboard.pending_orders')} color="#ef4444" />
        <StatCard value={stats.delivered} label={t('dashboard.delivered_orders')} color="#14b8a6" />
        <StatCard value={stats.cancelled} label={t('dashboard.cancelled_orders')} color="#a855f7" />
        <StatCard value={stats.unreadMessages} label={t('dashboard.unread_messages')} color="#f97316" />
        <StatCard
          compact
          value={stats.topProduct ? stats.topProduct.nameEn : '—'}
          label={stats.topProduct ? `${t('dashboard.top_product')} (${stats.topProduct.unitsSold} ${t('dashboard.units_sold')})` : t('dashboard.top_product')}
          color="#ec4899"
        />
      </div>
    </div>
  );
};

export default Dashboard;
