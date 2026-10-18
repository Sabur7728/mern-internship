const jwt = require('jsonwebtoken');
const User = require('../models/User');
const HttpError = require('../utils/HttpError');
const asyncHandler = require('../utils/asyncHandler');

const load = async (req, required) => {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) { if (required) throw new HttpError(401, 'Not authenticated'); return; }
  let decoded;
  try { decoded = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET); }
  catch { if (required) throw new HttpError(401, 'Invalid or expired token'); return; }
  const user = await User.findById(decoded.id);
  if (!user) { if (required) throw new HttpError(401, 'User no longer exists'); return; }
  req.user = user;
};
exports.protect = asyncHandler(async (req, res, next) => { await load(req, true); next(); });
exports.optionalAuth = asyncHandler(async (req, res, next) => { await load(req, false); next(); });
exports.adminOnly = (req, res, next) =>
  req.user && req.user.role === 'admin' ? next() : next(new HttpError(403, 'Admin access required'));
