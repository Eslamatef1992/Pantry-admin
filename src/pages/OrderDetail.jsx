import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const OrderDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/admin/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  useEffect(() => {
    if (order && searchParams.get('print') === '1') {
      // Give the browser a tick to finish painting before opening the print dialog.
      const timer = setTimeout(() => window.print(), 300);
      return () => clearTimeout(timer);
    }
  }, [order, searchParams]);

  if (!order) return <p>{t('common.loading')}</p>;

  const shipping = order.shippingSnapshot || {};
  const customerName = order.user ? order.user.name : order.guestName;
  const customerEmail = order.user ? order.user.email : order.guestEmail;
  const customerPhone = order.user ? order.user.phone : order.guestPhone;

  return (
    <div>
      <div className="toolbar no-print">
        <Link to="/orders" className="btn btn-outline order-detail-back">
          {t('common.back')}
        </Link>
        <button className="btn" onClick={() => window.print()}>
          {t('orders_page.print')}
        </button>
      </div>
      <h1>
        {t('order_detail.title')} #{order.orderNumber}
      </h1>
      <div className="grid order-detail-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
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
          <h3>{t('order_detail.customer')}</h3>
          <p>
            {customerName}
            {!order.user && <span className="badge off" style={{ marginInlineStart: 6 }}>{t('orders_page.guests')}</span>}
            <br />
            {customerPhone}
            <br />
            {customerEmail}
          </p>
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
