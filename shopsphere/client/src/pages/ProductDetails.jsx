import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useCart } from '../context/CartContext';
import { Loading, ErrorMsg } from '../components/Status';
import WishlistButton from '../components/WishlistButton';
import RecentlyViewed from '../components/RecentlyViewed';
import { pushRecent } from '../utils/recent';
import { money } from '../utils/format';
export default function ProductDetails() {
  const { id } = useParams();
  const { data, loading, error, reload } = useFetch(`/products/${id}`);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');
  useEffect(() => { if (data?.product) pushRecent(data.product._id); }, [data]);
  useEffect(() => { setQty(1); setMsg(''); }, [id]);
  if (loading) return <Loading />;
  if (error) return <ErrorMsg message={error} retry={reload} />;
  const p = data.product;
  const add = () => setMsg(addToCart(p, qty) ? 'Quantity limited to available stock.' : 'Added to cart.');
  return (
    <>
    <div className="details">
      <img src={p.image} alt={p.name} />
      <div>
        <h1>{p.name}</h1>
        <p className="muted">{p.brand} · {p.category?.name} · ★ {p.rating?.toFixed(1)}</p>
        <p className="price big">{p.discountPrice != null ? <><b>{money(p.discountPrice)}</b> <s>{money(p.price)}</s> <span className="good">{Math.round((1 - p.discountPrice / p.price) * 100)}% off</span></> : <b>{money(p.price)}</b>}</p>
        <p>{p.description}</p>
        <p className={p.stock < 1 ? 'bad' : 'good'}>{p.stock < 1 ? 'Out of stock' : `${p.stock} in stock`}</p>
        {p.stock > 0 && <div className="row">
          <input type="number" min="1" max={p.stock} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(p.stock, +e.target.value || 1)))} />
          <button className="btn" onClick={add}>Add to cart</button><WishlistButton id={p._id} /></div>}
        {msg && <p className="muted">{msg} <Link to="/cart">View cart</Link></p>}
      </div>
    </div>
    <RecentlyViewed exclude={p._id} />
    </>
  );
}
