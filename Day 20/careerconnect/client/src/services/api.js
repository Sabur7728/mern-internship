import axios from 'axios';

const TOKEN_KEY = 'cc_token';
export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 15000 });

api.interceptors.request.use((config) => {
  const t = tokenStore.get();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const data = err.response?.data;
    // expired / invalid token on a protected call -> tell the app to log out
    if (status === 401 && tokenStore.get() && !err.config.url.includes('/auth/login')) {
      window.dispatchEvent(new Event('auth:expired'));
    }
    const message = data?.message || (err.request ? 'Cannot reach the server. Please try again.' : err.message);
    const e = new Error(Array.isArray(data?.details) && data.details.length ? `${message}: ${data.details.join(', ')}` : message);
    e.status = status;
    return Promise.reject(e);
  }
);

const clean = (p = {}) => Object.fromEntries(Object.entries(p).filter(([, v]) => v !== '' && v !== null && v !== undefined));
const get = (url, params) => api.get(url, { params: clean(params) }).then((r) => r.data);
const post = (url, body) => api.post(url, body).then((r) => r.data);
const patch = (url, body) => api.patch(url, body).then((r) => r.data);
const del = (url) => api.delete(url).then((r) => r.data);

export const authApi = {
  register: (b) => post('/auth/register', b),
  login: (b) => post('/auth/login', b),
  me: () => get('/auth/me'),
  logout: () => post('/auth/logout'),
};
export const jobApi = {
  list: (p) => get('/jobs', p),
  mine: (p) => get('/jobs/mine', p),
  get: (id) => get(`/jobs/${id}`),
  create: (b) => post('/jobs', b),
  update: (id, b) => patch(`/jobs/${id}`, b),
  remove: (id) => del(`/jobs/${id}`),
};
export const candidateApi = {
  me: () => get('/candidates/me'),
  updateMe: (b) => patch('/candidates/me', b),
  list: (p) => get('/candidates', p),
  remove: (id) => del(`/candidates/${id}`),
};
export const applicationApi = {
  list: (p) => get('/applications', p),
  apply: (jobId) => post('/applications', { jobId }),
  update: (id, b) => patch(`/applications/${id}`, b),
  remove: (id) => del(`/applications/${id}`),
};
export const adminApi = {
  stats: () => get('/admin/stats'),
  list: (path, p) => get(path, p),
  update: (path, b) => patch(path, b),
  remove: (path) => del(path),
};
