const router = require('express').Router();
const { protect, optionalAuth, authorize } = require('../middleware/auth');
const auth = require('../controllers/authController');
const rest = require('../controllers/restaurantController');
const food = require('../controllers/foodController');
const cat = require('../controllers/categoryController');
const order = require('../controllers/orderController');
const review = require('../controllers/reviewController');
const dash = require('../controllers/dashboardController');
const users = require('../controllers/userController');

// auth
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', protect, auth.me);
router.patch('/auth/me', protect, auth.updateMe);

// restaurants
router.get('/restaurants', optionalAuth, rest.list);
router.get('/restaurants/mine', protect, authorize('restaurant'), rest.mine);
router.post('/restaurants', protect, authorize('restaurant', 'admin'), rest.create);
router.get('/restaurants/:id', optionalAuth, rest.getOne);
router.get('/restaurants/:id/reviews', rest.reviews);
router.patch('/restaurants/:id', protect, authorize('restaurant', 'admin'), rest.update);
router.delete('/restaurants/:id', protect, authorize('restaurant', 'admin'), rest.remove);

// categories
router.get('/categories', cat.list);
router.post('/categories', protect, authorize('admin'), cat.create);

// foods
router.get('/foods', food.list);
router.get('/foods/:id', food.getOne);
router.post('/foods', protect, authorize('restaurant', 'admin'), food.create);
router.patch('/foods/:id', protect, authorize('restaurant', 'admin'), food.update);
router.delete('/foods/:id', protect, authorize('restaurant', 'admin'), food.remove);

// orders (static paths before /:id)
router.post('/orders', protect, authorize('customer', 'admin'), order.create);
router.get('/orders/my', protect, authorize('customer', 'admin'), order.my);
router.get('/orders/restaurant', protect, authorize('restaurant'), order.restaurantOrders);
router.get('/orders/admin', protect, authorize('admin'), order.adminOrders);
router.get('/orders/:id', protect, order.getOne);
router.patch('/orders/:id/status', protect, authorize('restaurant', 'admin'), order.updateStatus);
router.patch('/orders/:id/cancel', protect, authorize('customer', 'admin'), order.cancel);

// reviews
router.post('/reviews', protect, authorize('customer'), review.create);
router.patch('/reviews/:id', protect, authorize('customer', 'admin'), review.update);
router.delete('/reviews/:id', protect, authorize('customer', 'admin'), review.remove);

// dashboard
router.get('/dashboard/admin', protect, authorize('admin'), dash.admin);
router.get('/dashboard/restaurant', protect, authorize('restaurant'), dash.restaurant);

// users (admin)
router.get('/users', protect, authorize('admin'), users.list);
router.post('/users', protect, authorize('admin'), users.create);
router.patch('/users/:id/status', protect, authorize('admin'), users.setStatus);

module.exports = router;
