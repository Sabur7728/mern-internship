import { useState } from 'react';
import { api } from '../../services/api.js';
import { useFetch } from '../../hooks/hooks.js';
import { Async } from '../../components/UI.jsx';
import { inr } from '../../utils/format.js';

const blank = { name: '', description: '', price: '', category: '', image: '', isVegetarian: true, isVegan: false, spiceLevel: 0, preparationTime: 15, isAvailable: true };
export default function RMenu() {
  const mine = useFetch(() => api('/restaurants/mine'));
  const cats = useFetch(() => api('/categories'));
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');
  const foods = useFetch(() => (mine.data ? api('/foods', { params: { restaurant: mine.data.data._id, limit: 100 } }) : Promise.resolve({ data: [] })), [mine.data]);

  const save = async (e) => {
    e.preventDefault(); setMsg('');
    const body = { ...form, price: Number(form.price), spiceLevel: Number(form.spiceLevel), preparationTime: Number(form.preparationTime) };
    try {
      if (form._id) await api(`/foods/${form._id}`, { method: 'PATCH', body }); else await api('/foods', { method: 'POST', body });
      setForm(null); foods.reload();
    } catch (x) { setMsg(x.message); }
  };
  const patch = async (f, body) => { try { await api(`/foods/${f._id}`, { method: 'PATCH', body }); foods.reload(); } catch (x) { setMsg(x.message); } };
  const del = async (f) => { if (window.confirm(`Delete ${f.name}?`)) { try { await api(`/foods/${f._id}`, { method: 'DELETE' }); foods.reload(); } catch (x) { setMsg(x.message); } } };
  const set = (k, v) => setForm({ ...form, [k]: v });

  return (
    <Async q={mine}>
      {() => (<>
        <div className="row between"><h1 className="h1">Menu</h1><button className="btn" onClick={() => setForm({ ...blank, category: cats.data?.data[0]?._id || '' })}>Add food item</button></div>
        {msg && <div className="alert error">{msg}</div>}
        {form && (
          <form className="panel" onSubmit={save}>
            <h3>{form._id ? 'Edit food item' : 'New food item'}</h3>
            <div className="form2">
              <label>Name<input required value={form.name} onChange={(e) => set('name', e.target.value)} /></label>
              <label>Price (₹)<input required type="number" min="1" value={form.price} onChange={(e) => set('price', e.target.value)} /></label>
              <label className="full">Description<input value={form.description || ''} onChange={(e) => set('description', e.target.value)} /></label>
              <label>Category<select required value={form.category?._id || form.category} onChange={(e) => set('category', e.target.value)}>{cats.data?.data.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></label>
              <label>Image URL<input value={form.image || ''} onChange={(e) => set('image', e.target.value)} /></label>
              <label>Spice level (0-3)<input type="number" min="0" max="3" value={form.spiceLevel} onChange={(e) => set('spiceLevel', e.target.value)} /></label>
              <label>Preparation time (min)<input type="number" min="1" value={form.preparationTime} onChange={(e) => set('preparationTime', e.target.value)} /></label>
            </div>
            <div className="row gap">
              <label className="check"><input type="checkbox" checked={form.isVegetarian} onChange={(e) => set('isVegetarian', e.target.checked)} /> Vegetarian</label>
              <label className="check"><input type="checkbox" checked={form.isVegan} onChange={(e) => set('isVegan', e.target.checked)} /> Vegan</label>
              <label className="check"><input type="checkbox" checked={form.isAvailable} onChange={(e) => set('isAvailable', e.target.checked)} /> Available</label>
            </div>
            <div className="row gap"><button className="btn">Save item</button><button type="button" className="btn ghost" onClick={() => setForm(null)}>Cancel</button></div>
          </form>
        )}
        <Async q={foods} empty={(d) => !d.data.length} emptyText="No items yet. Add your first dish.">
          {(d) => (
            <div className="tablewrap"><table>
              <thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Available</th><th></th></tr></thead>
              <tbody>{d.data.map((f) => (
                <tr key={f._id}>
                  <td><b>{f.name}</b></td><td>{f.category?.name}</td>
                  <td><input className="mini" type="number" defaultValue={f.price} onBlur={(e) => Number(e.target.value) !== f.price && patch(f, { price: Number(e.target.value) })} /></td>
                  <td><label className="check"><input type="checkbox" checked={f.isAvailable} onChange={(e) => patch(f, { isAvailable: e.target.checked })} />{f.isAvailable ? 'Yes' : 'No'}</label></td>
                  <td className="actions"><button className="btn sm ghost" onClick={() => setForm(f)}>Edit</button><button className="btn sm danger" onClick={() => del(f)}>Delete</button></td>
                </tr>))}</tbody>
            </table></div>
          )}
        </Async>
      </>)}
    </Async>
  );
}
