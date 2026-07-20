import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../lib/ToastContext';
import { FaUsers, FaUserShield } from 'react-icons/fa';
import './AdminPages.scss';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useToast();

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setUsers(data || []); setLoading(false); });
  }, []);

  const toggleRole = async (u) => {
    const next = u.role === 'admin' ? 'customer' : 'admin';
    try {
      const { error } = await supabase.from('profiles').update({ role: next }).eq('id', u.id);
      if (error) throw error;
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, role: next } : x));
      notify(`${u.email} is now ${next}.`, 'success');
    } catch (err) {
      notify('Update failed.', 'error');
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Users</h1>
      {loading ? (
        <div className="spinner" />
      ) : users.length === 0 ? (
        <p className="empty-row">No users yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>User</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="user-cell">
                    <div className="avatar">{(u.full_name || u.email).charAt(0).toUpperCase()}</div>
                    <div>
                      <strong>{u.full_name || '—'}</strong>
                      <span className="sub">{u.email}</span>
                    </div>
                  </td>
                  <td>{u.phone || '—'}</td>
                  <td>
                    {u.role === 'admin' ? <span className="badge badge-warning"><FaUserShield /> Admin</span> : <span className="badge badge-grey"><FaUsers /> Customer</span>}
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => toggleRole(u)}>
                      {u.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                    </button>
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
