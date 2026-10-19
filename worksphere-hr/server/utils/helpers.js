exports.wrap = f => (q, s, n) => Promise.resolve(f(q, s, n)).catch(n);
exports.fail = (status, message) => Object.assign(new Error(message), { status });
exports.day = d => { const x = new Date(d); if (isNaN(x)) throw exports.fail(400, 'Invalid date'); x.setUTCHours(0, 0, 0, 0); return x; };
exports.esc = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
exports.mins = t => { const [h, m] = String(t).split(':').map(Number); return h * 60 + m; };
exports.page = q => { const page = Math.max(1, parseInt(q.page) || 1), limit = Math.min(100, Math.max(1, parseInt(q.limit) || 10)); return { page, limit, skip: (page - 1) * limit }; };
exports.paged = (data, total, p) => ({ data, page: p.page, limit: p.limit, total, totalPages: Math.ceil(total / p.limit) });
