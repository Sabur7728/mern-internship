# WorkSphere HR Portal (MERN)
Employee Management & HR Portal with 3 roles: Admin, HR Manager, Employee.

## Run (needs Node 18+ and MongoDB running locally)
```bash
# Terminal 1 - backend
cd server
npm install
cp .env.example .env        # edit MONGO_URI / JWT_SECRET if needed
npm run seed                # 6 departments, 26 employees, attendance, leaves
npm run dev                 # http://localhost:5000

# Terminal 2 - frontend
cd client
npm install
npm run dev                 # http://localhost:5173
```
## Demo logins
| Role | Email | Password |
|---|---|---|
| Admin | admin@worksphere.com | Admin@123 |
| HR | hr@worksphere.com | Hr@12345 |
| Employee | rahul@worksphere.com | Employee@123 |

## API
`/api/auth` (login, me, register[admin]) · `/api/users` (admin) · `/api/employees` (search, filters, sort, page, limit) · `/api/departments` · `/api/attendance` (+`/stats`) · `/api/leaves` (+`/my`, `/:id/approve|reject|cancel`) · `/api/dashboard/admin|hr|employee`

## Business rules
No duplicate attendance per employee/date · check-out >= check-in · no attendance for inactive employees · overlapping leave blocked · no self-approval · HR cannot modify admin accounts · department with active employees cannot be deleted · employees can only read their own profile/attendance/leaves · tenure auto-calculated.

## Security
bcrypt hashing, JWT in env secret, role middleware + ownership checks on backend, `.env` git-ignored, CORS restricted to CLIENT_URL.
