const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const { ApiError, asyncH } = require('../utils/helpers');

const load = async (req) => {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return null;
  let d;
  try { d = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET); }
  catch { throw new ApiError(401, 'Invalid or expired token'); }
  const u = await User.findById(d.id);
  if (!u) throw new ApiError(401, 'User no longer exists');
  if (!u.isActive) throw new ApiError(403, 'Account is deactivated');
  return u;
};
exports.protect = asyncH(async (req, res, next) => {
  const u = await load(req);
  if (!u) throw new ApiError(401, 'Not authenticated');
  req.user = u; next();
});
exports.optionalAuth = asyncH(async (req, res, next) => { req.user = await load(req); next(); });
exports.authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : next(new ApiError(403, 'You do not have permission to perform this action'));
exports.myRestaurant = (user) => Restaurant.findOne({ owner: user._id });
