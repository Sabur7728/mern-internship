import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { Loading, ErrorMsg, Empty } from '../components/Status';
import { money, date } from '../utils/format';
export default function Orders() {
  const { data, loading, error, reload } = useFetch('/orders/my-orders');
  if (loading) return <Loading />; if (error) return <ErrorMsg message={error} retry={reload} />;
  if (!data.orders.length) return <Empty>No orders yet. <Link to="/products">Start shopping</Link></Empty>;
  return (
    <div><h1>My orders</h1><div className="scroll"><table>
      <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr></thead>
      <tbody>{data.orders.map((o) => <tr key={o._id}><td>{o._id.slice(-8)}</td><td>{date(o.createdAt)}</td><td>{o.items.length}</td><td>{money(o.totalAmount)}</td>
        <td>{o.paymentStatus}</td><td><span className="tag">{o.orderStatus}</span></td><td><Link to={`/orders/${o._id}`}>View order</Link></td></tr>)}</tbody></table></div></div>
  );
}
