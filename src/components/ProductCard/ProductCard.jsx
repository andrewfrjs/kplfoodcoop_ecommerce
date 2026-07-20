import { useState } from 'react';
import { FaCheck, FaShareAlt, FaStar, FaHeart, FaPlus, FaFacebook, FaWhatsapp, FaTelegram, FaLinkedin, FaCopy } from 'react-icons/fa';
import { FaXmark, FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { FacebookShareButton, LinkedinShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { useCart } from '../../lib/CartContext';
import { useAuth } from '../../lib/AuthContext';
import { useWishlist } from '../../lib/WishlistContext';
import { useToast } from '../../lib/ToastContext';
import './ProductCard.scss';

export default function ProductCard({ product }) {
  const [inCart, setInCart] = useState(false);
  const [busy, setBusy] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { has, toggle } = useWishlist();
  const { notify } = useToast();

  const shareUrl = `${window.location.origin}/shop/${product.slug}`;
  const shareTitle = `Check out ${product.title} on KPL FoodCoop!`;
  const liked = has(product.id);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { notify('Please sign in to add items to cart.', 'info'); return; }
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

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { notify('Please sign in to save items.', 'info'); return; }
    try {
      await toggle(product.id);
      notify(liked ? 'Removed from wishlist' : 'Saved to wishlist', liked ? 'info' : 'success');
    } catch (err) {
      notify(err.message || 'Could not update wishlist', 'error');
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShareOpen(!shareOpen);
  };

  const copyLink = async (e) => {
    e.stopPropagation();
    try { await navigator.clipboard.writeText(shareUrl); notify('Link copied!', 'success'); } catch {}
  };

  const rating = Math.round(Number(product.rating || 4.5));

  return (
    <div className="card product-card">
      <Link to={`/shop/${product.slug}`} className="image">
        <img src={product.image_url} alt={product.title} loading="lazy" />
        {product.is_featured && <span className="card-tag">Featured</span>}
        {product.stock === 0 && <span className="card-tag out">Sold out</span>}
      </Link>
      <div className="icon heart" onClick={handleWishlist} title="Wishlist">
        <FaHeart style={{ color: liked ? 'var(--error)' : 'var(--black)' }} />
      </div>
      <div className="icon share" onClick={handleShare} title="Share">
        <FaShareAlt />
      </div>
      {shareOpen && (
        <div className="card-share" onClick={(e) => e.stopPropagation()}>
          <div className="share-head"><span>Share</span><FaXmark onClick={() => setShareOpen(false)} /></div>
          <div className="share-icons">
            <FacebookShareButton url={shareUrl} quote={shareTitle} hashtag="food"><FaFacebook /></FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={shareTitle}><FaXTwitter /></TwitterShareButton>
            <WhatsappShareButton url={shareUrl} title={shareTitle}><FaWhatsapp /></WhatsappShareButton>
            <TelegramShareButton url={shareUrl} title={shareTitle}><FaTelegram /></TelegramShareButton>
            <LinkedinShareButton url={shareUrl} title={shareTitle}><FaLinkedin /></LinkedinShareButton>
            <button onClick={copyLink} className="copy-btn"><FaCopy /></button>
          </div>
        </div>
      )}

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
