# Production Smoke Test
Frontend URL: ____________  Backend URL: ____________  Date: ____________

| Step | Expected | Result |
|------|----------|--------|
| Open production URL | Homepage loads, no console errors | |
| /api/health | status ok, db connected | |
| Open Jobs, Job details | Loads, pagination works | |
| Refresh on /jobs/<id> | Page loads (no 404) | |
| Login (candidate) | Works | |
| Login (recruiter): create job | Appears in UI | |
| Verify in Atlas | Document exists | |
| Edit then delete test job | UI and DB updated | |
| Candidate opens /dashboard | Blocked (403 page) | |
| Logout then Back button | Protected pages blocked | |
| Mobile viewport 375px | Usable layout | |
| Network tab | No CORS errors | |
