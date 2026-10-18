const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const adm = require('../controllers/adminController');
router.get('/stats', protect, adminOnly, adm.stats);
module.exports = router;
