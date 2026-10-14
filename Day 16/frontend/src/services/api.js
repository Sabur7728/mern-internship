const API_URL = import.meta.env.VITE_API_URL;

export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const clearToken = () => localStorage.removeItem("token");

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  } catch {
    throw new Error("Cannot reach the server. Please check your connection.");
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    // Token invalid/expired
    if (response.status === 401 && token) {
      clearToken();
      window.dispatchEvent(new Event("auth:logout"));
    }

    const fallback = {
      401: "Please log in to continue.",
      403: "You do not have permission to do this.",
      404: "The requested resource was not found.",
      409: "This record already exists.",
      429: "Too many requests. Please try again later.",
      500: "Something went wrong on the server.",
    };

    throw new Error(
      result?.message || fallback[response.status] || `Request failed (status ${response.status})`
    );
  }

  return result;
};

// { a: 1, b: "" } -> "?a=1"
export const buildQuery = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) q.set(key, value);
  });
  const str = q.toString();
  return str ? `?${str}` : "";
};