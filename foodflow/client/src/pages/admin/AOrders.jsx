import { useState } from 'react';
import { api } from '../../services/api.js';
import { useFetch } from '../../hooks/hooks.js';
import { Async, Pagination, StatusBadge } from '../../components/UI.jsx';
import { inr, dt, STEPS } from '../../utils/format.js';

export default function AOrders() {
  const [f, setF] = useState({ restaurant: '', orderStatus: '', paymentStatus: '', from: '', to: '', page: 1 });
  const rests = useFetch(() => api('/restaurants', { params: { includeInactive: 'true', limit: 100 } }));
  const q = useFetch(() => api('/orders/admin', { params: { ...f, limit: 10 } }), [JSON.stringify(f)]);
  const set = (k, v) => setF({ ...f, [k]: v, page: 1 });
  return (
    <>
      <h1 className="h1">All orders</h1>
      <div className="filters">
        <select value={f.restaurant} onChange={(e) => set('restaurant', e.target.value)}><option value="">All restaurants</option>{rests.data?.data.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}</select>
        <select value={f.orderStatus} onChange={(e) => set('orderStatus', e.target.value)}><option value="">Any order status</option>{[...STEPS, 'Cancelled'].map((s) => <option key={s}>{s}</option>)}</select>
        <select value={f.paymentStatus} onChange={(e) => set('paymentStatus', e.target.value)}><option value="">Any payment status</option><option>Pending</option><option>Paid</option><option>Refunded</option></select>
        <label className="check">From <input type="date" value={f.from} onChange={(e) => set('from', e.target.value)} /></label>
        <label className="check">To <input type="date" value={f.to} onChange={(e) => set('to', e.target.value)} /></label>
      </div>
      <Async q={q} empty={(d) => !d.data.length} emptyText="No orders match these filters.">
        {(d) => (<>
          <div className="tablewrap"><table>
            <thead><tr><th>Order</th><th>Customer</th><th>Restaurant</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>{d.data.map((o) => (
              <tr key={o._id}><td>#{o._id.slice(-6).toUpperCase()}</td><td>{o.customer?.name}</td><td>{o.restaurant?.name}</td><td>{inr(o.totalAmount)}</td><td>{o.paymentStatus}</td><td><StatusBadge status={o.orderStatus} /></td><td>{dt(o.createdAt)}</td></tr>))}</tbody>
          </table></div>
          <Pagination page={d.page} totalPages={d.totalPages} onChange={(p) => setF({ ...f, page: p })} />
        </>)}
      </Async>
    </>
  );
}
