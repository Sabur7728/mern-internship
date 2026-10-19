require('dotenv').config();
const app = require('./app'), connect = require('./config/db');
connect().then(() => app.listen(process.env.PORT || 5000, () => console.log('Server on port ' + (process.env.PORT || 5000))))
  .catch(e => { console.error('DB connection failed:', e.message); process.exit(1); });
