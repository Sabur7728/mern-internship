const m = require('mongoose');
module.exports = m.model('Department', new m.Schema({
  name: { type: String, required: [true, 'Department name is required'], unique: true, trim: true },
  description: String, manager: String, location: String, isActive: { type: Boolean, default: true }
}, { timestamps: true }));
