import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const ProductStock = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => api.get('/reports/product-stock', { params: { search: search || undefined, limit: 200 } }).then((res) => setItems(res.data.items));

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const stockBadge = (stock) => {
    if (stock === null) return <span className="badge">∞</span>;
    if (stock <= 0) return <span className="badge off">{t('product_stock_page.out_of_stock')}</span>;
    if (stock <= 5) return <span className="badge role-staff">{`${t('product_stock_page.low_stock')} (${stock})`}</span>;
    return <span className="badge on">{stock}</span>;
  };

  return (
    <div>
      <div className="toolbar">
        <h1>{t('product_stock_page.title')}</h1>
        <div className="toolbar-actions">
          <input
            className="search-input"
            placeholder={t('product_stock_page.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>{t('common.image')}</th>
              <th>{t('common.name')}</th>
              <th>{t('product_stock_page.sku')}</th>
              <th>{t('product_stock_page.stock')}</th>
              <th>{t('product_stock_page.orders_count')}</th>
              <th>{t('product_stock_page.units_sold')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.image && <img src={p.image} alt="" style={{ height: 32, borderRadius: 4 }} />}</td>
                <td>{p.nameEn}</td>
                <td>{p.sku || '—'}</td>
                <td>{stockBadge(p.stock)}</td>
                <td>{p.timesOrdered}</td>
                <td>{p.unitsSold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductStock;
