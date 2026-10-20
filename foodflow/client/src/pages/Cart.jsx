import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { QuantitySelector } from '../components/Food.jsx';
import { inr, fallbackImg } from '../utils/format.js';
export default function Cart() {
  const c = useCart();
  if (!c.cartItems.length) return <div className="state"><p>Your cart is empty.</p><Link className="btn" to="/restaurants">Browse restaurants</Link></div>;
  const below = c.subtotal < c.restaurant.minimumOrder;
  return (
    <>
      <h1 className="h1">Your cart</h1>
      <p className="muted">Ordering from <Link to={`/restaurants/${c.restaurant._id}`}><b>{c.restaurant.name}</b></Link></p>
      <div className="two">
        <div className="panel">
          {c.cartItems.map((i) => (
            <div key={i._id} className="line">
              <img src={i.image} alt="" onError={fallbackImg} />
              <div className="grow"><b>{i.name}</b><div className="muted">{inr(i.price)} each</div></div>
              <QuantitySelector value={i.quantity} onMinus={() => c.decreaseQuantity(i._id)} onPlus={() => c.increaseQuantity(i._id)} />
              <b className="w80">{inr(i.price * i.quantity)}</b>
              <button className="link danger" onClick={() => c.removeItem(i._id)}>Remove</button>
            </div>
          ))}
          <button className="link" onClick={c.clearCart}>Clear cart</button>
        </div>
        <div className="panel summary">
          <h3>Summary</h3>
          <div className="row between"><span>Subtotal</span><span>{inr(c.subtotal)}</span></div>
          <div className="row between"><span>Delivery fee</span><span>{c.deliveryFee ? inr(c.deliveryFee) : 'Free'}</span></div>
          <div className="row between total"><span>Total</span><span>{inr(c.totalAmount)}</span></div>
          <small className="muted">Coupons are applied at checkout.</small>
          {below && <div className="alert warn">Add {inr(c.restaurant.minimumOrder - c.subtotal)} more to reach the minimum order of {inr(c.restaurant.minimumOrder)}.</div>}
          <Link className={'btn block' + (below ? ' disabled' : '')} to={below ? '#' : '/checkout'}>Proceed to checkout</Link>
        </div>
      </div>
    </>
  );
}
