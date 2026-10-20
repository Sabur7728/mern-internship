const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError, asyncH } = require('../utils/helpers');
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
const clean = (u) => ({ _id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role, address: u.address, isActive: u.isActive });

exports.register = asyncH(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) throw new ApiError(400, 'Name, email and password are required');
  if (password.length < 6) throw new ApiError(422, 'Password must be at least 6 characters');
  const u = await User.create({ name, email, password, phone, role: 'customer' });
  res.status(201).json({ token: sign(u), user: clean(u) });
});
exports.login = asyncH(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');
  const u = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!u || !(await u.matchPassword(password))) throw new ApiError(401, 'Invalid email or password');
  if (!u.isActive) throw new ApiError(403, 'Account is deactivated');
  res.json({ token: sign(u), user: clean(u) });
});
exports.me = (req, res) => res.json({ user: clean(req.user) });
exports.updateMe = asyncH(async (req, res) => {
  ['name', 'phone', 'address'].forEach((k) => { if (req.body[k] !== undefined) req.user[k] = req.body[k]; });
  await req.user.save();
  res.json({ user: clean(req.user) });
});
