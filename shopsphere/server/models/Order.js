const mongoose = require('mongoose');
const item = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String, quantity: { type: Number, min: 1, required: true }, price: Number,
}, { _id: false });
module.exports = mongoose.model('Order', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [item],
  shippingAddress: { fullName: String, phone: String, address: String, city: String, state: String, postalCode: String },
  subtotal: Number, shippingFee: Number, totalAmount: Number,
  paymentMethod: { type: String, enum: ['Cash on Delivery', 'Demo Card Payment', 'Test Payment'], default: 'Cash on Delivery' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
}, { timestamps: true }));
