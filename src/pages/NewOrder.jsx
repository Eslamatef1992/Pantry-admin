import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const emptyAddress = {
  fullName: '',
  phone: '',
  governorate: '',
  area: '',
  block: '',
  street: '',
  building: '',
  floorApartment: '',
};

const NewOrder = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [customerType, setCustomerType] = useState('existing'); // existing | guest
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const [address, setAddress] = useState(emptyAddress);

  const [productSearch, setProductSearch] = useState('');
  const [productResults, setProductResults] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');
  const [rules, setRules] = useState({ deliveryFee: 0, freeDeliveryThreshold: null });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/settings/site').then((res) => {
      setRules({
        deliveryFee: Number(res.data.deliveryFee) || 0,
        freeDeliveryThreshold:
          res.data.freeDeliveryThreshold !== null && res.data.freeDeliveryThreshold !== undefined
            ? Number(res.data.freeDeliveryThreshold)
            : null,
      });
    });
  }, []);

  useEffect(() => {
    if (customerType !== 'existing' || !customerSearch) {
      setCustomerResults([]);
      return;
    }
    const timer = setTimeout(() => {
      api.get('/users/customers', { params: { search: customerSearch, limit: 8 } }).then((res) => setCustomerResults(res.data.items));
    }, 300);
    return () => clearTimeout(timer);
  }, [customerSearch, customerType]);

  useEffect(() => {
    if (!productSearch) {
      setProductResults([]);
      return;
    }
    const timer = setTimeout(() => {
      api.get('/products', { params: { search: productSearch, all: true, limit: 8 } }).then((res) => setProductResults(res.data.products));
    }, 300);
    return () => clearTimeout(timer);
  }, [productSearch]);

  const pickCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch('');
    setCustomerResults([]);
    setAddress((a) => ({ ...a, fullName: a.fullName || customer.name, phone: a.phone || customer.phone || '' }));
  };

  const addProduct = (product) => {
    setCartItems((items) => {
      const existing = items.find((i) => i.productId === product.id);
      if (existing) {
        return items.map((i) => (i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...items,
        { productId: product.id, nameEn: product.nameEn, nameAr: product.nameAr, price: Number(product.price), quantity: 1, stock: product.stock },
      ];
    });
    setProductSearch('');
    setProductResults([]);
  };

  const updateQuantity = (productId, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setCartItems((items) => items.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)));
  };

  const removeItem = (productId) => {
    setCartItems((items) => items.filter((i) => i.productId !== productId));
  };

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee =
    rules.freeDeliveryThreshold !== null && subtotal >= rules.freeDeliveryThreshold ? 0 : rules.deliveryFee;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (customerType === 'existing' && !selectedCustomer) {
      setError(t('new_order_page.select_customer_error'));
      return;
    }
    if (customerType === 'guest' && (!guestName || !guestPhone)) {
      setError(t('new_order_page.guest_details_error'));
      return;
    }
    if (!cartItems.length) {
      setError(t('new_order_page.no_items_error'));
      return;
    }
    if (!address.fullName || !address.phone) {
      setError(t('new_order_page.address_error'));
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerType,
        userId: customerType === 'existing' ? selectedCustomer.id : undefined,
        guestName: customerType === 'guest' ? guestName : undefined,
        guestPhone: customerType === 'guest' ? guestPhone : undefined,
        guestEmail: customerType === 'guest' ? guestEmail : undefined,
        items: cartItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        address,
        paymentMethod,
        notes,
      };
      const res = await api.post('/orders/admin/create', payload);
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || t('new_order_page.save_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="toolbar">
        <h1>{t('new_order_page.title')}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid new-order-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <h3>{t('new_order_page.customer')}</h3>
              <div className="tabs" style={{ marginBottom: 16 }}>
                <button
                  type="button"
                  className={customerType === 'existing' ? 'active' : ''}
                  onClick={() => {
                    setCustomerType('existing');
                    setGuestName('');
                    setGuestPhone('');
                    setGuestEmail('');
                  }}
                >
                  {t('new_order_page.existing_customer')}
                </button>
                <button
                  type="button"
                  className={customerType === 'guest' ? 'active' : ''}
                  onClick={() => {
                    setCustomerType('guest');
                    setSelectedCustomer(null);
                  }}
                >
                  {t('new_order_page.new_customer')}
                </button>
              </div>

              {customerType === 'existing' ? (
                selectedCustomer ? (
                  <div className="selected-chip">
                    <div>
                      <strong>{selectedCustomer.name}</strong>
                      <div className="muted-text">
                        {selectedCustomer.email} · {selectedCustomer.phone || '—'}
                      </div>
                    </div>
                    <button type="button" className="btn btn-outline" onClick={() => setSelectedCustomer(null)}>
                      {t('common.change')}
                    </button>
                  </div>
                ) : (
                  <div className="picker">
                    <input
                      className="search-input"
                      placeholder={t('new_order_page.customer_search_placeholder')}
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                    {!!customerResults.length && (
                      <div className="picker-results">
                        {customerResults.map((c) => (
                          <div key={c.id} className="picker-row" onClick={() => pickCustomer(c)}>
                            <div>
                              <strong>{c.name}</strong>
                              <div className="muted-text">
                                {c.email} · {c.phone || '—'}
                              </div>
                            </div>
                            <span className="btn btn-outline">{t('common.select')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="form-grid">
                  <div className="form-group">
                    <label>{t('new_order_page.guest_name')}</label>
                    <input required value={guestName} onChange={(e) => setGuestName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>{t('new_order_page.guest_phone')}</label>
                    <input required value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>{t('new_order_page.guest_email')}</label>
                    <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <h3>{t('new_order_page.products')}</h3>
              <div className="picker">
                <input
                  className="search-input"
                  placeholder={t('new_order_page.product_search_placeholder')}
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
                {!!productResults.length && (
                  <div className="picker-results">
                    {productResults.map((p) => (
                      <div key={p.id} className="picker-row" onClick={() => addProduct(p)}>
                        <div>
                          <strong>{p.nameEn}</strong>
                          <div className="muted-text">
                            {Number(p.price).toFixed(3)} KWD · {t('new_order_page.stock')}: {p.stock ?? '—'}
                          </div>
                        </div>
                        <span className="btn btn-outline">{t('common.add')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <table style={{ marginTop: 16 }}>
                <thead>
                  <tr>
                    <th>{t('order_detail.item')}</th>
                    <th>{t('order_detail.price')}</th>
                    <th>{t('order_detail.qty')}</th>
                    <th>{t('new_order_page.line_total')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((i) => (
                    <tr key={i.productId}>
                      <td>{i.nameEn}</td>
                      <td>{i.price.toFixed(3)} KWD</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={i.quantity}
                          onChange={(e) => updateQuantity(i.productId, e.target.value)}
                          style={{ width: 70, padding: 6 }}
                        />
                      </td>
                      <td>{(i.price * i.quantity).toFixed(3)} KWD</td>
                      <td>
                        <button type="button" className="btn btn-outline" onClick={() => removeItem(i.productId)}>
                          {t('common.remove')}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!cartItems.length && (
                    <tr>
                      <td colSpan={5}>{t('new_order_page.no_items')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="card">
              <h3>{t('new_order_page.delivery_address')}</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>{t('new_order_page.address_full_name')}</label>
                  <input required value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t('new_order_page.address_phone')}</label>
                  <input required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t('new_order_page.address_governorate')}</label>
                  <input value={address.governorate} onChange={(e) => setAddress({ ...address, governorate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t('new_order_page.address_area')}</label>
                  <input value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t('new_order_page.address_block')}</label>
                  <input value={address.block} onChange={(e) => setAddress({ ...address, block: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t('new_order_page.address_street')}</label>
                  <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t('new_order_page.address_building')}</label>
                  <input value={address.building} onChange={(e) => setAddress({ ...address, building: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t('new_order_page.address_floor_apartment')}</label>
                  <input value={address.floorApartment} onChange={(e) => setAddress({ ...address, floorApartment: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{ position: 'sticky', top: 20 }}>
              <h3>{t('new_order_page.summary')}</h3>
              <div className="form-group">
                <label>{t('new_order_page.payment_method')}</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="cod">{t('new_order_page.payment_cod')}</option>
                  <option value="knet">{t('new_order_page.payment_knet')}</option>
                  <option value="sadad">{t('new_order_page.payment_sadad')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t('new_order_page.notes')}</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e5e7eb', borderRadius: 10, font: 'inherit' }}
                />
              </div>
              <p>
                {t('order_detail.subtotal')}: {subtotal.toFixed(3)} KWD
              </p>
              <p>
                {t('order_detail.delivery')}: {deliveryFee.toFixed(3)} KWD
              </p>
              <p>
                <strong>
                  {t('order_detail.total')}: {total.toFixed(3)} KWD
                </strong>
              </p>
              {error && <p className="error-text">{error}</p>}
              <button type="submit" className="btn" disabled={submitting} style={{ width: '100%' }}>
                {submitting ? t('common.saving') : t('new_order_page.submit')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewOrder;
