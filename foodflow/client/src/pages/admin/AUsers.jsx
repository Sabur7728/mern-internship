import { useState } from 'react';
import { api } from '../../services/api.js';
import { useFetch, useDebounce } from '../../hooks/hooks.js';
import { Async, Pagination } from '../../components/UI.jsx';

export default function AUsers() {
  const [f, setF] = useState({ search: '', role: '', page: 1 });
  const search = useDebounce(f.search);
  const [msg, setMsg] = useState('');
  const q = useFetch(() => api('/users', { params: { search, role: f.role, page: f.page, limit: 10 } }), [search, f.role, f.page]);
  const toggle = async (u) => { setMsg(''); try { await api(`/users/${u._id}/status`, { method: 'PATCH', body: { isActive: !u.isActive } }); q.reload(); } catch (e) { setMsg(e.message); } };
  return (
    <>
      <h1 className="h1">Users</h1>
      <div className="filters">
        <input placeholder="Search name or email" value={f.search} onChange={(e) => setF({ ...f, search: e.target.value, page: 1 })} />
        <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value, page: 1 })}><option value="">All roles</option><option value="customer">Customers</option><option value="restaurant">Restaurant users</option><option value="admin">Admins</option></select>
      </div>
      {msg && <div className="alert error">{msg}</div>}
      <Async q={q} empty={(d) => !d.data.length} emptyText="No users match.">
        {(d) => (<>
          <div className="tablewrap"><table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
            <tbody>{d.data.map((u) => (
              <tr key={u._id}><td><b>{u.name}</b></td><td>{u.email}</td><td>{u.role}</td>
                <td><span className={'pill ' + (u.isActive ? 'open' : 'shut')}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                <td><button className={'btn sm ' + (u.isActive ? 'danger' : 'mint')} onClick={() => toggle(u)}>{u.isActive ? 'Deactivate' : 'Activate'}</button></td></tr>))}</tbody>
          </table></div>
          <Pagination page={d.page} totalPages={d.totalPages} onChange={(p) => setF({ ...f, page: p })} />
        </>)}
      </Async>
    </>
  );
}
