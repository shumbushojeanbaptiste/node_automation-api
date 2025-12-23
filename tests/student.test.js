require("dotenv").config();
const request = require("supertest");
const app = require("../src/app");

// Mock Student model
jest.mock("../src/models/student.model", () => ({
  create: jest.fn(() => Promise.resolve(1)), // simulate insert
}));

// Mock Redis client
jest.mock("../src/config/redis", () => {
  return async () => ({
    get: jest.fn(() => null),
    setEx: jest.fn(() => Promise.resolve()),
    del: jest.fn(() => Promise.resolve()),
  });
});


describe("Student API", () => {
  it("should create student", async () => {
    const res = await request(app)
      .post("/students")
      .send({ name: "Test", email: "test@test12.com" });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("created");
  });
}); 
