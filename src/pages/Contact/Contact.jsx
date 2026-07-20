import { useState } from 'react';
import { submitContact } from '../../lib/api';
import { useToast } from '../../lib/ToastContext';
import './Contact.scss';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { notify('Please fill all required fields.', 'warning'); return; }
    setLoading(true);
    try {
      await submitContact(form);
      notify('Message sent! We will get back to you soon.', 'success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      notify('Could not send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <section className="contact">
      <div className="section-header">
        <p className="sub-heading">We're here to help</p>
        <h1 className="heading">Get in Touch</h1>
      </div>

      <div className="contact-layout">
        <div className="contact-info">
          <div className="info-item">
            <span className="icon">📍</span>
            <div>
              <strong>Visit us</strong>
              <p>Nairobi, Kenya</p>
            </div>
          </div>
          <div className="info-item">
            <span className="icon">📞</span>
            <div>
              <strong>Call us</strong>
              <p>+254 797 814 027</p>
            </div>
          </div>
          <div className="info-item">
            <span className="icon">✉️</span>
            <div>
              <strong>Email us</strong>
              <p>hello@kplfoodcoop.co.ke</p>
            </div>
          </div>
          <div className="info-item">
            <span className="icon">⏰</span>
            <div>
              <strong>Hours</strong>
              <p>Mon - Sat: 8am - 8pm</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label>Name *</label>
              <input value={form.name} onChange={set('name')} required />
            </div>
            <div className="field">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={set('email')} required />
            </div>
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={form.phone} onChange={set('phone')} placeholder="Optional" />
          </div>
          <div className="field">
            <label>Message *</label>
            <textarea rows="5" value={form.message} onChange={set('message')} required />
          </div>
          <button className="btn btn-green btn-lg" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
}
