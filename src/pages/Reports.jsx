import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const Reports = () => {
  const { t } = useTranslation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [data, setData] = useState({ totalOrders: 0, totalRevenue: 0, byStatus: {}, topProducts: [] });

  const load = () =>
    api.get('/reports/summary', { params: { from: from || undefined, to: to || undefined } }).then((res) => setData(res.data));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div>
      <div className="toolbar">
        <h1>{t('reports_page.title')}</h1>
        <form onSubmit={handleApply} className="toolbar-actions">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <span>{t('reports_page.to')}</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          <button type="submit" className="btn btn-outline">
            {t('reports_page.apply')}
          </button>
        </form>
      </div>

      <div className="stat-grid">
        <div className="card stat-card">
          <div className="value">{data.totalOrders}</div>
          <div className="label">{t('reports_page.total_orders')}</div>
        </div>
        <div className="card stat-card">
          <div className="value">{Number(data.totalRevenue).toFixed(3)} KWD</div>
          <div className="label">{t('reports_page.total_revenue')}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="reports-grid">
        <div className="card">
          <h3>{t('reports_page.orders_by_status')}</h3>
          <table>
            <tbody>
              {Object.entries(data.byStatus).map(([status, count]) => (
                <tr key={status}>
                  <td>{status}</td>
                  <td>{count}</td>
                </tr>
              ))}
              {!Object.keys(data.byStatus).length && (
                <tr>
                  <td>—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>{t('reports_page.top_products')}</h3>
          <table>
            <thead>
              <tr>
                <th>{t('reports_page.product')}</th>
                <th>{t('reports_page.units_sold')}</th>
              </tr>
            </thead>
            <tbody>
              {data.topProducts.map((p) => (
                <tr key={p.productId}>
                  <td>{p.nameEn}</td>
                  <td>{p.unitsSold}</td>
                </tr>
              ))}
              {!data.topProducts.length && (
                <tr>
                  <td colSpan={2}>—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
