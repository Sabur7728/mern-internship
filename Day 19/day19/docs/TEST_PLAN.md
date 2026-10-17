# CareerConnect Test Plan (Day 19)

Fill the **Actual** and **Status** columns while testing.

| ID | Feature | Precondition | Steps / Input | Expected | Actual | Status |
|----|---------|--------------|---------------|----------|--------|--------|
| REG-001 | Registration | None | Valid name/email/password | 201, no password in response | | |
| REG-002 | Registration | Email exists | Same email again | 409 | | |
| REG-003 | Registration | None | Email "abc" | 400 | | |
| REG-004 | Registration | None | 7-char password | 400 | | |
| REG-005 | Registration | None | role="admin" | Created as candidate | | |
| AUTH-001 | Login | User exists | Valid credentials | 200 + token | | |
| AUTH-002 | Login | User exists | Wrong password | 401 | | |
| AUTH-003 | Login | None | Unknown email | 401 | | |
| AUTH-004 | Login | None | Empty form | Validation error | | |
| AUTH-005 | Logout | Logged in | Logout, press Back | Redirect to login | | |
| AUTH-006 | Protected API | None | GET /api/auth/me no token | 401 | | |
| AUTH-007 | Protected API | None | Garbage token | 401 | | |
| AUTHZ-001 | Authorization | Candidate | POST /api/jobs | 403 | | |
| AUTHZ-002 | Authorization | Candidate | Open /dashboard | 403 page | | |
| AUTHZ-003 | Authorization | Admin | Delete any job | 200 | | |
| OWN-001 | Ownership | A owns job | B PUT job | 403 | | |
| OWN-002 | Ownership | A owns job | B DELETE job | 403 | | |
| OWN-003 | Ownership | A owns job | A PUT job | 200 | | |
| JOB-001 | Create | Recruiter | Valid job | 201, in DB, in UI | | |
| JOB-002 | Read | Jobs exist | GET /api/jobs | 200 + pagination | | |
| JOB-003 | Update | Own job | Change title | 200, DB + UI updated | | |
| JOB-004 | Delete | Own job | Delete | Removed from DB + UI | | |
| JOB-005 | Read | None | GET /api/jobs/abc | 400 | | |
| JOB-006 | Read | None | Valid missing ID | 404 | | |
| VAL-001..004 | Boundary | Recruiter | experience -1/0/30/31 | 400/201/201/400 | | |
| VAL-005 | Boundary | Recruiter | salary -5 | 400 | | |
| VAL-006 | Boundary | Recruiter | title 100/101 chars | 201/400 | | |
| VAL-007 | Negative | None | Malformed JSON | 400 | | |
| VAL-008 | Negative | None | PATCH /api/health | 404 | | |
| SRCH-001 | Search | Jobs exist | search=mern | Matching only | | |
| SRCH-002 | Search | Jobs exist | search=zzzzzz | "No jobs found." | | |
| SRCH-003 | Pagination | 25+ jobs | page 1,2,3 | Correct slices | | |
| SRCH-004 | Pagination | Jobs exist | limit=9999 | Capped at 50 | | |
| UI-001 | Loading | Slow 3G | Open Jobs | Loading text | | |
| UI-002 | Error | API down | Open Jobs | Error + Try again | | |
| UI-003 | Empty | No results | Search nonsense | Empty message | | |
| UI-004 | Duplicate submit | Slow 3G | Double-click Save | One record | | |
| UI-005 | 404 page | None | /random | NotFound page | | |
| RESP-001 | Responsive | None | 1440/1024/768/375 px | No overflow | | |
| A11Y-001 | Accessibility | None | Tab through forms | Visible focus, labels | | |
| DB-001 | Persistence | Job created | Restart backend | Job still exists | | |
| DB-002 | DB failure | Local | Stop MongoDB | 503 JSON, no crash | | |
| DEP-001 | Deployment | Deployed | /api/health | 200, db connected | | |
| DEP-002 | Deployment | Deployed | Refresh /jobs/123 | App loads | | |
| DEP-003 | Deployment | Deployed | Login in production | Works (CORS OK) | | |
