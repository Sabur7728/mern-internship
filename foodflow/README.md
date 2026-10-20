# FoodFlow - Food Delivery & Restaurant Management Platform (MERN)

Multi-role food delivery app: **Customer**, **Restaurant**, **Admin**. Built for LMS Trainee Program Project 3.

## Business problem
Customers need one place to discover restaurants, order food and track it. Restaurants need to manage menu and orders. The platform owner needs statistics and control.

## Tech stack
React 18 + Vite + React Router, Node.js + Express, MongoDB + Mongoose, JWT, bcryptjs.

## Quick start
```bash
# 1) Backend
cd server
npm install
npm run seed      # sample data (8 restaurants, 56 foods, 30 customers, 10 restaurant users, 80 orders)
npm run dev       # http://localhost:5000

# 2) Frontend (new terminal)
cd client
npm install
npm run dev       # http://localhost:5173
```
Requires Node 18+ and MongoDB running locally (or put an Atlas URL in `server/.env` -> `MONGODB_URI`).

## Demo logins (after seed)
| Role | Email | Password |
|---|---|---|
| Admin | admin@foodflow.com | Admin@123 |
| Restaurant | restaurant1@foodflow.com ... restaurant8@foodflow.com | Restaurant@123 |
| Customer | customer1@foodflow.com ... customer30@foodflow.com | Customer@123 |

Coupon to try at checkout: `FOOD10` (10% off, max Rs 100).

## Environment variables
`server/.env`: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES`, `CLIENT_URL`
`client/.env`: `VITE_API_URL=http://localhost:5000/api`
Never commit `.env` (already in .gitignore). Change `JWT_SECRET` before deploying.

## UI colour palette (Plum + Mint)
| Token | Hex | Use |
|---|---|---|
| Plum | `#4B1F7A` | primary buttons, navbar, links |
| Deep plum | `#2E1250` | navbar gradient, footer, hover |
| Mint | `#2EC4B6` | Add-to-cart / call-to-action, progress |
| Sunny yellow | `#FFC145` | promo banner, cart badge, focus ring |
| Lavender mist | `#F7F5FB` | page background |
| Ink | `#1B1030` | text |
Fonts: Bricolage Grotesque (headings) + Plus Jakarta Sans (body). Change colours in `client/src/index.css` (`:root`).

## Roles & authorization
- JWT in `Authorization: Bearer <token>`; `protect` + `authorize(...roles)` middleware.
- Ownership enforced in backend queries/checks: restaurant users only access their own restaurant, menu and orders; customers only their own orders/reviews.
- Passwords are hashed (bcrypt) and `select:false` so they never appear in API responses.

## Business rules (all on the backend)
- Order totals are recomputed from DB prices; frontend prices are ignored.
- Restaurant must be active and open; food must exist, belong to that restaurant and be available; minimum order enforced.
- Status flow: Placed -> Confirmed -> Preparing -> Ready -> Out for Delivery -> Delivered (+Cancelled). Invalid jump returns 422.
- Customer can cancel only in Placed / Confirmed (else 409).
- Reviews only for own Delivered orders, one per order; rating recalculated by aggregation.
- Cart (frontend) holds one restaurant only; conflict modal offers Keep / Clear and add / Cancel.

## API
```
POST /api/auth/register | POST /api/auth/login | GET,PATCH /api/auth/me
GET /api/restaurants?search&cuisine&minRating&maxDeliveryFee&maxDeliveryTime&isOpen&sort&page&limit
GET /api/restaurants/mine | GET /api/restaurants/:id | POST | PATCH /:id | DELETE /:id | GET /:id/reviews
GET /api/categories | POST /api/categories (admin)
GET /api/foods?restaurant&category&search&minPrice&maxPrice&vegetarian&sort&page&limit | GET /:id | POST | PATCH /:id | DELETE /:id
POST /api/orders | GET /api/orders/my | GET /api/orders/restaurant | GET /api/orders/admin | GET /api/orders/:id
PATCH /api/orders/:id/status | PATCH /api/orders/:id/cancel
POST /api/reviews | PATCH /api/reviews/:id | DELETE /api/reviews/:id
GET /api/dashboard/admin | GET /api/dashboard/restaurant
GET,POST /api/users | PATCH /api/users/:id/status   (admin)
```
List responses: `{ data, page, limit, total, totalPages }`.

## Aggregations used
Total sales, order count, orders by status, orders per day (14 days), top restaurants, top food items (`$unwind` items), average order value, customer growth per month, average review rating.

## Indexes
`users.email` unique, `restaurants.owner`, `restaurants {isActive, rating}`, `foods.restaurant`, `foods.category`, `orders.customer`, `orders.restaurant`, `orders.orderStatus`, `orders.createdAt`, `reviews.restaurant`, `reviews.order` unique.

## Security tests to run (Postman/Insomnia)
1. Customer token -> `GET /api/dashboard/admin` -> 403
2. Customer token -> `POST /api/restaurants` -> 403
3. Customer B -> `GET /api/orders/<customer A order id>` -> 403
4. Restaurant A -> `PATCH /api/foods/<restaurant B food id>` -> 403
5. Restaurant A -> `PATCH /api/orders/<restaurant B order id>/status` -> 403
6. No token -> `GET /api/orders/my` -> 401
7. Order with fake `price` in body -> total still uses DB price
8. Delivered order -> status `Preparing` -> 422
9. Subtotal below minimum order -> 422

## Project structure
```
foodflow/
  server/  config, controllers, middleware, models, routes, utils, seed.js, app.js, server.js
  client/  src/{components,context,hooks,layouts,pages,services,utils}
```

## Known limitations / ideas
Payments are simulated. Images use placeholder URLs (replace with your own). Ideas: coupons collection, favourites, delivery partner module, notifications.
