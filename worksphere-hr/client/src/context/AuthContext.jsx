import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null), [employee, setEmployee] = useState(null), [loading, setLoading] = useState(!!localStorage.getItem('token'));
  const load = async () => {
    try { const d = await api('/auth/me'); setUser(d.user); setEmployee(d.employee); }
    catch (e) { localStorage.removeItem('token'); throw e; }
    finally { setLoading(false); }
  };
  useEffect(() => { if (localStorage.getItem('token')) load().catch(() => {}); }, []);
  const login = async (email, password) => { const d = await api('/auth/login', { method: 'POST', body: { email, password } }); localStorage.setItem('token', d.token); await load(); };
  const logout = () => { localStorage.removeItem('token'); setUser(null); setEmployee(null); };
  return <Ctx.Provider value={{ user, employee, loading, login, logout }}>{children}</Ctx.Provider>;
}
