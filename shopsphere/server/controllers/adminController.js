const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
exports.stats = asyncHandler(async (req, res) => {
  const [totalProducts, totalCustomers, totalOrders, pendingOrders, lowStock, sales] = await Promise.all([
    Product.countDocuments(), User.countDocuments({ role: 'customer' }), Order.countDocuments(),
    Order.countDocuments({ orderStatus: 'Pending' }), Product.find({ stock: { $lte: 5 } }).select('name stock').sort('stock'),
    Order.aggregate([{ $match: { orderStatus: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
  ]);
  res.json({ totalProducts, totalCustomers, totalOrders, pendingOrders, lowStockProducts: lowStock, totalSales: sales[0]?.total || 0 });
});
exports.customers = asyncHandler(async (req, res) => res.json({ users: await User.find({ role: 'customer' }).sort('-createdAt') }));
