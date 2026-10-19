const jwt = require('jsonwebtoken'), User = require('../models/User'), Employee = require('../models/Employee');
exports.authenticateUser = async (req, res, next) => {
  try {
    const h = req.headers.authorization || '';
    if (!h.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authenticated' });
    const { id } = jwt.verify(h.slice(7), process.env.JWT_SECRET);
    const u = await User.findById(id);
    if (!u || !u.isActive) return res.status(401).json({ message: 'Account not found or inactive' });
    req.user = u;
    req.employee = await Employee.findOne({ user: u._id }).populate('department', 'name');
    next();
  } catch { res.status(401).json({ message: 'Invalid or expired token' }); }
};
exports.requireRole = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'You do not have permission to do this' });
