import './Cart.scss';
import CartItem from '../../components/CartItem/CartItem';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../../lib/CartContext';

export default function Cart() {
  const { items, subtotal, loading } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal > 3000 ? 0 : (subtotal > 0 ? 200 : 0);
  const total = subtotal + shipping;

  if (loading) {
    return <section className="cart"><div className="spinner" /></section>;
  }

  if (items.length === 0) {
    return (
      <section className="cart">
        <div className="empty-state">
          <div className="icon-big"><FaShoppingBag /></div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn btn-green btn-lg">Start Shopping</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart">
      <Link to="/shop" className="back-link"><FaArrowLeft /> Continue shopping</Link>
      <h1 className="heading">Your Cart ({items.length})</h1>

      <div className="cart-layout">
        <div className="cart-items">
          <div className="cart-head">
            <span>Item</span>
            <span>Quantity</span>
            <span>Subtotal</span>
            <span />
          </div>
          {items.map((item) => <CartItem key={item.id} item={item} />)}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>{subtotal.toLocaleString()} KSH</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `${shipping.toLocaleString()} KSH`}</span></div>
          {shipping > 0 && (
            <p className="shipping-hint">Add {(3000 - subtotal).toLocaleString()} KSH more for free shipping</p>
          )}
          <div className="summary-row total"><span>Total</span><span>{total.toLocaleString()} KSH</span></div>
          <button className="btn btn-green btn-block btn-lg" onClick={() => navigate('/checkout')}>Checkout</button>
        </aside>
      </div>
    </section>
  );
}
