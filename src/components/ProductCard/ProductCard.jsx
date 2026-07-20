import { useState } from 'react';
import { FaCheck, FaShareAlt, FaStar, FaHeart, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../../lib/CartContext';
import { useAuth } from '../../lib/AuthContext';
import { useToast } from '../../lib/ToastContext';
import './ProductCard.scss';

export default function ProductCard({ product }) {
  const [inCart, setInCart] = useState(false);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { notify } = useToast();

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      notify('Please sign in to add items to cart.', 'info');
      return;
    }
    setBusy(true);
    try {
      await addToCart(product.id, 1);
      setInCart(true);
      notify(`${product.title} added to cart`, 'success');
      setTimeout(() => setInCart(false), 1500);
    } catch (err) {
      notify(err.message || 'Could not add to cart', 'error');
    } finally {
      setBusy(false);
    }
  };

  const rating = Math.round(Number(product.rating || 4.5));

  return (
    <div className="card product-card">
      <Link to={`/shop/${product.slug}`} className="image">
        <img src={product.image_url} alt={product.title} loading="lazy" />
        {product.is_featured && <span className="card-tag">Featured</span>}
        {product.stock === 0 && <span className="card-tag out">Sold out</span>}
      </Link>
      <div className="icon heart" onClick={() => setLiked(!liked)} title="Wishlist">
        <FaHeart style={{ color: liked ? 'var(--error)' : 'var(--black)' }} />
      </div>
      <div className="icon share" title="Share">
        <FaShareAlt />
      </div>

      <div className="content">
        <div className="meta-row">
          <span className="stars">
            {Array.from({ length: rating }).map((_, i) => <FaStar key={i} className="star" />)}
          </span>
          <span className="price">{Number(product.price).toLocaleString()} KSH</span>
        </div>
        <Link to={`/shop/${product.slug}`}><h3>{product.title}</h3></Link>
        <p>{product.description}</p>
        <div className="actions">
          <span className="stock-badge">
            {product.stock > 0 ? <span className="badge badge-green">In stock</span> : <span className="badge badge-error">Out of stock</span>}
          </span>
          <button className="add-btn" onClick={handleAdd} disabled={busy || product.stock === 0}>
            {busy ? <span className="spinner" /> : inCart ? <FaCheck /> : <FaPlus />}
          </button>
        </div>
      </div>
    </div>
  );
}
