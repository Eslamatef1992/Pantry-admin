import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const OrderDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get('/orders/admin/all', { params: { limit: 200 } }).then((res) => {
      const found = res.data.orders.find((o) => o.id === Number(id));
      setOrder(found);
    });
  }, [id]);

  if (!order) return <p>{t('common.loading')}</p>;

  const shipping = order.shippingSnapshot || {};

  return (
    <div>
      <h1>
        {t('order_detail.title')} #{order.orderNumber}
      </h1>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card">
          <h3>{t('order_detail.items')}</h3>
          <table>
            <thead>
              <tr>
                <th>{t('order_detail.item')}</th>
                <th>{t('order_detail.price')}</th>
                <th>{t('order_detail.qty')}</th>
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
          <h3>{t('order_detail.delivery_address')}</h3>
          <p>
            {shipping.fullName}
            <br />
            {shipping.phone}
            <br />
            {[shipping.governorate, shipping.area, shipping.block, shipping.street, shipping.building, shipping.floorApartment]
              .filter(Boolean)
              .join(', ')}
          </p>
          <h3>{t('order_detail.payment')}</h3>
          <p>
            {order.paymentMethod.toUpperCase()} · {order.paymentStatus}
          </p>
          <h3>{t('order_detail.totals')}</h3>
          <p>
            {t('order_detail.subtotal')}: {Number(order.subtotal).toFixed(3)} KWD
          </p>
          <p>
            {t('order_detail.delivery')}: {Number(order.deliveryFee).toFixed(3)} KWD
          </p>
          <p>
            <strong>
              {t('order_detail.total')}: {Number(order.total).toFixed(3)} KWD
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
