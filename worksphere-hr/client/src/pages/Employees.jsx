import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, qs, fmtDate } from '../services/api';
import useFetch from '../hooks/useFetch';
import { Alert, Badge, Pager, State } from '../components/UI';
export default function Employees() {
  const [f, setF] = useState({ search: '', department: '', status: '', employmentType: '', page: 1 }), [text, setText] = useState(''), [msg, setMsg] = useState('');
  useEffect(() => { const t = setTimeout(() => setF(x => ({ ...x, search: text, page: 1 })), 400); return () => clearTimeout(t); }, [text]);
  const { data, loading, error, reload } = useFetch('/employees?' + qs({ ...f, limit: 10 }));
  const depts = useFetch('/departments').data || [];
  const set = (k, v) => setF({ ...f, [k]: v, page: 1 });
  const deactivate = async e => { if (!confirm(`Deactivate ${e.firstName} ${e.lastName}?`)) return; try { await api('/employees/' + e._id, { method: 'DELETE' }); setMsg('Employee deactivated'); reload(); } catch (x) { setMsg(x.message); } };
  return <><div className="row"><h1>Employees</h1><Link className="btn primary" to="/employees/new">+ Add employee</Link></div>
    <Alert type="info">{msg}</Alert>
    <div className="filters">
      <input placeholder="Search name, ID, email, designation" value={text} onChange={e => setText(e.target.value)} />
      <select value={f.department} onChange={e => set('department', e.target.value)}><option value="">All departments</option>{depts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}</select>
      <select value={f.status} onChange={e => set('status', e.target.value)}><option value="">All status</option>{['Active', 'On Leave', 'Inactive', 'Resigned'].map(s => <option key={s}>{s}</option>)}</select>
      <select value={f.employmentType} onChange={e => set('employmentType', e.target.value)}><option value="">All types</option>{['Full-time', 'Part-time', 'Contract', 'Intern'].map(s => <option key={s}>{s}</option>)}</select>
    </div>
    <State loading={loading} error={error} empty={data && data.data.length === 0} emptyText="No employees found matching your search criteria.">
      {data && <div className="card scroll"><table><thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Type</th><th>Joined</th><th>Status</th><th></th></tr></thead><tbody>
        {data.data.map(e => <tr key={e._id}><td>{e.employeeId}</td><td>{e.firstName} {e.lastName}</td><td>{e.department?.name}</td><td>{e.designation}</td><td>{e.employmentType}</td><td>{fmtDate(e.joiningDate)}</td><td><Badge v={e.status} /></td>
          <td className="actions"><Link className="btn sm" to={'/employees/' + e._id}>View</Link><Link className="btn sm" to={`/employees/${e._id}/edit`}>Edit</Link>{!['Inactive', 'Resigned'].includes(e.status) && <button className="btn sm danger" onClick={() => deactivate(e)}>Deactivate</button>}</td></tr>)}
      </tbody></table><Pager data={data} onPage={p => setF({ ...f, page: p })} /></div>}
    </State></>;
}
