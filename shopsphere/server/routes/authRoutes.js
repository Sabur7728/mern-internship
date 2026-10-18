const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const auth = require('../controllers/authController');
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: Number(process.env.AUTH_RATE_LIMIT) || 100, standardHeaders: true, legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later' }, skip: () => process.env.NODE_ENV === 'test' });
router.post('/register', limiter, auth.register);
router.post('/login', limiter, auth.login);
router.get('/me', protect, auth.me);
module.exports = router;
