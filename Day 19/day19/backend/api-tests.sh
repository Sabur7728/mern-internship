#!/usr/bin/env bash
# Manual API test run (needs curl + jq). Usage: ./api-tests.sh [API_URL]
API=${1:-http://localhost:5000/api}
S=$(date +%s)
H='Content-Type: application/json'
reg() { curl -s -X POST $API/auth/register -H "$H" -d "{\"name\":\"$1\",\"email\":\"$2\",\"password\":\"Password123!\",\"role\":\"$3\"}" >/dev/null; }
login() { curl -s -X POST $API/auth/login -H "$H" -d "{\"email\":\"$1\",\"password\":\"Password123!\"}" | jq -r .token; }
st() { echo "== $1"; shift; curl -s -o /dev/null -w "HTTP %{http_code}\n" "$@"; }

reg Cand cand$S@test.com candidate; reg RecA reca$S@test.com recruiter; reg RecB recb$S@test.com recruiter
CAND=$(login cand$S@test.com); RECA=$(login reca$S@test.com); RECB=$(login recb$S@test.com)

st "Health (200)" $API/health
st "Wrong password (401)" -X POST $API/auth/login -H "$H" -d "{\"email\":\"cand$S@test.com\",\"password\":\"nope\"}"
st "No token (401)" $API/auth/me
st "Candidate creates job (403)" -X POST $API/jobs -H "Authorization: Bearer $CAND" -H "$H" -d '{"title":"x"}'

JOB=$(curl -s -X POST $API/jobs -H "Authorization: Bearer $RECA" -H "$H" \
  -d '{"title":"MERN Dev","company":"Acme","location":"Pune","description":"Build","salary":500000,"experience":2}' | jq -r ._id)
echo "Created job: $JOB"

st "Recruiter B updates A's job (403)" -X PUT $API/jobs/$JOB -H "Authorization: Bearer $RECB" -H "$H" -d '{"title":"Hack"}'
st "Recruiter B deletes A's job (403)" -X DELETE $API/jobs/$JOB -H "Authorization: Bearer $RECB"
st "experience=31 (400)" -X POST $API/jobs -H "Authorization: Bearer $RECA" -H "$H" -d '{"title":"t","company":"c","location":"l","description":"d","experience":31}'
st "Invalid ID (400)" $API/jobs/abc
st "Missing ID (404)" $API/jobs/64b7f0c2a1b2c3d4e5f60718
st "Malformed JSON (400)" -X POST $API/auth/login -H "$H" -d '{"email":'
st "Search mern (200)" "$API/jobs?search=mern&page=1&limit=5"
st "Owner updates (200)" -X PUT $API/jobs/$JOB -H "Authorization: Bearer $RECA" -H "$H" -d '{"title":"Senior MERN"}'
st "Owner deletes (200)" -X DELETE $API/jobs/$JOB -H "Authorization: Bearer $RECA"
