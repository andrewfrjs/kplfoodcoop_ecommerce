import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../lib/ToastContext';
import { fetchAllNotifications, sendNotification, deleteNotification } from '../../lib/api';
import { FaBell, FaPaperPlane, FaTrash, FaTimes } from 'react-icons/fa';
import './AdminPages.scss';

const TYPES = ['info', 'success', 'warning', 'error', 'order', 'system'];
const TYPE_BADGE = { info: 'badge-info', success: 'badge-green', warning: 'badge-warning', error: 'badge-error', order: 'badge-info', system: 'badge-grey' };

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ userId: '', title: '', message: '', type: 'info' });
  const [sending, setSending] = useState(false);
  const { notify } = useToast();

  const load = () => {
    setLoading(true);
    Promise.all([
      fetchAllNotifications(),
      supabase.from('profiles').select('id, email, full_name').order('created_at', { ascending: false }).then(({ data }) => data || []),
    ]).then(([n, u]) => { setNotifications(n); setUsers(u); setLoading(false); });
  };

  useEffect(load, []);

  const send = async (e) => {
    e.preventDefault();
    if (!form.title) { notify('Title is required.', 'warning'); return; }
    setSending(true);
    try {
      await sendNotification({
        userId: form.userId || null,
        title: form.title,
        message: form.message,
        type: form.type,
      });
      notify(form.userId ? 'Notification sent to user.' : 'Broadcast sent to all users.', 'success');
      setForm({ userId: '', title: '', message: '', type: 'info' });
      setShowForm(false);
      load();
    } catch (err) {
      notify(err.message || 'Could not send notification.', 'error');
    } finally {
      setSending(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      notify('Notification deleted.', 'info');
    } catch {
      notify('Could not delete.', 'error');
    }
  };

  return (
    <div className="admin-page">
      <div className="page-head">
        <h1 className="admin-title">Notifications</h1>
        <button className="btn btn-green" onClick={() => setShowForm(!showForm)}><FaBell /> New Notification</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Send Notification</h2>
              <button onClick={() => setShowForm(false)}><FaTimes /></button>
            </div>
            <form onSubmit={send} className="modal-form">
              <div className="field">
                <label>Recipient</label>
                <select value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })}>
                  <option value="">All users (broadcast)</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.full_name || u.email} — {u.email}</option>)}
                </select>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="field">
                  <label>Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Message</label>
                <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-green" disabled={sending}>{sending ? <span className="spinner" /> : <><FaPaperPlane /> Send</>}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="spinner" />
      ) : notifications.length === 0 ? (
        <p className="empty-row">No notifications sent yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Message</th><th>Recipient</th><th>Type</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr key={n.id}>
                  <td><strong>{n.title}</strong></td>
                  <td className="notif-msg">{n.message || '—'}</td>
                  <td>{n.user_id ? (n.profiles?.email || 'User') : <span className="badge badge-grey">Broadcast</span>}</td>
                  <td><span className={`badge ${TYPE_BADGE[n.type]}`}>{n.type}</span></td>
                  <td>{new Date(n.created_at).toLocaleString()}</td>
                  <td className="action-cell">
                    <button className="icon-btn danger" onClick={() => remove(n.id)}><FaTrash /></button>
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
