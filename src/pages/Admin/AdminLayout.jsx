import { Outlet, NavLink, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { FaTachometerAlt, FaBox, FaShoppingBag, FaUsers, FaFileAlt, FaHome, FaSignOutAlt } from 'react-icons/fa';
import './AdminLayout.scss';

export default function AdminLayout() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) return <div className="admin-loading"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.role !== 'admin') return <Navigate to="/" replace />;

  const nav = [
    { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt />, end: true },
    { to: '/admin/products', label: 'Products', icon: <FaBox /> },
    { to: '/admin/orders', label: 'Orders', icon: <FaShoppingBag /> },
    { to: '/admin/users', label: 'Users', icon: <FaUsers /> },
    { to: '/admin/blogs', label: 'Blog Posts', icon: <FaFileAlt /> },
  ];

  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-logo">
          <span className="logo-mark">KPL</span>
          <span>Admin</span>
        </Link>
        <nav>
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
              <span className="icon">{n.icon}</span>
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-footer">
          <Link to="/" className="admin-link"><span className="icon"><FaHome /></span><span>View Store</span></Link>
          <button className="admin-link signout" onClick={signOut}><span className="icon"><FaSignOutAlt /></span><span>Sign Out</span></button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <strong>Admin Panel</strong>
            <span>{profile?.full_name || user.email}</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
