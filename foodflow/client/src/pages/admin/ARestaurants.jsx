import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useFetch, useDebounce } from '../../hooks/hooks.js';
import { Async, Pagination } from '../../components/UI.jsx';
import { CUISINES } from '../../utils/format.js';

export default function ARestaurants() {
  const [f, setF] = useState({ search: '', cuisine: '', page: 1 });
  const search = useDebounce(f.search);
  const [msg, setMsg] = useState('');
  const q = useFetch(() => api('/restaurants', { params: { includeInactive: 'true', search, cuisine: f.cuisine, page: f.page, limit: 10, sort: 'newest' } }), [search, f.cuisine, f.page]);
  const toggle = async (r) => { setMsg(''); try { await api(`/restaurants/${r._id}`, { method: 'PATCH', body: { isActive: !r.isActive } }); q.reload(); } catch (e) { setMsg(e.message); } };
  return (
    <>
      <h1 className="h1">Restaurants</h1>
      <div className="filters">
        <input placeholder="Search restaurants" value={f.search} onChange={(e) => setF({ ...f, search: e.target.value, page: 1 })} />
        <select value={f.cuisine} onChange={(e) => setF({ ...f, cuisine: e.target.value, page: 1 })}><option value="">All cuisines</option>{CUISINES.map((c) => <option key={c}>{c}</option>)}</select>
      </div>
      {msg && <div className="alert error">{msg}</div>}
      <Async q={q} empty={(d) => !d.data.length} emptyText="No restaurants match.">
        {(d) => (<>
          <div className="tablewrap"><table>
            <thead><tr><th>Name</th><th>Cuisine</th><th>City</th><th>Rating</th><th>Open</th><th>Status</th><th></th></tr></thead>
            <tbody>{d.data.map((r) => (
              <tr key={r._id}><td><Link to={`/restaurants/${r._id}`}><b>{r.name}</b></Link></td><td>{r.cuisineTypes.join(', ')}</td><td>{r.city}</td><td>★ {r.rating}</td><td>{r.isOpen ? 'Yes' : 'No'}</td>
                <td><span className={'pill ' + (r.isActive ? 'open' : 'shut')}>{r.isActive ? 'Active' : 'Inactive'}</span></td>
                <td><button className={'btn sm ' + (r.isActive ? 'danger' : 'mint')} onClick={() => toggle(r)}>{r.isActive ? 'Deactivate' : 'Activate'}</button></td></tr>))}</tbody>
          </table></div>
          <Pagination page={d.page} totalPages={d.totalPages} onChange={(p) => setF({ ...f, page: p })} />
        </>)}
      </Async>
    </>
  );
}
