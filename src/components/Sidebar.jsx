import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const Sidebar = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const links = [
    { to: '/', label: t('nav.dashboard'), end: true },
    { to: '/products', label: t('nav.products') },
    { to: '/categories', label: t('nav.categories') },
    { to: '/banners', label: t('nav.banners') },
    { to: '/orders', label: t('nav.orders') },
    { to: '/settings', label: t('nav.payment_settings') },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo-colored.svg" alt="Pantry" />
        <span>{t('brand')}</span>
      </div>
      <nav>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            {l.label}
          </NavLink>
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
