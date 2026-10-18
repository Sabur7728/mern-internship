import { useState } from 'react';

const blank = { name: '', description: '', price: '', discountPrice: '', category: '', brand: '', image: '', stock: '', rating: '', isActive: true };
const URL_RE = /^https?:\/\/\S+$/;

// Frontend validation (backend validates again - this is only for fast feedback)
export function validateProduct(f) {
  const price = Number(f.price), stock = Number(f.stock);
  if (f.name.trim().length < 2) return 'Product name is required (at least 2 characters)';
  if (f.price === '' || !Number.isFinite(price) || price <= 0) return 'Enter a valid price greater than 0';
  if (f.discountPrice !== '' && f.discountPrice != null) {
    const d = Number(f.discountPrice);
    if (!Number.isFinite(d) || d < 0 || d > price) return 'Discount price must be between 0 and the price';
  }
  if (!f.category) return 'Select a category';
  if (f.stock === '' || !Number.isInteger(stock) || stock < 0) return 'Stock must be a whole number, 0 or more';
  if (f.rating !== '' && f.rating != null && !(Number(f.rating) >= 0 && Number(f.rating) <= 5)) return 'Rating must be between 0 and 5';
  if (f.image && !URL_RE.test(f.image.trim())) return 'Image must be a valid http(s) URL';
  return '';
}

// Reusable for both "Add product" and "Edit product".
export default function ProductForm({ initial, categories = [], onSave, onCancel }) {
  const [form, setForm] = useState({ ...blank, ...initial, discountPrice: initial?.discountPrice ?? '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const bind = (k, type = 'text') => ({ type, value: form[k] ?? '', onChange: (e) => setForm({ ...form, [k]: e.target.value }) });
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    const problem = validateProduct(form);
    if (problem) return setErr(problem);
    setBusy(true);
    try {
      await onSave({ ...form, name: form.name.trim(), price: +form.price, stock: +form.stock, rating: +form.rating || 0, discountPrice: form.discountPrice === '' ? null : +form.discountPrice });
    } catch (e) { setErr(e.message); setBusy(false); }
  };
  return (
    <form className="form wide" onSubmit={submit}><h2>{form._id ? 'Edit' : 'New'} product</h2>
      <input placeholder="Product name" {...bind('name')} /><textarea placeholder="Description" {...bind('description')} />
      <div className="row"><input placeholder="Price" min="0" {...bind('price', 'number')} /><input placeholder="Discount price (optional)" min="0" {...bind('discountPrice', 'number')} /></div>
      <select {...bind('category')}><option value="">Select category</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
      <input placeholder="Brand" {...bind('brand')} /><input placeholder="Image URL" {...bind('image')} />
      <div className="row"><input placeholder="Stock" min="0" step="1" {...bind('stock', 'number')} /><input placeholder="Rating (0-5)" min="0" max="5" step="0.1" {...bind('rating', 'number')} /></div>
      <label><input type="checkbox" checked={!!form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active (visible to customers)</label>
      {err && <p className="bad">{err}</p>}
      <div className="row"><button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save product'}</button><button type="button" className="btn ghost" onClick={onCancel}>Cancel</button></div>
    </form>
  );
}
