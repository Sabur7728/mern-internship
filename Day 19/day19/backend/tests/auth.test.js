const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

const valid = { name: "Sabur", email: "sabur@test.com", password: "Password123!" };

describe("Health", () => {
  it("GET /api/health -> 200", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("Registration", () => {
  it("REG-001 registers a user without exposing password", async () => {
    const res = await request(app).post("/api/auth/register").send(valid);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(JSON.stringify(res.body)).not.toMatch(/Password123/);
  });
  it("REG-002 duplicate email -> 409", async () => {
    await request(app).post("/api/auth/register").send(valid);
    const res = await request(app).post("/api/auth/register").send(valid);
    expect(res.status).toBe(409);
  });
  it("REG-003 invalid email -> 400", async () => {
    const res = await request(app).post("/api/auth/register").send({ ...valid, email: "abc" });
    expect(res.status).toBe(400);
  });
  it("REG-004 short password -> 400", async () => {
    const res = await request(app).post("/api/auth/register").send({ ...valid, password: "1234567" });
    expect(res.status).toBe(400);
  });
  it("REG-005 cannot self-register as admin", async () => {
    const res = await request(app).post("/api/auth/register").send({ ...valid, role: "admin" });
    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("candidate");
  });
});

describe("Login", () => {
  beforeEach(() => User.create({ ...valid, role: "candidate" }));

  it("AUTH-001 valid credentials -> 200 + token", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: valid.email, password: valid.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
  it("AUTH-002 wrong password -> 401", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: valid.email, password: "wrong-pass" });
    expect(res.status).toBe(401);
  });
  it("AUTH-003 unknown email -> 401", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "no@one.com", password: "Password123!" });
    expect(res.status).toBe(401);
  });
  it("AUTH-004 empty body -> 400", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
  });
  it("AUTH-006 protected route without token -> 401", async () => {
    expect((await request(app).get("/api/auth/me")).status).toBe(401);
  });
  it("AUTH-007 garbage token -> 401", async () => {
    const res = await request(app).get("/api/auth/me").set("Authorization", "Bearer garbage");
    expect(res.status).toBe(401);
  });
});

describe("Misc negative", () => {
  it("VAL-007 malformed JSON -> 400", async () => {
    const res = await request(app).post("/api/auth/login").set("Content-Type", "application/json").send('{"email": ');
    expect(res.status).toBe(400);
  });
  it("VAL-008 unsupported method/route -> 404", async () => {
    expect((await request(app).patch("/api/health")).status).toBe(404);
  });
});
