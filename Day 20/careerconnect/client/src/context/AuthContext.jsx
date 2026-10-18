import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, tokenStore } from '../services/api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!tokenStore.get());

  useEffect(() => {
    if (!tokenStore.get()) return;
    authApi.me().then((r) => setUser(r.user)).catch(() => tokenStore.clear()).finally(() => setLoading(false));
  }, []);

  const logout = useCallback(async () => {
    try { if (tokenStore.get()) await authApi.logout(); } catch { /* ignore */ }
    tokenStore.clear();
    setUser(null);
  }, []);

  // token expired -> clear auth state
  useEffect(() => {
    const onExpired = () => { tokenStore.clear(); setUser(null); };
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  const handleAuth = (r) => { tokenStore.set(r.token); setUser(r.user); return r.user; };
  const login = async (body) => handleAuth(await authApi.login(body));
  const register = async (body) => handleAuth(await authApi.register(body));

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
