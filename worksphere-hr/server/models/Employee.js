const m = require('mongoose');
const s = new m.Schema({
  employeeId: { type: String, unique: true, required: true },
  user: { type: m.Schema.Types.ObjectId, ref: 'User' },
  firstName: { type: String, required: [true, 'First name is required'], trim: true },
  lastName: { type: String, required: [true, 'Last name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  phone: { type: String, match: [/^\d{10}$/, 'Phone must be 10 digits'] },
  dateOfBirth: Date,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  department: { type: m.Schema.Types.ObjectId, ref: 'Department', required: [true, 'Department is required'] },
  designation: { type: String, required: [true, 'Designation is required'] },
  joiningDate: { type: Date, required: [true, 'Joining date is required'] },
  employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Intern'], default: 'Full-time' },
  salary: { type: Number, min: 0 },
  manager: String, address: String, city: String, state: String, postalCode: String,
  status: { type: String, enum: ['Active', 'On Leave', 'Inactive', 'Resigned'], default: 'Active' }
}, { timestamps: true });
s.virtual('tenure').get(function () { const mo = (Date.now() - this.joiningDate) / 2629800000; return `${Math.floor(mo / 12)}y ${Math.floor(mo % 12)}m`; });
s.set('toJSON', { virtuals: true });
module.exports = m.model('Employee', s);
