import './Footer.scss';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { subscribeNewsletter } from '../../lib/api';
import { useToast } from '../../lib/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await subscribeNewsletter(email);
      notify(res.duplicate ? "You're already subscribed!" : 'Subscribed successfully!', res.duplicate ? 'info' : 'success');
      setEmail('');
    } catch (err) {
      notify('Subscription failed. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="brand-col">
          <div className="footer-logo">
            <span className="logo-mark">KPL</span>
            <span>FoodCoop</span>
          </div>
          <p>Your trusted online grocery and food cooperative. Fresh produce, fair prices, delivered to your door.</p>
          <div className="socials">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter"><FaXTwitter /></a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>

        <div className="wrapper">
          <h4>Shop</h4>
          <Link to="/shop">All Products</Link>
          <Link to="/shop?category=cereals">Cereals</Link>
          <Link to="/shop?category=vegetables">Vegetables</Link>
          <Link to="/shop?category=fruits">Fruits</Link>
        </div>

        <div className="wrapper">
          <h4>Company</h4>
          <Link to="/about-us">About Us</Link>
          <Link to="/blogs">Blog</Link>
          <Link to="/contact-us">Contact Us</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="wrapper">
          <h4>Newsletter</h4>
          <p>Get fresh deals in your inbox.</p>
          <form className="footer-sub" onSubmit={subscribe}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
            <button type="submit" disabled={loading}>{loading ? '...' : 'Go'}</button>
          </form>
        </div>
      </div>
      <div className="credit">
        &copy; {new Date().getFullYear()} KPLFOODCOOP · Built with care for the community.
      </div>
    </footer>
  );
}
