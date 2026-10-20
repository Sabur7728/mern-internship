const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  name: { type: String, required: [true, 'Food name is required'], trim: true, maxlength: 80 },
  description: { type: String, trim: true },
  price: { type: Number, required: [true, 'Price is required'], min: [1, 'Price must be greater than 0'] },
  image: String,
  isVegetarian: { type: Boolean, default: true },
  isVegan: { type: Boolean, default: false },
  spiceLevel: { type: Number, min: 0, max: 3, default: 0 },
  preparationTime: { type: Number, min: 1, default: 15 },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 4, min: 0, max: 5 },
}, { timestamps: true });
module.exports = mongoose.model('FoodItem', schema);
