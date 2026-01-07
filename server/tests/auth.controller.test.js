const express = require("express");
const request = require("supertest");

const { register } = require("../controllers/auth.controller");

const app = express();
app.use(express.json());
app.post("/register", register);

describe("Auth Controller", () => {
  test("returns 400 on error", async () => {
    const res = await request(app).post("/register").send({});
    expect(res.status).toBe(400);
  });
});
