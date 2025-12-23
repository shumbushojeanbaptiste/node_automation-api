require("dotenv").config();
const request = require("supertest");
const app = require("../src/app");
const db = require("../src/config/db");


// // Mock Student model
// jest.mock("../src/models/student.model", () => ({
//   create: jest.fn(() => Promise.resolve(1)), // simulate insert
// }));

// // Mock Redis client
// jest.mock("../src/config/redis", () => {
//   return async () => ({
//     get: jest.fn(() => null),
//     setEx: jest.fn(() => Promise.resolve()),
//     del: jest.fn(() => Promise.resolve()),
//   });
// });

// Mock Redis only
jest.mock("../src/config/redis", () => {
  return async () => ({
    get: jest.fn(() => null),
    setEx: jest.fn(() => Promise.resolve()),
    del: jest.fn(() => Promise.resolve()),
  });
});

beforeEach(async () => {
  // Clear table before each test
  await db.query("TRUNCATE TABLE students");
});

afterAll(async () => {
  // Close DB connection after all tests
  await db.end();
});

describe("Student API", () => {
  it("should create student", async () => {
    const res = await request(app)
      .post("/students")
      .send({ name: "Test", email: "test@gmail.com" });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("created");

    // Verify record exists in DB
    const [rows] = await db.query("SELECT * FROM students WHERE email = ?", [
      "test@gmail.com",
    ]);
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe("Test");
  });
});
