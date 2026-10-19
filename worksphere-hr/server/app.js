const express = require('express'), cors = require('cors');
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (q, s) => s.json({ ok: true }));
['auth', 'users', 'employees', 'departments', 'attendance', 'leaves', 'dashboard'].forEach(n => app.use('/api/' + n, require('./routes/' + n)));
app.use((q, s) => s.status(404).json({ message: 'Route not found' }));
app.use((e, q, s, n) => {
  if (e.name === 'ValidationError') return s.status(400).json({ message: Object.values(e.errors).map(x => x.message).join(', ') });
  if (e.code === 11000) return s.status(400).json({ message: 'Already exists: ' + Object.keys(e.keyValue || {}).join(', ') });
  if (e.name === 'CastError') return s.status(400).json({ message: 'Invalid id or value' });
  if (e.status) return s.status(e.status).json({ message: e.message });
  console.error(e); s.status(500).json({ message: 'Something went wrong on the server' });
});
module.exports = app;
