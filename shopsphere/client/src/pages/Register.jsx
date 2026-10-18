import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Register() {
  const { register } = useAuth(); const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '', phone: '' }); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const bind = (k) => ({ value: f[k], onChange: (e) => setF({ ...f, [k]: e.target.value }) });
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    if (Object.values(f).some((v) => !v.trim())) return setErr('All fields are required');
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr('Enter a valid email address');
    if (f.password.length < 6) return setErr('Password must be at least 6 characters');
    if (f.password !== f.confirm) return setErr('Passwords do not match');
    if (!/^[0-9+\-\s]{10,15}$/.test(f.phone)) return setErr('Enter a valid phone number (10–15 digits)');
    setBusy(true);
    try { await register({ name: f.name, email: f.email, password: f.password, phone: f.phone }); nav('/'); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  };
  return (
    <form className="form" onSubmit={submit}><h1>Create account</h1>
      <input placeholder="Full name" {...bind('name')} /><input type="email" placeholder="Email" {...bind('email')} />
      <input type="password" placeholder="Password" {...bind('password')} /><input type="password" placeholder="Confirm password" {...bind('confirm')} />
      <input placeholder="Phone" {...bind('phone')} />
      {err && <p className="bad">{err}</p>}<button className="btn" disabled={busy}>{busy ? 'Creating…' : 'Register'}</button>
      <p className="muted">Already registered? <Link to="/login">Login</Link></p>
    </form>
  );
}
