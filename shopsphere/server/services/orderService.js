const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const HttpError = require('../utils/HttpError');

const FREE_SHIPPING_ABOVE = 999, SHIPPING_FEE = 49;
const PAYMENT_METHODS = ['Cash on Delivery', 'Demo Card Payment', 'Test Payment'];
const PHONE = /^[0-9+\-\s]{10,15}$/, POSTAL = /^[0-9]{6}$/;
const ADDRESS_FIELDS = ['fullName', 'phone', 'address', 'city', 'state', 'postalCode'];

const validateShipping = (a) => {
  if (!a || ADDRESS_FIELDS.some((k) => !String(a[k] || '').trim())) throw new HttpError(400, 'Complete shipping information is required');
  if (!PHONE.test(String(a.phone))) throw new HttpError(400, 'Invalid phone number');
  if (!POSTAL.test(String(a.postalCode).trim())) throw new HttpError(400, 'Postal code must be 6 digits');
  return Object.fromEntries(ADDRESS_FIELDS.map((k) => [k, String(a[k]).trim()])); // only known fields are stored
};

// Merge duplicate lines and validate ids / quantities
const normaliseItems = (items) => {
  if (!Array.isArray(items) || !items.length) throw new HttpError(400, 'Cart is empty');
  const qtyById = new Map();
  for (const it of items) {
    if (!it || !mongoose.isValidObjectId(it.product)) throw new HttpError(400, 'Invalid product ID');
    const qty = Number(it.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 100) throw new HttpError(400, 'Invalid quantity');
    qtyById.set(String(it.product), (qtyById.get(String(it.product)) || 0) + qty);
  }
  return qtyById;
};

const restock = (order) => Promise.all(order.items.map((it) => Product.updateOne({ _id: it.product }, { $inc: { stock: it.quantity } })));

// Backend is the single source of truth for prices, shipping, totals and stock. Client-sent prices/totals are ignored.
async function placeOrder(userId, { items, shippingAddress, paymentMethod }) {
  const address = validateShipping(shippingAddress);
  const qtyById = normaliseItems(items);
  const reserved = [];
  try {
    const orderItems = []; let subtotal = 0;
    for (const [id, qty] of qtyById) {
      const p = await Product.findOne({ _id: id, isActive: true });
      if (!p) throw new HttpError(404, `Product not found: ${id}`);
      const upd = await Product.findOneAndUpdate({ _id: id, stock: { $gte: qty } }, { $inc: { stock: -qty } }); // atomic: no overselling
      if (!upd) throw new HttpError(400, `Insufficient stock for ${p.name} (available: ${p.stock})`);
      reserved.push([id, qty]);
      const price = p.discountPrice ?? p.price;
      subtotal += price * qty;
      orderItems.push({ product: p._id, productName: p.name, quantity: qty, price });
    }
    const shippingFee = subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
    const pm = PAYMENT_METHODS.includes(paymentMethod) ? paymentMethod : 'Cash on Delivery';
    return await Order.create({
      user: userId, items: orderItems, shippingAddress: address, subtotal, shippingFee, totalAmount: subtotal + shippingFee,
      paymentMethod: pm, paymentStatus: pm === 'Cash on Delivery' ? 'Pending' : 'Paid',
    });
  } catch (e) {
    for (const [id, qty] of reserved) await Product.updateOne({ _id: id }, { $inc: { stock: qty } }); // roll back reserved stock
    throw e;
  }
}
module.exports = { placeOrder, restock, FREE_SHIPPING_ABOVE, SHIPPING_FEE };
