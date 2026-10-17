# Day 19 Reflection (answer in your own words where marked *)

1. Why test before deployment? Bugs are cheaper to fix before users see them; production carries real data and security risk.
2. * Which feature needed the most testing? (Often authorization/ownership.)
3. * Most difficult bug?
4. * How did you find the root cause? (Console -> Network -> backend log -> DB.)
5. DevTools showed request URL, payload, status, CORS errors; throttling tested slow networks.
6. Backend logs showed stack traces and DB errors the browser never sees.
7. Curl/Postman proved the API worked without React, isolating the bug's side.
8. * Authorization scenario tested: candidate POST /api/jobs (403).
9. Ownership: Recruiter B tried to edit/delete Recruiter A's job and got 403.
10. * Performance issue found?
11. * Optimization implemented?
12. Pagination limits response size, memory and render time as data grows.
13. Git history is permanent; leaked secrets must be rotated.
14. * Deployment problem you hit?
15. Smoke test login and API calls from the deployed URL; check the Network tab for CORS errors.
16. Rate limiting, logging/monitoring, CI, refresh tokens, backups, caching, tighter Atlas IP rules.
