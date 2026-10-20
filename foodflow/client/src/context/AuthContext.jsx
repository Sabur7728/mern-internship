import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);
export const homeFor = (u) => (!u ? '/' : u.role === 'admin' ? '/admin/dashboard' : u.role === 'restaurant' ? '/restaurant/dashboard' : '/');
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('ff_token'));
  useEffect(() => {
    if (!localStorage.getItem('ff_token')) return;
    api('/auth/me').then((d) => setUser(d.user)).catch(() => localStorage.removeItem('ff_token')).finally(() => setLoading(false));
  }, []);
  const save = (d) => { localStorage.setItem('ff_token', d.token); setUser(d.user); return d.user; };
  const login = async (email, password) => save(await api('/auth/login', { method: 'POST', body: { email, password } }));
  const register = async (body) => save(await api('/auth/register', { method: 'POST', body }));
  const logout = () => { localStorage.removeItem('ff_token'); setUser(null); };
  return <Ctx.Provider value={{ user, setUser, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
