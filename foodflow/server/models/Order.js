const mongoose = require('mongoose');
const item = new mongoose.Schema({
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  name: { type: String, required: true },      // snapshot for history
  price: { type: Number, required: true },     // snapshot for history
  quantity: { type: Number, required: true, min: 1 },
  specialInstructions: String,
}, { _id: false });
const schema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  items: { type: [item], validate: (v) => v.length > 0 },
  deliveryAddress: { fullName: String, phone: String, address: String, city: String, state: String, postalCode: String },
  subtotal: Number, deliveryFee: Number, discount: { type: Number, default: 0 }, totalAmount: Number,
  paymentMethod: { type: String, enum: ['Cash on Delivery', 'Demo Card', 'Test Payment'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Placed', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Placed', index: true },
  customerNote: String,
}, { timestamps: true });
schema.index({ createdAt: -1 });
module.exports = mongoose.model('Order', schema);
