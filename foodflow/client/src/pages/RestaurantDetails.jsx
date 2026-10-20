import { useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useFetch } from '../hooks/hooks.js';
import { Async } from '../components/UI.jsx';
import { MenuCategory } from '../components/Food.jsx';
import { inr, dt, fallbackImg } from '../utils/format.js';

export default function RestaurantDetails() {
  const { id } = useParams();
  const r = useFetch(() => api(`/restaurants/${id}`), [id]);
  const foods = useFetch(() => api('/foods', { params: { restaurant: id, limit: 100 } }), [id]);
  const reviews = useFetch(() => api(`/restaurants/${id}/reviews`), [id]);
  return (
    <Async q={r}>
      {({ data: rest }) => (<>
        <div className="rhead">
          <img src={rest.image} alt={rest.name} onError={fallbackImg} />
          <div>
            <h1 className="h1">{rest.name}</h1>
            <p className="muted">{rest.description}</p>
            <div className="meta big">
              <span>★ {Number(rest.rating).toFixed(1)}</span><span>{(rest.cuisineTypes || []).join(', ')}</span>
              <span>{rest.estimatedDeliveryTime} min</span><span>{rest.deliveryFee ? inr(rest.deliveryFee) + ' delivery' : 'Free delivery'}</span>
              <span>Min order {inr(rest.minimumOrder)}</span>
              <span className={'pill ' + (rest.isOpen ? 'open' : 'shut')}>{rest.isOpen ? 'Open now' : 'Closed right now'}</span>
            </div>
          </div>
        </div>
        <h2 className="sec">Menu</h2>
        <Async q={foods} empty={(d) => !d.data.length} emptyText="This restaurant has not added any dishes yet.">
          {(d) => {
            const groups = d.data.reduce((a, f) => { const k = f.category?.name || 'Other'; (a[k] = a[k] || []).push(f); return a; }, {});
            return Object.entries(groups).map(([name, items]) => <MenuCategory key={name} name={name} foods={items} restaurant={rest} />);
          }}
        </Async>
        <h2 className="sec">Reviews</h2>
        <Async q={reviews} empty={(d) => !d.data.length} emptyText="No reviews yet. Order and be the first to review.">
          {(d) => <div className="reviews">{d.data.map((v) => <div key={v._id} className="review"><b>{v.customer?.name || 'Customer'}</b> <span className="stars">{'★'.repeat(v.rating)}{'☆'.repeat(5 - v.rating)}</span><p>{v.comment}</p><small className="muted">{dt(v.createdAt)}</small></div>)}</div>}
        </Async>
      </>)}
    </Async>
  );
}
