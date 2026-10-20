import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useFetch, useDebounce } from '../hooks/hooks.js';
import { Async, Pagination } from '../components/UI.jsx';
import RestaurantCard from '../components/RestaurantCard.jsx';
import { CUISINES } from '../utils/format.js';

export default function Restaurants() {
  const [sp] = useSearchParams();
  const [f, setF] = useState({ search: sp.get('search') || '', cuisine: '', minRating: '', maxDeliveryFee: '', maxDeliveryTime: '', isOpen: false, sort: 'rating', page: 1 });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v, page: k === 'page' ? v : 1 }));
  const search = useDebounce(f.search);
  const params = { ...f, search, limit: 9 };
  const q = useFetch(() => api('/restaurants', { params: { ...params, isOpen: f.isOpen ? 'true' : '' } }), [JSON.stringify(params)]);
  return (
    <>
      <h1 className="h1">Restaurants</h1>
      <div className="filters">
        <input placeholder="Search restaurants or dishes" value={f.search} onChange={(e) => set('search', e.target.value)} />
        <select value={f.cuisine} onChange={(e) => set('cuisine', e.target.value)}><option value="">All cuisines</option>{CUISINES.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={f.minRating} onChange={(e) => set('minRating', e.target.value)}><option value="">Any rating</option><option value="3">3.0+</option><option value="4">4.0+</option><option value="4.5">4.5+</option></select>
        <select value={f.maxDeliveryFee} onChange={(e) => set('maxDeliveryFee', e.target.value)}><option value="">Any delivery fee</option><option value="0">Free delivery</option><option value="30">Up to ₹30</option><option value="50">Up to ₹50</option></select>
        <select value={f.maxDeliveryTime} onChange={(e) => set('maxDeliveryTime', e.target.value)}><option value="">Any delivery time</option><option value="25">Under 25 min</option><option value="35">Under 35 min</option><option value="45">Under 45 min</option></select>
        <select value={f.sort} onChange={(e) => set('sort', e.target.value)}><option value="rating">Top rated</option><option value="fastest">Fastest delivery</option><option value="fee">Lowest delivery fee</option><option value="newest">Newest</option></select>
        <label className="check"><input type="checkbox" checked={f.isOpen} onChange={(e) => set('isOpen', e.target.checked)} /> Open now</label>
      </div>
      <Async q={q} empty={(d) => !d.data.length} emptyText="No restaurants found. Try removing a filter.">
        {(d) => (<>
          <p className="muted">{d.total} restaurants</p>
          <div className="grid rests">{d.data.map((r) => <RestaurantCard key={r._id} r={r} />)}</div>
          <Pagination page={d.page} totalPages={d.totalPages} onChange={(p) => set('page', p)} />
        </>)}
      </Async>
    </>
  );
}
