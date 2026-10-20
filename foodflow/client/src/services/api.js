const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export async function api(path, { method = 'GET', body, params } = {}) {
  const qs = params
    ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null && v !== false)).toString()
    : '';
  const token = localStorage.getItem('ff_token');
  let res;
  try {
    res = await fetch(API + path + qs, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch { throw new Error('Cannot reach the server. Is the backend running?'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}
