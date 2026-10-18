import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined. Copy .env.example to .env');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)))
  .catch((err) => { console.error('Failed to start server:', err.message); process.exit(1); });
