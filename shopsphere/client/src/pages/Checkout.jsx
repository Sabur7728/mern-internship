import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Empty } from '../components/Status';
import { money } from '../utils/format';
export default function Checkout() {
  const { user } = useAuth(); const { cartItems, clearCart, calculateTotals } = useCart(); const nav = useNavigate();
  const [f, setF] = useState({ fullName: user.name, phone: user.phone || '', address: '', city: '', state: '', postalCode: '' });
  const [pay, setPay] = useState('Cash on Delivery'); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const t = calculateTotals();
  if (!cartItems.length) return <Empty>Your cart is empty. <Link to="/products">Browse products</Link></Empty>;
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    if (Object.values(f).some((v) => !v.trim())) return setErr('Please fill in all shipping fields');
    if (!/^[0-9+\-\s]{10,15}$/.test(f.phone)) return setErr('Enter a valid phone number');
    if (!/^[0-9]{6}$/.test(f.postalCode)) return setErr('Postal code must be 6 digits');
    setBusy(true);
    try {
      const { order } = await api('/orders', { method: 'POST', body: { items: cartItems.map((i) => ({ product: i._id, quantity: i.quantity })), shippingAddress: f, paymentMethod: pay } });
      clearCart(); nav(`/orders/${order._id}`, { state: { placed: true } });
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };
  const bind = (k, ph) => <input placeholder={ph} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />;
  return (
    <div className="checkout">
      <form className="form" onSubmit={submit}><h1>Shipping</h1>
        {bind('fullName', 'Full name')}{bind('phone', 'Phone')}{bind('address', 'Address')}{bind('city', 'City')}{bind('state', 'State')}{bind('postalCode', 'Postal code')}
        <select value={pay} onChange={(e) => setPay(e.target.value)}><option>Cash on Delivery</option><option>Demo Card Payment</option><option>Test Payment</option></select>
        {err && <p className="bad">{err}</p>}<button className="btn" disabled={busy}>{busy ? 'Placing order…' : 'Confirm order'}</button></form>
      <div className="summary"><h2>Order summary</h2>
        {cartItems.map((i) => <p key={i._id}><span>{i.name}<br /><span className="muted">{money(i.price)} × {i.quantity}</span></span> <b>{money(i.price * i.quantity)}</b></p>)}
        <hr /><p>Subtotal <b>{money(t.subtotal)}</b></p><p>Shipping <b>{t.shipping ? money(t.shipping) : 'Free'}</b></p><p>Total <b>{money(t.total)}</b></p>
        <p className="muted">Final total is confirmed by the server.</p></div>
    </div>
  );
}
