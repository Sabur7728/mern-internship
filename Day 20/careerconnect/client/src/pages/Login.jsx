import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { dashboardPath } from '../utils/constants.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Email and password are required');
    setSubmitting(true);
    try {
      const user = await login(form);
      navigate(location.state?.from || dashboardPath(user.role), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card form narrow" onSubmit={onSubmit}>
      <h2>Login</h2>
      {error && <div className="alert error">{error}</div>}
      <label>Email<input type="email" name="email" value={form.email} onChange={onChange} required /></label>
      <label>Password<input type="password" name="password" value={form.password} onChange={onChange} required /></label>
      <button className="btn primary" disabled={submitting}>{submitting ? 'Signing in...' : 'Login'}</button>
      <p className="muted">No account? <Link to="/register">Register</Link></p>
    </form>
  );
}
