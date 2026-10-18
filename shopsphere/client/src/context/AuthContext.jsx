import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));
  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    api('/auth/me').then((d) => setUser(d.user)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false));
  }, []);
  const save = (d) => { localStorage.setItem('token', d.token); setUser(d.user); return d.user; };
  const login = async (email, password) => save(await api('/auth/login', { method: 'POST', body: { email, password } }));
  const register = async (body) => save(await api('/auth/register', { method: 'POST', body }));
  const updateProfile = async (body) => { const d = await api('/users/me', { method: 'PATCH', body }); setUser(d.user); return d.user; };
  const toggleWishlist = async (id) => {
    const has = user.wishlist?.includes(id);
    const d = await api(`/users/me/wishlist/${id}`, { method: has ? 'DELETE' : 'PUT' });
    setUser((u) => ({ ...u, wishlist: d.wishlist }));
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  return <Ctx.Provider value={{ user, loading, login, register, logout, updateProfile, toggleWishlist }}>{children}</Ctx.Provider>;
}
