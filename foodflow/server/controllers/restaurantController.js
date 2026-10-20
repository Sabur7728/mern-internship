const Restaurant = require('../models/Restaurant');
const Food = require('../models/FoodItem');
const Review = require('../models/Review');
const User = require('../models/User');
const { myRestaurant } = require('../middleware/auth');
const { ApiError, asyncH, paginate, pageRes, escapeRx } = require('../utils/helpers');

const FIELDS = ['name', 'description', 'phone', 'email', 'address', 'city', 'state', 'postalCode', 'cuisineTypes',
  'image', 'deliveryFee', 'minimumOrder', 'estimatedDeliveryTime', 'isOpen'];
const pick = (o, f) => f.reduce((a, k) => (o[k] !== undefined ? { ...a, [k]: o[k] } : a), {});
const isAdmin = (u) => u && u.role === 'admin';

exports.list = asyncH(async (req, res) => {
  const q = req.query, f = {};
  if (!(q.includeInactive === 'true' && isAdmin(req.user))) f.isActive = true;
  if (q.search) {
    const rx = new RegExp(escapeRx(q.search), 'i');
    const ids = await Food.distinct('restaurant', { name: rx }); // "pizza" also finds restaurants selling pizza
    f.$or = [{ name: rx }, { cuisineTypes: rx }, { description: rx }, { _id: { $in: ids } }];
  }
  if (q.cuisine) f.cuisineTypes = new RegExp('^' + escapeRx(q.cuisine) + '$', 'i');
  if (q.minRating) f.rating = { $gte: +q.minRating };
  if (q.maxDeliveryFee !== undefined && q.maxDeliveryFee !== '') f.deliveryFee = { $lte: +q.maxDeliveryFee };
  if (q.maxDeliveryTime) f.estimatedDeliveryTime = { $lte: +q.maxDeliveryTime };
  if (q.isOpen === 'true') f.isOpen = true;
  const sorts = { rating: { rating: -1 }, fastest: { estimatedDeliveryTime: 1 }, fee: { deliveryFee: 1 }, newest: { createdAt: -1 } };
  const p = paginate(q);
  const [data, total] = await Promise.all([
    Restaurant.find(f).sort(sorts[q.sort] || sorts.rating).skip(p.skip).limit(p.limit).lean(),
    Restaurant.countDocuments(f),
  ]);
  res.json(pageRes(data, total, p));
});

exports.mine = asyncH(async (req, res) => {
  const r = await myRestaurant(req.user);
  if (!r) throw new ApiError(404, 'You have not created a restaurant yet');
  res.json({ data: r });
});

exports.getOne = asyncH(async (req, res) => {
  const r = await Restaurant.findById(req.params.id);
  if (!r) throw new ApiError(404, 'Restaurant not found');
  const allowed = r.isActive || isAdmin(req.user) || (req.user && r.owner.equals(req.user._id));
  if (!allowed) throw new ApiError(404, 'Restaurant not found');
  res.json({ data: r });
});

exports.create = asyncH(async (req, res) => {
  const body = pick(req.body, FIELDS);
  let owner = req.user._id;
  if (isAdmin(req.user)) {
    owner = req.body.owner;
    if (!owner) throw new ApiError(400, 'Owner is required');
    const u = await User.findById(owner);
    if (!u || u.role !== 'restaurant') throw new ApiError(422, 'Owner must be a restaurant user');
  } else if (await Restaurant.findOne({ owner })) throw new ApiError(409, 'You already have a restaurant');
  const r = await Restaurant.create({ ...body, owner });
  res.status(201).json({ data: r });
});

exports.update = asyncH(async (req, res) => {
  const r = await Restaurant.findById(req.params.id);
  if (!r) throw new ApiError(404, 'Restaurant not found');
  if (!isAdmin(req.user) && !r.owner.equals(req.user._id)) throw new ApiError(403, 'You can only manage your own restaurant');
  Object.assign(r, pick(req.body, FIELDS));
  if (isAdmin(req.user) && req.body.isActive !== undefined) r.isActive = req.body.isActive;
  await r.save();
  res.json({ data: r });
});

exports.remove = asyncH(async (req, res) => {
  const r = await Restaurant.findById(req.params.id);
  if (!r) throw new ApiError(404, 'Restaurant not found');
  if (!isAdmin(req.user) && !r.owner.equals(req.user._id)) throw new ApiError(403, 'You can only manage your own restaurant');
  await Food.deleteMany({ restaurant: r._id });
  await r.deleteOne();
  res.json({ message: 'Restaurant deleted' });
});

exports.reviews = asyncH(async (req, res) => {
  const data = await Review.find({ restaurant: req.params.id }).populate('customer', 'name').sort('-createdAt').limit(50).lean();
  res.json({ data });
});
