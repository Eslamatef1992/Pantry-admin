import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  reports: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 15l4-5 3 3 5-7" />
    </svg>
  ),
  products: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8L12 3 3 8l9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
    </svg>
  ),
  stock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7H4a1 1 0 00-1 1v3a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z" />
      <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" />
      <path d="M10 12v5M14 12v5" />
    </svg>
  ),
  categories: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </svg>
  ),
  brands: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.6 5.7 6.2.6-4.7 4.2 1.4 6.1L12 15.8 6.5 18.6l1.4-6.1-4.7-4.2 6.2-.6L12 2z" />
    </svg>
  ),
  banners: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="12" rx="1" />
      <path d="M3 19h18" />
    </svg>
  ),
  pages: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  ),
  messages: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  orders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2l1.5 4M18 2l-1.5 4" />
      <rect x="4" y="6" width="16" height="16" rx="2" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  admins: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6z" />
    </svg>
  ),
  rules: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V21a2 2 0 01-4 0v-.09a1.7 1.7 0 00-1-1.55 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.55-1H3a2 2 0 010-4h.09a1.7 1.7 0 001.55-1 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34H9a1.7 1.7 0 001-1.55V3a2 2 0 014 0v.09a1.7 1.7 0 001 1.55 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87V9a1.7 1.7 0 001.55 1H21a2 2 0 010 4h-.09a1.7 1.7 0 00-1.55 1z" />
    </svg>
  ),
};

const Sidebar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const isSuperAdmin = user && (user.adminRole === 'super_admin' || !user.adminRole);

  const sections = [
    {
      label: t('nav_sections.overview'),
      links: [
        { to: '/', label: t('nav.dashboard'), end: true, icon: icons.dashboard },
        { to: '/reports', label: t('nav.reports'), icon: icons.reports },
      ],
    },
    {
      label: t('nav_sections.catalog'),
      links: [
        { to: '/products', label: t('nav.products'), icon: icons.products },
        { to: '/product-stock', label: t('nav.product_stock'), icon: icons.stock },
        { to: '/categories', label: t('nav.categories'), icon: icons.categories },
        { to: '/brands', label: t('nav.brands'), icon: icons.brands },
      ],
    },
    {
      label: t('nav_sections.sales'),
      links: [{ to: '/orders', label: t('nav.orders'), icon: icons.orders }],
    },
    {
      label: t('nav_sections.content'),
      links: [
        { to: '/banners', label: t('nav.banners'), icon: icons.banners },
        { to: '/pages', label: t('nav.pages'), icon: icons.pages },
        { to: '/contact-messages', label: t('nav.contact_messages'), icon: icons.messages },
      ],
    },
    {
      label: t('nav_sections.admin'),
      links: [
        { to: '/users', label: t('nav.users'), icon: icons.users },
        ...(isSuperAdmin ? [{ to: '/admins', label: t('nav.admins'), icon: icons.admins }] : []),
        ...(isSuperAdmin ? [{ to: '/rules', label: t('nav.delivery_rules'), icon: icons.rules }] : []),
        { to: '/settings', label: t('nav.payment_settings'), icon: icons.settings },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo-colored.svg" alt="Pantry" />
        <span>{t('brand')}</span>
      </div>
      <nav>
        {sections.map((section) => (
          <div key={section.label}>
            <div className="nav-section-label">{section.label}</div>
            {section.links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                {l.icon}
                <span>{l.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div style={{ padding: '0 16px 16px' }}>
        <LanguageSwitcher />
      </div>
      <button className="btn btn-outline" onClick={logout} style={{ margin: '0 16px 16px' }}>
        {t('nav.logout')}
      </button>
    </aside>
  );
};

export default Sidebar;
