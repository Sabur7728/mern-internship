const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");

const makeUser = async (role, email) => {
  const user = await User.create({ name: role, email, password: "Password123!", role });
  return { user, token: jwt.sign({ id: user._id }, process.env.JWT_SECRET) };
};
const auth = (t) => ({ Authorization: `Bearer ${t}` });
const job = { title: "MERN Developer", company: "Acme", location: "Pune", description: "Build apps", salary: 600000, experience: 2 };

describe("Jobs - authorization", () => {
  it("AUTHZ-001 candidate cannot create job -> 403", async () => {
    const { token } = await makeUser("candidate", "c@test.com");
    expect((await request(app).post("/api/jobs").set(auth(token)).send(job)).status).toBe(403);
  });
  it("no token -> 401", async () => {
    expect((await request(app).post("/api/jobs").send(job)).status).toBe(401);
  });
  it("JOB-001 recruiter creates job -> 201", async () => {
    const { token } = await makeUser("recruiter", "r@test.com");
    const res = await request(app).post("/api/jobs").set(auth(token)).send(job);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(job.title);
  });
});

describe("Jobs - ownership", () => {
  let a, b, jobId;
  beforeEach(async () => {
    a = await makeUser("recruiter", "a@test.com");
    b = await makeUser("recruiter", "b@test.com");
    jobId = (await request(app).post("/api/jobs").set(auth(a.token)).send(job)).body._id;
  });

  it("OWN-001 recruiter B cannot update A's job -> 403", async () => {
    const res = await request(app).put(`/api/jobs/${jobId}`).set(auth(b.token)).send({ title: "Hacked" });
    expect(res.status).toBe(403);
  });
  it("OWN-002 recruiter B cannot delete A's job -> 403", async () => {
    expect((await request(app).delete(`/api/jobs/${jobId}`).set(auth(b.token))).status).toBe(403);
  });
  it("OWN-003 recruiter A can update -> 200", async () => {
    const res = await request(app).put(`/api/jobs/${jobId}`).set(auth(a.token)).send({ title: "Senior MERN" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Senior MERN");
  });
  it("JOB-004 recruiter A deletes -> 200 then 404", async () => {
    expect((await request(app).delete(`/api/jobs/${jobId}`).set(auth(a.token))).status).toBe(200);
    expect((await request(app).get(`/api/jobs/${jobId}`)).status).toBe(404);
  });
  it("admin can delete any job", async () => {
    const admin = await makeUser("admin", "admin@test.com");
    expect((await request(app).delete(`/api/jobs/${jobId}`).set(auth(admin.token))).status).toBe(200);
  });
});

describe("Jobs - IDs and validation", () => {
  it("JOB-005 invalid ID -> 400", async () => {
    expect((await request(app).get("/api/jobs/abc")).status).toBe(400);
  });
  it("JOB-006 valid but missing ID -> 404", async () => {
    expect((await request(app).get(`/api/jobs/${new mongoose.Types.ObjectId()}`)).status).toBe(404);
  });
  it("missing required fields -> 400", async () => {
    const { token } = await makeUser("recruiter", "r@test.com");
    expect((await request(app).post("/api/jobs").set(auth(token)).send({ title: "x" })).status).toBe(400);
  });

  it.each([[-1, 400], [0, 201], [1, 201], [29, 201], [30, 201], [31, 400]])(
    "VAL experience=%i -> %i",
    async (experience, expected) => {
      const { token } = await makeUser("recruiter", `r${experience}@test.com`);
      const res = await request(app).post("/api/jobs").set(auth(token)).send({ ...job, experience });
      expect(res.status).toBe(expected);
    }
  );

  it("VAL-005 negative salary -> 400", async () => {
    const { token } = await makeUser("recruiter", "r@test.com");
    expect((await request(app).post("/api/jobs").set(auth(token)).send({ ...job, salary: -5 })).status).toBe(400);
  });
  it.each([[100, 201], [101, 400]])("VAL title length %i -> %i", async (len, expected) => {
    const { token } = await makeUser("recruiter", `t${len}@test.com`);
    const res = await request(app).post("/api/jobs").set(auth(token)).send({ ...job, title: "a".repeat(len) });
    expect(res.status).toBe(expected);
  });
});

describe("Jobs - search & pagination", () => {
  beforeEach(async () => {
    const { token } = await makeUser("recruiter", "r@test.com");
    for (let i = 1; i <= 25; i++) {
      await request(app).post("/api/jobs").set(auth(token)).send({ ...job, title: i % 5 === 0 ? `Python Dev ${i}` : `MERN Dev ${i}` });
    }
  });

  it("SRCH-003 paginates with metadata", async () => {
    const res = await request(app).get("/api/jobs?page=3&limit=10");
    expect(res.body.data).toHaveLength(5);
    expect(res.body.pagination).toEqual({ page: 3, limit: 10, total: 25, pages: 3 });
  });
  it("SRCH-001 search filters", async () => {
    const res = await request(app).get("/api/jobs?search=python");
    expect(res.body.pagination.total).toBe(5);
  });
  it("SRCH-002 empty result", async () => {
    const res = await request(app).get("/api/jobs?search=zzzzzz");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
  it("SRCH-004 limit capped at 50", async () => {
    expect((await request(app).get("/api/jobs?limit=9999")).body.pagination.limit).toBe(50);
  });
  it("list response excludes description (projection)", async () => {
    const res = await request(app).get("/api/jobs");
    expect(res.body.data[0].description).toBeUndefined();
  });
});
