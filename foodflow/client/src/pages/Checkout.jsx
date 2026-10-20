import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { inr, discountFor } from '../utils/format.js';

export default function Checkout() {
  const { user } = useAuth();
  const c = useCart();
  const nav = useNavigate();
  const [a, setA] = useState({ fullName: user?.name || '', phone: user?.phone || '', address: user?.address || '', city: '', state: 'Maharashtra', postalCode: '' });
  const [note, setNote] = useState('');
  const [pay, setPay] = useState('Cash on Delivery');
  const [coupon, setCoupon] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (!c.cartItems.length) return <div className="state"><p>Your cart is empty.</p><Link className="btn" to="/restaurants">Browse restaurants</Link></div>;
  const discount = discountFor(coupon, c.subtotal);
  const bind = (k) => ({ value: a[k], onChange: (e) => setA({ ...a, [k]: e.target.value }) });

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    if (!/^\d{10}$/.test(a.phone)) return setErr('Enter a valid 10-digit phone number');
    if (!/^\d{6}$/.test(a.postalCode)) return setErr('Enter a valid 6-digit postal code');
    setBusy(true);
    try {
      // prices are NOT sent - the backend reads them from the database
      const { data } = await api('/orders', { method: 'POST', body: {
        restaurant: c.restaurant._id, items: c.cartItems.map((i) => ({ foodItem: i._id, quantity: i.quantity })),
        deliveryAddress: a, paymentMethod: pay, customerNote: note, couponCode: coupon } });
      c.clearCart();
      nav(`/orders/${data._id}`);
    } catch (e2) { setErr(e2.message); } finally { setBusy(false); }
  };
  return (
    <>
      <h1 className="h1">Checkout</h1>
      <form className="two" onSubmit={submit}>
        <div className="panel">
          <h3>Delivery details</h3>
          <div className="form2">
            <label>Full name<input required {...bind('fullName')} /></label>
            <label>Phone<input required inputMode="numeric" maxLength={10} {...bind('phone')} /></label>
            <label className="full">Address<input required {...bind('address')} /></label>
            <label>City<input required {...bind('city')} /></label>
            <label>State<input required {...bind('state')} /></label>
            <label>Postal code<input required inputMode="numeric" maxLength={6} {...bind('postalCode')} /></label>
            <label className="full">Delivery instructions<textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></label>
          </div>
          <h3>Payment (simulated)</h3>
          <div className="radios">
            {['Cash on Delivery', 'Demo Card', 'Test Payment'].map((m) => <label key={m} className={pay === m ? 'on' : ''}><input type="radio" name="pay" checked={pay === m} onChange={() => setPay(m)} />{m}</label>)}
          </div>
        </div>
        <div className="panel summary">
          <h3>Order summary</h3>
          <p className="muted">{c.restaurant.name}</p>
          {c.cartItems.map((i) => <div key={i._id} className="row between"><span>{i.quantity} × {i.name}</span><span>{inr(i.price * i.quantity)}</span></div>)}
          <hr />
          <div className="row"><input placeholder="Coupon code (try FOOD10)" value={coupon} onChange={(e) => setCoupon(e.target.value)} /></div>
          <div className="row between"><span>Subtotal</span><span>{inr(c.subtotal)}</span></div>
          <div className="row between"><span>Delivery fee</span><span>{c.deliveryFee ? inr(c.deliveryFee) : 'Free'}</span></div>
          {discount > 0 && <div className="row between good"><span>Discount</span><span>−{inr(discount)}</span></div>}
          <div className="row between total"><span>Total</span><span>{inr(c.totalAmount - discount)}</span></div>
          <small className="muted">The final amount is calculated by our server from current menu prices.</small>
          {err && <div className="alert error">{err}</div>}
          <button className="btn block" disabled={busy}>{busy ? 'Placing order...' : 'Place order'}</button>
        </div>
      </form>
    </>
  );
}
