import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Loading, ErrorMsg, Empty } from '../components/Status';
export default function Products() {
  const [sp, setSp] = useSearchParams();
  const f = { search: sp.get('search') || '', category: sp.get('category') || '', brand: sp.get('brand') || '', minRating: sp.get('minRating') || '', onDiscount: sp.get('onDiscount') || '', minPrice: sp.get('minPrice') || '', maxPrice: sp.get('maxPrice') || '', inStock: sp.get('inStock') || '', sort: sp.get('sort') || 'newest', page: sp.get('page') || '1' };
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); if (k !== 'page') n.delete('page'); setSp(n); };
  const [q, setQ] = useState(f.search);
  useEffect(() => setQ(f.search), [f.search]);
  useEffect(() => { if (q === f.search) return; const t = setTimeout(() => set('search', q), 350); return () => clearTimeout(t); }, [q]);
  const cats = useFetch('/categories');
  const brands = useFetch('/products/brands');
  const [state, setState] = useState({ loading: true, error: '', data: null });
  const key = JSON.stringify(f);
  const load = () => { setState((s) => ({ ...s, loading: true, error: '' }));
    productService.list({ ...f, limit: 12 }).then((data) => setState({ loading: false, error: '', data })).catch((e) => setState({ loading: false, error: e.message, data: null })); };
  useEffect(load, [key]);
  const { loading, error, data } = state;
  return (
    <div className="listing">
      <aside className="filters">
        <input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={f.category} onChange={(e) => set('category', e.target.value)}>
          <option value="">All categories</option>{cats.data?.categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select value={f.brand} onChange={(e) => set('brand', e.target.value)}>
          <option value="">All brands</option>{brands.data?.brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={f.minRating} onChange={(e) => set('minRating', e.target.value)}>
          <option value="">Any rating</option><option value="4">4★ & up</option><option value="3">3★ & up</option><option value="2">2★ & up</option>
        </select>
        <div className="row"><input type="number" min="0" placeholder="Min ₹" value={f.minPrice} onChange={(e) => set('minPrice', e.target.value)} />
          <input type="number" min="0" placeholder="Max ₹" value={f.maxPrice} onChange={(e) => set('maxPrice', e.target.value)} /></div>
        <label><input type="checkbox" checked={f.onDiscount === 'true'} onChange={(e) => set('onDiscount', e.target.checked ? 'true' : '')} /> On discount only</label>
        <label><input type="checkbox" checked={f.inStock === 'true'} onChange={(e) => set('inStock', e.target.checked ? 'true' : '')} /> In stock only</label>
        <select value={f.sort} onChange={(e) => set('sort', e.target.value)}>
          <option value="newest">Newest</option><option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option><option value="name_asc">Name: A to Z</option>
        </select>
        <button className="btn ghost" onClick={() => setSp({})}>Clear filters</button>
      </aside>
      <div>
        {loading ? <Loading /> : error ? <ErrorMsg message={error} retry={load} /> : !data.products.length ? <Empty>No matching products. Try changing your filters.</Empty> : <>
          <p className="muted">{data.total} products</p>
          <div className="grid">{data.products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
          <div className="row center">
            <button className="btn ghost" disabled={data.page <= 1} onClick={() => set('page', data.page - 1)}>Previous</button>
            <span>Page {data.page} of {data.pages}</span>
            <button className="btn ghost" disabled={data.page >= data.pages} onClick={() => set('page', data.page + 1)}>Next</button>
          </div></>}
      </div>
    </div>
  );
}
