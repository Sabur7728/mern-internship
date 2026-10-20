const Category = require('../models/Category');
const { asyncH } = require('../utils/helpers');
exports.list = asyncH(async (req, res) => res.json({ data: await Category.find({ isActive: true }).sort('name').lean() }));
exports.create = asyncH(async (req, res) => {
  const { name, description, image } = req.body;
  res.status(201).json({ data: await Category.create({ name, description, image }) });
});
