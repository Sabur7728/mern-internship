import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function WishlistButton({ id }) {
  const { user, toggleWishlist } = useAuth(); const nav = useNavigate();
  const on = !!user?.wishlist?.includes(id);
  const click = async () => { if (!user) return nav('/login'); try { await toggleWishlist(id); } catch (e) { alert(e.message); } };
  return <button className="btn ghost heart" onClick={click} aria-pressed={on} aria-label={on ? 'Remove from wishlist' : 'Add to wishlist'}>{on ? '♥' : '♡'}</button>;
}
