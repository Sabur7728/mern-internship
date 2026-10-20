import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, homeFor } from '../context/AuthContext.jsx';

export function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try { const u = await login(f.email, f.password); nav(loc.state?.from || homeFor(u), { replace: true }); } catch (x) { setErr(x.message); }
  };
  return (
    <form className="panel authbox" onSubmit={submit}>
      <h1 className="h1">Welcome back</h1>
      <label>Email<input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
      <label>Password<input type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
      {err && <div className="alert error">{err}</div>}
      <button className="btn block">Log in</button>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
      <details className="demo"><summary>Demo accounts</summary>
        <p>Customer: customer1@foodflow.com / Customer@123</p><p>Restaurant: restaurant1@foodflow.com / Restaurant@123</p><p>Admin: admin@foodflow.com / Admin@123</p></details>
    </form>
  );
}

export function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [err, setErr] = useState('');
  const bind = (k) => ({ value: f[k], onChange: (e) => setF({ ...f, [k]: e.target.value }) });
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    if (f.password.length < 6) return setErr('Password must be at least 6 characters');
    if (f.password !== f.confirm) return setErr('Passwords do not match');
    if (!/^\d{10}$/.test(f.phone)) return setErr('Enter a valid 10-digit phone number');
    try { await register({ name: f.name, email: f.email, phone: f.phone, password: f.password }); nav('/'); } catch (x) { setErr(x.message); }
  };
  return (
    <form className="panel authbox" onSubmit={submit}>
      <h1 className="h1">Create your account</h1>
      <label>Name<input required {...bind('name')} /></label>
      <label>Email<input type="email" required {...bind('email')} /></label>
      <label>Phone<input required inputMode="numeric" maxLength={10} {...bind('phone')} /></label>
      <label>Password<input type="password" required {...bind('password')} /></label>
      <label>Confirm password<input type="password" required {...bind('confirm')} /></label>
      {err && <div className="alert error">{err}</div>}
      <button className="btn block">Sign up</button>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}
