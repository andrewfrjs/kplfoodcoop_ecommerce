import { useEffect, useRef, useState } from 'react';
import './Topnav.scss';
import { FaBars, FaBell, FaHeart, FaSearch, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { useCart } from '../../lib/CartContext';
import { useWishlist } from '../../lib/WishlistContext';
import { useNotifications } from '../../lib/NotificationsContext';

const TYPE_ICON = { order: '🛒', success: '✅', warning: '⚠️', error: '⛔', system: '⚙️', info: 'ℹ️' };

export default function Topnav() {
  const [opened, setOpened] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const handleToggle = () => {
    setOpened(!opened);
    document.querySelector('nav')?.classList.toggle('active');
  };

  const handleOpenSearch = () => {
    document.querySelector('.search-form')?.classList.toggle('active');
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenu(false);
    navigate('/');
  };

  useEffect(() => {
    document.body.onscroll = () => {
      const nav = document.querySelector('nav');
      if (nav?.classList.contains('active')) {
        setOpened(false);
        nav.classList.remove('active');
      }
      setUserMenu(false);
      setNotifOpen(false);
    };
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenu(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const isAdmin = profile?.role === 'admin';

  return (
    <header>
      <a href="/" className="logo">
        <span className="logo-mark">KPL</span>
        <span className="logo-text">FoodCoop</span>
      </a>

      <nav>
        <NavLink to="/" end onClick={handleToggle}>Home</NavLink>
        <NavLink to="/shop" onClick={handleToggle}>Store</NavLink>
        <NavLink to="/blogs" onClick={handleToggle}>Blog</NavLink>
        <NavLink to="/about-us" end onClick={handleToggle}>About Us</NavLink>
        <NavLink to="/contact-us" end onClick={handleToggle}>Contact Us</NavLink>
        {isAdmin && <NavLink to="/admin" onClick={handleToggle} className="admin-link">Admin</NavLink>}
        {!user && <NavLink to="/get-started" className="btn btn-green nav-cta" onClick={handleToggle}>Get Started</NavLink>}
      </nav>

      <div className="icons">
        <div className="icon" id="menu-bars" onClick={handleToggle}>
          {opened ? <FaXmark /> : <FaBars />}
        </div>
        <div className="icon" id="search-icon" onClick={handleOpenSearch} title="Search"><FaSearch /></div>

        <NavLink to="/wishlist" className="icon heart-icon" title="Wishlist">
          {wishCount > 0 && <span>{wishCount}</span>}
          <FaHeart />
        </NavLink>

        <NavLink to="/cart" className="icon cart-icon" id="bars">
          {count > 0 && <span>{count}</span>}
          <FaShoppingCart />
        </NavLink>

        {user && (
          <div className="notif-wrap" ref={notifRef}>
            <div className="icon" onClick={() => setNotifOpen(!notifOpen)} title="Notifications">
              <FaBell />
              {unreadCount > 0 && <span className="notif-dot">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </div>
            {notifOpen && (
              <div className="notif-dropdown">
                <div className="notif-head">
                  <strong>Notifications</strong>
                  {unreadCount > 0 && <button onClick={markAllRead}>Mark all read</button>}
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <p className="notif-empty">No notifications yet.</p>
                  ) : notifications.slice(0, 12).map((n) => (
                    <div key={n.id} className={`notif-item ${n.is_read ? 'read' : ''}`} onClick={() => markRead(n.id)}>
                      <span className="notif-icon">{TYPE_ICON[n.type] || 'ℹ️'}</span>
                      <div className="notif-body">
                        <strong>{n.title}</strong>
                        {n.message && <span>{n.message}</span>}
                        <em>{new Date(n.created_at).toLocaleString()}</em>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {user ? (
          <div className="user-menu-wrap" ref={userRef}>
            <div className="icon" onClick={() => setUserMenu(!userMenu)} title="Account">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" />
              ) : (
                <FaUserCircle />
              )}
            </div>
            {userMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <strong>{profile?.full_name || user.email}</strong>
                  <span>{user.email}</span>
                </div>
                <Link to="/profile" onClick={() => setUserMenu(false)}>My Profile</Link>
                <Link to="/orders" onClick={() => setUserMenu(false)}>My Orders</Link>
                <Link to="/wishlist" onClick={() => setUserMenu(false)}>My Wishlist</Link>
                <Link to="/cart" onClick={() => setUserMenu(false)}>My Cart</Link>
                {isAdmin && <Link to="/admin" onClick={() => setUserMenu(false)}>Admin Panel</Link>}
                <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/login" className="icon" title="Sign in"><FaUserCircle /></NavLink>
        )}
      </div>
    </header>
  );
}
