import { createContext, useContext, useEffect, useState } from 'react';
const Ctx = createContext();
export const useCart = () => useContext(Ctx);
const FREE_ABOVE = 999, FEE = 49; // display only; backend recalculates
export function CartProvider({ children }) {
  const [cartItems, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; } });
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cartItems)), [cartItems]);
  const addToCart = (p, qty = 1) => {
    let msg = '';
    setItems((items) => {
      const ex = items.find((i) => i._id === p._id);
      const next = Math.min((ex?.quantity || 0) + qty, p.stock);
      if (next < (ex?.quantity || 0) + qty) msg = 'limit';
      const item = { _id: p._id, name: p.name, image: p.image, price: p.discountPrice ?? p.price, stock: p.stock, quantity: next };
      return ex ? items.map((i) => (i._id === p._id ? item : i)) : next > 0 ? [...items, item] : items;
    });
    return msg;
  };
  const removeFromCart = (id) => setItems((i) => i.filter((x) => x._id !== id));
  const increaseQuantity = (id) => setItems((i) => i.map((x) => (x._id === id ? { ...x, quantity: Math.min(x.quantity + 1, x.stock) } : x)));
  const decreaseQuantity = (id) => setItems((i) => i.map((x) => (x._id === id ? { ...x, quantity: Math.max(x.quantity - 1, 1) } : x)));
  const clearCart = () => setItems([]);
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = cartItems.length && subtotal < FREE_ABOVE ? FEE : 0;
    return { subtotal, shipping, total: subtotal + shipping, count: cartItems.reduce((s, i) => s + i.quantity, 0) };
  };
  return <Ctx.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, calculateTotals }}>{children}</Ctx.Provider>;
}
