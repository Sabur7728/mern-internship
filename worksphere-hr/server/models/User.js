const m = require('mongoose'), b = require('bcryptjs');
const s = new m.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  password: { type: String, required: true, minlength: [6, 'Password must be at least 6 characters'], select: false },
  role: { type: String, enum: ['admin', 'hr', 'employee'], default: 'employee' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
s.pre('save', async function () { if (this.isModified('password')) this.password = await b.hash(this.password, 10); });
s.methods.match = function (p) { return b.compare(p, this.password); };
module.exports = m.model('User', s);
