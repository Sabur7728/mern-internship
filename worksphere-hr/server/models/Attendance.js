const m = require('mongoose');
const s = new m.Schema({
  employee: { type: m.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  checkIn: { type: String, match: /^\d{2}:\d{2}$/ }, checkOut: { type: String, match: /^\d{2}:\d{2}$/ },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half Day', 'Work From Home'], required: true },
  workHours: { type: Number, default: 0 }, remarks: String
}, { timestamps: true });
s.index({ employee: 1, date: 1 }, { unique: true });
module.exports = m.model('Attendance', s);
