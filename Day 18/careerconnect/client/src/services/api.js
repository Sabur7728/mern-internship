const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "cc_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// AuthContext registers a handler here so a 401 clears auth state globally
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

export async function apiRequest(path, { auth = true, ...options } = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers });
  } catch {
    const err = new Error("Cannot reach the server. Please try again.");
    err.status = 0;
    throw err;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Only treat 401 as "session invalid" if we actually sent a token
    if (res.status === 401 && auth && token && onUnauthorized) onUnauthorized();
    const err = new Error(data.message || "Something went wrong");
    err.status = res.status;
    throw err;
  }
  return data;
}