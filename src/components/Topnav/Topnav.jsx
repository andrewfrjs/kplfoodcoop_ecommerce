import { useEffect, useState } from 'react';
import './Topnav.scss';
import { FaBars, FaHeart, FaSearch, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { useCart } from '../../lib/CartContext';

export default function Topnav() {
  const [opened, setOpened] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

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
    };
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
        <NavLink to="/cart" className="icon cart-icon" id="bars">
          {count > 0 && <span>{count}</span>}
          <FaShoppingCart />
        </NavLink>

        {user ? (
          <div className="user-menu-wrap">
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
