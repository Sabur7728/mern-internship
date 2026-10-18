const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const HttpError = require('../utils/HttpError');
const asyncHandler = require('../utils/asyncHandler');
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const FIELDS = ['name', 'description', 'price', 'discountPrice', 'category', 'brand', 'image', 'stock', 'rating', 'isActive'];
const pick = (body) => Object.fromEntries(FIELDS.filter((k) => body[k] !== undefined).map((k) => [k, body[k]])); // blocks mass-assignment
const SORTS = { price_asc: { finalPrice: 1 }, price_desc: { finalPrice: -1 }, rating: { rating: -1 }, name_asc: { name: 1 }, newest: { createdAt: -1 } };
const has = (v) => v !== undefined && v !== '';
const num = (v, label, min, max) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || (max !== undefined && n > max)) throw new HttpError(400, `Invalid ${label}`);
  return n;
};

exports.list = asyncHandler(async (req, res) => {
  const { search, category, brand, minPrice, maxPrice, minRating, inStock, onDiscount, sort, page, limit, includeInactive } = req.query;
  // ---- validate every query parameter first (before touching the DB)
  if (has(sort) && !SORTS[sort]) throw new HttpError(400, `Invalid sort. Use one of: ${Object.keys(SORTS).join(', ')}`);
  const p = has(page) ? Math.floor(num(page, 'page', 1)) : 1;
  const l = has(limit) ? Math.floor(num(limit, 'limit', 1, 100)) : 12;
  const min = has(minPrice) ? num(minPrice, 'minPrice', 0) : undefined;
  const max = has(maxPrice) ? num(maxPrice, 'maxPrice', 0) : undefined;
  if (min !== undefined && max !== undefined && min > max) throw new HttpError(400, 'minPrice cannot be greater than maxPrice');
  const rating = has(minRating) ? num(minRating, 'minRating', 0, 5) : undefined;

  const q = {};
  if (!(includeInactive === 'true' && req.user?.role === 'admin')) q.isActive = true;
  if (has(search)) { const r = new RegExp(esc(search), 'i'); q.$or = [{ name: r }, { brand: r }, { description: r }]; }
  if (has(category)) {
    const cat = mongoose.isValidObjectId(category) ? { _id: category } : { name: new RegExp(`^${esc(String(category).replace(/-/g, ' '))}$`, 'i') };
    const found = await Category.findOne(cat);
    q.category = found ? found._id : null; // unknown category -> empty result, not an error
  }
  if (has(brand)) q.brand = new RegExp(`^${esc(brand)}$`, 'i');
  if (min !== undefined || max !== undefined) q.finalPrice = { ...(min !== undefined && { $gte: min }), ...(max !== undefined && { $lte: max }) };
  if (rating !== undefined) q.rating = { $gte: rating };
  if (inStock === 'true') q.stock = { $gt: 0 };
  if (onDiscount === 'true') q.discountPrice = { $ne: null };

  const [items, total] = await Promise.all([
    Product.find(q).populate('category', 'name').sort(SORTS[sort] || SORTS.newest).skip((p - 1) * l).limit(l),
    Product.countDocuments(q),
  ]);
  res.json({ products: items, total, page: p, pages: Math.ceil(total / l) });
});
exports.brands = asyncHandler(async (req, res) => {
  const brands = (await Product.distinct('brand', { isActive: true })).filter(Boolean).sort((a, b) => a.localeCompare(b));
  res.json({ brands });
});
exports.get = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');
  if (!product) throw new HttpError(404, 'Product not found');
  res.json({ product });
});
exports.create = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.body.category) || !(await Category.findById(req.body.category))) throw new HttpError(404, 'Category not found');
  res.status(201).json({ product: await Product.create(pick(req.body)) });
});
exports.update = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new HttpError(404, 'Product not found');
  if (req.body.category && (!mongoose.isValidObjectId(req.body.category) || !(await Category.findById(req.body.category)))) throw new HttpError(404, 'Category not found');
  Object.assign(product, pick(req.body));
  await product.save();
  res.json({ product });
});
exports.remove = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new HttpError(404, 'Product not found');
  res.json({ message: 'Product deleted' });
});
