const jwt = require('jsonwebtoken');
const User = require('../models/User');
const HttpError = require('../utils/HttpError');
const asyncHandler = require('../utils/asyncHandler');
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const out = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, phone: u.phone, address: u.address, wishlist: (u.wishlist || []).map(String) });
const EMAIL = /^\S+@\S+\.\S+$/, PHONE = /^[0-9+\-\s]{10,15}$/;

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !String(name).trim() || !email || !password) throw new HttpError(400, 'Name, email and password are required');
  if (!EMAIL.test(String(email))) throw new HttpError(400, 'Invalid email');
  if (String(password).length < 6) throw new HttpError(400, 'Password must be at least 6 characters');
  if (!phone || !PHONE.test(String(phone))) throw new HttpError(400, 'A valid phone number is required');
  if (await User.findOne({ email: String(email).toLowerCase() })) throw new HttpError(409, 'Email already registered');
  const user = await User.create({ name, email, password, phone, role: 'customer' }); // role is never taken from client
  res.status(201).json({ token: sign(user), user: out(user) });
});
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new HttpError(400, 'Email and password are required');
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) throw new HttpError(401, 'Invalid email or password');
  res.json({ token: sign(user), user: out(user) });
});
exports.me = asyncHandler(async (req, res) => res.json({ user: out(req.user) }));

// Customer profile editing (name, phone, address only - never email/role)
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;
  if (name !== undefined) { if (!String(name).trim()) throw new HttpError(400, 'Name cannot be empty'); req.user.name = String(name).trim(); }
  if (phone !== undefined) { if (!PHONE.test(String(phone))) throw new HttpError(400, 'Invalid phone number'); req.user.phone = String(phone).trim(); }
  if (address !== undefined) req.user.address = String(address).trim();
  await req.user.save();
  res.json({ user: out(req.user) });
});

// ----- Wishlist (extra feature) -----
exports.getWishlist = asyncHandler(async (req, res) => {
  const u = await User.findById(req.user._id).populate({ path: 'wishlist', match: { isActive: true }, populate: { path: 'category', select: 'name' } });
  res.json({ products: u.wishlist.filter(Boolean) });
});
exports.addWishlist = asyncHandler(async (req, res) => {
  const Product = require('../models/Product');
  if (!require('mongoose').isValidObjectId(req.params.productId)) throw new HttpError(400, 'Invalid product ID');
  if (!(await Product.exists({ _id: req.params.productId }))) throw new HttpError(404, 'Product not found');
  await User.updateOne({ _id: req.user._id }, { $addToSet: { wishlist: req.params.productId } });
  const u = await User.findById(req.user._id);
  res.json({ wishlist: u.wishlist.map(String) });
});
exports.removeWishlist = asyncHandler(async (req, res) => {
  if (!require('mongoose').isValidObjectId(req.params.productId)) throw new HttpError(400, 'Invalid product ID');
  await User.updateOne({ _id: req.user._id }, { $pull: { wishlist: req.params.productId } });
  const u = await User.findById(req.user._id);
  res.json({ wishlist: u.wishlist.map(String) });
});
