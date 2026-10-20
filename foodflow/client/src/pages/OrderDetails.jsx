import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useFetch } from '../hooks/hooks.js';
import { Async, OrderProgress, StatusBadge } from '../components/UI.jsx';
import { inr, dt } from '../utils/format.js';

export default function OrderDetails() {
  const { id } = useParams();
  const q = useFetch(() => api(`/orders/${id}`), [id]);
  const [msg, setMsg] = useState('');
  const [rv, setRv] = useState({ rating: 5, comment: '' });
  const act = async (fn) => { setMsg(''); try { await fn(); q.reload(); } catch (e) { setMsg(e.message); } };
  return (
    <Async q={q}>
      {({ data: o }) => (<>
        <div className="row between"><h1 className="h1">Order #{o._id.slice(-6).toUpperCase()}</h1><button className="btn sm ghost" onClick={q.reload}>Refresh status</button></div>
        <div className="panel"><OrderProgress status={o.orderStatus} /></div>
        {msg && <div className="alert error">{msg}</div>}
        <div className="two">
          <div className="panel">
            <h3>{o.restaurant?.name}</h3>
            {o.items.map((i, k) => <div key={k} className="row between"><span>{i.quantity} × {i.name} <small className="muted">({inr(i.price)})</small></span><span>{inr(i.price * i.quantity)}</span></div>)}
            <hr />
            <div className="row between"><span>Subtotal</span><span>{inr(o.subtotal)}</span></div>
            <div className="row between"><span>Delivery fee</span><span>{inr(o.deliveryFee)}</span></div>
            <div className="row between"><span>Discount</span><span>−{inr(o.discount)}</span></div>
            <div className="row between total"><span>Total</span><span>{inr(o.totalAmount)}</span></div>
          </div>
          <div className="panel">
            <h3>Details</h3>
            <p><b>Status:</b> <StatusBadge status={o.orderStatus} /></p>
            <p><b>Payment:</b> {o.paymentMethod} ({o.paymentStatus})</p>
            <p><b>Ordered:</b> {dt(o.createdAt)}</p>
            <p><b>Deliver to:</b> {o.deliveryAddress.fullName}, {o.deliveryAddress.address}, {o.deliveryAddress.city}, {o.deliveryAddress.state} {o.deliveryAddress.postalCode}</p>
            {o.customerNote && <p><b>Note:</b> {o.customerNote}</p>}
            {['Placed', 'Confirmed'].includes(o.orderStatus) && <button className="btn danger" onClick={() => window.confirm('Cancel this order?') && act(() => api(`/orders/${o._id}/cancel`, { method: 'PATCH' }))}>Cancel order</button>}
          </div>
        </div>
        {o.orderStatus === 'Delivered' && (
          <div className="panel">
            <h3>Rate this order</h3>
            <div className="row gap">
              <select value={rv.rating} onChange={(e) => setRv({ ...rv, rating: +e.target.value })}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 && 's'}</option>)}</select>
              <input className="grow" placeholder="How was the food?" value={rv.comment} onChange={(e) => setRv({ ...rv, comment: e.target.value })} />
              <button className="btn" onClick={() => act(async () => { await api('/reviews', { method: 'POST', body: { order: o._id, ...rv } }); setMsg(''); alert('Thanks for your review!'); })}>Submit review</button>
            </div>
          </div>
        )}
      </>)}
    </Async>
  );
}
