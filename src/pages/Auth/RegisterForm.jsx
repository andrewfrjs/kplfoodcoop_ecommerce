import { useState } from 'react';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import './Auth.scss';
import { useAuth } from '../../lib/AuthContext';
import { useToast } from '../../lib/ToastContext';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function RegisterForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { user, signUp, signInWithGoogle } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) { notify('All fields are required.', 'warning'); return; }
    if (password.length < 6) { notify('Password must be at least 6 characters.', 'warning'); return; }
    if (password !== confirm) { notify('Passwords do not match.', 'error'); return; }
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      notify('Account created! Welcome to KPL FoodCoop.', 'success');
      navigate('/');
    } catch (err) {
      notify(err.message || 'Registration failed.', 'error');
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
          <h1>Get Started</h1>
          <p>Create your free account to start shopping.</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="field">
            <label>Full Name</label>
            <input type="text" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <div className="password-wrap">
              <input type={showPass ? 'text' : 'password'} placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>{showPass ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input type={showPass ? 'text' : 'password'} placeholder="Re-enter password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          <button className="btn btn-green btn-block btn-lg" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <div className="divider"><span>or</span></div>

        <button className="btn btn-secondary btn-block btn-lg google-btn" onClick={handleGoogle} disabled={googleLoading}>
          <FaGoogle /> {googleLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <p className="switch-auth">Already have an account? <NavLink to="/login">Login</NavLink></p>
      </div>
    </div>
  );
}
