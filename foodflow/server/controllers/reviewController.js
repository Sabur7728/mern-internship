const Review = require('../models/Review');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const { ApiError, asyncH } = require('../utils/helpers');

const recalc = async (rid) => {
  const [a] = await Review.aggregate([{ $match: { restaurant: rid } }, { $group: { _id: null, avg: { $avg: '$rating' } } }]);
  await Restaurant.findByIdAndUpdate(rid, { rating: a ? Math.round(a.avg * 10) / 10 : 0 });
};
exports.create = asyncH(async (req, res) => {
  const { order, rating, comment } = req.body;
  const o = await Order.findById(order);
  if (!o) throw new ApiError(404, 'Order not found');
  if (!o.customer.equals(req.user._id)) throw new ApiError(403, 'You can only review your own orders');
  if (o.orderStatus !== 'Delivered') throw new ApiError(422, 'You can review only after the order is delivered');
  const r = await Review.create({ customer: req.user._id, restaurant: o.restaurant, order: o._id, rating, comment });
  await recalc(o.restaurant);
  res.status(201).json({ data: r });
});
const own = async (req) => {
  const r = await Review.findById(req.params.id);
  if (!r) throw new ApiError(404, 'Review not found');
  if (req.user.role !== 'admin' && !r.customer.equals(req.user._id)) throw new ApiError(403, 'You can only modify your own reviews');
  return r;
};
exports.update = asyncH(async (req, res) => {
  const r = await own(req);
  if (req.body.rating !== undefined) r.rating = req.body.rating;
  if (req.body.comment !== undefined) r.comment = req.body.comment;
  await r.save(); await recalc(r.restaurant);
  res.json({ data: r });
});
exports.remove = asyncH(async (req, res) => {
  const r = await own(req);
  await r.deleteOne(); await recalc(r.restaurant);
  res.json({ message: 'Review deleted' });
});
