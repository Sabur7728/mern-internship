# CareerConnect – Full-Stack Job Recruitment Platform (MERN)

CareerConnect connects **candidates**, **recruiters**, **companies** and **administrators**.
Candidates search and apply to jobs and track status; recruiters post jobs and manage applications;
admins manage the whole platform.

## Problem statement
Hiring is scattered across emails and spreadsheets. CareerConnect gives one place to publish jobs,
apply, review candidates and update application status, with strict role/ownership security.

## Features
- JWT authentication (register, login, logout, current user, expiry handling)
- Role-based access control (candidate / recruiter / admin) + ownership checks (recruiter can only edit own jobs/applications)
- Job CRUD, company auto-creation, candidate profiles, application workflow
- Search (title, skill, location, company), filters (type, experience, location, salary, skills), pagination
- Admin dashboard: stats, users (suspend/delete), companies, jobs, candidates, applications
- Loading / empty / error states, responsive UI, protected routes
- Backend validation, central error handler (400/401/403/404/409/500), health-check endpoint

## Tech stack
MongoDB · Express.js · React (Vite) · Node.js · Mongoose · JWT · bcryptjs · Axios · React Router

## Architecture
```
React (pages → components → context → services/api.js)
        │  HTTP/JSON  (Authorization: Bearer <JWT>)
Express (routes → middleware[protect, authorize] → controllers → services → Mongoose) → MongoDB
```
```
server/ config, models, routes, controllers, services, middleware, validators, utils, app.js, server.js, seed.js
client/src/ components, pages, layouts, context, services, hooks, routes, utils, App.jsx, main.jsx
```

## Prerequisites
Node.js 18+ and MongoDB (local: `mongodb://127.0.0.1:27017` or a free MongoDB Atlas cluster).

## Installation & run
```bash
# 1. install everything
npm run install:all          # or: cd server && npm i ; cd ../client && npm i

# 2. configure environment
cp server/.env.example server/.env      # edit MONGO_URI and JWT_SECRET
cp client/.env.example client/.env

# 3. load demo data (optional but recommended)
npm run seed

# 4. run backend  (http://localhost:5000)
npm run dev:server

# 5. run frontend (http://localhost:5173)  – in a second terminal
npm run dev:client
```

## Environment variables
| File | Variable | Purpose |
|---|---|---|
| server/.env | PORT | API port (5000) |
| | NODE_ENV | development / production |
| | MONGO_URI | MongoDB connection string |
| | JWT_SECRET | long random string (never commit) |
| | JWT_EXPIRES_IN | token lifetime, e.g. 7d |
| | CLIENT_URL | allowed CORS origin(s), comma separated |
| | SEED_PASSWORD | password for seeded demo users |
| client/.env | VITE_API_URL | API base URL (`/api` in dev, full URL in production) |

## Demo accounts (created by `npm run seed`, password = SEED_PASSWORD, default `Password@123`)
admin@careerconnect.com · recruiter1@careerconnect.com · recruiter2@careerconnect.com · candidate1@careerconnect.com · candidate2@careerconnect.com

## API overview
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/auth/me · POST /api/auth/logout | authenticated |
| GET | /api/jobs?search&location&employmentType&experience&salaryMin&skills&page&limit | public |
| GET | /api/jobs/:id | public |
| GET | /api/jobs/mine | recruiter |
| POST | /api/jobs | recruiter, admin |
| PATCH/PUT/DELETE | /api/jobs/:id | owner recruiter or admin |
| GET/PATCH | /api/candidates/me | candidate |
| GET | /api/candidates, /api/candidates/:id | recruiter (only own applicants), admin |
| POST/DELETE | /api/candidates, /api/candidates/:id | admin |
| PATCH | /api/candidates/:id | candidate (self) or admin |
| POST | /api/applications | candidate |
| GET | /api/applications | role-scoped (own / own jobs / all) |
| PATCH | /api/applications/:id | recruiter owning the job, admin |
| DELETE | /api/applications/:id | candidate (own, status Applied) or admin |
| GET | /api/admin/stats, /users, /companies, /jobs | admin |
| PATCH/DELETE | /api/admin/users/:id, /api/admin/companies/:id | admin |
| GET | /api/health | public health check |

Error format: `{ "success": false, "message": "...", "details": [...] }`

## Database
Collections: `users`, `companies`, `jobs`, `candidates`, `applications`.
`Application.candidate → Candidate`, `Application.job → Job`, `Job.company → Company`, `Job.recruiter → User`,
`Candidate.user → User`. Unique index on `(candidate, job)` stops duplicate applications; text/regular indexes on jobs.

## Authentication & authorization
Passwords are hashed with bcrypt (never stored in plaintext). Login returns a JWT sent as `Authorization: Bearer`.
`protect` middleware verifies the token (401), `authorize(...roles)` checks role (403), controllers check ownership (403).
React route protection is UX only; the backend is the real security layer.

## Key flows
- **Register:** React form → POST /api/auth/register → validation → bcrypt hash → MongoDB (+ Candidate profile) → JWT.
- **Apply:** Candidate → POST /api/applications {jobId} → job open? duplicate? → Application saved.
- **Update status:** Recruiter → PATCH /api/applications/:id → ownership check → saved → visible to candidate.

## Testing
- Manual API tests: `server/api-tests.http` (VS Code REST Client / Postman) – covers 401, 403, 404, 400, 409.
- UI checklist: login/register, search & filters, apply, withdraw, job CRUD, status update, admin management,
  responsive layout (resize browser), logout clears state.
- Verify DB with MongoDB Compass / `mongosh`: `use careerconnect; db.users.findOne()` (passwordHash is a bcrypt hash).

## Deployment
- MongoDB Atlas (database) → set `MONGO_URI`.
- Backend (Render/Railway): root `server`, build `npm install`, start `npm start`, set env vars, `CLIENT_URL=<frontend URL>`.
- Frontend (Vercel/Netlify): root `client`, build `npm run build`, output `dist`, set `VITE_API_URL=https://<api>/api`.
  SPA rewrites are included (`vercel.json`, `public/_redirects`).
- Smoke test: `GET https://<api>/api/health` should return `db: connected`.

## Known limitations
JWT is stored in localStorage (httpOnly cookie is safer); no file upload for resumes (URL only); no email
notifications; no automated unit tests; no rate limiting.
