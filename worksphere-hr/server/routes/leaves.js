const r = require('express').Router();
const Leave = require('../models/Leave'), Employee = require('../models/Employee');
const { wrap, fail, day, page, paged } = require('../utils/helpers'), { authenticateUser, requireRole } = require('../middleware/auth');
r.use(authenticateUser);
const HR = requireRole('admin', 'hr');
const POP = [{ path: 'employee', select: 'employeeId firstName lastName department', populate: { path: 'department', select: 'name' } }, { path: 'reviewedBy', select: 'name' }];
const span = (a, b) => Math.round((b - a) / 864e5) + 1;

const list = async (q, s, mine) => {
  const p = page(q.query), f = {}, Q = q.query;
  if (mine) { if (!q.employee) throw fail(400, 'No employee profile linked'); f.employee = q.employee._id; }
  else {
    if (Q.employee) f.employee = Q.employee;
    else if (Q.department) f.employee = { $in: await Employee.find({ department: Q.department }).distinct('_id') };
  }
  ['status', 'leaveType'].forEach(k => { if (Q[k]) f[k] = Q[k]; });
  if (Q.from) f.endDate = { $gte: day(Q.from) };
  if (Q.to) f.startDate = { $lte: day(Q.to) };
  const [data, total] = await Promise.all([Leave.find(f).populate(POP).sort({ createdAt: -1 }).skip(p.skip).limit(p.limit), Leave.countDocuments(f)]);
  s.json(paged(data, total, p));
};

r.post('/', wrap(async (q, s) => {
  if (!q.employee) throw fail(400, 'No employee profile linked to this account');
  const { leaveType, startDate, endDate, reason } = q.body;
  if (!leaveType || !startDate || !endDate || !reason || !reason.trim()) throw fail(400, 'Leave type, dates and reason are required');
  const a = day(startDate), b = day(endDate);
  if (b < a) throw fail(400, 'End date cannot be before start date');
  if (a < day(new Date())) throw fail(400, 'Leave cannot start in the past');
  const clash = await Leave.findOne({ employee: q.employee._id, status: { $in: ['Pending', 'Approved'] }, startDate: { $lte: b }, endDate: { $gte: a } });
  if (clash) throw fail(409, 'This overlaps with an existing leave request');
  s.status(201).json(await Leave.create({ employee: q.employee._id, leaveType, startDate: a, endDate: b, days: span(a, b), reason }));
}));
r.get('/my', wrap((q, s) => list(q, s, true)));
r.get('/', HR, wrap((q, s) => list(q, s, false)));
r.get('/:id', wrap(async (q, s) => {
  const l = await Leave.findById(q.params.id).populate(POP); if (!l) throw fail(404, 'Leave request not found');
  if (q.user.role === 'employee' && !(q.employee && q.employee._id.equals(l.employee._id))) throw fail(403, 'Not your leave request');
  s.json(l);
}));

const review = status => [HR, wrap(async (q, s) => {
  const l = await Leave.findById(q.params.id); if (!l) throw fail(404, 'Leave request not found');
  if (l.status !== 'Pending') throw fail(400, 'Only pending requests can be reviewed');
  if (q.employee && q.employee._id.equals(l.employee)) throw fail(403, 'You cannot review your own leave request');
  Object.assign(l, { status, reviewedBy: q.user._id, reviewComment: q.body.comment || '', reviewedAt: new Date() });
  await l.save(); s.json(l);
})];
r.patch('/:id/approve', ...review('Approved'));
r.patch('/:id/reject', ...review('Rejected'));
r.patch('/:id/cancel', wrap(async (q, s) => {
  const l = await Leave.findById(q.params.id); if (!l) throw fail(404, 'Leave request not found');
  if (!(q.employee && q.employee._id.equals(l.employee))) throw fail(403, 'You can only cancel your own requests');
  const ok = l.status === 'Pending' || (l.status === 'Approved' && l.startDate > day(new Date()));
  if (!ok) throw fail(400, 'This request can no longer be cancelled');
  l.status = 'Cancelled'; await l.save(); s.json(l);
}));
module.exports = r;
