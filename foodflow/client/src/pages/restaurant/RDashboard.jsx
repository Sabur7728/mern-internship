import { api } from '../../services/api.js';
import { useFetch } from '../../hooks/hooks.js';
import { Async, Stat } from '../../components/UI.jsx';
import { inr } from '../../utils/format.js';
import { Link } from 'react-router-dom';

export default function RDashboard() {
  const q = useFetch(() => api('/dashboard/restaurant'));
  const toggle = async (r) => { await api(`/restaurants/${r._id}`, { method: 'PATCH', body: { isOpen: !r.isOpen } }); q.reload(); };
  return (
    <Async q={q}>
      {({ data: d }) => (<>
        <div className="row between">
          <h1 className="h1">{d.restaurant.name}</h1>
          <button className={'btn ' + (d.restaurant.isOpen ? 'danger' : 'mint')} onClick={() => toggle(d.restaurant)}>{d.restaurant.isOpen ? 'Close restaurant' : 'Open restaurant'}</button>
        </div>
        <p className="muted">Status: <b>{d.restaurant.isOpen ? 'Open for orders' : 'Closed'}</b>{!d.restaurant.isActive && ' · Deactivated by admin'}</p>
        <div className="stats">
          <Stat label="Today's orders" value={d.todayOrders} /><Stat label="Pending (new)" value={d.pending} tone="warn" />
          <Stat label="Preparing" value={d.preparing} /><Stat label="Completed" value={d.completed} tone="good" />
          <Stat label="Cancelled" value={d.cancelled} /><Stat label="Total sales" value={inr(d.totalSales)} tone="brand" />
          <Stat label="Avg order value" value={inr(d.avgOrderValue)} /><Stat label="All orders" value={d.totalOrders} />
        </div>
        <div className="panel"><h3>Top-selling items</h3>
          {!d.topFoods.length ? <p className="muted">No sales yet.</p> : d.topFoods.map((f) => <div key={f._id} className="row between"><span>{f.name}</span><span>{f.quantity} sold · {inr(f.revenue)}</span></div>)}
        </div>
        <Link className="btn" to="/restaurant/orders">Manage orders</Link>
      </>)}
    </Async>
  );
}
