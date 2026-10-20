import { useState } from 'react';
import { api } from '../../services/api.js';
import { useFetch } from '../../hooks/hooks.js';
import { Async, Pagination, StatusBadge } from '../../components/UI.jsx';
import { inr, dt, NEXT, STEPS } from '../../utils/format.js';

export default function ROrders() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');
  const q = useFetch(() => api('/orders/restaurant', { params: { page, status, limit: 8 } }), [page, status]);
  const move = async (o, s) => { setMsg(''); try { await api(`/orders/${o._id}/status`, { method: 'PATCH', body: { status: s } }); q.reload(); } catch (e) { setMsg(e.message); } };
  return (
    <>
      <div className="row between"><h1 className="h1">Restaurant orders</h1>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="">All statuses</option>{[...STEPS, 'Cancelled'].map((s) => <option key={s}>{s}</option>)}</select></div>
      {msg && <div className="alert error">{msg}</div>}
      <Async q={q} empty={(d) => !d.data.length} emptyText="No orders yet.">
        {(d) => (<>
          <div className="list">{d.data.map((o) => (
            <div key={o._id} className="panel">
              <div className="row between"><b>#{o._id.slice(-6).toUpperCase()} · {o.customer?.name}</b><StatusBadge status={o.orderStatus} /></div>
              <div className="muted">{dt(o.createdAt)} · Payment: {o.paymentMethod} ({o.paymentStatus})</div>
              <ul className="items">{o.items.map((i, k) => <li key={k}>{i.quantity} × {i.name}</li>)}</ul>
              <div className="row between"><b>{inr(o.totalAmount)}</b>
                <div className="row gap">
                  {NEXT[o.orderStatus] && <button className="btn sm" onClick={() => move(o, NEXT[o.orderStatus])}>Mark {NEXT[o.orderStatus]}</button>}
                  {['Placed', 'Confirmed'].includes(o.orderStatus) && <button className="btn sm danger" onClick={() => window.confirm('Cancel this order?') && move(o, 'Cancelled')}>Cancel</button>}
                </div></div>
            </div>))}</div>
          <Pagination page={d.page} totalPages={d.totalPages} onChange={setPage} />
        </>)}
      </Async>
    </>
  );
}
