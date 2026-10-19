const r = require('express').Router(), jwt = require('jsonwebtoken'), User = require('../models/User');
const { wrap, fail } = require('../utils/helpers'), { authenticateUser, requireRole } = require('../middleware/auth');
const pub = u => ({ id: u._id, name: u.name, email: u.email, role: u.role });
r.post('/login', wrap(async (q, s) => {
  const { email, password } = q.body;
  if (!email || !password) throw fail(400, 'Email and password are required');
  const u = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!u || !(await u.match(password))) throw fail(401, 'Invalid email or password');
  if (!u.isActive) throw fail(403, 'Account is deactivated');
  s.json({ token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '1d' }), user: pub(u) });
}));
r.get('/me', authenticateUser, (q, s) => s.json({ user: pub(q.user), employee: q.employee }));
r.post('/register', authenticateUser, requireRole('admin'), wrap(async (q, s) => {
  const { name, email, password, role } = q.body;
  s.status(201).json(pub(await User.create({ name, email, password, role })));
}));
module.exports = r;
