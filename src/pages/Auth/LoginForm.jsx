import { useState } from 'react';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import './Auth.scss';
import { useAuth } from '../../lib/AuthContext';
import { useToast } from '../../lib/ToastContext';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { user, signIn, signInWithGoogle } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { notify('All fields are required.', 'warning'); return; }
    setLoading(true);
    try {
      await signIn(email, password);
      notify('Welcome back!', 'success');
      navigate('/');
    } catch (err) {
      notify(err.message || 'Login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      notify('Google sign-in failed.', 'error');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-hero">
          <div className="logo-mark">KPL</div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue shopping fresh, local produce.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <div className="password-wrap">
              <input type={showPass ? 'text' : 'password'} placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>{showPass ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
          </div>
          <button className="btn btn-green btn-block btn-lg" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <div className="divider"><span>or</span></div>

        <button className="btn btn-secondary btn-block btn-lg google-btn" onClick={handleGoogle} disabled={googleLoading}>
          <FaGoogle /> {googleLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <p className="switch-auth">Don&apos;t have an account? <NavLink to="/get-started">Get started</NavLink></p>
      </div>
    </div>
  );
}
