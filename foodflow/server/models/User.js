const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address'] },
  password: { type: String, required: true, minlength: 6, select: false },
  phone: { type: String, trim: true },
  role: { type: String, enum: ['customer', 'restaurant', 'admin'], default: 'customer' },
  address: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
schema.pre('save', async function () {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10);
});
schema.methods.matchPassword = function (p) { return bcrypt.compare(p, this.password); };
module.exports = mongoose.model('User', schema);
