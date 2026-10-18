const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
export const productService = {
  list: (params) => api('/products?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null))),
  brands: () => api('/products/brands'),
  get: (id) => api(`/products/${id}`),
  create: (b) => api('/products', { method: 'POST', body: b }),
  update: (id, b) => api(`/products/${id}`, { method: 'PATCH', body: b }),
  remove: (id) => api(`/products/${id}`, { method: 'DELETE' }),
};
