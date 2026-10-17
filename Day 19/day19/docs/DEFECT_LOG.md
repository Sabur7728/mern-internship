# Defect Log
Replace examples with REAL defects you find.

| ID | Problem | Severity | Root Cause | Fix | Status |
|----|---------|----------|-----------|-----|--------|
| BUG-001 | Jobs page blank when API down | High | No error state | Added loading/error/empty states in useJobs | Resolved |
| BUG-002 | experience=-5 accepted | Medium | No min/max in schema | Added min 0 / max 30 | Resolved |
| BUG-003 | Recruiter B edits A's job | Critical | No ownership check | Compare postedBy with req.user._id | Resolved |
| BUG-004 | GET /api/jobs/abc returns 500 | Medium | CastError unhandled | Map CastError to 400 | Resolved |
| BUG-005 | Refresh on /jobs/123 gives 404 after deploy | High | Host lacks SPA fallback | Added vercel.json rewrite | Resolved |
| BUG-006 | Login fails only in production | High | CLIENT_URL missing deployed origin (CORS) | Set CLIENT_URL to Vercel URL | Resolved |

## RCA example (BUG-006)
Login click -> request sent -> console "blocked by CORS policy" -> response has no
Access-Control-Allow-Origin -> backend allowedOrigins lacked the Vercel URL
-> Root cause: env variable not updated. Fix: set CLIENT_URL, redeploy, retest.
