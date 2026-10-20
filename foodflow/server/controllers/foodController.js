const Food = require('../models/FoodItem');
const Category = require('../models/Category');
const { myRestaurant } = require('../middleware/auth');
const { ApiError, asyncH, paginate, pageRes, escapeRx, isId } = require('../utils/helpers');

const FIELDS = ['category', 'name', 'description', 'price', 'image', 'isVegetarian', 'isVegan', 'spiceLevel', 'preparationTime', 'isAvailable'];
const pick = (o, f) => f.reduce((a, k) => (o[k] !== undefined ? { ...a, [k]: o[k] } : a), {});

exports.list = asyncH(async (req, res) => {
  const q = req.query, f = {};
  if (q.restaurant) f.restaurant = q.restaurant;
  if (q.search) { const rx = new RegExp(escapeRx(q.search), 'i'); f.$or = [{ name: rx }, { description: rx }]; }
  if (q.category) {
    if (isId(q.category)) f.category = q.category;
    else {
      const c = await Category.findOne({ name: new RegExp('^' + escapeRx(q.category) + '$', 'i') });
      f.category = c ? c._id : null;
    }
  }
  if (q.minPrice || q.maxPrice) {
    f.price = {};
    if (q.minPrice) f.price.$gte = +q.minPrice;
    if (q.maxPrice) f.price.$lte = +q.maxPrice;
  }
  if (q.vegetarian === 'true') f.isVegetarian = true;
  if (q.available === 'true') f.isAvailable = true;
  const sorts = { rating: { rating: -1 }, price_asc: { price: 1 }, price_desc: { price: -1 }, newest: { createdAt: -1 } };
  const p = paginate(q);
  const [data, total] = await Promise.all([
    Food.find(f).sort(sorts[q.sort] || { createdAt: 1 }).skip(p.skip).limit(p.limit)
      .populate('category', 'name').populate('restaurant', 'name deliveryFee minimumOrder isOpen isActive').lean(),
    Food.countDocuments(f),
  ]);
  res.json(pageRes(data, total, p));
});

exports.getOne = asyncH(async (req, res) => {
  const f = await Food.findById(req.params.id).populate('category', 'name').populate('restaurant', 'name');
  if (!f) throw new ApiError(404, 'Food item not found');
  res.json({ data: f });
});

exports.create = asyncH(async (req, res) => {
  let restaurant;
  if (req.user.role === 'admin') restaurant = req.body.restaurant;
  else { const r = await myRestaurant(req.user); if (!r) throw new ApiError(404, 'Create your restaurant first'); restaurant = r._id; }
  if (!restaurant) throw new ApiError(400, 'Restaurant is required');
  const body = pick(req.body, FIELDS);
  if (!body.category || !isId(body.category) || !(await Category.findById(body.category))) throw new ApiError(422, 'Valid category is required');
  const f = await Food.create({ ...body, restaurant });
  res.status(201).json({ data: f });
});

const owned = async (req) => {
  const f = await Food.findById(req.params.id);
  if (!f) throw new ApiError(404, 'Food item not found');
  if (req.user.role !== 'admin') {
    const r = await myRestaurant(req.user);
    if (!r || !f.restaurant.equals(r._id)) throw new ApiError(403, 'You can only manage food items of your own restaurant');
  }
  return f;
};
exports.update = asyncH(async (req, res) => {
  const f = await owned(req);
  Object.assign(f, pick(req.body, FIELDS));
  await f.save();
  res.json({ data: f });
});
exports.remove = asyncH(async (req, res) => {
  const f = await owned(req);
  await f.deleteOne();
  res.json({ message: 'Food item deleted' });
});
