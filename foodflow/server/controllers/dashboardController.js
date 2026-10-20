const Order = require('../models/Order');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Food = require('../models/FoodItem');
const { myRestaurant } = require('../middleware/auth');
const { ApiError, asyncH } = require('../utils/helpers');

const live = { orderStatus: { $ne: 'Cancelled' } };
const topFoods = (match) => Order.aggregate([
  { $match: match }, { $unwind: '$items' },
  { $group: { _id: '$items.foodItem', name: { $first: '$items.name' }, quantity: { $sum: '$items.quantity' },
    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
  { $sort: { quantity: -1 } }, { $limit: 5 },
]);
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

exports.admin = asyncH(async (req, res) => {
  const since = new Date(Date.now() - 14 * 864e5);
  const [customers, restaurants, activeRestaurants, foods, orders, todayOrders, pending, cancelled, sales, statusDist, daily, topRestaurants, tf, growth] =
    await Promise.all([
      User.countDocuments({ role: 'customer' }), Restaurant.countDocuments(), Restaurant.countDocuments({ isActive: true }),
      Food.countDocuments(), Order.countDocuments(), Order.countDocuments({ createdAt: { $gte: startOfToday() } }),
      Order.countDocuments({ orderStatus: { $in: ['Placed', 'Confirmed', 'Preparing'] } }),
      Order.countDocuments({ orderStatus: 'Cancelled' }),
      Order.aggregate([{ $match: live }, { $group: { _id: null, total: { $sum: '$totalAmount' }, avg: { $avg: '$totalAmount' } } }]),
      Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
      Order.aggregate([{ $match: { ...live, createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, orders: { $sum: 1 }, sales: { $sum: '$totalAmount' } } },
        { $sort: { _id: 1 } }]),
      Order.aggregate([{ $match: live }, { $group: { _id: '$restaurant', orders: { $sum: 1 }, sales: { $sum: '$totalAmount' } } },
        { $sort: { sales: -1 } }, { $limit: 5 },
        { $lookup: { from: 'restaurants', localField: '_id', foreignField: '_id', as: 'r' } }, { $unwind: '$r' },
        { $project: { name: '$r.name', orders: 1, sales: 1 } }]),
      topFoods(live),
      User.aggregate([{ $match: { role: 'customer' } }, { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    ]);
  res.json({ data: {
    customers, restaurants, activeRestaurants, foods, orders, todayOrders, pending, cancelled,
    totalSales: sales[0]?.total || 0, avgOrderValue: Math.round(sales[0]?.avg || 0),
    statusDistribution: statusDist, daily, topRestaurants, topFoods: tf, customerGrowth: growth,
  } });
});

exports.restaurant = asyncH(async (req, res) => {
  const r = await myRestaurant(req.user);
  if (!r) throw new ApiError(404, 'You have not created a restaurant yet');
  const base = { restaurant: r._id };
  const [totalOrders, todayOrders, pending, preparing, completed, cancelled, sales, tf] = await Promise.all([
    Order.countDocuments(base), Order.countDocuments({ ...base, createdAt: { $gte: startOfToday() } }),
    Order.countDocuments({ ...base, orderStatus: 'Placed' }), Order.countDocuments({ ...base, orderStatus: 'Preparing' }),
    Order.countDocuments({ ...base, orderStatus: 'Delivered' }), Order.countDocuments({ ...base, orderStatus: 'Cancelled' }),
    Order.aggregate([{ $match: { ...base, ...live } }, { $group: { _id: null, total: { $sum: '$totalAmount' }, avg: { $avg: '$totalAmount' } } }]),
    topFoods({ ...base, ...live }),
  ]);
  res.json({ data: { restaurant: r, totalOrders, todayOrders, pending, preparing, completed, cancelled,
    totalSales: sales[0]?.total || 0, avgOrderValue: Math.round(sales[0]?.avg || 0), topFoods: tf } });
});
