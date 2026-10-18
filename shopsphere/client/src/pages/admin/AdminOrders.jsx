import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { api } from '../../services/api';
import { Loading, ErrorMsg, Empty } from '../../components/Status';
import { money, date, STATUSES } from '../../utils/format';
export default function AdminOrders() {
  const [status, setStatus] = useState(''); const [search, setSearch] = useState(''); const [open, setOpen] = useState(null);
  const { data, loading, error, reload } = useFetch(`/orders?status=${status}&search=${encodeURIComponent(search)}`);
  const update = async (id, body) => { try { await api(`/orders/${id}/status`, { method: 'PATCH', body }); reload(); } catch (e) { alert(e.message); } };
  return (
    <div><h1>Orders</h1>
      <div className="row"><input placeholder="Search by order ID, name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
      {loading ? <Loading /> : error ? <ErrorMsg message={error} retry={reload} /> : !data.orders.length ? <Empty>No orders found.</Empty> :
        <div className="scroll"><table><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr></thead>
          <tbody>{data.orders.map((o) => <><tr key={o._id}><td>{o._id.slice(-8)}</td><td>{o.user?.name}<br /><span className="muted">{o.user?.email}</span></td><td>{date(o.createdAt)}</td><td>{money(o.totalAmount)}</td>
            <td><select value={o.paymentStatus} onChange={(e) => update(o._id, { paymentStatus: e.target.value })}>{['Pending', 'Paid', 'Failed'].map((s) => <option key={s}>{s}</option>)}</select></td>
            <td><select value={o.orderStatus} onChange={(e) => update(o._id, { orderStatus: e.target.value })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
            <td><button className="btn ghost" onClick={() => setOpen(open === o._id ? null : o._id)}>{open === o._id ? 'Hide' : 'Details'}</button></td></tr>
            {open === o._id && <tr key={o._id + 'd'}><td colSpan="7"><p className="muted">Ship to {o.shippingAddress.fullName}, {o.shippingAddress.address}, {o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.postalCode} · {o.shippingAddress.phone}</p>
              {o.items.map((i) => <p key={i.product}>{i.productName} × {i.quantity} — {money(i.price * i.quantity)}</p>)}</td></tr>}</>)}</tbody></table></div>}
    </div>
  );
}
