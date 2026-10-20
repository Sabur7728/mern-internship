import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { CUISINES } from '../../utils/format.js';

const blank = { name: '', description: '', phone: '', email: '', address: '', city: '', state: 'Maharashtra', postalCode: '', cuisineTypes: [], image: '', deliveryFee: 0, minimumOrder: 0, estimatedDeliveryTime: 30, isOpen: true };
export default function RProfile() {
  const [f, setF] = useState(blank);
  const [id, setId] = useState(null);
  const [state, setState] = useState('loading');
  const [msg, setMsg] = useState('');
  useEffect(() => {
    api('/restaurants/mine').then((d) => { setF({ ...blank, ...d.data }); setId(d.data._id); setState('ready'); })
      .catch((e) => { setState(/not created/.test(e.message) ? 'new' : 'error'); if (!/not created/.test(e.message)) setMsg(e.message); });
  }, []);
  const bind = (k, num) => ({ value: f[k] ?? '', onChange: (e) => setF({ ...f, [k]: num ? Number(e.target.value) : e.target.value }) });
  const toggleC = (c) => setF({ ...f, cuisineTypes: f.cuisineTypes.includes(c) ? f.cuisineTypes.filter((x) => x !== c) : [...f.cuisineTypes, c] });
  const submit = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      const d = id ? await api(`/restaurants/${id}`, { method: 'PATCH', body: f }) : await api('/restaurants', { method: 'POST', body: f });
      setId(d.data._id); setState('ready'); setMsg('Saved successfully');
    } catch (x) { setMsg(x.message); }
  };
  if (state === 'loading') return <div className="state"><div className="spin" />Loading...</div>;
  if (state === 'error') return <div className="state error">{msg}</div>;
  return (
    <form className="panel" onSubmit={submit}>
      <h1 className="h1">{id ? 'Restaurant profile' : 'Create your restaurant'}</h1>
      <div className="form2">
        <label>Name<input required {...bind('name')} /></label>
        <label>Phone<input {...bind('phone')} /></label>
        <label className="full">Description<textarea rows={2} {...bind('description')} /></label>
        <label>Email<input type="email" {...bind('email')} /></label>
        <label>Image URL<input {...bind('image')} /></label>
        <label className="full">Address<input {...bind('address')} /></label>
        <label>City<input {...bind('city')} /></label>
        <label>State<input {...bind('state')} /></label>
        <label>Postal code<input {...bind('postalCode')} /></label>
        <label>Delivery fee (₹)<input type="number" min="0" {...bind('deliveryFee', true)} /></label>
        <label>Minimum order (₹)<input type="number" min="0" {...bind('minimumOrder', true)} /></label>
        <label>Delivery time (min)<input type="number" min="5" {...bind('estimatedDeliveryTime', true)} /></label>
      </div>
      <p><b>Cuisine types</b></p>
      <div className="chips">{CUISINES.map((c) => <button type="button" key={c} className={'chip' + (f.cuisineTypes.includes(c) ? ' on' : '')} onClick={() => toggleC(c)}>{c}</button>)}</div>
      <label className="check"><input type="checkbox" checked={f.isOpen} onChange={(e) => setF({ ...f, isOpen: e.target.checked })} /> Open for orders</label>
      {msg && <div className="alert">{msg}</div>}
      <button className="btn">Save restaurant</button>
    </form>
  );
}
