const mongoose = require('mongoose');
module.exports = mongoose.model('Category', new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: String, image: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true }));
