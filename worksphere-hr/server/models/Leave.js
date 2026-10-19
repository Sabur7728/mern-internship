const m = require('mongoose');
module.exports = m.model('Leave', new m.Schema({
  employee: { type: m.Schema.Types.ObjectId, ref: 'Employee', required: true },
  leaveType: { type: String, enum: ['Casual Leave', 'Sick Leave', 'Annual Leave', 'Emergency Leave', 'Unpaid Leave'], required: true },
  startDate: { type: Date, required: true }, endDate: { type: Date, required: true }, days: Number,
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], default: 'Pending' },
  reviewedBy: { type: m.Schema.Types.ObjectId, ref: 'User' }, reviewComment: String, reviewedAt: Date
}, { timestamps: true }));
