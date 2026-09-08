import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const statusOptions = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];

const Orders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const load = () =>
    api.get('/orders/admin/all', { params: statusFilter ? { status: statusFilter, limit: 100 } : { limit: 100 } }).then((res) =>
      setOrders(res.data.orders)
    );

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/orders/admin/${orderId}/status`, { status });
    load();
  };

  return (
    <div>
      <div className="toolbar">
        <h1>{t('orders_page.title')}</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: 8 }}>
          <option value="">{t('orders_page.all_statuses')}</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>{t('orders_page.order_number')}</th>
              <th>{t('orders_page.customer')}</th>
              <th>{t('orders_page.payment')}</th>
              <th>{t('orders_page.total')}</th>
              <th>{t('orders_page.status')}</th>
              <th>{t('orders_page.date')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.orderNumber}</td>
                <td>{o.guestName || (o.userId ? `Account #${o.userId}` : t('orders_page.unregistered'))}</td>
                <td>
                  {o.paymentMethod.toUpperCase()} · <span className={`badge ${o.paymentStatus === 'paid' ? 'on' : 'off'}`}>{o.paymentStatus}</span>
                </td>
                <td>{Number(o.total).toFixed(3)} KWD</td>
                <td>
                  <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)}>
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/orders/${o.id}`}>{t('orders_page.view')}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
