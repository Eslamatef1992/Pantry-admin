import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ orders: 0, products: 0, revenue: 0, pending: 0 });

  useEffect(() => {
    Promise.all([api.get('/orders/admin/all', { params: { limit: 100 } }), api.get('/products', { params: { all: true, limit: 100 } })]).then(
      ([ordersRes, productsRes]) => {
        const orders = ordersRes.data.orders;
        const revenue = orders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + Number(o.total), 0);
        const pending = orders.filter((o) => o.status === 'pending').length;
        setStats({ orders: ordersRes.data.total, products: productsRes.data.total, revenue, pending });
      }
    );
  }, []);

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <div className="stat-grid">
        <div className="card stat-card">
          <div className="value">{stats.orders}</div>
          <div className="label">{t('dashboard.total_orders')}</div>
        </div>
        <div className="card stat-card">
          <div className="value">{stats.pending}</div>
          <div className="label">{t('dashboard.pending_orders')}</div>
        </div>
        <div className="card stat-card">
          <div className="value">{stats.products}</div>
          <div className="label">{t('dashboard.products')}</div>
        </div>
        <div className="card stat-card">
          <div className="value">{stats.revenue.toFixed(3)} KWD</div>
          <div className="label">{t('dashboard.revenue')}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
