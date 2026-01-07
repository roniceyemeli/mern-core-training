// tests/user.controller.test.js
const express = require("express");
const request = require("supertest");

jest.mock("../services/user.service"); // mock the service

const userService = require("../services/user.service");
const {
  getAllUsers,
  getUser,
  updateUserInfo,
  deleteUserById,
} = require("../controllers/user.controller");

const app = express();
app.use(express.json());

app.get("/users", getAllUsers);
app.get("/users/:id", getUser);
app.put("/users/:id", updateUserInfo);
app.delete("/users/:id", deleteUserById);

describe("User Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("GET /users returns users", async () => {
    userService.listUsers.mockResolvedValue([{ username: "test" }]);
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(res.body[0].username).toBe("test");
  });

  test("GET /users/:id returns a user", async () => {
    userService.getUserById.mockResolvedValue({ username: "test" });
    const res = await request(app).get("/users/1");
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("test");
  });

  test("GET /users/:id returns 404 if not found", async () => {
    userService.getUserById.mockRejectedValue(new Error("User not found"));
    const res = await request(app).get("/users/2");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  test("PUT /users/:id updates user", async () => {
    userService.updateUser.mockResolvedValue({ username: "updated" });
    const res = await request(app)
      .put("/users/1")
      .send({ username: "updated" });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("updated");
  });

  test("DELETE /users/:id deletes user", async () => {
    userService.deleteUser.mockResolvedValue({ _id: "1" });
    const res = await request(app).delete("/users/1");
    expect(res.status).toBe(200);
    expect(res.body.user._id).toBe("1");
  });
});
