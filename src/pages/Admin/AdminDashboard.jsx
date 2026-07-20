import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FaBox, FaShoppingBag, FaUsers, FaDollarSign, FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './AdminPages.scss';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    (async () => {
      const [{ count: products }, { count: orders }, { count: users }, { data: orderRows }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('id, total, status, created_at, shipping_name').order('created_at', { ascending: false }).limit(6),
      ]);
      const revenue = (orderRows || []).reduce((s, o) => s + Number(o.total), 0);
      setStats({ products: products || 0, orders: orders || 0, users: users || 0, revenue });
      setRecent(orderRows || []);
    })();
  }, []);

  const cards = [
    { label: 'Total Revenue', value: `${stats.revenue.toLocaleString()} KSH`, icon: <FaDollarSign />, color: 'green' },
    { label: 'Orders', value: stats.orders, icon: <FaShoppingBag />, color: 'info' },
    { label: 'Products', value: stats.products, icon: <FaBox />, color: 'warning' },
    { label: 'Users', value: stats.users, icon: <FaUsers />, color: 'purple' },
  ];

  return (
    <div className="admin-page">
      <h1 className="admin-title">Dashboard</h1>
      <div className="stats-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className={`stat-icon ${c.color}`}>{c.icon}</div>
            <div className="stat-info">
              <span className="stat-label">{c.label}</span>
              <strong className="stat-value">{c.value}</strong>
            </div>
            <FaArrowUp className="trend" />
          </div>
        ))}
      </div>

      <div className="recent-section">
        <div className="section-head">
          <h2>Recent Orders</h2>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">View all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-muted">No orders yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id.slice(0, 8).toUpperCase()}</td>
                    <td>{o.shipping_name}</td>
                    <td>{Number(o.total).toLocaleString()} KSH</td>
                    <td><span className={`badge badge-${o.status === 'pending' ? 'warning' : o.status === 'delivered' ? 'green' : 'info'}`}>{o.status}</span></td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
