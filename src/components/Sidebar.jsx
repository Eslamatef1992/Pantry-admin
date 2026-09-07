import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/banners', label: 'Banners' },
  { to: '/orders', label: 'Orders' },
  { to: '/settings', label: 'Payment Settings' },
];

const Sidebar = () => {
  const { logout } = useAuth();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo-colored.svg" alt="Pantry" />
        <span>Pantry Foods</span>
      </div>
      <nav>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <button className="btn btn-outline" onClick={logout} style={{ margin: 16 }}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
