const mongoose = require('mongoose');
module.exports = mongoose.model('Category', new mongoose.Schema({
  name: { type: String, required: [true, 'Category name is required'], unique: true, trim: true },
  description: String, image: String, isActive: { type: Boolean, default: true },
}, { timestamps: true }));
