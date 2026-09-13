import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statusOptions = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];

const SearchIcon = () => (
  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

const ViewIcon = () => (
  <svg className="ic-view" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const PrintIcon = () => (
  <svg className="ic-print" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9V2h12v7" />
    <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
    <path d="M6 14h12v8H6z" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M12 3v12" />
    <path d="M7 10l5 5 5-5" />
    <path d="M4 19h16" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const formatAddress = (snapshot) => {
  if (!snapshot) return '—';
  const parts = [snapshot.governorate, snapshot.area, snapshot.block, snapshot.street, snapshot.building, snapshot.floorApartment].filter(
    Boolean
  );
  return parts.length ? parts.join(', ') : '—';
};

const csvEscape = (value) => {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
};

const Orders = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isSuperAdmin = user && (user.adminRole === 'super_admin' || !user.adminRole);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [customerTab, setCustomerTab] = useState('all'); // all | registered | guests
  const [search, setSearch] = useState('');

  const load = () => {
    const params = { limit: 100 };
    if (statusFilter) params.status = statusFilter;
    if (customerTab === 'registered') params.guestOnly = 'false';
    if (customerTab === 'guests') params.guestOnly = 'true';
    if (search) params.search = search;
    return api.get('/orders/admin/all', { params }).then((res) => setOrders(res.data.orders));
  };

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, customerTab, search]);

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/orders/admin/${orderId}/status`, { status });
    load();
  };

  const handlePrint = (id) => {
    window.open(`/orders/${id}?print=1`, '_blank');
  };

  const handleExport = () => {
    const headers = [
      t('orders_page.order_number'),
      t('orders_page.customer'),
      t('orders_page.phone'),
      t('orders_page.address'),
      t('orders_page.payment'),
      t('orders_page.total'),
      t('orders_page.status'),
      t('orders_page.date'),
      t('orders_page.time'),
    ];
    const lines = [headers.map(csvEscape).join(',')];
    orders.forEach((o) => {
      const created = new Date(o.createdAt);
      const customerName = o.user ? o.user.name : o.guestName || t('orders_page.unregistered');
      const phone = o.user ? o.user.phone : o.guestPhone;
      lines.push(
        [
          o.orderNumber,
          customerName,
          phone || '',
          formatAddress(o.shippingSnapshot),
          `${o.paymentMethod.toUpperCase()} - ${o.paymentStatus}`,
          Number(o.total).toFixed(3),
          o.status,
          created.toLocaleDateString(),
          created.toLocaleTimeString(),
        ]
          .map(csvEscape)
          .join(',')
      );
    });
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="toolbar">
        <h1>{t('orders_page.title')}</h1>
        <div className="toolbar-actions">
          <div className="search-wrap">
            <SearchIcon />
            <input
              className="search-input"
              placeholder={t('orders_page.search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: 8 }}>
            <option value="">{t('orders_page.all_statuses')}</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
          ))}
          </select>
          <button type="button" className="btn btn-outline" onClick={handleExport}>
            <DownloadIcon />
            <span style={{ marginInlineStart: 6 }}>{t('orders_page.export')}</span>
          </button>
          {isSuperAdmin && (
            <Link to="/orders/new" className="btn">
              <PlusIcon />
              <span style={{ marginInlineStart: 6 }}>{t('orders_page.add_order')}</span>
            </Link>
          )}
        </div>
      </div>

      <div className="tabs">
        <button className={customerTab === 'all' ? 'active' : ''} onClick={() => setCustomerTab('all')}>
          {t('orders_page.all')}
        </button>
        <button className={customerTab === 'registered' ? 'active' : ''} onClick={() => setCustomerTab('registered')}>
          {t('orders_page.registered')}
        </button>
        <button className={customerTab === 'guests' ? 'active' : ''} onClick={() => setCustomerTab('guests')}>
          {t('orders_page.guests')}
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>{t('orders_page.order_number')}</th>
              <th>{t('orders_page.customer')}</th>
              <th>{t('orders_page.phone')}</th>
              <th>{t('orders_page.address')}</th>
              <th>{t('orders_page.payment')}</th>
              <th>{t('orders_page.total')}</th>
              <th>{t('orders_page.status')}</th>
              <th>{t('orders_page.date')}</th>
              <th>{t('orders_page.time')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const created = new Date(o.createdAt);
              const phone = o.user ? o.user.phone : o.guestPhone;
              return (
                <tr key={o.id}>
                  <td>{o.orderNumber}</td>
                  <td>
                    {o.user ? o.user.name : o.guestName || t('orders_page.unregistered')}
                    {!o.user && <span className="badge off" style={{ marginInlineStart: 6 }}>{t('orders_page.guests')}</span>}
                  </td>
                  <td>{phone || '—'}</td>
                  <td className="order-address-cell">{formatAddress(o.shippingSnapshot)}</td>
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
                  <td>{created.toLocaleDateString()}</td>
                  <td>{created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>
                    <Link to={`/orders/${o.id}`} className="icon-btn" title={t('common.view')}>
                      <ViewIcon />
                    </Link>
                    <button className="icon-btn" title={t('common.print')} onClick={() => handlePrint(o.id)}>
                      <PrintIcon />
                    </button>
                  </td>
                </tr>
              );
            })}
            {!orders.length && (
              <tr>
                <td colSpan={10}>{t('common.loading')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
