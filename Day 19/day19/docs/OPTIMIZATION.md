# Optimization Review

| # | Area | Before | After | Why it helps |
|---|------|--------|-------|--------------|
| 1 | Pagination | All jobs returned | page & limit (max 50) + metadata | Smaller payload, scalable |
| 2 | Projection + lean() | Full documents | .select() + .lean() on list | Less data, less Mongoose overhead |
| 3 | Indexes | Collection scan | createdAt, postedBy+createdAt, location, unique email | Faster queries |
| 4 | Debounced search | Request per keystroke | 400 ms debounce + AbortController | Fewer requests, no stale responses |
| 5 | React.memo(JobCard) | All cards re-render | Re-render only on change | Less rendering |
| 6 | Derived state | Duplicate state | Computed in render | Fewer bugs |

Measure (paste numbers here):
- `mongosh careerconnect --eval 'db.jobs.find({}).sort({createdAt:-1}).limit(10).explain("executionStats").executionStats'`  (look for IXSCAN)
- `curl -s -o /dev/null -w "size=%{size_download} time=%{time_total}\n" "http://localhost:5000/api/jobs?limit=10"`
- `npx lighthouse http://localhost:4173 --view`
