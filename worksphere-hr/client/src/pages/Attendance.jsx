import { useState } from 'react';
import { api, qs, fmtDate, hm } from '../services/api';
import useFetch from '../hooks/useFetch';
import { Alert, Badge, Pager, State } from '../components/UI';
const STATUS = ['Present', 'Absent', 'Late', 'Half Day', 'Work From Home'];
const today = () => new Date().toISOString().slice(0, 10);
export default function Attendance({ mine }) {
  const [f, setF] = useState({ date: mine ? '' : today(), department: '', status: '', employee: '', page: 1 });
  const [form, setForm] = useState({ employee: '', date: today(), checkIn: '', checkOut: '', status: 'Present', remarks: '' }), [msg, setMsg] = useState({});
  const { data, loading, error, reload } = useFetch('/attendance?' + qs({ ...f, limit: 10 }));
  const stats = useFetch(mine ? '/auth/me' : '/attendance/stats?date=' + (f.date || today()));
  const emps = useFetch(mine ? '/auth/me' : '/employees?limit=100&status=Active').data;
  const depts = useFetch(mine ? '/auth/me' : '/departments').data;
  const set = (k, v) => setF({ ...f, [k]: v, page: 1 });
  const submit = async e => {
    e.preventDefault(); if (!form.employee || !form.date) return setMsg({ t: 'error', m: 'Employee and date are required' });
    if (form.checkIn && form.checkOut && form.checkOut < form.checkIn) return setMsg({ t: 'error', m: 'Check-out cannot be before check-in' });
    try { await api('/attendance', { method: 'POST', body: form }); setMsg({ t: 'success', m: 'Attendance recorded' }); reload(); stats.reload(); } catch (x) { setMsg({ t: 'error', m: x.message }); }
  };
  return <><h1>{mine ? 'My Attendance' : 'Attendance'}</h1>
    {!mine && <>
      <div className="grid">{STATUS.map(s => <div className="stat" key={s}><small>{s} ({f.date || 'today'})</small><strong>{stats.data?.[s] || 0}</strong></div>)}</div>
      <form className="card filters" onSubmit={submit}><b>Record attendance</b>
        <select value={form.employee} onChange={e => setForm({ ...form, employee: e.target.value })}><option value="">Employee…</option>{(emps?.data || []).map(x => <option key={x._id} value={x._id}>{x.employeeId} - {x.firstName} {x.lastName}</option>)}</select>
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <input type="time" value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} /><input type="time" value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{STATUS.map(s => <option key={s}>{s}</option>)}</select>
        <input placeholder="Remarks" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} /><button className="btn primary">Save</button></form>
      <Alert type={msg.t}>{msg.m}</Alert>
      <div className="filters"><input type="date" value={f.date} onChange={e => set('date', e.target.value)} />
        <select value={f.department} onChange={e => set('department', e.target.value)}><option value="">All departments</option>{(depts || []).map(d => <option key={d._id} value={d._id}>{d.name}</option>)}</select>
        <select value={f.employee} onChange={e => set('employee', e.target.value)}><option value="">All employees</option>{(emps?.data || []).map(x => <option key={x._id} value={x._id}>{x.firstName} {x.lastName}</option>)}</select>
        <select value={f.status} onChange={e => set('status', e.target.value)}><option value="">All status</option>{STATUS.map(s => <option key={s}>{s}</option>)}</select>
        <button className="btn sm" onClick={() => setF({ date: '', department: '', status: '', employee: '', page: 1 })}>Clear</button></div></>}
    <State loading={loading} error={error} empty={data && !data.data.length} emptyText="No attendance records found.">
      {data && <div className="card scroll"><table><thead><tr><th>Date</th>{!mine && <th>Employee</th>}<th>Check in</th><th>Check out</th><th>Status</th><th>Work hours</th><th>Remarks</th></tr></thead><tbody>
        {data.data.map(a => <tr key={a._id}><td>{fmtDate(a.date)}</td>{!mine && <td>{a.employee?.firstName} {a.employee?.lastName}<br /><small className="muted">{a.employee?.department?.name}</small></td>}<td>{a.checkIn || '-'}</td><td>{a.checkOut || '-'}</td><td><Badge v={a.status} /></td><td>{hm(a.workHours)}</td><td>{a.remarks}</td></tr>)}
      </tbody></table><Pager data={data} onPage={p => setF({ ...f, page: p })} /></div>}</State></>;
}
