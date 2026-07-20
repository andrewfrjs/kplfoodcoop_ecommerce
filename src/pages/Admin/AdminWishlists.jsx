import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../lib/ToastContext';
import { FaHeart, FaTrash } from 'react-icons/fa';
import './AdminPages.scss';

export default function AdminWishlists() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useToast();

  const load = () => {
    setLoading(true);
    supabase
      .from('wishlists')
      .select('id, created_at, product_id, products(title, slug), profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  };

  useEffect(load, []);

  const remove = async (id) => {
    try {
      const { error } = await supabase.from('wishlists').delete().eq('id', id);
      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== id));
      notify('Wishlist entry removed.', 'info');
    } catch {
      notify('Could not remove entry.', 'error');
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Wishlists</h1>
      <p className="text-muted mb-3">All saved products across users. Admins can remove entries if needed.</p>

      {loading ? (
        <div className="spinner" />
      ) : items.length === 0 ? (
        <p className="empty-row">No wishlist entries yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Product</th><th>User</th><th>Saved On</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td className="product-cell">
                    <FaHeart style={{ color: 'var(--error)' }} />
                    <span>{i.products?.title || 'Unknown product'}</span>
                  </td>
                  <td>{i.profiles?.full_name || '—'}<br /><span className="sub">{i.profiles?.email}</span></td>
                  <td>{new Date(i.created_at).toLocaleDateString()}</td>
                  <td className="action-cell">
                    <button className="icon-btn danger" onClick={() => remove(i.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
