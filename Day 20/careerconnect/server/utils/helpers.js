export const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const parsePagination = (q) => {
  const page = Math.max(parseInt(q.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(q.limit, 10) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

export const pageMeta = (page, limit, total) => ({
  page, limit, total, pages: Math.max(Math.ceil(total / limit), 1),
});

export const toList = (v) =>
  Array.isArray(v)
    ? v.map((s) => String(s).trim()).filter(Boolean)
    : String(v || '').split(',').map((s) => s.trim()).filter(Boolean);
