# CareerConnect - Day 19 (Testing, Debugging, Optimization, Deployment)

Folders: `backend/` (Express + MongoDB), `frontend/` (React + Vite), `docs/` (test plan, defect log, etc.)

## 1. Requirements
- Node.js 18+  (`node -v`)
- MongoDB running locally on port 27017 (or an Atlas URI in `backend/.env`)
- curl + jq for API tests (`sudo apt install jq` / `brew install jq`)

## 2. Run the backend
    cd backend
    npm install
    npm run dev                     # http://localhost:5000/api/health

## 3. Run the frontend (new terminal)
    cd frontend
    npm install
    npm run dev                     # http://localhost:5173

## 4. Create an admin (optional)
    cd backend
    ADMIN_EMAIL=admin@test.com ADMIN_PASSWORD='Admin@12345' npm run create-admin
    # Windows PowerShell:
    # $env:ADMIN_EMAIL="admin@test.com"; $env:ADMIN_PASSWORD="Admin@12345"; npm run create-admin

## 5. Automated tests
    cd backend  && npm test         # Jest + Supertest (downloads a MongoDB binary on first run)
    cd frontend && npm test         # Vitest + Testing Library

## 6. Manual API tests (backend must be running)
    cd backend
    ./api-tests.sh                  # prints HTTP status for every scenario
    ./smoke.sh http://localhost:5000/api http://localhost:5173

## 7. Production build test
    cd frontend && npm run build && npm run preview     # http://localhost:4173
    cd backend  && NODE_ENV=production npm start

## 8. Debug exercises
- API failure: set VITE_API_URL=http://localhost:9999/api in frontend/.env, restart, open /jobs -> error + Try again.
- Slow network: DevTools > Network > Slow 3G.
- Empty state: search "zzzzzz".
- DB failure: stop mongod, then `curl -i localhost:5000/api/jobs` -> 503 JSON.

## 9. Deploy
1. MongoDB Atlas: M0 cluster, DB user, Network Access 0.0.0.0/0, copy the connection string.
2. JWT secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
3. Push to GitHub.
4. Render (Web Service): Root `backend`, Build `npm install`, Start `npm start`.
   Env: NODE_ENV=production, MONGODB_URI, JWT_SECRET, CLIENT_URL (set to the Vercel URL, no trailing slash).
5. Vercel: Root `frontend`, Framework Vite, Output `dist`. Env: VITE_API_URL=https://YOUR-API.onrender.com/api
   (`vercel.json` handles SPA refresh; redeploy after changing VITE_ variables.)
6. Run `./smoke.sh https://YOUR-API.onrender.com/api https://YOUR-APP.vercel.app`

## 10. Final Git review
    git status && git diff
    git ls-files | grep -E "(^|/)\.env($|\.)" | grep -v ".env.example"     # must print nothing
    git add . && git commit -m "Test optimize and prepare MERN application for deployment" && git push
