const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: [true, 'Restaurant name is required'], trim: true },
  description: { type: String, trim: true },
  phone: String, email: String, address: String, city: String, state: String, postalCode: String,
  cuisineTypes: [String],
  image: String,
  rating: { type: Number, default: 0, min: 0, max: 5 },
  deliveryFee: { type: Number, default: 0, min: 0 },
  minimumOrder: { type: Number, default: 0, min: 0 },
  estimatedDeliveryTime: { type: Number, default: 30, min: 5 },
  isOpen: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
schema.index({ isActive: 1, rating: -1 });
module.exports = mongoose.model('Restaurant', schema);
