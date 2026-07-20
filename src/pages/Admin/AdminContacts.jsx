import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../lib/ToastContext';
import { fetchAllContacts, deleteContact } from '../../lib/api';
import { FaEnvelope, FaTrash, FaTimes, FaPhone } from 'react-icons/fa';
import './AdminPages.scss';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const { notify } = useToast();

  const load = () => {
    setLoading(true);
    fetchAllContacts().then(setContacts).catch(() => setContacts([])).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      notify('Message deleted.', 'info');
    } catch {
      notify('Could not delete.', 'error');
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Contact Messages</h1>
      <p className="text-muted mb-3">Messages submitted through the contact form.</p>

      {loading ? (
        <div className="spinner" />
      ) : contacts.length === 0 ? (
        <p className="empty-row">No messages yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>From</th><th>Contact</th><th>Message</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>
                    <span className="sub">{c.email}</span>
                    {c.phone && <span className="sub"><FaPhone /> {c.phone}</span>}
                  </td>
                  <td className="contact-msg" onClick={() => setViewing(c)}>{c.message}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="action-cell">
                    <button className="icon-btn" onClick={() => setViewing(c)}><FaEnvelope /></button>
                    <button className="icon-btn danger" onClick={() => remove(c.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <div className="modal-overlay" onClick={() => setViewing(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Message from {viewing.name}</h2>
              <button onClick={() => setViewing(null)}><FaTimes /></button>
            </div>
            <div className="contact-detail">
              <div className="contact-meta">
                <div><strong>Email</strong><a href={`mailto:${viewing.email}`}>{viewing.email}</a></div>
                {viewing.phone && <div><strong>Phone</strong><span>{viewing.phone}</span></div>}
                <div><strong>Received</strong><span>{new Date(viewing.created_at).toLocaleString()}</span></div>
              </div>
              <div className="contact-message">
                <strong>Message</strong>
                <p>{viewing.message}</p>
              </div>
              <div className="form-actions">
                <a className="btn btn-green" href={`mailto:${viewing.email}?subject=Re: Your message to KPL FoodCoop`}>Reply by Email</a>
                <button className="btn btn-secondary" onClick={() => setViewing(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
