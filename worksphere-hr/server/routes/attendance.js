const r = require('express').Router();
const Attendance = require('../models/Attendance'), Employee = require('../models/Employee');
const { wrap, fail, day, mins, page, paged } = require('../utils/helpers'), { authenticateUser, requireRole } = require('../middleware/auth');
r.use(authenticateUser);
const HR = requireRole('admin', 'hr');
const TIME = /^\d{2}:\d{2}$/;
const calc = (a, b) => {
  if (a && !TIME.test(a) || b && !TIME.test(b)) throw fail(400, 'Time must be HH:mm');
  if (!a || !b) return 0;
  const m = mins(b) - mins(a); if (m < 0) throw fail(400, 'Check-out cannot be before check-in');
  return +(m / 60).toFixed(2);
};
const POP = { path: 'employee', select: 'employeeId firstName lastName department', populate: { path: 'department', select: 'name' } };

r.get('/stats', HR, wrap(async (q, s) => {
  const rows = await Attendance.aggregate([{ $match: { date: day(q.query.date || new Date()) } }, { $group: { _id: '$status', count: { $sum: 1 } } }]);
  s.json(Object.fromEntries(rows.map(x => [x._id, x.count])));
}));

r.get('/', wrap(async (q, s) => {
  const p = page(q.query), f = {}, Q = q.query;
  if (q.user.role === 'employee' || Q.mine === 'true') { if (!q.employee) throw fail(404, 'No employee profile linked'); f.employee = q.employee._id; }
  else {
    if (Q.employee) f.employee = Q.employee;
    else if (Q.department) f.employee = { $in: await Employee.find({ department: Q.department }).distinct('_id') };
  }
  if (Q.date) f.date = day(Q.date);
  if (Q.status) f.status = Q.status;
  const [data, total] = await Promise.all([Attendance.find(f).populate(POP).sort({ date: -1 }).skip(p.skip).limit(p.limit), Attendance.countDocuments(f)]);
  s.json(paged(data, total, p));
}));

r.get('/:id', wrap(async (q, s) => {
  const a = await Attendance.findById(q.params.id).populate(POP); if (!a) throw fail(404, 'Record not found');
  if (q.user.role === 'employee' && !(q.employee && q.employee._id.equals(a.employee._id))) throw fail(403, 'Not your record');
  s.json(a);
}));

r.post('/', HR, wrap(async (q, s) => {
  const { employee, date, checkIn, checkOut, status, remarks } = q.body;
  if (!employee || !date || !status) throw fail(400, 'Employee, date and status are required');
  const e = await Employee.findById(employee); if (!e) throw fail(404, 'Employee not found');
  if (['Inactive', 'Resigned'].includes(e.status)) throw fail(400, 'Cannot record attendance for inactive employees');
  const d = day(date);
  if (await Attendance.findOne({ employee, date: d })) throw fail(409, 'Attendance already recorded for this employee and date');
  s.status(201).json(await Attendance.create({ employee, date: d, checkIn, checkOut, status, remarks, workHours: calc(checkIn, checkOut) }));
}));

r.patch('/:id', HR, wrap(async (q, s) => {
  const a = await Attendance.findById(q.params.id); if (!a) throw fail(404, 'Record not found');
  ['checkIn', 'checkOut', 'status', 'remarks'].forEach(k => { if (q.body[k] !== undefined) a[k] = q.body[k]; });
  a.workHours = calc(a.checkIn, a.checkOut); await a.save(); s.json(a);
}));
module.exports = r;
