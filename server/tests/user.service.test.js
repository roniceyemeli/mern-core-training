// tests/user.service.test.js
const bcrypt = require("bcryptjs");

jest.mock("../repositories/user.repository");
const userRepoMock = require("../repositories/user.repository");

const {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../services/user.service");

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("listUsers returns users", async () => {
    userRepoMock.findAll.mockResolvedValue([{ _id: "1", username: "test" }]);
    const users = await listUsers();
    expect(users.length).toBe(1);
    expect(users[0].username).toBe("test");
  });

  test("getUserById returns a user", async () => {
    userRepoMock.findById.mockResolvedValue({ _id: "1", username: "test" });
    const user = await getUserById("1");
    expect(user.username).toBe("test");
  });

  test("getUserById throws if not found", async () => {
    userRepoMock.findById.mockResolvedValue(null);
    await expect(getUserById("2")).rejects.toThrow("User not found");
  });

  test("updateUser hashes password if present", async () => {
    const hashSpy = jest.spyOn(bcrypt, "hash");
    userRepoMock.updateById.mockResolvedValue({ _id: "1", password: "hashed" });

    const updated = await updateUser("1", { password: "123456" });
    expect(hashSpy).toHaveBeenCalled();
    expect(updated.password).toBe("hashed");
  });

  test("deleteUser deletes user", async () => {
    userRepoMock.deleteById.mockResolvedValue({ _id: "1" });
    const deleted = await deleteUser("1");
    expect(deleted._id).toBe("1");
  });

  test("deleteUser throws if user not found", async () => {
    userRepoMock.deleteById.mockResolvedValue(null);
    await expect(deleteUser("2")).rejects.toThrow("User not found");
  });
});
