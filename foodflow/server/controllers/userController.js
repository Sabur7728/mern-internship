const User = require('../models/User');
const { ApiError, asyncH, paginate, pageRes, escapeRx } = require('../utils/helpers');
exports.list = asyncH(async (req, res) => {
  const q = req.query, f = {};
  if (q.role) f.role = q.role;
  if (q.search) { const rx = new RegExp(escapeRx(q.search), 'i'); f.$or = [{ name: rx }, { email: rx }]; }
  const p = paginate(q);
  const [data, total] = await Promise.all([User.find(f).sort('-createdAt').skip(p.skip).limit(p.limit).lean(), User.countDocuments(f)]);
  res.json(pageRes(data, total, p)); // password has select:false so it is never returned
});
exports.create = asyncH(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!['customer', 'restaurant', 'admin'].includes(role)) throw new ApiError(422, 'Invalid role');
  const u = await User.create({ name, email, password, phone, role });
  res.status(201).json({ data: { _id: u._id, name: u.name, email: u.email, role: u.role } });
});
exports.setStatus = asyncH(async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) throw new ApiError(404, 'User not found');
  if (u._id.equals(req.user._id)) throw new ApiError(409, 'You cannot deactivate your own account');
  u.isActive = !!req.body.isActive;
  await u.save();
  res.json({ data: { _id: u._id, isActive: u.isActive } });
});
