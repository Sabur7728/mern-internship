import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const { login } = useAuth(); const nav = useNavigate(); const loc = useLocation();
  const [f, setF] = useState({ email: '', password: '' }); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr('Enter a valid email address');
    if (!f.password) return setErr('Password is required');
    setBusy(true);
    try { const u = await login(f.email, f.password); nav(loc.state?.from || (u.role === 'admin' ? '/admin' : '/'), { replace: true }); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  };
  return (
    <form className="form" onSubmit={submit}><h1>Login</h1>
      <input type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input type="password" placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      {err && <p className="bad">{err}</p>}<button className="btn" disabled={busy}>{busy ? 'Logging in…' : 'Login'}</button>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
    </form>
  );
}
