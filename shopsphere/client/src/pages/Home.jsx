import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';
import { Loading, ErrorMsg } from '../components/Status';
export default function Home() {
  const cats = useFetch('/categories');
  const prods = useFetch('/products?sort=rating&limit=8');
  return (
    <>
      <section className="hero"><h1>Everything you need, delivered.</h1><p>Electronics, fashion, books and more at honest prices.</p><Link className="btn" to="/products">Shop all products</Link></section>
      <h2>Featured categories</h2>
      {cats.loading ? <Loading /> : cats.error ? <ErrorMsg message={cats.error} retry={cats.reload} /> :
        <div className="chips">{cats.data.categories.map((c) => <Link key={c._id} className="chip" to={`/products?category=${c._id}`}>{c.name}</Link>)}</div>}
      <h2>Featured products</h2>
      {prods.loading ? <Loading /> : prods.error ? <ErrorMsg message={prods.error} retry={prods.reload} /> :
        <div className="grid">{prods.data.products.map((p) => <ProductCard key={p._id} product={p} />)}</div>}
      <RecentlyViewed />
      <section className="promo"><h2>Free shipping on orders above ₹999</h2><p>Pay with Cash on Delivery or the demo card option.</p></section>
    </>
  );
}
