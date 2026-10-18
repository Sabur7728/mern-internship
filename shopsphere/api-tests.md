# Quick API tests (curl)
```bash
API=http://localhost:5000/api
curl -X POST $API/auth/register -H 'Content-Type: application/json' -d '{"name":"Test","email":"t@t.com","password":"secret1","phone":"9876543210"}'
curl -X POST $API/auth/register -H 'Content-Type: application/json' -d '{"name":"Test","email":"t@t.com","password":"secret1"}'   # 409 duplicate
TOKEN=$(curl -s -X POST $API/auth/login -H 'Content-Type: application/json' -d '{"email":"admin@shopsphere.com","password":"admin123"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')
curl $API/auth/me -H "Authorization: Bearer $TOKEN"
curl "$API/products?search=headphones&sort=price_asc"
curl "$API/products?category=electronics&minPrice=500&maxPrice=5000&page=1&limit=10"
curl $API/admin/stats -H "Authorization: Bearer $TOKEN"
curl $API/orders -H "Authorization: Bearer bad"   # 401
```
CUST=$(curl -s -X POST $API/auth/login -H 'Content-Type: application/json' -d '{"email":"customer@shopsphere.com","password":"customer123"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')
curl -X PATCH $API/users/me -H "Authorization: Bearer $CUST" -H 'Content-Type: application/json' -d '{"phone":"9123456780"}'   # profile edit
curl -X PATCH $API/orders/<orderId>/cancel -H "Authorization: Bearer $CUST"   # cancel own Pending/Confirmed order
```
Customer calling `POST /api/products` returns 403; invalid ObjectId returns 400; insufficient stock returns 400.

More: `curl "$API/products?brand=KeyForge&minRating=4&onDiscount=true"` · `curl "$API/products?sort=bogus"` → 400 · `npm run smoke` runs everything automatically.
