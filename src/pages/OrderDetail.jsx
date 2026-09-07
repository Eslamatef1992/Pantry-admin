import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get('/orders/admin/all', { params: { limit: 200 } }).then((res) => {
      const found = res.data.orders.find((o) => o.id === Number(id));
      setOrder(found);
    });
  }, [id]);

  if (!order) return <p>Loading...</p>;

  const shipping = order.shippingSnapshot || {};

  return (
    <div>
      <h1>Order #{order.orderNumber}</h1>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card">
          <h3>Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.nameEn}</td>
                  <td>{Number(item.price).toFixed(3)} KWD</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>Delivery Address</h3>
          <p>
            {shipping.fullName}
            <br />
            {shipping.phone}
            <br />
            {[shipping.governorate, shipping.area, shipping.block, shipping.street, shipping.building, shipping.floorApartment]
              .filter(Boolean)
              .join(', ')}
          </p>
          <h3>Payment</h3>
          <p>
            {order.paymentMethod.toUpperCase()} · {order.paymentStatus}
          </p>
          <h3>Totals</h3>
          <p>Subtotal: {Number(order.subtotal).toFixed(3)} KWD</p>
          <p>Delivery: {Number(order.deliveryFee).toFixed(3)} KWD</p>
          <p>
            <strong>Total: {Number(order.total).toFixed(3)} KWD</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
