import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../lib/ToastContext';
import { FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './AdminPages.scss';

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');
  const { notify } = useToast();

  const load = () => {
    setLoading(true);
    supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false })
      .then(({ data }) => { setOrders(data || []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
      notify(`Order marked ${status}.`, 'success');
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    } catch (err) {
      notify('Update failed.', 'error');
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="admin-page">
      <div className="page-head">
        <h1 className="admin-title">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <p className="empty-row">No orders found.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <>
                  <tr key={o.id}>
                    <td>#{o.id.slice(0, 8).toUpperCase()}</td>
                    <td>{o.shipping_name}<br /><span className="sub">{o.shipping_phone}</span></td>
                    <td>{Number(o.total).toLocaleString()} KSH</td>
                    <td>{o.payment_method === 'mpesa' ? 'M-Pesa' : 'COD'}</td>
                    <td>
                      <select className="status-select" value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td><button className="icon-btn" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>{expanded === o.id ? <FaChevronUp /> : <FaChevronDown />}</button></td>
                  </tr>
                  {expanded === o.id && (
                    <tr className="expand-row" key={o.id + '-exp'}>
                      <td colSpan={7}>
                        <div className="order-expand">
                          <div className="meta-grid">
                            <div><strong>Shipping Address</strong><span>{o.shipping_address}</span></div>
                            <div><strong>Subtotal</strong><span>{Number(o.subtotal).toLocaleString()} KSH</span></div>
                            <div><strong>Shipping</strong><span>{Number(o.shipping) === 0 ? 'Free' : `${Number(o.shipping).toLocaleString()} KSH`}</span></div>
                          </div>
                          <div className="items-list">
                            {o.order_items.map((it) => (
                              <div key={it.id} className="item">
                                <img src={it.image_url} alt="" />
                                <span>{it.title}</span>
                                <span>{it.quantity} × {Number(it.price).toLocaleString()} KSH</span>
                                <span>{(Number(it.price) * it.quantity).toLocaleString()} KSH</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
