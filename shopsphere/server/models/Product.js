const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true, minlength: [2, 'Product name is too short'], maxlength: [120, 'Product name is too long'] },
  description: { type: String, default: '' },
  price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
  discountPrice: { type: Number, min: [0, 'Discount price cannot be negative'], validate: { validator(v) { return v == null || v <= this.price; }, message: 'Discount price cannot exceed price' } },
  finalPrice: { type: Number, index: true }, // discountPrice if set, otherwise price; used for filtering/sorting by what the customer pays
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'Category is required'] },
  brand: { type: String, trim: true },
  image: { type: String, trim: true, match: [/^(https?:\/\/\S+)?$/, 'Image must be a valid http(s) URL'] },
  stock: { type: Number, required: [true, 'Stock is required'], min: [0, 'Stock cannot be negative'], default: 0, validate: { validator: Number.isInteger, message: 'Stock must be a whole number' } },
  rating: { type: Number, min: [0, 'Rating must be between 0 and 5'], max: [5, 'Rating must be between 0 and 5'], default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
schema.pre('validate', function () { this.finalPrice = this.discountPrice != null ? this.discountPrice : this.price; });
schema.index({ name: 'text', brand: 'text' });
module.exports = mongoose.model('Product', schema);
