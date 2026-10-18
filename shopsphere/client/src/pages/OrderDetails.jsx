import { useParams, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../services/api';
import useFetch from '../hooks/useFetch';
import { Loading, ErrorMsg } from '../components/Status';
import { money, date } from '../utils/format';
export default function OrderDetails() {
  const { id } = useParams(); const { state } = useLocation();
  const { data, loading, error, reload } = useFetch(`/orders/${id}`);
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  if (loading) return <Loading />; if (error) return <ErrorMsg message={error} retry={reload} />;
  const o = data.order, a = o.shippingAddress;
  const FLOW = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const step = FLOW.indexOf(o.orderStatus);
  const canCancel = ['Pending', 'Confirmed'].includes(o.orderStatus);
  const cancel = async () => {
    if (!confirm('Cancel this order?')) return;
    setBusy(true); setErr('');
    try { await api(`/orders/${o._id}/cancel`, { method: 'PATCH' }); reload(); } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="narrow">{state?.placed && <p className="good">Order confirmed. Thank you!</p>}
      <h1>Order {o._id.slice(-8)}</h1>
      <p>Placed {date(o.createdAt)} · <span className="tag">{o.orderStatus}</span> · Payment: {o.paymentMethod} ({o.paymentStatus})</p>
      {o.orderStatus === 'Cancelled' ? <p className="bad">This order was cancelled.</p> :
        <ol className="tracker">{FLOW.map((s, i) => <li key={s} className={i <= step ? 'done' : ''}>{s}</li>)}</ol>}
      {canCancel && <button className="btn ghost" disabled={busy} onClick={cancel}>{busy ? 'Cancelling…' : 'Cancel order'}</button>}
      {err && <p className="bad">{err}</p>}
      <p className="muted">Ship to {a.fullName}, {a.address}, {a.city}, {a.state} {a.postalCode} · {a.phone}</p>
      <div className="scroll"><table><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
        <tbody>{o.items.map((i) => <tr key={i.product}><td>{i.productName}</td><td>{i.quantity}</td><td>{money(i.price)}</td><td>{money(i.price * i.quantity)}</td></tr>)}</tbody></table></div>
      <div className="summary"><p>Subtotal <b>{money(o.subtotal)}</b></p><p>Shipping <b>{o.shippingFee ? money(o.shippingFee) : 'Free'}</b></p><p>Total <b>{money(o.totalAmount)}</b></p></div>
    </div>
  );
}
