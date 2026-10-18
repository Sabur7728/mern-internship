const Category = require('../models/Category');
const Product = require('../models/Product');
const HttpError = require('../utils/HttpError');
const asyncHandler = require('../utils/asyncHandler');
const pick = ({ name, description, image, isActive }) => Object.fromEntries(Object.entries({ name, description, image, isActive }).filter(([, v]) => v !== undefined));

exports.list = asyncHandler(async (req, res) => {
  const q = req.user?.role === 'admin' ? {} : { isActive: true };
  res.json({ categories: await Category.find(q).sort('name') });
});
exports.create = asyncHandler(async (req, res) => res.status(201).json({ category: await Category.create(pick(req.body)) }));
exports.update = asyncHandler(async (req, res) => {
  const c = await Category.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true });
  if (!c) throw new HttpError(404, 'Category not found');
  res.json({ category: c });
});
exports.remove = asyncHandler(async (req, res) => {
  if (await Product.exists({ category: req.params.id })) throw new HttpError(409, 'Category has products; reassign or delete them first');
  const c = await Category.findByIdAndDelete(req.params.id);
  if (!c) throw new HttpError(404, 'Category not found');
  res.json({ message: 'Category deleted' });
});
