const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Food = require('../models/FoodItem');
const { myRestaurant } = require('../middleware/auth');
const { ApiError, asyncH, paginate, pageRes, isId } = require('../utils/helpers');

// Allowed status transitions (enforced on backend)
const FLOW = {
  Placed: ['Confirmed', 'Cancelled'],
  Confirmed: ['Preparing', 'Cancelled'],
  Preparing: ['Ready'],
  Ready: ['Out for Delivery'],
  'Out for Delivery': ['Delivered'],
  Delivered: [],
  Cancelled: [],
};
const CUSTOMER_CAN_CANCEL = ['Placed', 'Confirmed'];
const PAYMENTS = ['Cash on Delivery', 'Demo Card', 'Test Payment'];
const discountFor = (code, subtotal) => (code && String(code).toUpperCase() === 'FOOD10' ? Math.min(Math.round(subtotal * 0.1), 100) : 0);

exports.create = asyncH(async (req, res) => {
  const { restaurant: rid, items, deliveryAddress: a, paymentMethod, customerNote, couponCode } = req.body;
  if (!rid || !Array.isArray(items) || !items.length) throw new ApiError(400, 'Restaurant and at least one item are required');
  if (!a || !a.fullName || !a.phone || !a.address || !a.city || !a.state || !a.postalCode)
    throw new ApiError(422, 'Complete delivery address is required');
  if (!PAYMENTS.includes(paymentMethod)) throw new ApiError(422, 'Invalid payment method');
  if (!isId(rid)) throw new ApiError(404, 'Restaurant not found');

  const rest = await Restaurant.findById(rid);
  if (!rest) throw new ApiError(404, 'Restaurant not found');
  if (!rest.isActive) throw new ApiError(409, 'This restaurant is not active');
  if (!rest.isOpen) throw new ApiError(409, 'This restaurant is currently closed');

  const merged = new Map();
  for (const it of items) {
    const qty = Number(it.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) throw new ApiError(422, 'Quantity must be a whole number between 1 and 20');
    if (!isId(it.foodItem)) throw new ApiError(404, 'Food item not found');
    const key = String(it.foodItem), prev = merged.get(key);
    merged.set(key, { quantity: (prev ? prev.quantity : 0) + qty, specialInstructions: it.specialInstructions || (prev && prev.specialInstructions) || '' });
  }
  const ids = [...merged.keys()];
  const foods = await Food.find({ _id: { $in: ids } });
  if (foods.length !== ids.length) throw new ApiError(404, 'One or more food items were not found');

  let subtotal = 0;
  const orderItems = [];
  for (const f of foods) {
    if (!f.restaurant.equals(rest._id)) throw new ApiError(422, `${f.name} does not belong to this restaurant`);
    if (!f.isAvailable) throw new ApiError(409, `${f.name} is currently unavailable`);
    if (!(f.price > 0)) throw new ApiError(422, `${f.name} has an invalid price`);
    const m = merged.get(String(f._id));
    subtotal += f.price * m.quantity; // authoritative DB price - never the frontend price
    orderItems.push({ foodItem: f._id, name: f.name, price: f.price, quantity: m.quantity, specialInstructions: m.specialInstructions });
  }
  if (subtotal < rest.minimumOrder) throw new ApiError(422, `Minimum order for this restaurant is ₹${rest.minimumOrder}`);
  const deliveryFee = rest.deliveryFee;
  const discount = discountFor(couponCode, subtotal);
  const order = await Order.create({
    customer: req.user._id, restaurant: rest._id, items: orderItems, deliveryAddress: a,
    subtotal, deliveryFee, discount, totalAmount: subtotal + deliveryFee - discount,
    paymentMethod, paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid', customerNote,
  });
  res.status(201).json({ data: order });
});

