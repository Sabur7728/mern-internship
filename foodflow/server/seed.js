require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Category = require('./models/Category');
const Food = require('./models/FoodItem');
const Order = require('./models/Order');
const Review = require('./models/Review');

const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pickR = (a) => a[rnd(0, a.length - 1)];
const CATS = ['Starters', 'Main Course', 'Pizza', 'Burgers', 'Biryani', 'Chinese', 'Desserts', 'Beverages'];
// [name, category, price, veg(1/0), spice]
const R = [
  { name: 'Spice Route', cuisine: ['Indian'], city: 'Nanded', fee: 30, min: 150, eta: 35, foods: [
    ['Paneer Tikka', 'Starters', 220, 1, 2], ['Chicken Tikka', 'Starters', 260, 0, 3], ['Butter Chicken', 'Main Course', 340, 0, 2],
    ['Paneer Butter Masala', 'Main Course', 290, 1, 2], ['Dal Makhani', 'Main Course', 240, 1, 1], ['Gulab Jamun', 'Desserts', 90, 1, 0], ['Masala Chai', 'Beverages', 50, 1, 0]] },
  { name: 'Biryani Junction', cuisine: ['Indian', 'Biryani'], city: 'Nanded', fee: 20, min: 200, eta: 40, foods: [
    ['Hyderabadi Chicken Biryani', 'Biryani', 320, 0, 3], ['Veg Biryani', 'Biryani', 240, 1, 2], ['Mutton Biryani', 'Biryani', 420, 0, 3],
    ['Egg Biryani', 'Biryani', 260, 0, 2], ['Chicken 65', 'Starters', 230, 0, 3], ['Double Ka Meetha', 'Desserts', 110, 1, 0], ['Mango Lassi', 'Beverages', 90, 1, 0]] },
  { name: 'Pizza Palazzo', cuisine: ['Italian', 'Fast Food'], city: 'Latur', fee: 40, min: 250, eta: 30, foods: [
    ['Margherita Pizza', 'Pizza', 249, 1, 0], ['Farmhouse Pizza', 'Pizza', 349, 1, 1], ['Pepperoni Pizza', 'Pizza', 399, 0, 2],
    ['Garlic Bread', 'Starters', 129, 1, 0], ['Pasta Alfredo', 'Main Course', 279, 1, 0], ['Tiramisu', 'Desserts', 180, 1, 0], ['Cold Coffee', 'Beverages', 120, 1, 0]] },
  { name: 'Burger Barn', cuisine: ['Fast Food'], city: 'Latur', fee: 25, min: 150, eta: 25, foods: [
    ['Classic Veg Burger', 'Burgers', 119, 1, 1], ['Cheese Burger', 'Burgers', 149, 1, 1], ['Chicken Zinger Burger', 'Burgers', 189, 0, 2],
    ['Crispy Fries', 'Starters', 99, 1, 0], ['Peri Peri Nuggets', 'Starters', 159, 0, 2], ['Chocolate Shake', 'Beverages', 139, 1, 0], ['Fudge Brownie', 'Desserts', 110, 1, 0]] },
  { name: 'Dragon Wok', cuisine: ['Chinese'], city: 'Pune', fee: 35, min: 200, eta: 35, foods: [
    ['Veg Spring Roll', 'Starters', 160, 1, 1], ['Chilli Chicken', 'Chinese', 280, 0, 3], ['Hakka Noodles', 'Chinese', 210, 1, 2],
    ['Veg Manchurian', 'Chinese', 220, 1, 2], ['Egg Fried Rice', 'Chinese', 200, 0, 1], ['Honey Noodles with Ice Cream', 'Desserts', 170, 1, 0], ['Lemon Iced Tea', 'Beverages', 90, 1, 0]] },
  { name: 'Dosa Darbar', cuisine: ['South Indian'], city: 'Pune', fee: 0, min: 100, eta: 25, foods: [
    ['Masala Dosa', 'Main Course', 120, 1, 1], ['Idli Sambar', 'Main Course', 80, 1, 1], ['Medu Vada', 'Starters', 70, 1, 1],
    ['Onion Uttapam', 'Main Course', 110, 1, 1], ['Filter Coffee', 'Beverages', 50, 1, 0], ['Rava Kesari', 'Desserts', 60, 1, 0], ['Ven Pongal', 'Main Course', 100, 1, 1]] },
  { name: 'Sweet Crumbs', cuisine: ['Bakery'], city: 'Mumbai', fee: 45, min: 180, eta: 45, foods: [
    ['Chocolate Truffle Pastry', 'Desserts', 120, 1, 0], ['Red Velvet Cake Slice', 'Desserts', 150, 1, 0], ['Veg Puff', 'Starters', 40, 1, 1],
    ['Cheese Croissant', 'Starters', 95, 1, 0], ['Iced Latte', 'Beverages', 140, 1, 0], ['Vanilla Cupcake', 'Desserts', 80, 1, 0], ['Blueberry Muffin', 'Desserts', 90, 1, 0]] },
  { name: 'Taco Fiesta', cuisine: ['Mexican'], city: 'Mumbai', fee: 30, min: 220, eta: 30, foods: [
    ['Veg Burrito', 'Main Course', 220, 1, 2], ['Chicken Tacos', 'Main Course', 260, 0, 2], ['Nachos with Cheese', 'Starters', 180, 1, 1],
    ['Cheese Quesadilla', 'Starters', 210, 1, 1], ['Churros', 'Desserts', 150, 1, 0], ['Virgin Mojito', 'Beverages', 110, 1, 0], ['Burrito Bowl', 'Main Course', 280, 0, 2]] },
];
const COMMENTS = ['Loved it, arrived hot!', 'Great taste and portion size.', 'Good food, delivery was a bit late.', 'Absolutely delicious.', 'Value for money.', 'Will order again.'];
const FIRST = ['Aarav', 'Vivaan', 'Aditya', 'Ishaan', 'Sara', 'Ananya', 'Diya', 'Riya', 'Kabir', 'Zoya', 'Rohan', 'Meera', 'Arjun', 'Neha', 'Imran'];
const LAST = ['Sharma', 'Patil', 'Shaikh', 'Deshmukh', 'Khan', 'Joshi', 'Kulkarni', 'Pawar', 'More', 'Jadhav'];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Clearing old data...');
  await Promise.all([User, Restaurant, Category, Food, Order, Review].map((m) => m.deleteMany({})));

  const hash = (p) => bcrypt.hash(p, 10);
  const [adminPw, restPw, custPw] = await Promise.all([hash('Admin@123'), hash('Restaurant@123'), hash('Customer@123')]);
  const admin = await User.collection.insertOne({ name: 'FoodFlow Admin', email: 'admin@foodflow.com', password: adminPw, role: 'admin', isActive: true, createdAt: new Date(), updatedAt: new Date() });
  const now = new Date();
  const restUsers = Array.from({ length: 10 }, (_, i) => ({ name: `${R[i] ? R[i].name : 'Spare'} Owner`, email: `restaurant${i + 1}@foodflow.com`, password: restPw, phone: `98200000${String(i).padStart(2, '0')}`, role: 'restaurant', isActive: true, createdAt: now, updatedAt: now }));
  const customers = Array.from({ length: 30 }, (_, i) => ({ name: `${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`, email: `customer${i + 1}@foodflow.com`, password: custPw, phone: `97000000${String(i).padStart(2, '0')}`, role: 'customer', isActive: true, address: 'Station Road', createdAt: new Date(Date.now() - rnd(0, 120) * 864e5), updatedAt: now }));
  const ru = (await User.collection.insertMany(restUsers)).insertedIds;
  const cu = (await User.collection.insertMany(customers)).insertedIds;
  const restUserIds = Object.values(ru), custIds = Object.values(cu);

  const cats = await Category.insertMany(CATS.map((name) => ({ name, description: `${name} favourites` })));
  const catId = Object.fromEntries(cats.map((c) => [c.name, c._id]));

  const restaurants = [];
  let n = 0;
  for (let i = 0; i < R.length; i++) {
    const r = R[i];
    const doc = await Restaurant.create({
      owner: restUserIds[i], name: r.name, description: `${r.name} serves fresh ${r.cuisine.join(' & ')} food, made to order.`,
      phone: `98765432${10 + i}`, email: `hello@${r.name.toLowerCase().replace(/\s+/g, '')}.com`, address: `${10 + i} Main Market`, city: r.city, state: 'Maharashtra',
      postalCode: `4316${i}0`, cuisineTypes: r.cuisine, image: `https://loremflickr.com/800/500/restaurant,food?lock=${i + 1}`,
      rating: (rnd(38, 48) / 10), deliveryFee: r.fee, minimumOrder: r.min, estimatedDeliveryTime: r.eta, isOpen: i !== 6, isActive: true,
    });
    const foods = await Food.insertMany(r.foods.map(([name, cat, price, veg, spice]) => ({
      restaurant: doc._id, category: catId[cat], name, description: `Freshly prepared ${name.toLowerCase()} from ${r.name}.`, price,
      image: `https://loremflickr.com/600/400/${encodeURIComponent(name.split(' ').pop().toLowerCase())},food?lock=${++n}`,
      isVegetarian: !!veg, isVegan: false, spiceLevel: spice, preparationTime: rnd(10, 30), isAvailable: Math.random() > 0.08, rating: rnd(35, 50) / 10,
    })));
    restaurants.push({ doc, foods });
  }

  const STATUS = ['Delivered', 'Delivered', 'Delivered', 'Delivered', 'Delivered', 'Placed', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Cancelled'];
  const orders = [];
  for (let i = 0; i < 80; i++) {
    const { doc, foods } = pickR(restaurants);
    const avail = foods.filter((f) => f.isAvailable);
    const chosen = [...avail].sort(() => 0.5 - Math.random()).slice(0, rnd(1, 4)).map((f) => ({ f, q: rnd(1, 3) }));
    let subtotal = chosen.reduce((s, c) => s + c.f.price * c.q, 0);
    while (subtotal < doc.minimumOrder) { chosen[0].q++; subtotal += chosen[0].f.price; }
    const status = pickR(STATUS), method = pickR(['Cash on Delivery', 'Demo Card', 'Test Payment']);
    const created = new Date(Date.now() - (i < 8 ? rnd(0, 10) * 36e5 : rnd(0, 29) * 864e5 + rnd(0, 20) * 36e5));
    const cid = pickR(custIds);
    orders.push({
      customer: cid, restaurant: doc._id, createdAt: created, updatedAt: created,
      items: chosen.map((c) => ({ foodItem: c.f._id, name: c.f.name, price: c.f.price, quantity: c.q })),
      deliveryAddress: { fullName: 'Customer', phone: '9700000000', address: 'Station Road', city: doc.city, state: 'Maharashtra', postalCode: '431601' },
      subtotal, deliveryFee: doc.deliveryFee, discount: 0, totalAmount: subtotal + doc.deliveryFee, paymentMethod: method,
      paymentStatus: status === 'Cancelled' ? (method === 'Cash on Delivery' ? 'Pending' : 'Refunded') : status === 'Delivered' || method !== 'Cash on Delivery' ? 'Paid' : 'Pending',
      orderStatus: status,
    });
  }
  const saved = await Order.insertMany(orders);

  const reviews = saved.filter((o) => o.orderStatus === 'Delivered' && Math.random() > 0.4).map((o) => ({
    customer: o.customer, restaurant: o.restaurant, order: o._id, rating: rnd(3, 5), comment: pickR(COMMENTS),
  }));
  await Review.insertMany(reviews);
  const avg = await Review.aggregate([{ $group: { _id: '$restaurant', avg: { $avg: '$rating' } } }]);
  for (const a of avg) await Restaurant.findByIdAndUpdate(a._id, { rating: Math.round(a.avg * 10) / 10 });

  console.log(`Seeded: 1 admin, ${restUsers.length} restaurant users, ${customers.length} customers, ${restaurants.length} restaurants, ${n} food items, ${saved.length} orders, ${reviews.length} reviews`);
  console.log('Logins -> admin@foodflow.com / Admin@123 | restaurant1@foodflow.com / Restaurant@123 | customer1@foodflow.com / Customer@123');
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
