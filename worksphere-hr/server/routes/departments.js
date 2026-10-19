const r = require('express').Router();
const Department = require('../models/Department'), Employee = require('../models/Employee');
const { wrap, fail } = require('../utils/helpers'), { authenticateUser, requireRole } = require('../middleware/auth');
r.use(authenticateUser, requireRole('admin', 'hr'));
const F = ['name', 'description', 'manager', 'location', 'isActive'];
const pick = b => Object.fromEntries(F.filter(k => b[k] !== undefined).map(k => [k, b[k]]));
r.get('/', wrap(async (q, s) => {
  const [d, c] = await Promise.all([Department.find().sort('name').lean(),
    Employee.aggregate([{ $match: { status: { $in: ['Active', 'On Leave'] } } }, { $group: { _id: '$department', count: { $sum: 1 } } }])]);
  const m = Object.fromEntries(c.map(x => [String(x._id), x.count]));
  s.json(d.map(x => ({ ...x, employeeCount: m[String(x._id)] || 0 })));
}));
r.get('/:id', wrap(async (q, s) => { const d = await Department.findById(q.params.id); if (!d) throw fail(404, 'Department not found'); s.json(d); }));
r.post('/', wrap(async (q, s) => s.status(201).json(await Department.create(pick(q.body)))));
r.patch('/:id', wrap(async (q, s) => {
  const d = await Department.findById(q.params.id); if (!d) throw fail(404, 'Department not found');
  Object.assign(d, pick(q.body)); await d.save(); s.json(d);
}));
r.delete('/:id', wrap(async (q, s) => {
  const n = await Employee.countDocuments({ department: q.params.id, status: { $in: ['Active', 'On Leave'] } });
  if (n) throw fail(400, `Cannot delete: ${n} active employee(s) still in this department`);
  await Department.findByIdAndDelete(q.params.id); s.json({ message: 'Department deleted' });
}));
module.exports = r;
