import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Checkout.scss';
import { useCart } from '../../lib/CartContext';
import { useAuth } from '../../lib/AuthContext';
import { useToast } from '../../lib/ToastContext';
import { createOrder, fetchAddresses, saveAddress } from '../../lib/api';
import { FaCheck, FaArrowLeft } from 'react-icons/fa';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('Nairobi');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const shipping = subtotal > 3000 ? 0 : 200;
  const total = subtotal + shipping;

  if (!user) {
    return (
      <section className="empty-state">
        <h2>Please sign in to checkout</h2>
        <Link to="/login" className="btn btn-green btn-lg">Sign In</Link>
      </section>
    );
  }

  if (items.length === 0 && !confirmed) {
    return (
      <section className="empty-state">
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="btn btn-green btn-lg">Browse Products</Link>
      </section>
    );
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!name || !phone || !line1 || !city) { notify('Please fill all required fields.', 'warning'); return; }
    setPlacing(true);
    try {
      const { order } = await createOrder({
        user,
        items,
        shipping: { name, phone, address: `${line1}, ${city}${notes ? ' — ' + notes : ''}` },
        paymentMethod,
      });
      setConfirmed(order);
      await clearCart();
      notify('Order placed successfully!', 'success');
      window.scrollTo(0, 0);
    } catch (err) {
      notify(err.message || 'Could not place order.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  if (confirmed) {
    return (
      <section className="checkout-confirmed">
        <div className="confirm-card">
          <div className="check-icon"><FaCheck /></div>
          <h1>Order Confirmed!</h1>
          <p>Thank you, {name}. We've received your order.</p>
          <div className="order-ref">Order #{confirmed.id.slice(0, 8).toUpperCase()}</div>
          <div className="order-totals">
            <div className="row"><span>Subtotal</span><span>{Number(confirmed.subtotal).toLocaleString()} KSH</span></div>
            <div className="row"><span>Shipping</span><span>{Number(confirmed.shipping) === 0 ? 'Free' : `${Number(confirmed.shipping).toLocaleString()} KSH`}</span></div>
            <div className="row total"><span>Total</span><span>{Number(confirmed.total).toLocaleString()} KSH</span></div>
            <div className="row"><span>Payment</span><span>{confirmed.payment_method === 'mpesa' ? 'M-Pesa (pay on delivery)' : 'Cash on Delivery'}</span></div>
            <div className="row"><span>Status</span><span className="badge badge-warning">Pending</span></div>
          </div>
          <p className="delivery-note">Our team will call {phone} to confirm delivery details.</p>
          <div className="confirm-actions">
            <Link to="/orders" className="btn btn-green">View My Orders</Link>
            <Link to="/shop" className="btn btn-secondary">Keep Shopping</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout">
      <Link to="/cart" className="back-link"><FaArrowLeft /> Back to cart</Link>
      <h1 className="heading">Checkout</h1>

      <form className="checkout-layout" onSubmit={placeOrder}>
        <div className="checkout-main">
          <div className="checkout-block">
            <h3>Delivery Details</h3>
            <div className="field-row">
              <div className="field">
                <label>Full Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="field">
                <label>Phone Number *</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07xx xxx xxx" required />
              </div>
            </div>
            <div className="field">
              <label>Street Address *</label>
              <input value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="House no, street, area" required />
            </div>
            <div className="field-row">
              <div className="field">
                <label>City *</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div className="field">
                <label>Delivery Notes</label>
                <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Landmark, instructions" />
              </div>
            </div>
          </div>

          <div className="checkout-block">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label className={`payment-opt ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <div>
                  <strong>Cash on Delivery</strong>
                  <span>Pay with cash when your order arrives</span>
                </div>
              </label>
              <label className={`payment-opt ${paymentMethod === 'mpesa' ? 'active' : ''}`}>
                <input type="radio" name="payment" value="mpesa" checked={paymentMethod === 'mpesa'} onChange={() => setPaymentMethod('mpesa')} />
                <div>
                  <strong>M-Pesa (on delivery)</strong>
                  <span>Pay via M-Pesa when our rider arrives</span>
                </div>
              </label>
              <label className="payment-opt disabled">
                <input type="radio" disabled />
                <div>
                  <strong>Card / Online Payment</strong>
                  <span>Coming soon</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <aside className="checkout-summary">
          <h3>Your Order</h3>
          <div className="order-items">
            {items.map((i) => (
              <div className="order-item" key={i.id}>
                <img src={i.products?.image_url} alt={i.products?.title} />
                <div className="info">
                  <span className="title">{i.products?.title}</span>
                  <span className="qty">{i.quantity} × {Number(i.products?.price).toLocaleString()} KSH</span>
                </div>
                <span className="line">{(Number(i.products?.price) * i.quantity).toLocaleString()} KSH</span>
              </div>
            ))}
          </div>
          <div className="summary-row"><span>Subtotal</span><span>{subtotal.toLocaleString()} KSH</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `${shipping} KSH`}</span></div>
          <div className="summary-row total"><span>Total</span><span>{total.toLocaleString()} KSH</span></div>
          <button type="submit" className="btn btn-green btn-block btn-lg" disabled={placing}>
            {placing ? <span className="spinner" /> : 'Place Order'}
          </button>
          <p className="secure-note">By placing this order you agree to our terms of service.</p>
        </aside>
      </form>
    </section>
  );
}
