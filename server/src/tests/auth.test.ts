import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { User } from "../models/User.js";
import { clearTestDB, connectTestDB, disconnectTestDB } from "./helpers/testDb.js";

const validUser = {
  username: "harate_dev",
  email: "dev@example.com",
  password: "Password123",
};

beforeAll(async () => {
  await connectTestDB();
  await User.init();
});
afterEach(async () => {
  await clearTestDB(); 
});
afterAll(async () => {
  await disconnectTestDB();
});

function registerUser(body: Record<string, unknown> = validUser) {
  return request(app).post("/api/auth/register").send(body);
}

// ======================= REGISTER =======================
describe("POST /api/auth/register", () => {
  it("creates a user and returns a token without the password", async () => {
    const res = await registerUser();

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(validUser.email);
    expect(res.body.data.user.username).toBe(validUser.username);
    expect(res.body.data.user.password).toBeUndefined(); // must NEVER be sent
    expect(typeof res.body.data.token).toBe("string");
  });

  it("stores a bcrypt hash, not the real password", async () => {
    await registerUser();

    const saved = await User.findOne({ email: validUser.email }).select("+password");

    expect(saved).not.toBeNull();
    expect(saved?.password).not.toBe(validUser.password);
    expect(saved?.password.startsWith("$2")).toBe(true); // bcrypt hashes start with $2
  });

  it("lowercases and trims the email", async () => {
    const res = await registerUser({ ...validUser, email: "  Dev@Example.COM " });

    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe("dev@example.com");
  });

  it("rejects a duplicate email with 409", async () => {
    await registerUser();
    const res = await registerUser({ ...validUser, username: "someone_else" });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Email is already registered");
  });

  it("rejects a duplicate username with 409", async () => {
    await registerUser();
    const res = await registerUser({ ...validUser, email: "other@example.com" });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Username is already taken");
  });

  it("rejects a weak password with 400", async () => {
    const res = await registerUser({ ...validUser, password: "short" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    const hasPasswordError = res.body.errors.some(
      (error: { field: string }) => error.field === "password",
    );
    expect(hasPasswordError).toBe(true);
  });

  it("rejects an invalid email with 400", async () => {
    const res = await registerUser({ ...validUser, email: "not-an-email" });

    expect(res.status).toBe(400);
  });
});

// ======================= LOGIN =======================
describe("POST /api/auth/login", () => {
  it("logs in with the right credentials", async () => {
    await registerUser();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(typeof res.body.data.token).toBe("string");
    expect(res.body.data.user.email).toBe(validUser.email);
  });

  it("rejects a wrong password with 401", async () => {
    await registerUser();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: "WrongPassword9" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("gives the SAME message for an unknown email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "Password123" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("blocks a NoSQL injection attempt with 400", async () => {
    await registerUser();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: { $gt: "" }, password: "Password123" });

    expect(res.status).toBe(400);
  });
});

// ======================= ME (protected route) =======================
describe("GET /api/auth/me", () => {
  it("returns the current user when the token is valid", async () => {
    const registered = await registerUser();
    const token: string = registered.body.data.token;

    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(validUser.email);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it("returns 401 when no token is sent", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
  });

  it("returns 401 for a fake token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer this.is.not.real");

    expect(res.status).toBe(401);
  });

  it("returns 401 when the user was deleted after the token was issued", async () => {
    const registered = await registerUser();
    const token: string = registered.body.data.token;

    await User.deleteMany({}); 

    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("User no longer exists");
  });
});