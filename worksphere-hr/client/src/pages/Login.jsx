import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Field } from '../components/UI';
export default function Login() {
  const { user, login } = useAuth();
  const [f, setF] = useState({ email: '', password: '' }), [err, setErr] = useState(''), [busy, setBusy] = useState(false), [v, setV] = useState({});
  if (user) return <Navigate to="/dashboard" replace />;
  const submit = async e => {
    e.preventDefault(); setErr('');
    const x = {}; if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = 'Enter a valid email'; if (!f.password) x.password = 'Password is required';
    setV(x); if (Object.keys(x).length) return;
    setBusy(true); try { await login(f.email, f.password); } catch (e2) { setErr(e2.message); } setBusy(false);
  };
  return <div className="login"><form className="card" onSubmit={submit} noValidate>
    <h2>WorkSphere HR Portal</h2><p className="muted">Sign in to continue</p>
    <Alert type="error">{err}</Alert>
    <Field label="Email"><input value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />{v.email && <small className="err">{v.email}</small>}</Field>
    <Field label="Password"><input type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />{v.password && <small className="err">{v.password}</small>}</Field>
    <button className="btn primary" disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button>
  </form></div>;
}
