import { useState } from 'react';
import { api } from '../services/api';
import useFetch from '../hooks/useFetch';
import { Alert, Badge, Field, State } from '../components/UI';
const blank = { name: '', description: '', manager: '', location: '' };
export default function Departments() {
  const { data, loading, error, reload } = useFetch('/departments');
  const [f, setF] = useState(blank), [edit, setEdit] = useState(null), [msg, setMsg] = useState({});
  const run = async (fn, ok) => { try { await fn(); setMsg({ t: 'success', m: ok }); setF(blank); setEdit(null); reload(); } catch (e) { setMsg({ t: 'error', m: e.message }); } };
  const save = e => { e.preventDefault(); if (!f.name.trim()) return setMsg({ t: 'error', m: 'Department name is required' }); run(() => api(edit ? '/departments/' + edit : '/departments', { method: edit ? 'PATCH' : 'POST', body: f }), edit ? 'Department updated' : 'Department created'); };
  return <><h1>Departments</h1><Alert type={msg.t}>{msg.m}</Alert>
    <form className="card filters" onSubmit={save}>{['name', 'description', 'manager', 'location'].map(k => <input key={k} placeholder={k[0].toUpperCase() + k.slice(1)} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} />)}
      <button className="btn primary">{edit ? 'Update' : 'Add'} department</button>{edit && <button type="button" className="btn" onClick={() => { setEdit(null); setF(blank); }}>Cancel</button>}</form>
    <State loading={loading} error={error} empty={data && !data.length} emptyText="No departments yet.">
      <div className="grid2">{(data || []).map(d => <div className="card" key={d._id}><h3>{d.name} <Badge v={d.isActive ? 'Active' : 'Inactive'} /></h3>
        <p className="muted">{d.description}</p><p>Employees: <b>{d.employeeCount}</b><br />Manager: {d.manager || '-'}<br />Location: {d.location || '-'}</p>
        <div className="actions"><button className="btn sm" onClick={() => { setEdit(d._id); setF({ name: d.name, description: d.description || '', manager: d.manager || '', location: d.location || '' }); }}>Edit</button>
          <button className="btn sm" onClick={() => run(() => api('/departments/' + d._id, { method: 'PATCH', body: { isActive: !d.isActive } }), 'Status changed')}>{d.isActive ? 'Deactivate' : 'Activate'}</button>
          <button className="btn sm danger" onClick={() => confirm('Delete department?') && run(() => api('/departments/' + d._id, { method: 'DELETE' }), 'Department deleted')}>Delete</button></div></div>)}</div>
    </State></>;
}
