import { useState } from 'react';
import { api, qs, fmtDate } from '../services/api';
import useFetch from '../hooks/useFetch';
import { Alert, Badge, Pager, State } from '../components/UI';
const TYPES = ['Casual Leave', 'Sick Leave', 'Annual Leave', 'Emergency Leave', 'Unpaid Leave'];
const days = (a, b) => a && b && b >= a ? Math.round((new Date(b) - new Date(a)) / 864e5) + 1 : 0;
export default function Leaves({ mine }) {
  const [f, setF] = useState({ status: '', leaveType: '', from: '', to: '', page: 1 }), [form, setForm] = useState({ leaveType: 'Casual Leave', startDate: '', endDate: '', reason: '' }), [msg, setMsg] = useState({});
  const { data, loading, error, reload } = useFetch((mine ? '/leaves/my?' : '/leaves?') + qs({ ...f, limit: 10 }));
  const set = (k, v) => setF({ ...f, [k]: v, page: 1 });
  const act = async (fn, ok) => { try { await fn(); setMsg({ t: 'success', m: ok }); reload(); } catch (x) { setMsg({ t: 'error', m: x.message }); } };
  const apply = e => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason.trim()) return setMsg({ t: 'error', m: 'All fields are required' });
    if (form.endDate < form.startDate) return setMsg({ t: 'error', m: 'End date cannot be before start date' });
    act(async () => { await api('/leaves', { method: 'POST', body: form }); setForm({ ...form, startDate: '', endDate: '', reason: '' }); }, 'Leave request submitted');
  };
  const review = (l, kind) => { const comment = prompt(`Comment for ${kind}:`) ; if (comment === null) return; act(() => api(`/leaves/${l._id}/${kind}`, { method: 'PATCH', body: { comment } }), 'Request ' + kind + 'd'); };
  return <><h1>{mine ? 'My Leave Requests' : 'Leave Requests'}</h1><Alert type={msg.t}>{msg.m}</Alert>
    {mine && <form className="card filters" onSubmit={apply}><select value={form.leaveType} onChange={e => setForm({ ...form, leaveType: e.target.value })}>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
      <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /><input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
      <input placeholder="Reason" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} /><span className="chip">{days(form.startDate, form.endDate)} day(s)</span><button className="btn primary">Apply</button></form>}
    <div className="filters"><select value={f.status} onChange={e => set('status', e.target.value)}><option value="">All status</option>{['Pending', 'Approved', 'Rejected', 'Cancelled'].map(s => <option key={s}>{s}</option>)}</select>
      <select value={f.leaveType} onChange={e => set('leaveType', e.target.value)}><option value="">All types</option>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
      <label>From <input type="date" value={f.from} onChange={e => set('from', e.target.value)} /></label><label>To <input type="date" value={f.to} onChange={e => set('to', e.target.value)} /></label></div>
    <State loading={loading} error={error} empty={data && !data.data.length} emptyText="No leave requests found.">
      {data && <div className="card scroll"><table><thead><tr>{!mine && <th>Employee</th>}<th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th><th>Review</th><th></th></tr></thead><tbody>
        {data.data.map(l => <tr key={l._id}>{!mine && <td>{l.employee?.firstName} {l.employee?.lastName}<br /><small className="muted">{l.employee?.department?.name}</small></td>}<td>{l.leaveType}</td><td>{fmtDate(l.startDate)} – {fmtDate(l.endDate)}</td><td>{l.days}</td><td>{l.reason}</td><td><Badge v={l.status} /></td>
          <td>{l.reviewedBy ? <small>{l.reviewedBy.name}<br />{l.reviewComment}</small> : '-'}</td>
          <td className="actions">{!mine && l.status === 'Pending' && <><button className="btn sm primary" onClick={() => review(l, 'approve')}>Approve</button><button className="btn sm danger" onClick={() => review(l, 'reject')}>Reject</button></>}
            {mine && ['Pending', 'Approved'].includes(l.status) && <button className="btn sm" onClick={() => act(() => api(`/leaves/${l._id}/cancel`, { method: 'PATCH' }), 'Request cancelled')}>Cancel</button>}</td></tr>)}
      </tbody></table><Pager data={data} onPage={p => setF({ ...f, page: p })} /></div>}</State></>;
}
