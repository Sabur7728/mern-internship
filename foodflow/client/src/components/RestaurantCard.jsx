import { Link } from 'react-router-dom';
import { inr, fallbackImg } from '../utils/format.js';
export default function RestaurantCard({ r }) {
  return (
    <Link to={`/restaurants/${r._id}`} className={'rcard' + (r.isOpen ? '' : ' closed')}>
      <div className="rimg">
        <img src={r.image} alt={r.name} loading="lazy" onError={fallbackImg} />
        <span className={'pill ' + (r.isOpen ? 'open' : 'shut')}>{r.isOpen ? 'Open now' : 'Closed'}</span>
        <span className="rate">★ {Number(r.rating || 0).toFixed(1)}</span>
      </div>
      <div className="rbody">
        <h3>{r.name}</h3>
        <p className="muted">{(r.cuisineTypes || []).join(', ')}</p>
        <div className="meta"><span>{r.estimatedDeliveryTime} min</span><span>{r.deliveryFee ? inr(r.deliveryFee) + ' delivery' : 'Free delivery'}</span><span>Min {inr(r.minimumOrder)}</span></div>
        <span className="btn sm block">View menu</span>
      </div>
    </Link>
  );
}
