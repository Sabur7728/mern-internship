import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useCart } from '../context/CartContext.jsx';
export default function Layout() {
  const { conflict, resolveConflict, restaurant } = useCart();
  return (
    <>
      <Navbar />
      <main className="wrap page"><Outlet /></main>
      <footer className="foot"><div className="wrap">© {new Date().getFullYear()} FoodFlow. Built as a MERN trainee project.</div></footer>
      {conflict && (
        <div className="modal-bg">
          <div className="modal">
            <h3>Start a new cart?</h3>
            <p>Your cart contains items from {restaurant?.name}. Would you like to clear your current cart and add this item from {conflict.restaurant.name}?</p>
            <div className="row gap wrap-r">
              <button className="btn ghost" onClick={() => resolveConflict('keep')}>Keep current cart</button>
              <button className="btn" onClick={() => resolveConflict('replace')}>Clear cart and add new item</button>
              <button className="btn ghost" onClick={() => resolveConflict('cancel')}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
