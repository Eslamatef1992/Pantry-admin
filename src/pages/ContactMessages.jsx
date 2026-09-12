import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const ContactMessages = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const load = () =>
    api.get('/contact/admin/all', { params: { unreadOnly: unreadOnly || undefined, limit: 100 } }).then((res) => setItems(res.data.items));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadOnly]);

  const toggleRead = async (id, isRead) => {
    await api.put(`/contact/admin/${id}/read`, { isRead });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('contact_messages_page.confirm_delete'))) return;
    await api.delete(`/contact/admin/${id}`);
    load();
  };

  return (
    <div>
      <div className="toolbar">
        <h1>{t('contact_messages_page.title')}</h1>
        <div className="toolbar-actions">
          <label>
            <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} style={{ width: 'auto', marginInlineEnd: 6 }} />
            {t('common.unread')}
          </label>
        </div>
      </div>
      {!items.length && (
        <div className="card">
          <p>{t('contact_messages_page.empty')}</p>
        </div>
      )}
      {items.map((m) => (
        <div className="card" key={m.id} style={{ marginBottom: 12, opacity: m.isRead ? 0.7 : 1 }}>
          <div className="toolbar" style={{ marginBottom: 8 }}>
            <div>
              <strong>{m.name}</strong>
              <span style={{ color: '#6b7280', marginInlineStart: 10, fontSize: 13 }}>
                {m.email} {m.phone ? `· ${m.phone}` : ''}
              </span>
            </div>
            <span className={`badge ${m.isRead ? 'off' : 'on'}`}>{m.isRead ? t('common.read') : t('common.unread')}</span>
          </div>
          <p style={{ whiteSpace: 'pre-wrap' }}>{m.message}</p>
          <div className="toolbar-actions" style={{ marginTop: 10 }}>
            <span style={{ color: '#9ca3af', fontSize: 13 }}>{new Date(m.createdAt).toLocaleString()}</span>
            {!m.isRead && (
              <button className="btn btn-outline" onClick={() => toggleRead(m.id, true)}>
                {t('common.mark_read')}
              </button>
            )}
            <button className="btn btn-danger" onClick={() => handleDelete(m.id)}>
              {t('common.delete')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactMessages;
