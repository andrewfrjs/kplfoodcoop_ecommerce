import { useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { FaTachometerAlt, FaBox, FaShoppingBag, FaUsers, FaFileAlt, FaHome, FaSignOutAlt, FaHeart, FaBell, FaBars, FaTimes } from 'react-icons/fa';
import './AdminLayout.scss';

export default function AdminLayout() {
  const { user, profile, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (window.innerWidth > 768) return;
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && !e.target.closest('.admin-menu-btn')) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (loading) return <div className="admin-loading"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.role !== 'admin') return <Navigate to="/" replace />;

  const nav = [
    { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt />, end: true },
    { to: '/admin/products', label: 'Products', icon: <FaBox /> },
    { to: '/admin/orders', label: 'Orders', icon: <FaShoppingBag /> },
    { to: '/admin/users', label: 'Users', icon: <FaUsers /> },
    { to: '/admin/wishlists', label: 'Wishlists', icon: <FaHeart /> },
    { to: '/admin/blogs', label: 'Blog Posts', icon: <FaFileAlt /> },
    { to: '/admin/notifications', label: 'Notifications', icon: <FaBell /> },
  ];

  return (
    <div className="admin">
      <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><FaBars /></button>
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
        <div className="sidebar-head">
          <Link to="/admin" className="admin-logo">
            <span className="logo-mark">KPL</span>
            <span>Admin</span>
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}><FaTimes /></button>
        </div>
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
