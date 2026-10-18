import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { productService } from '../../services/api';
import { Loading, ErrorMsg, Empty } from '../../components/Status';
import ProductForm from '../../components/ProductForm';
import { money } from '../../utils/format';
export default function AdminProducts() {
  const [search, setSearch] = useState(''); const [cat, setCat] = useState('');
  const { data, loading, error, reload } = useFetch(`/products?includeInactive=true&limit=100&search=${encodeURIComponent(search)}&category=${cat}`);
  const cats = useFetch('/categories');
  const [form, setForm] = useState(null);
  const save = async (body) => { form._id ? await productService.update(form._id, body) : await productService.create(body); setForm(null); reload(); };
  const del = async (p) => { if (confirm(`Delete ${p.name}?`)) { try { await productService.remove(p._id); reload(); } catch (e) { alert(e.message); } } };
  const quick = async (p, k, v) => { if (v === '' || +v < 0 || +v === p[k]) return; try { await productService.update(p._id, { [k]: +v }); reload(); } catch (e) { alert(e.message); reload(); } };
  const toggle = async (p) => { await productService.update(p._id, { isActive: !p.isActive }); reload(); };
  return (
    <div><div className="row"><h1 className="grow">Products</h1><button className="btn" onClick={() => setForm({})}>Add product</button></div>
      {form && <ProductForm key={form._id || 'new'} initial={form} categories={cats.data?.categories} onSave={save} onCancel={() => setForm(null)} />}
      <div className="row"><input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{cats.data?.categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
      {loading ? <Loading /> : error ? <ErrorMsg message={error} retry={reload} /> : !data.products.length ? <Empty>No products found.</Empty> :
        <div className="scroll"><table><thead><tr><th>Name</th><th>Category</th><th>Price (₹)</th><th>Stock</th><th>Active</th><th></th></tr></thead>
          <tbody>{data.products.map((p) => <tr key={p._id}><td>{p.name}</td><td>{p.category?.name}</td><td><input className="qty" type="number" min="0" defaultValue={p.price} key={p._id + 'p' + p.price} aria-label="Price" onBlur={(e) => quick(p, 'price', e.target.value)} onKeyDown={(e) => e.key === 'Enter' && e.target.blur()} />{p.discountPrice != null && <span className="muted"> sale {money(p.discountPrice)}</span>}</td>
            <td><input className="qty" type="number" min="0" defaultValue={p.stock} key={p._id + p.stock} aria-label="Stock" onBlur={(e) => quick(p, 'stock', e.target.value)} onKeyDown={(e) => e.key === 'Enter' && e.target.blur()} />{p.stock <= 5 && <span className="warn"> low</span>}</td>
            <td><input type="checkbox" checked={p.isActive} onChange={() => toggle(p)} /></td>
            <td className="row"><button className="btn ghost" onClick={() => { setForm({ ...p, category: p.category?._id }); window.scrollTo(0, 0); }}>Edit</button>
              <button className="btn ghost" onClick={() => del(p)}>Delete</button></td></tr>)}</tbody></table></div>}
    </div>
  );
}
