# ShopSphere – MERN E-Commerce Store & Product Management System

Customers browse, search, filter, cart and order products; admins manage products, categories, orders and see dashboard stats.

## Project structure
```
shopsphere/
├── client/src/  components · pages (+admin/) · layouts · services · context · hooks · utils
├── server/      config · controllers · middleware · models · routes (per resource) · services · utils
├── docs/        TESTING.md, screenshots/
└── shopsphere.postman.json
```

## Key features
- **Customer:** browse, debounced search, category/brand/price/rating/discount/stock filters (price uses the discounted price), sorting, pagination, product details, cart (stock-capped, Context API), checkout with simulated payment, order history/details with status tracker, protected routes.
- **Admin:** dashboard stats (from the API), product CRUD with inline stock updates, category CRUD, customer list, order management (search, filter, status/payment updates).
- **Extra features (hands-on challenge):** wishlist, customer profile editing, customer order cancellation (restocks items), recently viewed products, dark/light theme, low-stock alerts, pagination.

## Tech stack
React 18 (Vite), React Router 6, Context API, Node.js, Express 4, MongoDB, Mongoose, JWT, bcryptjs.

## Setup
**Prerequisite:** Node 18+ and MongoDB running locally (or an Atlas URI).

```bash
# Backend
cd server
npm install
cp .env.example .env     # edit MONGODB_URI and JWT_SECRET
npm run seed             # 6 categories, 21 products, 2 users (re-run after upgrading: adds the finalPrice field)
npm run dev              # http://localhost:5000

# Frontend (new terminal)
cd client
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

## Screenshots
Add screenshots of the home page, product listing, cart, checkout, orders and admin dashboard to `docs/screenshots/` and link them here.

## Environment variables
Server: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, optional `AUTH_RATE_LIMIT`. Client: `VITE_API_URL`.

## Demo credentials
- Admin: `admin@shopsphere.com` / `admin123`
- Customer: `customer@shopsphere.com` / `customer123`

## API summary
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | Public |
| GET | /api/auth/me | Auth |
| GET | /api/products (search, category, brand, minPrice, maxPrice, minRating, onDiscount, inStock, sort, page, limit) | Public |
| GET | /api/products/brands | Public |
| GET | /api/products/:id | Public |
| POST/PATCH/DELETE | /api/products[/:id] | Admin |
| GET | /api/categories | Public |
| POST/PATCH/DELETE | /api/categories[/:id] | Admin |
| POST | /api/orders | Auth |
| GET | /api/orders/my-orders, /api/orders/:id | Auth (owner/admin) |
| GET | /api/orders | Admin |
| PATCH | /api/orders/:id/status | Admin |
| PATCH | /api/orders/:id/cancel | Auth (owner, Pending/Confirmed only) |
| PATCH | /api/users/me | Auth (name, phone, address) |
| GET | /api/users | Admin (customer list) |
| GET | /api/users/me/wishlist | Auth |
| PUT/DELETE | /api/users/me/wishlist/:productId | Auth |
| GET | /api/admin/stats | Admin |

Sort values: `newest`, `price_asc`, `price_desc`, `rating`, `name_asc`.

## Security notes
Passwords hashed (bcrypt); JWT secret in `.env`; role checks enforced in backend middleware; order totals and stock are validated/calculated on the server (atomic stock decrement); `.env` is git-ignored; product/category writes whitelist allowed fields (no mass-assignment); finished orders (Delivered/Cancelled) cannot be changed; JSON body size is limited.

## Testing
`npm run test:validation` (no DB) and `npm run smoke` (needs seeded DB + running server) in `server/`; full checklists in `docs/TESTING.md`. Import `shopsphere.postman.json` into Postman (set `baseUrl`; the Login requests store `adminToken` / `customerToken` automatically) or use the curl snippets in `api-tests.md`. Run the full customer and admin journeys from the project brief manually.

## Known limitations / future improvements
Product image upload, reviews, coupons, real payment gateway, automated tests, screenshots (add yours in `docs/screenshots/`).
