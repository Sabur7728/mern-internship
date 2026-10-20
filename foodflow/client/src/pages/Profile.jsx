import { useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
export default function Profile() {
  const { user, setUser } = useAuth();
  const [f, setF] = useState({ name: user.name, phone: user.phone || '', address: user.address || '' });
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { const d = await api('/auth/me', { method: 'PATCH', body: f }); setUser(d.user); setMsg('Profile saved'); } catch (x) { setMsg(x.message); }
  };
  return (
    <form className="panel authbox" onSubmit={submit}>
      <h1 className="h1">My profile</h1>
      <p className="muted">{user.email} · {user.role}</p>
      <label>Name<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
      <label>Phone<input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
      <label>Address<input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></label>
      {msg && <div className="alert">{msg}</div>}
      <button className="btn block">Save changes</button>
    </form>
  );
}
