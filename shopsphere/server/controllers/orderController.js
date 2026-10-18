const Order = require('../models/Order');
const HttpError = require('../utils/HttpError');
const asyncHandler = require('../utils/asyncHandler');
const { placeOrder, restock } = require('../services/orderService');
const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed'];

exports.create = asyncHandler(async (req, res) => res.status(201).json({ order: await placeOrder(req.user._id, req.body) }));
exports.myOrders = asyncHandler(async (req, res) =>
  res.json({ orders: await Order.find({ user: req.user._id }).sort('-createdAt') }));
exports.get = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');
  if (!order) throw new HttpError(404, 'Order not found');
  if (req.user.role !== 'admin' && String(order.user?._id) !== String(req.user._id)) throw new HttpError(403, 'Not allowed to view this order');
  res.json({ order });
});
exports.all = asyncHandler(async (req, res) => {
  const q = {};
  if (req.query.status) {
    if (!STATUSES.includes(req.query.status)) throw new HttpError(400, 'Invalid order status filter');
    q.orderStatus = req.query.status;
  }
  let orders = await Order.find(q).populate('user', 'name email').sort('-createdAt');
  if (req.query.search) {
    const s = String(req.query.search).toLowerCase();
    orders = orders.filter((o) => String(o._id).includes(s) || o.user?.name?.toLowerCase().includes(s) || o.user?.email?.toLowerCase().includes(s));
  }
  res.json({ orders });
});
exports.updateStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  if (!orderStatus && !paymentStatus) throw new HttpError(400, 'orderStatus or paymentStatus is required');
  if (orderStatus && !STATUSES.includes(orderStatus)) throw new HttpError(400, 'Invalid order status');
  if (paymentStatus && !PAYMENT_STATUSES.includes(paymentStatus)) throw new HttpError(400, 'Invalid payment status');
  const order = await Order.findById(req.params.id);
  if (!order) throw new HttpError(404, 'Order not found');
  if (orderStatus && orderStatus !== order.orderStatus) {
    if (['Cancelled', 'Delivered'].includes(order.orderStatus)) throw new HttpError(409, `A ${order.orderStatus.toLowerCase()} order cannot be changed`);
    if (orderStatus === 'Cancelled') await restock(order);
    order.orderStatus = orderStatus;
  }
  if (paymentStatus) order.paymentStatus = paymentStatus;
  await order.save();
  res.json({ order });
});
// Customer cancels own order - only before it ships
exports.cancel = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new HttpError(404, 'Order not found');
  if (String(order.user) !== String(req.user._id)) throw new HttpError(403, 'Not allowed to cancel this order');
  if (!['Pending', 'Confirmed'].includes(order.orderStatus)) throw new HttpError(409, `Order is already ${order.orderStatus.toLowerCase()} and can no longer be cancelled`);
  await restock(order);
  order.orderStatus = 'Cancelled';
  await order.save();
  res.json({ order });
});
