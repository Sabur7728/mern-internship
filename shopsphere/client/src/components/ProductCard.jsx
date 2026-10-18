import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import WishlistButton from './WishlistButton';
import { money } from '../utils/format';
export default function ProductCard({ product: p }) {
  const { addToCart } = useCart();
  const out = p.stock < 1;
  return (
    <article className="card">
      <Link to={`/products/${p._id}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
      <div className="card-body">
        <h3>{p.name}</h3>
        <p className="muted">{p.brand} · {p.category?.name}</p>
        <p className="price">
          {p.discountPrice != null ? <><b>{money(p.discountPrice)}</b> <s>{money(p.price)}</s></> : <b>{money(p.price)}</b>}
        </p>
        <p className="muted">★ {p.rating?.toFixed(1)} · <span className={out ? 'bad' : p.stock <= 5 ? 'warn' : 'good'}>{out ? 'Out of stock' : p.stock <= 5 ? `Only ${p.stock} left` : 'In stock'}</span></p>
        <div className="row">
          <Link className="btn ghost" to={`/products/${p._id}`}>View details</Link>
          <button className="btn" disabled={out} onClick={() => addToCart(p)}>Add to cart</button><WishlistButton id={p._id} />
        </div>
      </div>
    </article>
  );
}
