import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './Single.scss';
import { FaMinus, FaPlus, FaStar, FaStarHalf, FaShippingFast, FaCheck, FaShareAlt } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa6';
import { fetchProductBySlug, fetchReviews, addReview, fetchProducts } from '../../lib/api';
import { useCart } from '../../lib/CartContext';
import { useAuth } from '../../lib/AuthContext';
import { useToast } from '../../lib/ToastContext';
import ShareModal from '../../components/ShareModal/ShareModal';
import ProductCard from '../../components/ProductCard/ProductCard';

export default function Single() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { notify } = useToast();

  useEffect(() => {
    setLoading(true);
    setQty(1);
    fetchProductBySlug(id)
      .then((p) => {
        setProduct(p);
        if (p) {
          fetchReviews(p.id).then(setReviews);
          fetchProducts({ categorySlug: p.categories?.slug, limit: 4 }).then((r) => setRelated(r.filter((x) => x.id !== p.id).slice(0, 4)));
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  const handleAdd = async () => {
    if (!user) { notify('Please sign in to add items to cart.', 'info'); navigate('/login'); return; }
    setBusy(true);
    try {
      await addToCart(product.id, qty);
      notify(`${qty} × ${product.title} added to cart`, 'success');
    } catch (err) {
      notify(err.message || 'Could not add to cart', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart(product.id, qty);
      navigate('/cart');
    } catch (err) {
      notify(err.message || 'Could not proceed', 'error');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { notify('Sign in to leave a review.', 'info'); return; }
    if (!newComment.trim()) { notify('Write a comment first.', 'warning'); return; }
    try {
      const r = await addReview(product.id, newRating, newComment);
      setReviews([r, ...reviews]);
      setNewComment('');
      setNewRating(5);
      notify('Review posted!', 'success');
    } catch (err) {
      notify(err.message || 'Could not post review', 'error');
    }
  };

  if (loading) {
    return <section className="single-loading"><div className="spinner" /></section>;
  }
  if (!product) {
    return (
      <section className="empty-state">
        <h1 className="heading">Product not found</h1>
        <Link to="/shop" className="btn btn-green">Back to Shop</Link>
      </section>
    );
  }

  const rating = Math.round(Number(product.rating));
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : product.rating;

  return (
    <section className="single">
      <Link to="/shop" className="back-link"><FaArrowLeft /> Back to shop</Link>

      <div className="product-detail">
        <div className="product-image">
          <img src={product.image_url} alt={product.title} />
          <button className="share-fab" onClick={() => setShareOpen(!shareOpen)}><FaShareAlt /></button>
          {shareOpen && <ShareModal visible={shareOpen} setVisible={setShareOpen} url={window.location.href} title={product.title} />}
        </div>

        <div className="product-info">
          <span className="badge badge-grey">{product.categories?.name || 'Product'}</span>
          <h1>{product.title}</h1>
          <div className="rating-row">
            <span className="stars">
              {Array.from({ length: rating }).map((_, i) => <FaStar key={i} className="star" />)}
              {product.rating % 1 >= 0.5 && <FaStarHalf className="star" />}
            </span>
            <span className="rating-text">{avgRating} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="price-block">
            <span className="price">{Number(product.price).toLocaleString()} KSH</span>
            <span className="stock-badge">
              {product.stock > 0 ? <span className="badge badge-green"><FaCheck /> In stock</span> : <span className="badge badge-error">Out of stock</span>}
            </span>
          </div>

          <p className="desc">{product.description}</p>

          <div className="perk"><FaShippingFast /> Free delivery on orders over KSH 3,000</div>

          <div className="buy-row">
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}><FaMinus /></button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} disabled={qty >= product.stock}><FaPlus /></button>
            </div>
            <button className="btn btn-green btn-lg" onClick={handleAdd} disabled={busy || product.stock === 0}>
              {busy ? <span className="spinner" /> : 'Add to Cart'}
            </button>
            <button className="btn btn-lg" onClick={handleBuyNow} disabled={product.stock === 0}>Buy Now</button>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews ({reviews.length})</h2>

        <form className="review-form" onSubmit={submitReview}>
          <h3>Write a review</h3>
          <div className="rating-input">
            <span>Rating:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <FaStar key={n} className="star clickable" style={{ color: n <= newRating ? 'var(--warning)' : 'var(--border)' }} onClick={() => setNewRating(n)} />
            ))}
          </div>
          <textarea placeholder="Share your experience..." value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={3} />
          <button type="submit" className="btn btn-green btn-sm">Post Review</button>
        </form>

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="text-muted">No reviews yet. Be the first to share!</p>
          ) : reviews.map((r) => (
            <div className="review-item" key={r.id}>
              <div className="review-head">
                <div className="avatar">{(r.profiles?.full_name || 'User').charAt(0)}</div>
                <div>
                  <strong>{r.profiles?.full_name || 'Anonymous'}</strong>
                  <span className="stars">
                    {Array.from({ length: r.rating }).map((_, i) => <FaStar key={i} className="star" />)}
                  </span>
                </div>
                <span className="date">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <div className="related">
          <h2 className="heading">You Might Also Like</h2>
          <div className="grid">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </section>
  );
}
