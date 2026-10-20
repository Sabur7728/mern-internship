import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useFetch } from '../hooks/hooks.js';
import { useCart } from '../context/CartContext.jsx';
import { Async, Pagination, StatusBadge } from '../components/UI.jsx';
import { inr, dt } from '../utils/format.js';

export default function Orders() {
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState('');
  const { loadCart } = useCart();
  const nav = useNavigate();
  const q = useFetch(() => api('/orders/my', { params: { page, limit: 8 } }), [page]);

  // Reorder: re-validate restaurant + items and use CURRENT prices
  const reorder = async (o) => {
    setMsg('');
    try {
      const { data: rest } = await api(`/restaurants/${o.restaurant._id}`);
      if (!rest.isActive || !rest.isOpen) return setMsg(`${rest.name} is not accepting orders right now.`);
      const { data: foods } = await api('/foods', { params: { restaurant: rest._id, limit: 100 } });
      const rows = [], skipped = [];
      o.items.forEach((it) => {
        const f = foods.find((x) => x._id === String(it.foodItem));
        if (f && f.isAvailable) rows.push({ food: f, quantity: it.quantity }); else skipped.push(it.name);
      });
      if (!rows.length) return setMsg('None of these items are available any more.');
      loadCart(rest, rows);
      if (skipped.length) alert(`Skipped (unavailable): ${skipped.join(', ')}`);
      nav('/cart');
    } catch (e) { setMsg(e.message); }
  };
  return (
    <>
      <h1 className="h1">My orders</h1>
      {msg && <div className="alert error">{msg}</div>}
      <Async q={q} empty={(d) => !d.data.length} emptyText="You have not placed any orders yet.">
        {(d) => (<>
          <div className="list">
            {d.data.map((o) => (
              <div key={o._id} className="panel order-row">
                <div className="grow">
                  <b>{o.restaurant?.name}</b> <StatusBadge status={o.orderStatus} />
                  <div className="muted">{dt(o.createdAt)} · {o.items.length} item(s) · Payment: {o.paymentStatus}</div>
                </div>
                <b>{inr(o.totalAmount)}</b>
                <Link className="btn sm ghost" to={`/orders/${o._id}`}>View details</Link>
                <button className="btn sm" onClick={() => reorder(o)}>Reorder</button>
              </div>
            ))}
          </div>
          <Pagination page={d.page} totalPages={d.totalPages} onChange={setPage} />
        </>)}
      </Async>
    </>
  );
}
