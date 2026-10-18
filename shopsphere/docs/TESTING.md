# ShopSphere – Testing & Debugging Guide

## 1. Automated checks
| Command (in `server/`) | Needs DB? | What it checks |
|---|---|---|
| `npm run test:validation` | No | Input validation (400), auth guards (401), invalid ObjectIds, bad query params, malformed JSON, 404 |
| `npm run smoke` | Yes (server running + seeded) | Full flow: auth, authorization (403), product/category CRUD, filters, order creation, backend totals, stock update, cancel + restock, wishlist, admin stats |

`npm run smoke` creates a throw-away customer, category and product and deletes the product/category at the end.

## 2. Practical exercise checklists (manual, in the browser or Postman)
**Authentication** – successful registration · duplicate email (409) · invalid email (400) · short password (400) · successful login · wrong password (401) · protected request with token · request without token (401) · customer calling an admin API (403).

**Cart** – add one product · add same product again · increase · decrease (never below 1) · remove · subtotal · shipping (₹49 under ₹999, free above) · total · empty cart message · quantity capped at stock.

**Orders** – logged-in customer places order · logged-out user redirected to login (API returns 401) · invalid product ID (400) · insufficient stock (400, stock unchanged) · totals match backend · order appears in MongoDB · stock reduced · customer sees it in *My orders* · admin sees it · admin changes status and the customer sees the new status · customer can cancel Pending/Confirmed orders (stock restored).

## 3. Debugging challenges – where to look
**A. Products not displaying** – is `mongod` running? Server log says "API running"? `VITE_API_URL` correct (restart Vite after editing `.env`)? Open `GET /api/products` in the browser; check status + JSON; Network tab in DevTools; React state in `Products.jsx` (`loading / error / data`).

**B. Admin can't create products** – token present in `localStorage`? Request has `Authorization: Bearer …`? `protect` returns 401 (bad/expired token) vs `adminOnly` returns 403 (role is not `admin`)? Body has a valid `category` ID (404 "Category not found" otherwise)? Validation message is returned in `message`.

**C. Order total incorrect** – compare: product `discountPrice ?? price` × quantity → subtotal → shipping rule (`services/orderService.js`) → total. The server ignores any price/total sent by the client; the frontend numbers are display-only.

**D. Quantity exceeds stock** – three layers: product details page (max = stock), cart context (`Math.min(…, stock)`), and the order API (atomic `$gte` stock check). Only the last one is a real security boundary; the smoke test tries 11 items when 10 exist.

## 4. Security checklist
- [x] Passwords hashed with bcrypt (`models/User.js`), never selected by default
- [x] `JWT_SECRET`, `MONGODB_URI` only in `.env` (git-ignored); server refuses to start without them
- [x] `.env` ignored by Git, only `.env.example` committed
- [x] Admin routes use `protect` + `adminOnly`; ownership checked for orders
- [x] Backend validation on every input; whitelist of writable product/category fields
- [x] Internal errors return a generic 500 message; DB outage returns 503
- [x] `helmet` security headers, CORS limited to `CLIENT_URL`, rate limit on login/register
- [x] Frontend role checks are UX only; the backend enforces access
