const r = require('express').Router(), mongoose = require('mongoose');
const Employee = require('../models/Employee'), User = require('../models/User'), Department = require('../models/Department'), Attendance = require('../models/Attendance'), Leave = require('../models/Leave');
const { wrap, fail, esc, page, paged } = require('../utils/helpers'), { authenticateUser, requireRole } = require('../middleware/auth');
r.use(authenticateUser);
const HR = requireRole('admin', 'hr');
const find = id => mongoose.isValidObjectId(id) ? { _id: id } : { employeeId: String(id).toUpperCase() };
const FIELDS = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'department', 'designation', 'joiningDate', 'employmentType', 'salary', 'manager', 'address', 'city', 'state', 'postalCode', 'status'];
const pick = b => Object.fromEntries(FIELDS.filter(k => b[k] !== undefined && b[k] !== '').map(k => [k, b[k]]));
const summary = (M, id) => M.aggregate([{ $match: { employee: id } }, { $group: { _id: '$status', count: { $sum: 1 } } }]).then(a => Object.fromEntries(a.map(x => [x._id, x.count])));

r.get('/', HR, wrap(async (q, s) => {
  const p = page(q.query), f = {}, Q = q.query;
  if (Q.search) { const re = new RegExp(esc(Q.search), 'i'); f.$or = ['firstName', 'lastName', 'employeeId', 'email', 'designation'].map(k => ({ [k]: re })); }
  ['department', 'employmentType', 'status'].forEach(k => { if (Q[k]) f[k] = Q[k]; });
  if (Q.designation) f.designation = new RegExp(esc(Q.designation), 'i');
  const key = ['firstName', 'employeeId', 'designation', 'joiningDate', 'status'].includes(Q.sort) ? Q.sort : 'employeeId';
  const [data, total] = await Promise.all([
    Employee.find(f).populate('department', 'name').sort({ [key]: Q.order === 'desc' ? -1 : 1 }).skip(p.skip).limit(p.limit),
    Employee.countDocuments(f)]);
  s.json(paged(data, total, p));
}));

r.get('/:id', wrap(async (q, s) => {
  const e = await Employee.findOne(find(q.params.id)).populate('department', 'name location');
  if (!e) throw fail(404, 'Employee not found');
  if (q.user.role === 'employee' && !(q.employee && q.employee._id.equals(e._id))) throw fail(403, 'You can only view your own profile');
  const [attendanceSummary, leaveSummary] = await Promise.all([summary(Attendance, e._id), summary(Leave, e._id)]);
  s.json({ ...e.toJSON(), attendanceSummary, leaveSummary });
}));

r.post('/', HR, wrap(async (q, s) => {
  const d = pick(q.body);
  if (!(await Department.findById(d.department))) throw fail(400, 'Valid department is required');
  const last = await Employee.findOne().sort({ employeeId: -1 });
  const n = last ? parseInt(last.employeeId.slice(3)) + 1 : 1;
  const u = await User.create({ name: `${d.firstName} ${d.lastName}`, email: d.email, password: q.body.password || 'Welcome@123', role: 'employee' });
  try { s.status(201).json(await Employee.create({ ...d, employeeId: 'EMP' + String(n).padStart(3, '0'), user: u._id })); }
  catch (err) { await u.deleteOne(); throw err; }
}));

r.patch('/:id', HR, wrap(async (q, s) => {
  const e = await Employee.findOne(find(q.params.id)); if (!e) throw fail(404, 'Employee not found');
  const u = await User.findById(e.user);
  if (q.user.role === 'hr' && u && u.role === 'admin') throw fail(403, 'HR cannot modify administrator accounts');
  Object.assign(e, pick(q.body)); await e.save();
  if (u) { u.name = `${e.firstName} ${e.lastName}`; u.email = e.email; u.isActive = !['Inactive', 'Resigned'].includes(e.status); await u.save(); }
  s.json(e);
}));

r.delete('/:id', HR, wrap(async (q, s) => {
  const e = await Employee.findOne(find(q.params.id)); if (!e) throw fail(404, 'Employee not found');
  const u = await User.findById(e.user);
  if (q.user.role === 'hr' && u && u.role === 'admin') throw fail(403, 'HR cannot modify administrator accounts');
  if (u && String(u._id) === String(q.user._id)) throw fail(400, 'You cannot deactivate yourself');
  e.status = 'Inactive'; await e.save();
  if (u) { u.isActive = false; await u.save(); }
  s.json({ message: 'Employee deactivated' });
}));
module.exports = r;
