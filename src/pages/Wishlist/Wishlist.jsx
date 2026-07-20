import { useEffect, useState } from 'react';
import './Wishlist.scss';
import { useAuth } from '../../lib/AuthContext';
import { useWishlist } from '../../lib/WishlistContext';
import { useToast } from '../../lib/ToastContext';
import { fetchWishlist, removeFromWishlist } from '../../lib/api';
import { Link } from 'react-router-dom';
import { FaHeart, FaCartPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';

export default function Wishlist() {
  const { user } = useAuth();
  const { toggle } = useWishlist();
  const { notify } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!user) { setLoading(false); return; }
    fetchWishlist(user.id).then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  };

  useEffect(load, [user]);

  const remove = async (productId) => {
    try {
      await removeFromWishlist(user.id, productId);
      await toggle(productId);
      setItems((prev) => prev.filter((i) => i.product_id !== productId));
      notify('Removed from wishlist.', 'info');
    } catch (err) {
      notify('Could not remove.', 'error');
    }
  };

  if (!user) {
    return (
      <section className="empty-state" style={{ paddingTop: '12rem' }}>
        <div className="icon-big"><FaHeart /></div>
        <h2>Sign in to view your wishlist</h2>
        <Link to="/login" className="btn btn-green btn-lg">Sign In</Link>
      </section>
    );
  }

  if (loading) return <section className="wishlist" style={{ paddingTop: '10rem' }}><div className="spinner" /></section>;

  return (
    <section className="wishlist" style={{ paddingTop: '9rem' }}>
      <Link to="/shop" className="back-link"><FaArrowLeft /> Back to shop</Link>
      <h1 className="heading">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="icon-big"><FaHeart /></div>
          <h2>Your wishlist is empty</h2>
          <p>Tap the heart on any product to save it for later.</p>
          <Link to="/shop" className="btn btn-green btn-lg">Browse Products</Link>
        </div>
      ) : (
        <div className="grid wishlist-grid">
          {items.map((item) => {
            const p = item.products;
            if (!p) return null;
            return (
              <div className="card wishlist-card" key={item.id}>
                <Link to={`/shop/${p.slug}`} className="image">
                  <img src={p.image_url} alt={p.title} loading="lazy" />
                  {p.stock === 0 && <span className="card-tag out">Sold out</span>}
                </Link>
                <div className="content">
                  <Link to={`/shop/${p.slug}`}><h3>{p.title}</h3></Link>
                  <span className="price">{Number(p.price).toLocaleString()} KSH</span>
                  <div className="actions">
                    <Link to={`/shop/${p.slug}`} className="btn btn-green btn-sm"><FaCartPlus /> View</Link>
                    <button className="btn btn-secondary btn-sm" onClick={() => remove(p.id)}><FaTrash /> Remove</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
