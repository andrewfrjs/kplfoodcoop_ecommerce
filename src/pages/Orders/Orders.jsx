import { useEffect, useState } from 'react';
import './Orders.scss';
import { useAuth } from '../../lib/AuthContext';
import { fetchOrders } from '../../lib/api';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const STATUS_COLORS = {
  pending: 'badge-warning',
  paid: 'badge-info',
  shipped: 'badge-info',
  delivered: 'badge-green',
  cancelled: 'badge-error',
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (user) fetchOrders(user.id).then((o) => { setOrders(o); setLoading(false); });
    else setLoading(false);
  }, [user]);

  if (!user) {
    return (
      <section className="empty-state">
        <h2>Please sign in</h2>
        <Link to="/login" className="btn btn-green btn-lg">Sign In</Link>
      </section>
    );
  }

  if (loading) return <section className="orders-page"><div className="spinner" /></section>;

  if (orders.length === 0) {
    return (
      <section className="empty-state">
        <div className="icon-big"><FaBoxOpen /></div>
        <h2>No orders yet</h2>
        <p>When you place orders they will appear here.</p>
        <Link to="/shop" className="btn btn-green btn-lg">Start Shopping</Link>
      </section>
    );
  }

  return (
    <section className="orders-page">
      <h1 className="heading">My Orders</h1>
      <div className="orders-list">
        {orders.map((o) => (
          <div className="order-card" key={o.id}>
            <div className="order-head" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
              <div className="head-left">
                <span className="order-id">#{o.id.slice(0, 8).toUpperCase()}</span>
                <span className="date">{new Date(o.created_at).toLocaleDateString()}</span>
                <span className={`badge ${STATUS_COLORS[o.status]}`}>{o.status}</span>
              </div>
              <div className="head-right">
                <span className="total">{Number(o.total).toLocaleString()} KSH</span>
                <span className="expand">{expanded === o.id ? <FaChevronUp /> : <FaChevronDown />}</span>
              </div>
            </div>
            {expanded === o.id && (
              <div className="order-body">
                <div className="order-meta">
                  <div><strong>Payment</strong><span>{o.payment_method === 'mpesa' ? 'M-Pesa on delivery' : 'Cash on Delivery'}</span></div>
                  <div><strong>Ship to</strong><span>{o.shipping_name}<br />{o.shipping_phone}<br />{o.shipping_address}</span></div>
                  <div><strong>Totals</strong>
                    <span>Subtotal: {Number(o.subtotal).toLocaleString()} KSH<br />
                      Shipping: {Number(o.shipping) === 0 ? 'Free' : `${Number(o.shipping).toLocaleString()} KSH`}<br />
                      Total: {Number(o.total).toLocaleString()} KSH</span>
                  </div>
                </div>
                <div className="order-items-list">
                  {o.order_items.map((it) => (
                    <div className="item" key={it.id}>
                      <img src={it.image_url} alt={it.title} />
                      <div>
                        <strong>{it.title}</strong>
                        <span>{it.quantity} × {Number(it.price).toLocaleString()} KSH</span>
                      </div>
                      <span className="line">{(Number(it.price) * it.quantity).toLocaleString()} KSH</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
