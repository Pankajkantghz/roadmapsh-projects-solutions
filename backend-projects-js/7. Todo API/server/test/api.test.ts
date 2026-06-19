import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import  app  from "../src/app.js"; // Backs up out of test/, into src/app
import mongoose from "mongoose";

describe("🚀 Todo API End-to-End Integration Suite", () => {
  let accessToken: string;
  let refreshToken: string;
  const testUser = {
    name: "Darth Tester",
    email: `test-${Date.now()}@example.com`,
    password: "SecurePassword123!",
  };

  // Completely empty collections right before entering each single evaluation block
  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  describe("🔐 Authentication Layer Tests", () => {
    it("should successfully register a new user and issue dual tokens", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refreshToken");
    });

    it("should block duplicate registrations with the same email address", async () => {
      await request(app).post("/api/auth/register").send(testUser);
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("already exists");
    });

    it("should validate valid passwords and return login payloads", async () => {
      await request(app).post("/api/auth/register").send(testUser);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: testUser.password });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });
  });

  describe("📝 Todo Operational CRUD & Sorting Constraints", () => {
    // Generate valid session authentication context prior to testing data mutations
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(testUser);
      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: testUser.password });
      accessToken = loginRes.body.accessToken;
    });

    it("should explicitly reject unauthenticated todo mutations", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({ title: "Unauthenticated Task" });

      expect(res.status).toBe(401);
    });

    it("should allow user task creation and ensure schema metadata strings are removed", async () => {
      const res = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ title: "Deep Work Session", description: "Run test validation" });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.title).toBe("Deep Work Session");
      expect(res.body).not.toHaveProperty("__v"); // Confirms object destructuring strip functions cleanly
    });

    it("should apply pagination limit filters perfectly on data query windows", async () => {
      // Seed discrete test entries across the sandbox database cluster
      await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ title: "Task Alpha" });
      await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ title: "Task Beta" });
      await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ title: "Task Gamma" });

      const res = await request(app)
        .get("/api/todos?page=1&limit=2")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination.totalItems).toBe(3);
      expect(res.body.pagination.totalPages).toBe(2);
    });

    it("should correctly filter outputs via keyword regex strings safely without crashing", async () => {
      await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ title: "Muay Thai Drills" });
      await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ title: "Fix Type Error" });

      const res = await request(app)
        .get("/api/todos?search=Thai")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe("Muay Thai Drills");
    });
  });
});
