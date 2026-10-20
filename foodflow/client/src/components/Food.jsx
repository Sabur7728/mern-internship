import { useCart } from '../context/CartContext.jsx';
import { inr, fallbackImg } from '../utils/format.js';

export function QuantitySelector({ value, onMinus, onPlus }) {
  return <div className="qty"><button onClick={onMinus} aria-label="Decrease">−</button><span>{value}</span><button onClick={onPlus} aria-label="Increase">+</button></div>;
}
export function AddToCartButton({ food, restaurant }) {
  const { cartItems, addItem, increaseQuantity, decreaseQuantity } = useCart();
  const inCart = cartItems.find((i) => i._id === food._id);
  if (!food.isAvailable) return <button className="btn sm" disabled>Unavailable</button>;
  if (restaurant.isOpen === false) return <button className="btn sm" disabled>Closed</button>;
  if (inCart) return <QuantitySelector value={inCart.quantity} onMinus={() => decreaseQuantity(food._id)} onPlus={() => increaseQuantity(food._id)} />;
  return <button className="btn sm mint" onClick={() => addItem(food, restaurant)}>Add</button>;
}
export function FoodItemCard({ food, restaurant }) {
  const rest = restaurant || food.restaurant;
  return (
    <div className={'food' + (food.isAvailable ? '' : ' off')}>
      <img src={food.image} alt={food.name} loading="lazy" onError={fallbackImg} />
      <div className="food-body">
        <div className="row">
          <span className={'veg ' + (food.isVegetarian ? 'v' : 'nv')} title={food.isVegetarian ? 'Vegetarian' : 'Non-vegetarian'} />
          <h4>{food.name}</h4>
        </div>
        <p className="muted">{food.description}</p>
        <div className="meta">{food.spiceLevel > 0 && <span title="Spice level">{'🌶'.repeat(food.spiceLevel)}</span>}<span>{food.preparationTime} min</span>{rest?.name && !restaurant && <span>{rest.name}</span>}</div>
        <div className="row between">
          <b className="price">{inr(food.price)}</b>
          {rest && <AddToCartButton food={food} restaurant={rest} />}
        </div>
        {!food.isAvailable && <small className="muted">Currently not available to order</small>}
      </div>
    </div>
  );
}
export function MenuCategory({ name, foods, restaurant }) {
  return (
    <section className="menu-cat" id={'cat-' + name}>
      <h3>{name} <small>{foods.length}</small></h3>
      <div className="grid foods">{foods.map((f) => <FoodItemCard key={f._id} food={f} restaurant={restaurant} />)}</div>
    </section>
  );
}
