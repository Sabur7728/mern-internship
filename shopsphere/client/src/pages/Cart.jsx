import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Empty } from '../components/Status';
import { money } from '../utils/format';
export default function Cart() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, calculateTotals } = useCart();
  const nav = useNavigate(); const t = calculateTotals();
  if (!cartItems.length) return <Empty>Your cart is empty. <Link to="/products">Continue shopping</Link></Empty>;
  return (
    <div className="narrow"><h1>Your cart</h1>
      {cartItems.map((i) => (
        <div className="line" key={i._id}>
          <img src={i.image} alt="" /><div className="grow"><Link to={`/products/${i._id}`}>{i.name}</Link><p className="muted">{money(i.price)}</p></div>
          <div className="row"><button className="btn ghost" onClick={() => decreaseQuantity(i._id)}>−</button><span>{i.quantity}</span>
            <button className="btn ghost" disabled={i.quantity >= i.stock} onClick={() => increaseQuantity(i._id)}>+</button></div>
          <b>{money(i.price * i.quantity)}</b><button className="btn ghost" onClick={() => removeFromCart(i._id)}>Remove</button>
        </div>))}
      <div className="summary"><p>Subtotal <b>{money(t.subtotal)}</b></p><p>Shipping <b>{t.shipping ? money(t.shipping) : 'Free'}</b></p><p>Total <b>{money(t.total)}</b></p>
        <div className="row"><Link className="btn ghost" to="/products">Continue shopping</Link><button className="btn" onClick={() => nav('/checkout')}>Proceed to checkout</button></div></div>
    </div>
  );
}
