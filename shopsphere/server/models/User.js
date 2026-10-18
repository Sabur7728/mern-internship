const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  password: { type: String, required: true, minlength: [6, 'Password must be at least 6 characters'], select: false },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phone: { type: String, match: [/^[0-9+\-\s]{10,15}$/, 'Invalid phone number'] },
  address: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });
schema.pre('save', async function () { if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10); });
schema.methods.matchPassword = function (p) { return bcrypt.compare(p, this.password); };
module.exports = mongoose.model('User', schema);