exports.my = asyncH(async (req, res) => {
  const f = { customer: req.user._id };
  if (req.query.status) f.orderStatus = req.query.status;
  const p = paginate(req.query);
  const [data, total] = await Promise.all([
    Order.find(f).sort('-createdAt').skip(p.skip).limit(p.limit).populate('restaurant', 'name image').lean(),
    Order.countDocuments(f),
  ]);
  res.json(pageRes(data, total, p));
});

exports.restaurantOrders = asyncH(async (req, res) => {
  const r = await myRestaurant(req.user);
  if (!r) throw new ApiError(404, 'You have not created a restaurant yet');
  const f = { restaurant: r._id }; // ownership enforced in the query itself
  if (req.query.status) f.orderStatus = req.query.status;
  const p = paginate(req.query);
  const [data, total] = await Promise.all([
    Order.find(f).sort('-createdAt').skip(p.skip).limit(p.limit).populate('customer', 'name phone').lean(),
    Order.countDocuments(f),
  ]);
  res.json(pageRes(data, total, p));
});

exports.adminOrders = asyncH(async (req, res) => {
  const q = req.query, f = {};
  if (q.restaurant) f.restaurant = q.restaurant;
  if (q.customer) f.customer = q.customer;
  if (q.orderStatus) f.orderStatus = q.orderStatus;
  if (q.paymentStatus) f.paymentStatus = q.paymentStatus;
  if (q.from || q.to) {
    f.createdAt = {};
    if (q.from) f.createdAt.$gte = new Date(q.from);
    if (q.to) { const t = new Date(q.to); t.setHours(23, 59, 59, 999); f.createdAt.$lte = t; }
  }
  const p = paginate(q);
  const [data, total] = await Promise.all([
    Order.find(f).sort('-createdAt').skip(p.skip).limit(p.limit).populate('customer', 'name email').populate('restaurant', 'name').lean(),
    Order.countDocuments(f),
  ]);
  res.json(pageRes(data, total, p));
});

exports.getOne = asyncH(async (req, res) => {
  const o = await Order.findById(req.params.id).populate('restaurant', 'name image phone address owner').populate('customer', 'name email phone');
  if (!o) throw new ApiError(404, 'Order not found');
  const u = req.user;
  const ok = u.role === 'admin' || (u.role === 'customer' && o.customer._id.equals(u._id)) ||
    (u.role === 'restaurant' && o.restaurant.owner.equals(u._id));
  if (!ok) throw new ApiError(403, 'You are not allowed to view this order');
  res.json({ data: o });
});

exports.updateStatus = asyncH(async (req, res) => {
  const { status } = req.body;
  const o = await Order.findById(req.params.id);
  if (!o) throw new ApiError(404, 'Order not found');
  const r = await Restaurant.findById(o.restaurant);
  if (req.user.role !== 'admin' && !(r && r.owner.equals(req.user._id))) throw new ApiError(403, 'This order does not belong to your restaurant');
  if (!FLOW[status] || !FLOW[o.orderStatus].includes(status))
    throw new ApiError(422, `Invalid status change: ${o.orderStatus} → ${status}`);
  o.orderStatus = status;
  if (status === 'Delivered' && o.paymentMethod === 'Cash on Delivery') o.paymentStatus = 'Paid';
  if (status === 'Cancelled' && o.paymentStatus === 'Paid') o.paymentStatus = 'Refunded';
  await o.save();
  res.json({ data: o });
});

exports.cancel = asyncH(async (req, res) => {
  const o = await Order.findById(req.params.id);
  if (!o) throw new ApiError(404, 'Order not found');
  if (req.user.role !== 'admin' && !o.customer.equals(req.user._id)) throw new ApiError(403, 'You can only cancel your own orders');
  if (!CUSTOMER_CAN_CANCEL.includes(o.orderStatus)) throw new ApiError(409, `Order cannot be cancelled once it is ${o.orderStatus}`);
  o.orderStatus = 'Cancelled';
  if (o.paymentStatus === 'Paid') o.paymentStatus = 'Refunded';
  await o.save();
  res.json({ data: o });
});
