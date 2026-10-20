import { createContext, useContext, useEffect, useState } from 'react';
const Ctx = createContext();
export const useCart = () => useContext(Ctx);
const empty = { restaurant: null, items: [] };
const load = () => { try { return JSON.parse(localStorage.getItem('ff_cart')) || empty; } catch { return empty; } };
const slim = (r) => ({ _id: r._id, name: r.name, deliveryFee: r.deliveryFee, minimumOrder: r.minimumOrder });
const mk = (f, q = 1) => ({ _id: f._id, name: f.name, price: f.price, image: f.image, isVegetarian: f.isVegetarian, quantity: q });

export function CartProvider({ children }) {
  const [cart, setCart] = useState(load);
  const [conflict, setConflict] = useState(null); // {food, restaurant} when a 2nd restaurant is attempted
  useEffect(() => localStorage.setItem('ff_cart', JSON.stringify(cart)), [cart]);

  const addItem = (food, restaurant) => {
    if (!food.isAvailable) return;
    if (cart.restaurant && cart.restaurant._id !== restaurant._id && cart.items.length) { setConflict({ food, restaurant }); return; }
    setCart((c) => {
      const ex = c.items.find((i) => i._id === food._id);
      return { restaurant: slim(restaurant), items: ex ? c.items.map((i) => (i._id === food._id ? { ...i, quantity: i.quantity + 1 } : i)) : [...c.items, mk(food)] };
    });
  };
  const resolveConflict = (action) => {
    if (action === 'replace' && conflict) setCart({ restaurant: slim(conflict.restaurant), items: [mk(conflict.food)] });
    setConflict(null); // 'keep' and 'cancel' both leave the cart untouched
  };
  const setItems = (fn) => setCart((c) => { const items = fn(c.items); return { restaurant: items.length ? c.restaurant : null, items }; });
  const increaseQuantity = (id) => setItems((is) => is.map((i) => (i._id === id ? { ...i, quantity: Math.min(i.quantity + 1, 20) } : i)));
  const decreaseQuantity = (id) => setItems((is) => is.map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i)).filter((i) => i.quantity > 0));
  const removeItem = (id) => setItems((is) => is.filter((i) => i._id !== id));
  const clearCart = () => setCart(empty);
  const loadCart = (restaurant, rows) => setCart({ restaurant: slim(restaurant), items: rows.map((r) => mk(r.food, r.quantity)) });

  // all calculations live here only
  const count = cart.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = cart.items.length && cart.restaurant ? cart.restaurant.deliveryFee : 0;
  const totalAmount = subtotal + deliveryFee;

  return (
    <Ctx.Provider value={{ cartItems: cart.items, restaurant: cart.restaurant, conflict, addItem, resolveConflict, increaseQuantity, decreaseQuantity, removeItem, clearCart, loadCart, count, subtotal, deliveryFee, totalAmount }}>
      {children}
    </Ctx.Provider>
  );
}
