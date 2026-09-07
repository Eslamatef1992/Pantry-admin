import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Products = () => {
  const [products, setProducts] = useState([]);

  const load = () => api.get('/products', { params: { all: true, limit: 100 } }).then((res) => setProducts(res.data.products));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div>
      <div className="toolbar">
        <h1>Products</h1>
        <Link to="/products/new" className="btn">
          + Add Product
        </Link>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name (EN)</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
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
                  <span className={`badge ${p.isActive ? 'on' : 'off'}`}>{p.isActive ? 'Active' : 'Hidden'}</span>
                </td>
                <td>
                  <Link to={`/products/${p.id}`} className="btn btn-outline" style={{ marginRight: 8 }}>
                    Edit
                  </Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
                    Delete
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
