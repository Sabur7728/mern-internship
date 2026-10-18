import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { Loading, ErrorMsg, Empty } from '../../components/Status';
import { date } from '../../utils/format';
export default function AdminCustomers() {
  const { data, loading, error, reload } = useFetch('/users');
  const [q, setQ] = useState('');
  if (loading) return <Loading />; if (error) return <ErrorMsg message={error} retry={reload} />;
  const list = data.users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div><h1>Customers</h1><input placeholder="Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} />
      {!list.length ? <Empty>No customers found.</Empty> :
        <div className="scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr></thead>
          <tbody>{list.map((u) => <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.phone || '—'}</td><td>{date(u.createdAt)}</td></tr>)}</tbody></table></div>}
    </div>
  );
}
