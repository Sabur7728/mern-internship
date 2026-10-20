import { api } from '../../services/api.js';
import { useFetch } from '../../hooks/hooks.js';
import { Async, Stat } from '../../components/UI.jsx';
import { inr } from '../../utils/format.js';

function Bars({ rows, label, value, fmt = (v) => v }) {
  const max = Math.max(1, ...rows.map(value));
  return <div className="bars">{rows.map((r, i) => <div key={i} className="bar"><span>{label(r)}</span><div><i style={{ width: (value(r) / max) * 100 + '%' }} /></div><b>{fmt(value(r))}</b></div>)}</div>;
}
export default function ADashboard() {
  const q = useFetch(() => api('/dashboard/admin'));
  return (
    <Async q={q}>
      {({ data: d }) => (<>
        <h1 className="h1">Platform overview</h1>
        <div className="stats">
          <Stat label="Customers" value={d.customers} /><Stat label="Restaurants" value={d.restaurants} /><Stat label="Active restaurants" value={d.activeRestaurants} />
          <Stat label="Food items" value={d.foods} /><Stat label="Total orders" value={d.orders} /><Stat label="Today's orders" value={d.todayOrders} />
          <Stat label="Pending orders" value={d.pending} tone="warn" /><Stat label="Cancelled" value={d.cancelled} /><Stat label="Total sales" value={inr(d.totalSales)} tone="brand" />
          <Stat label="Avg order value" value={inr(d.avgOrderValue)} />
        </div>
        <div className="two">
          <div className="panel"><h3>Orders in the last 14 days</h3>{d.daily.length ? <Bars rows={d.daily} label={(r) => r._id.slice(5)} value={(r) => r.orders} /> : <p className="muted">No data.</p>}</div>
          <div className="panel"><h3>Order status</h3><Bars rows={d.statusDistribution} label={(r) => r._id} value={(r) => r.count} /></div>
          <div className="panel"><h3>Top restaurants by sales</h3>{d.topRestaurants.map((r) => <div key={r._id} className="row between"><span>{r.name}</span><span>{inr(r.sales)} · {r.orders} orders</span></div>)}</div>
          <div className="panel"><h3>Top food items</h3>{d.topFoods.map((f) => <div key={f._id} className="row between"><span>{f.name}</span><span>{f.quantity} sold</span></div>)}</div>
          <div className="panel"><h3>Customer growth</h3><Bars rows={d.customerGrowth} label={(r) => r._id} value={(r) => r.count} /></div>
        </div>
      </>)}
    </Async>
  );
}
