const mongoose = require('mongoose');
class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const paginate = (q) => {
  const page = Math.max(parseInt(q.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(q.limit) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};
const pageRes = (data, total, p) => ({
  data, page: p.page, limit: p.limit, total, totalPages: Math.ceil(total / p.limit) || 1,
});
const escapeRx = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isId = (id) => mongoose.Types.ObjectId.isValid(id);
module.exports = { ApiError, asyncH, paginate, pageRes, escapeRx, isId };
