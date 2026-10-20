const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  rating: { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true });
module.exports = mongoose.model('Review', schema);
