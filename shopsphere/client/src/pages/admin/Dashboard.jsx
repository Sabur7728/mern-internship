import useFetch from '../../hooks/useFetch';
import { Loading, ErrorMsg } from '../../components/Status';
import { money } from '../../utils/format';
export default function Dashboard() {
  const { data: d, loading, error, reload } = useFetch('/admin/stats');
  if (loading) return <Loading />; if (error) return <ErrorMsg message={error} retry={reload} />;
  const tiles = [['Total products', d.totalProducts], ['Total customers', d.totalCustomers], ['Total orders', d.totalOrders], ['Total sales', money(d.totalSales)], ['Pending orders', d.pendingOrders], ['Low-stock products', d.lowStockProducts.length]];
  return (
    <div><h1>Dashboard</h1><div className="tiles">{tiles.map(([k, v]) => <div className="tile" key={k}><span className="muted">{k}</span><b>{v}</b></div>)}</div>
      <h2>Low stock (5 or fewer)</h2>{d.lowStockProducts.length ? <ul>{d.lowStockProducts.map((p) => <li key={p._id}>{p.name} — {p.stock} left</li>)}</ul> : <p className="muted">All products are well stocked.</p>}
    </div>
  );
}
