import { useState } from 'react';
import { api } from '../services/api';
import useFetch from '../hooks/useFetch';
import { Alert, Badge, State } from '../components/UI';
export default function Settings() {
  const { data, loading, error, reload } = useFetch('/users'), [msg, setMsg] = useState({});
  const patch = async (u, body) => { try { await api('/users/' + u._id, { method: 'PATCH', body }); setMsg({ t: 'success', m: 'User updated' }); reload(); } catch (x) { setMsg({ t: 'error', m: x.message }); } };
  return <><h1>Settings – User accounts</h1><Alert type={msg.t}>{msg.m}</Alert>
    <State loading={loading} error={error} empty={data && !data.length}><div className="card scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead><tbody>
      {(data || []).map(u => <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td><select value={u.role} onChange={e => patch(u, { role: e.target.value })}>{['admin', 'hr', 'employee'].map(r => <option key={r}>{r}</option>)}</select></td>
        <td><Badge v={u.isActive ? 'Active' : 'Inactive'} /> <button className="btn sm" onClick={() => patch(u, { isActive: !u.isActive })}>{u.isActive ? 'Disable' : 'Enable'}</button></td></tr>)}
    </tbody></table></div></State></>;
}
