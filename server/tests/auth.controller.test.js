const express = require("express");
const request = require("supertest");

jest.mock("../services/auth.service"); // mock all service functions

const {
  registerUser,
  loginUser,
  refreshTokenService,
  logoutService,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} = require("../services/auth.service");

const {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  reset,
  verify,
} = require("../controllers/auth.controller");

const app = express();
app.use(express.json());

// Routes
app.post("/register", register);
app.post("/login", login);
app.post("/refresh", refresh);
app.post("/logout", (req, res) => {
  req.user = { _id: "1" };
  logout(req, res);
});
app.post("/forgot-password", forgotPassword);
app.post("/reset-password", reset);
app.get("/verify/:token", verify);

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // REGISTER
  test("POST /register - success", async () => {
    registerUser.mockResolvedValue({
      user: { _id: "1", email: "test@test.com" },
      accessToken: "access123",
      refreshToken: "refresh123",
    });

    const res = await request(app).post("/register").send({
      email: "test@test.com",
      username: "tester",
      password: "123456",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("test@test.com");
    expect(res.body.accessToken).toBe("access123");
    expect(res.body.refreshToken).toBe("refresh123");
  });

  test("POST /register - validation error", async () => {
    registerUser.mockRejectedValue(new Error("Validation error"));
    const res = await request(app).post("/register").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  // LOGIN
  test("POST /login - success", async () => {
    loginUser.mockResolvedValue({
      user: { _id: "1", email: "test@test.com" },
      accessToken: "access123",
      refreshToken: "refresh123",
    });

    const res = await request(app).post("/login").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("test@test.com");
    expect(res.body.accessToken).toBe("access123");
  });

  test("POST /login - invalid credentials", async () => {
    loginUser.mockRejectedValue(new Error("Invalid credentials"));
    const res = await request(app).post("/login").send({
      email: "wrong@test.com",
      password: "wrongpass",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("POST /login - validation error", async () => {
    const res = await request(app).post("/login").send({
      email: "invalid",
      password: "123", // too short
    });

    expect(res.status).toBe(401); // Zod validation -> 401
  });

  // REFRESH TOKEN
  test("POST /refresh - success", async () => {
    refreshTokenService.mockResolvedValue("newAccessToken");
    const res = await request(app)
      .post("/refresh")
      .send({ refreshToken: "refresh123" });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBe("newAccessToken");
  });

  test("POST /refresh - invalid token", async () => {
    refreshTokenService.mockRejectedValue(new Error());
    const res = await request(app)
      .post("/refresh")
      .send({ refreshToken: "badToken" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid token");
  });

  // LOGOUT
  test("POST /logout - success", async () => {
    logoutService.mockResolvedValue();
    const res = await request(app).post("/logout");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged out");
  });

  // FORGOT PASSWORD
  test("POST /forgot-password - success", async () => {
    requestPasswordReset.mockResolvedValue("resetToken123");
    const res = await request(app)
      .post("/forgot-password")
      .send({ email: "test@test.com" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe("resetToken123");
  });

  // RESET PASSWORD
  test("POST /reset-password - success", async () => {
    resetPassword.mockResolvedValue();
    const res = await request(app)
      .post("/reset-password")
      .send({ token: "resetToken123", password: "newPass123" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Password updated");
  });

  // EMAIL VERIFICATION
  test("GET /verify/:token - success", async () => {
    verifyEmail.mockResolvedValue();
    const res = await request(app).get("/verify/verifyToken123");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Email verified");
  });
});
