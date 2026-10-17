#!/usr/bin/env bash
# Usage: ./smoke.sh <API_URL> <FRONTEND_URL>
# Local:  ./smoke.sh http://localhost:5000/api http://localhost:5173
API=${1:-http://localhost:5000/api}
APP=${2:-http://localhost:5173}
EMAIL="smoke_$(date +%s)@test.com"
PASS=0; FAIL=0

check() { if [ "$2" = "$3" ]; then echo "PASS  $1"; PASS=$((PASS+1)); else echo "FAIL  $1 (expected $2, got $3)"; FAIL=$((FAIL+1)); fi; }
code() { curl -s -o /dev/null -w "%{http_code}" "$@"; }

check "Frontend loads"            200 "$(code $APP)"
check "SPA route refresh (/jobs)" 200 "$(code $APP/jobs)"
check "Health endpoint"           200 "$(code $API/health)"
check "DB connected" '"db":"connected"' "$(curl -s $API/health | grep -o '"db":"connected"')"
check "Jobs list"                 200 "$(code $API/jobs)"
check "Protected without token"   401 "$(code $API/auth/me)"
check "CORS allows frontend" "$APP" "$(curl -s -D - -o /dev/null -H "Origin: $APP" $API/health | grep -i '^access-control-allow-origin' | awk '{print $2}' | tr -d '\r')"

REG=$(curl -s -X POST $API/auth/register -H "Content-Type: application/json" \
  -d "{\"name\":\"Smoke\",\"email\":\"$EMAIL\",\"password\":\"Password123!\",\"role\":\"recruiter\"}")
TOKEN=$(echo "$REG" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
check "Register returns token" yes "$([ -n "$TOKEN" ] && echo yes || echo no)"
check "Protected with token" 200 "$(code -H "Authorization: Bearer $TOKEN" $API/auth/me)"
check "Create job" 201 "$(code -X POST $API/jobs -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Smoke Job","company":"QA","location":"Pune","description":"smoke","experience":1}')"
check "Invalid ID -> 400" 400 "$(code $API/jobs/abc)"
check "Unknown route -> 404" 404 "$(code $API/nope)"

echo "---- $PASS passed, $FAIL failed ----"; [ $FAIL -eq 0 ]
