require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User'), Category = require('../models/Category'), Product = require('../models/Product'), Order = require('../models/Order');
const img = (s) => `https://picsum.photos/seed/${encodeURIComponent(s)}/600/450`;
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany(), Order.deleteMany()]);
  await User.create([
    { name: 'Admin', email: 'admin@shopsphere.com', password: 'admin123', role: 'admin', phone: '9999999999' },
    { name: 'Demo Customer', email: 'customer@shopsphere.com', password: 'customer123', phone: '8888888888' },
  ]);
  const names = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty', 'Sports'];
  const cats = {};
  for (const n of names) cats[n] = await Category.create({ name: n, description: `${n} products`, image: img(n) });
  const P = [
    ['Wireless Bluetooth Headphones', 'Electronics', 'SoundCore', 1999, 1599, 25, 4.4],
    ['Mechanical Keyboard', 'Electronics', 'KeyForge', 2499, null, 15, 4.6],
    ['Smart Fitness Band', 'Electronics', 'FitPulse', 2999, 2499, 30, 4.1],
    ['Portable Power Bank 20000mAh', 'Electronics', 'ChargeMax', 1799, 1499, 50, 4.3],
    ['Wireless Gaming Mouse', 'Electronics', 'KeyForge', 1299, null, 3, 4.2],
    ['Cotton Casual Shirt', 'Clothing', 'UrbanWeave', 999, 799, 40, 4.0],
    ['Slim Fit Denim Jeans', 'Clothing', 'DenimCo', 1799, 1399, 35, 4.2],
    ['Hooded Sweatshirt', 'Clothing', 'UrbanWeave', 1499, null, 22, 4.5],
    ["Women's Kurti Set", 'Clothing', 'Ethnic Roots', 1299, 999, 18, 4.3],
    ['Non-Stick Cookware Set', 'Home & Kitchen', 'ChefMate', 2999, 2399, 12, 4.4],
    ['Electric Kettle 1.5L', 'Home & Kitchen', 'HeatWave', 1199, 999, 28, 4.1],
    ['Stainless Steel Water Bottle', 'Home & Kitchen', 'HydroPure', 599, null, 60, 4.6],
    ['Programming Fundamentals Book', 'Books', 'TechPress', 699, null, 20, 4.5],
    ['The MERN Stack Handbook', 'Books', 'TechPress', 899, 749, 14, 4.7],
    ['Atomic Habits', 'Books', 'Penguin', 499, 449, 45, 4.8],
    ['Vitamin C Face Serum', 'Beauty', 'GlowLab', 649, 549, 38, 4.2],
    ['Herbal Shampoo 500ml', 'Beauty', 'PureLeaf', 399, null, 55, 4.0],
    ['Running Shoes', 'Sports', 'StrideX', 2799, 2299, 30, 4.5],
    ['Yoga Mat 6mm', 'Sports', 'FlexFit', 799, 649, 4, 4.3],
    ['Cricket Bat - English Willow', 'Sports', 'SG Pro', 3499, 2999, 10, 4.4],
    ['Adjustable Dumbbell Set', 'Sports', 'FlexFit', 3999, null, 8, 4.1],
  ];
  await Product.insertMany(P.map(([name, c, brand, price, discountPrice, stock, rating]) => ({
    name, brand, price, discountPrice: discountPrice || undefined, finalPrice: discountPrice || price, stock, rating, category: cats[c]._id, image: img(name),
    description: `${name} by ${brand}. A reliable, well-reviewed pick in ${c}.`,
  })));
  console.log('Seeded: 2 users, 6 categories, 21 products\nAdmin: admin@shopsphere.com / admin123\nCustomer: customer@shopsphere.com / customer123');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
