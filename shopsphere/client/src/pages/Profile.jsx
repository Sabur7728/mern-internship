import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [f, setF] = useState({ name: user.name, phone: user.phone || '', address: user.address || '' });
  const [err, setErr] = useState(''); const [ok, setOk] = useState(''); const [busy, setBusy] = useState(false);
  const bind = (k) => ({ value: f[k], onChange: (e) => { setF({ ...f, [k]: e.target.value }); setOk(''); } });
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setOk('');
    if (!f.name.trim()) return setErr('Name is required');
    if (!/^[0-9+\-\s]{10,15}$/.test(f.phone)) return setErr('Enter a valid phone number (10–15 digits)');
    setBusy(true);
    try { await updateProfile(f); setOk('Profile updated.'); } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };
  return (
    <form className="form" onSubmit={submit}><h1>My profile</h1>
      <p className="muted">Email: {user.email} · Role: {user.role}</p>
      <label>Full name<input {...bind('name')} /></label>
      <label>Phone<input {...bind('phone')} /></label>
      <label>Address<textarea {...bind('address')} /></label>
      {err && <p className="bad">{err}</p>}{ok && <p className="good">{ok}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
    </form>
  );
}
