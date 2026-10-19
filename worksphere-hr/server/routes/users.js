const r = require('express').Router(), User = require('../models/User');
const { wrap, fail } = require('../utils/helpers'), { authenticateUser, requireRole } = require('../middleware/auth');
r.use(authenticateUser, requireRole('admin'));
r.get('/', wrap(async (q, s) => s.json(await User.find().sort('name'))));
r.patch('/:id', wrap(async (q, s) => {
  const u = await User.findById(q.params.id); if (!u) throw fail(404, 'User not found');
  if (String(u._id) === String(q.user._id)) throw fail(400, 'You cannot change your own account here');
  if (q.body.role) u.role = q.body.role;
  if (q.body.isActive !== undefined) u.isActive = q.body.isActive;
  await u.save(); s.json(u);
}));
module.exports = r;
