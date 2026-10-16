import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";
import { getToken, setToken, clearToken, setUnauthorizedHandler } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until initial check completes

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await authService.getProfile();
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  // Initialize on app start
  useEffect(() => {
    setUnauthorizedHandler(logout); // global 401 handling

    (async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        await refreshUser();
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [logout, refreshUser]);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, logout, refreshUser }),
    [user, loading, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};