import { useState } from 'react';
import './Newsletter.scss';
import { FaPaperPlane } from 'react-icons/fa';
import { subscribeNewsletter } from '../../lib/api';
import { useToast } from '../../lib/ToastContext';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await subscribeNewsletter(email);
      notify(res.duplicate ? "You're already subscribed!" : 'Thanks for subscribing!', res.duplicate ? 'info' : 'success');
      setEmail('');
    } catch (err) {
      notify('Subscription failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter" id="subscribe">
      <div className="newsletter-inner">
        <div className="text">
          <h2>Stay in the loop</h2>
          <p>Subscribe for fresh deals, seasonal offers, and farm updates.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : <FaPaperPlane />}
            <span>Subscribe</span>
          </button>
        </form>
      </div>
    </section>
  );
}
