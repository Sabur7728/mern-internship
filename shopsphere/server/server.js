require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const PORT = process.env.PORT || 5000;
if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) { console.error('Missing JWT_SECRET or MONGODB_URI in environment (.env)'); process.exit(1); }
if (process.env.NODE_ENV === 'production' && /change_this/i.test(process.env.JWT_SECRET)) { console.error('Set a real JWT_SECRET before running in production'); process.exit(1); }
connectDB()
  .then(() => Product.updateMany({ finalPrice: { $exists: false } }, [{ $set: { finalPrice: { $ifNull: ['$discountPrice', '$price'] } } }])) // backfill for older data
  .then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)))
  .catch((e) => { console.error('Startup failed:', e.message); process.exit(1); });
