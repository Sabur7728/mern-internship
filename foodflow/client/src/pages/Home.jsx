import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useFetch } from '../hooks/hooks.js';
import { Async } from '../components/UI.jsx';
import RestaurantCard from '../components/RestaurantCard.jsx';
import { FoodItemCard } from '../components/Food.jsx';

export default function Home() {
  const nav = useNavigate();
  const [term, setTerm] = useState('');
  const cats = useFetch(() => api('/categories'));
  const feat = useFetch(() => api('/restaurants', { params: { sort: 'rating', limit: 4 } }));
  const popular = useFetch(() => api('/foods', { params: { sort: 'rating', limit: 8, available: 'true' } }));
  return (
    <>
      <section className="hero">
        <div>
          <h1>Hungry? Your next meal is a few taps away.</h1>
          <p>Biryani from Nanded, pizza from Latur, dosa from Pune. Pick a restaurant, fill the cart, track it to your door.</p>
          <form onSubmit={(e) => { e.preventDefault(); nav(`/restaurants?search=${encodeURIComponent(term)}`); }} className="search">
            <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search pizza, biryani, Chinese..." />
            <button className="btn mint">Search</button>
          </form>
        </div>
        <div className="hero-art" aria-hidden="true">🍛<span>🍕</span><span>🍜</span></div>
      </section>

      <h2 className="sec">Browse by category</h2>
      <Async q={cats} empty={(d) => !d.data.length} emptyText="No categories yet.">
        {(d) => <div className="chips">{d.data.map((c) => <Link key={c._id} className="chip" to={`/restaurants?search=${encodeURIComponent(c.name)}`}>{c.name}</Link>)}</div>}
      </Async>

      <h2 className="sec">Featured restaurants</h2>
      <Async q={feat} empty={(d) => !d.data.length} emptyText="No restaurants found.">
        {(d) => <div className="grid rests">{d.data.map((r) => <RestaurantCard key={r._id} r={r} />)}</div>}
      </Async>

      <section className="promo">
        <div><h3>Get 10% off your first big order</h3><p>Use code <b>FOOD10</b> at checkout. Saves up to ₹100.</p></div>
        <Link className="btn mint" to="/restaurants">Order now</Link>
      </section>

      <h2 className="sec">Popular right now</h2>
      <Async q={popular} empty={(d) => !d.data.length} emptyText="No dishes found.">
        {(d) => <div className="grid foods">{d.data.map((f) => <FoodItemCard key={f._id} food={f} />)}</div>}
      </Async>
    </>
  );
}
