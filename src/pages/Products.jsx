import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const Products = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  const load = () => api.get('/products', { params: { all: true, limit: 100 } }).then((res) => setProducts(res.data.products));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('products_page.confirm_delete'))) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div>
      <div className="toolbar">
        <h1>{t('products_page.title')}</h1>
        <Link to="/products/new" className="btn">
          {t('products_page.add_product')}
        </Link>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>{t('products_page.name_en')}</th>
              <th>{t('products_page.category')}</th>
              <th>{t('products_page.price')}</th>
              <th>{t('products_page.stock')}</th>
              <th>{t('common.status')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.nameEn}</td>
                <td>{p.category?.nameEn}</td>
                <td>{Number(p.price).toFixed(3)} KWD</td>
                <td>{p.stock}</td>
                <td>
                  <span className={`badge ${p.isActive ? 'on' : 'off'}`}>{p.isActive ? t('common.active') : t('categories.hidden')}</span>
                </td>
                <td>
                  <Link to={`/products/${p.id}`} className="btn btn-outline" style={{ marginRight: 8 }}>
                    {t('common.edit')}
                  </Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
                    {t('common.delete')}
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

export default Products;
