import { useEffect, useState } from 'react';
import './Profile.scss';
import { useAuth } from '../../lib/AuthContext';
import { useToast } from '../../lib/ToastContext';
import { updateProfile, fetchAddresses, saveAddress, deleteAddress } from '../../lib/api';
import { Link } from 'react-router-dom';
import { FaUser, FaBox, FaMapMarkerAlt, FaHeart, FaSignOutAlt, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function Profile() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { notify } = useToast();
  const [tab, setTab] = useState('account');
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [addrForm, setAddrForm] = useState({ full_name: '', phone: '', line1: '', line2: '', city: 'Nairobi', notes: '' });

  useEffect(() => {
    if (user) fetchAddresses(user.id).then(setAddresses);
  }, [user]);

  useEffect(() => {
    setFullName(profile?.full_name || '');
    setPhone(profile?.phone || '');
  }, [profile]);

  if (!user) {
    return (
      <section className="empty-state">
        <h2>Please sign in</h2>
        <Link to="/login" className="btn btn-green btn-lg">Sign In</Link>
      </section>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(user.id, { full_name: fullName, phone });
      await refreshProfile();
      notify('Profile updated.', 'success');
    } catch (err) {
      notify('Could not update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openAddrForm = (addr = null) => {
    setEditingAddr(addr?.id || null);
    setAddrForm(addr || { full_name: fullName, phone, line1: '', line2: '', city: 'Nairobi', notes: '' });
    setShowAddrForm(true);
  };

  const saveAddr = async (e) => {
    e.preventDefault();
    try {
      const saved = await saveAddress(user.id, { ...addrForm, id: editingAddr });
      setAddresses((prev) => editingAddr ? prev.map((a) => a.id === editingAddr ? saved : a) : [saved, ...prev]);
      setShowAddrForm(false);
      notify('Address saved.', 'success');
    } catch (err) {
      notify('Could not save address.', 'error');
    }
  };

  const removeAddr = async (id) => {
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      notify('Address removed.', 'info');
    } catch {
      notify('Could not remove address.', 'error');
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: <FaUser /> },
    { id: 'orders', label: 'My Orders', icon: <FaBox />, link: '/orders' },
    { id: 'addresses', label: 'Addresses', icon: <FaMapMarkerAlt /> },
  ];

  return (
    <section className="profile-page">
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="avatar">
              {profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : (profile?.full_name?.charAt(0) || 'U')}
            </div>
            <h3>{profile?.full_name || user.email}</h3>
            <span className="email">{user.email}</span>
            {profile?.role === 'admin' && <span className="badge badge-warning">Admin</span>}
          </div>
          <nav className="profile-nav">
            {tabs.map((t) =>
              t.link ? (
                <Link key={t.id} to={t.link} className="nav-item"><span className="icon">{t.icon}</span> {t.label}</Link>
              ) : (
                <button key={t.id} className={`nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                  <span className="icon">{t.icon}</span> {t.label}
                </button>
              )
            )}
            <button className="nav-item signout" onClick={signOut}><FaSignOutAlt /> Sign Out</button>
          </nav>
        </aside>

        <div className="profile-content">
          {tab === 'account' && (
            <div className="panel">
              <h2>Account Details</h2>
              <form onSubmit={handleSave} className="account-form">
                <div className="field">
                  <label>Full Name</label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input value={user.email} disabled />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07xx xxx xxx" />
                </div>
                <button className="btn btn-green" type="submit" disabled={saving}>
                  {saving ? <span className="spinner" /> : <><FaEdit /> Save Changes</>}
                </button>
              </form>
            </div>
          )}

          {tab === 'addresses' && (
            <div className="panel">
              <div className="panel-head">
                <h2>Saved Addresses</h2>
                <button className="btn btn-green btn-sm" onClick={() => openAddrForm()}><FaPlus /> Add New</button>
              </div>

              {showAddrForm && (
                <form className="addr-form" onSubmit={saveAddr}>
                  <div className="field-row">
                    <div className="field">
                      <label>Full Name *</label>
                      <input value={addrForm.full_name} onChange={(e) => setAddrForm({ ...addrForm, full_name: e.target.value })} required />
                    </div>
                    <div className="field">
                      <label>Phone *</label>
                      <input value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} required />
                    </div>
                  </div>
                  <div className="field">
                    <label>Street Address *</label>
                    <input value={addrForm.line1} onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })} required />
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label>City *</label>
                      <input value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} required />
                    </div>
                    <div className="field">
                      <label>Notes</label>
                      <input value={addrForm.notes} onChange={(e) => setAddrForm({ ...addrForm, notes: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-green btn-sm">Save Address</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddrForm(false)}>Cancel</button>
                  </div>
                </form>
              )}

              {addresses.length === 0 ? (
                <p className="text-muted">No saved addresses yet.</p>
              ) : (
                <div className="addr-list">
                  {addresses.map((a) => (
                    <div key={a.id} className="addr-item">
                      <div className="addr-info">
                        <strong>{a.full_name} · {a.phone}</strong>
                        <span>{a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}</span>
                        {a.notes && <span className="note">{a.notes}</span>}
                      </div>
                      <div className="addr-actions">
                        <button onClick={() => openAddrForm(a)}><FaEdit /></button>
                        <button onClick={() => removeAddr(a.id)}><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
