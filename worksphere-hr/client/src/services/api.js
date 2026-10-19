const BASE = import.meta.env.VITE_API_URL || '/api';
export async function api(path, { method = 'GET', body } = {}) {
  const t = localStorage.getItem('token');
  const r = await fetch(BASE + path, { method, headers: { 'Content-Type': 'application/json', ...(t && { Authorization: 'Bearer ' + t }) }, body: body && JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(d.message || 'Request failed'); e.status = r.status; throw e; }
  return d;
}
export const qs = o => { const p = new URLSearchParams(); Object.entries(o).forEach(([k, v]) => v !== '' && v != null && p.set(k, v)); return p.toString(); };
export const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '-';
export const hm = h => h ? `${Math.floor(h)}h ${Math.round((h % 1) * 60)}m` : '-';
