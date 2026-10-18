// End-to-end API check. Needs: MongoDB running, `npm run seed` done, server running (npm run dev).
// Usage: npm run smoke        (optional: API_URL=http://localhost:5000/api)
const { SHIPPING_FEE, FREE_SHIPPING_ABOVE } = require('../services/orderService');
const API = process.env.API_URL || 'http://localhost:5000/api';
let passed = 0, failed = 0;
const call = async (path, { method = 'GET', token, body } = {}) => {
  const res = await fetch(API + path, { method, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, data: await res.json().catch(() => ({})) };
};
const check = (name, cond, extra = '') => { cond ? passed++ : failed++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  ' + extra}`); };
const is = (name, r, status) => check(name, r.status === status, `expected ${status}, got ${r.status} ${JSON.stringify(r.data)}`);
const address = { fullName: 'Smoke Test', phone: '9876543210', address: '1 Test Street', city: 'Nanded', state: 'Maharashtra', postalCode: '431601' };

(async () => {
  const email = `smoke_${Date.now()}@example.com`;
  // ---- Authentication
  is('register customer', await call('/auth/register', { method: 'POST', body: { name: 'Smoke', email, password: 'secret1', phone: '9876543210' } }), 201);
  is('duplicate email -> 409', await call('/auth/register', { method: 'POST', body: { name: 'Smoke', email, password: 'secret1', phone: '9876543210' } }), 409);
  is('invalid email -> 400', await call('/auth/register', { method: 'POST', body: { name: 'S', email: 'nope', password: 'secret1', phone: '9876543210' } }), 400);
  is('short password -> 400', await call('/auth/register', { method: 'POST', body: { name: 'S', email: 'x@y.co', password: '12', phone: '9876543210' } }), 400);
  const login = await call('/auth/login', { method: 'POST', body: { email, password: 'secret1' } });
  is('login ok', login, 200); const token = login.data.token;
  is('wrong password -> 401', await call('/auth/login', { method: 'POST', body: { email, password: 'bad' } }), 401);
  is('GET /auth/me with token', await call('/auth/me', { token }), 200);
  is('GET /auth/me without token -> 401', await call('/auth/me'), 401);
  is('GET /auth/me bad token -> 401', await call('/auth/me', { token: 'bad.token' }), 401);
  const admin = (await call('/auth/login', { method: 'POST', body: { email: 'admin@shopsphere.com', password: 'admin123' } })).data.token;
  check('admin login (seeded)', !!admin, 'run npm run seed first');

  // ---- Authorization
  is('customer cannot create product -> 403', await call('/products', { method: 'POST', token, body: { name: 'x' } }), 403);
  is('customer cannot list all orders -> 403', await call('/orders', { token }), 403);
  is('customer cannot view admin stats -> 403', await call('/admin/stats', { token }), 403);

  // ---- Products / categories (admin CRUD)
  const cat = await call('/categories', { method: 'POST', token: admin, body: { name: `Smoke Cat ${Date.now()}` } });
  is('admin creates category', cat, 201);
  const draft = { name: 'Smoke Product', description: 'temp', price: 500, discountPrice: 400, category: cat.data.category?._id, brand: 'SmokeBrand', image: 'https://picsum.photos/400', stock: 5, rating: 4 };
  is('negative stock -> 400', await call('/products', { method: 'POST', token: admin, body: { ...draft, stock: -1 } }), 400);
  is('discount above price -> 400', await call('/products', { method: 'POST', token: admin, body: { ...draft, discountPrice: 900 } }), 400);
  is('unknown category -> 404', await call('/products', { method: 'POST', token: admin, body: { ...draft, category: '64b7f0f0f0f0f0f0f0f0f0f0' } }), 404);
  const prod = await call('/products', { method: 'POST', token: admin, body: draft });
  is('admin creates product', prod, 201); const pid = prod.data.product?._id;
  is('get product by id', await call(`/products/${pid}`), 200);
  is('invalid product id -> 400', await call('/products/123'), 400);
  is('missing product -> 404', await call('/products/64b7f0f0f0f0f0f0f0f0f0f0'), 404);
  const found = await call('/products?search=SmokeBrand&inStock=true&onDiscount=true&brand=smokebrand&minPrice=300&maxPrice=450&sort=price_asc');
  check('search + brand + discount + price filters combine', found.data.products?.some((p) => p._id === pid), JSON.stringify(found.data).slice(0, 120));
  check('price filter uses discounted price', (await call('/products?search=SmokeBrand&minPrice=450')).data.products?.length === 0);
  is('invalid sort -> 400', await call('/products?sort=bogus'), 400);
  is('update product price/stock', await call(`/products/${pid}`, { method: 'PATCH', token: admin, body: { stock: 10 } }), 200);

  // ---- Orders
  is('order unauthenticated -> 401', await call('/orders', { method: 'POST', body: { items: [] } }), 401);
  is('order invalid product id -> 400', await call('/orders', { method: 'POST', token, body: { items: [{ product: 'abc', quantity: 1 }], shippingAddress: address } }), 400);
  is('order invalid quantity -> 400', await call('/orders', { method: 'POST', token, body: { items: [{ product: pid, quantity: 0 }], shippingAddress: address } }), 400);
  is('order missing shipping -> 400', await call('/orders', { method: 'POST', token, body: { items: [{ product: pid, quantity: 1 }] } }), 400);
  is('order insufficient stock -> 400', await call('/orders', { method: 'POST', token, body: { items: [{ product: pid, quantity: 11 }], shippingAddress: address } }), 400);
  check('stock untouched after failed order', (await call(`/products/${pid}`)).data.product.stock === 10);
  // client tries to cheat on price/total: backend must ignore it
  const order = await call('/orders', { method: 'POST', token, body: { items: [{ product: pid, quantity: 2, price: 1 }], totalAmount: 1, shippingAddress: address, paymentMethod: 'Cash on Delivery' } });
  is('order created', order, 201); const o = order.data.order;
  const subtotal = 400 * 2, fee = subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
  check('backend calculates totals (ignores client price/total)', o?.subtotal === subtotal && o?.totalAmount === subtotal + fee, JSON.stringify(o));
  check('stock decreased', (await call(`/products/${pid}`)).data.product.stock === 8);
  check('customer sees order in my-orders', (await call('/orders/my-orders', { token })).data.orders?.some((x) => x._id === o._id));
  is('customer views own order', await call(`/orders/${o._id}`, { token }), 200);
  is('admin views order', await call(`/orders/${o._id}`, { token: admin }), 200);
  is('admin lists orders', await call('/orders?status=Pending', { token: admin }), 200);
  is('invalid status -> 400', await call(`/orders/${o._id}/status`, { method: 'PATCH', token: admin, body: { orderStatus: 'Teleported' } }), 400);
  is('customer cannot update status -> 403', await call(`/orders/${o._id}/status`, { method: 'PATCH', token, body: { orderStatus: 'Shipped' } }), 403);
  is('admin confirms order', await call(`/orders/${o._id}/status`, { method: 'PATCH', token: admin, body: { orderStatus: 'Confirmed' } }), 200);
  check('status persisted', (await call(`/orders/${o._id}`, { token })).data.order.orderStatus === 'Confirmed');
  is('customer cancels own order', await call(`/orders/${o._id}/cancel`, { method: 'PATCH', token }), 200);
  check('stock restored after cancel', (await call(`/products/${pid}`)).data.product.stock === 10);
  is('cancelled order cannot change -> 409', await call(`/orders/${o._id}/status`, { method: 'PATCH', token: admin, body: { orderStatus: 'Shipped' } }), 409);

  // ---- Profile / wishlist / dashboard
  is('update profile', await call('/users/me', { method: 'PATCH', token, body: { phone: '9123456780' } }), 200);
  is('invalid phone -> 400', await call('/users/me', { method: 'PATCH', token, body: { phone: '1' } }), 400);
  is('add wishlist', await call(`/users/me/wishlist/${pid}`, { method: 'PUT', token }), 200);
  check('wishlist lists product', (await call('/users/me/wishlist', { token })).data.products?.some((p) => p._id === pid));
  const stats = await call('/admin/stats', { token: admin });
  check('admin stats from backend', stats.status === 200 && typeof stats.data.totalSales === 'number' && Array.isArray(stats.data.lowStockProducts));

  // ---- cleanup
  is('admin deletes product', await call(`/products/${pid}`, { method: 'DELETE', token: admin }), 200);
  is('admin deletes category', await call(`/categories/${cat.data.category._id}`, { method: 'DELETE', token: admin }), 200);
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error('Smoke test crashed (is the server running?):', e.message); process.exit(1); });
