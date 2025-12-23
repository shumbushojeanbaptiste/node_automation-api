require("dotenv").config();
const request = require("supertest");
const app = require("../src/app");
const db = require("../src/config/db");

// Mock Redis only
jest.mock("../src/config/redis", () => {
  return async () => ({
    get: jest.fn(() => null),
    setEx: jest.fn(() => Promise.resolve()),
    del: jest.fn(() => Promise.resolve()),
  });
});

beforeEach(async () => {
  // SAFE cleanup (no special permissions needed)
  await db.query("DELETE FROM students");
});

afterAll(async () => {
  await db.end(); // IMPORTANT: prevent Jest hang
});

describe("Student API", () => {
  it("should create student", async () => {
    const res = await request(app)
      .post("/students")
      .send({ name: "Test", email: "test@test.com" });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("created");

    // verify record really exists
    const [rows] = await db.query(
      "SELECT * FROM students WHERE email = ?",
      ["test@test.com"]
    );

    expect(rows.length).toBe(1);
  });
});
