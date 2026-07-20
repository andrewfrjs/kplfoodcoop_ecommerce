import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../lib/ToastContext';
import { fetchAllCarts, fetchAbandonedCarts, deleteCartItem, clearUserCart, notifyUser } from '../../lib/api';
import { FaShoppingCart, FaBell, FaTrash, FaClock } from 'react-icons/fa';
import './AdminPages.scss';

export default function AdminCarts() {
  const [carts, setCarts] = useState([]);
  const [abandoned, setAbandoned] = useState([]);
  const [tab, setTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const { notify } = useToast();

  const load = () => {
    setLoading(true);
    Promise.all([fetchAllCarts(), fetchAbandonedCarts(24)])
      .then(([c, a]) => { setCarts(c); setAbandoned(a); })
      .catch(() => { setCarts([]); setAbandoned([]); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const abandonedUserIds = new Set(abandoned.map((a) => a.user_id));
  const activeCarts = carts.filter((c) => !abandonedUserIds.has(c.user_id));

  // group cart items by user
  const grouped = (items) => {
    const map = new Map();
    items.forEach((i) => {
      if (!map.has(i.user_id)) map.set(i.user_id, { user_id: i.user_id, email: i.profiles?.email, full_name: i.profiles?.full_name, items: [] });
      map.get(i.user_id).items.push(i);
    });
    return [...map.values()];
  };

  const handleNotify = async (userId, email) => {
    try {
      await notifyUser(userId, 'Complete your order', `Hi! You left some items in your cart. Come back and check out before they're gone.`, 'warning');
      notify(`Reminder sent to ${email}.`, 'success');
    } catch (err) {
      notify('Could not send reminder.', 'error');
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await deleteCartItem(id);
      setCarts((prev) => prev.filter((i) => i.id !== id));
      notify('Item removed from cart.', 'info');
    } catch {
      notify('Could not remove item.', 'error');
    }
  };

  const handleClearCart = async (userId) => {
    if (!confirm('Clear this user\'s entire cart?')) return;
    try {
      await clearUserCart(userId);
      setCarts((prev) => prev.filter((i) => i.user_id !== userId));
      notify('Cart cleared.', 'info');
    } catch {
      notify('Could not clear cart.', 'error');
    }
  };

  const renderGroup = (group) => {
    const total = group.items.reduce((s, i) => s + Number(i.products?.price || 0) * i.quantity, 0);
    return (
      <div className="cart-group" key={group.user_id}>
        <div className="cart-group-head">
          <div>
            <strong>{group.full_name || group.email || 'Unknown user'}</strong>
            <span className="sub">{group.email}</span>
          </div>
          <div className="cart-group-actions">
            <span className="cart-total">{total.toLocaleString()} KSH</span>
            {tab === 'abandoned' && (
              <button className="btn btn-green btn-sm" onClick={() => handleNotify(group.user_id, group.email)}><FaBell /> Remind</button>
            )}
            <button className="btn btn-secondary btn-sm" onClick={() => handleClearCart(group.user_id)}><FaTrash /> Clear</button>
          </div>
        </div>
        <div className="cart-items-list">
          {group.items.map((i) => (
            <div className="cart-row" key={i.id}>
              <img src={i.products?.image_url} alt="" />
              <span className="title">{i.products?.title || 'Product'}</span>
              <span className="qty">{i.quantity} × {Number(i.products?.price || 0).toLocaleString()} KSH</span>
              <span className="line">{(Number(i.products?.price || 0) * i.quantity).toLocaleString()} KSH</span>
              <button className="icon-btn danger" onClick={() => handleRemoveItem(i.id)}><FaTrash /></button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const activeGroups = grouped(activeCarts);
  const abandonedGroups = grouped(abandoned.map((a) => ({ ...a, id: a.user_id + a.product_id, products: { title: a.title, price: a.price, image_url: a.image_url }, profiles: { email: a.email, full_name: a.full_name } })));

  return (
    <div className="admin-page">
      <div className="page-head">
        <h1 className="admin-title">Carts</h1>
        <div className="tabs">
          <button className={tab === 'active' ? 'active' : ''} onClick={() => setTab('active')}><FaShoppingCart /> Active ({activeGroups.length})</button>
          <button className={tab === 'abandoned' ? 'active' : ''} onClick={() => setTab('abandoned')}><FaClock /> Abandoned ({abandonedGroups.length})</button>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : tab === 'abandoned' ? (
        abandonedGroups.length === 0 ? (
          <p className="empty-row">No abandoned carts (inactive for 24h+) right now.</p>
        ) : (
          <div className="carts-list">{abandonedGroups.map(renderGroup)}</div>
        )
      ) : activeGroups.length === 0 ? (
        <p className="empty-row">No active carts.</p>
      ) : (
        <div className="carts-list">{activeGroups.map(renderGroup)}</div>
      )}
    </div>
  );
}
