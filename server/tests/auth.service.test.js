// tests/auth.service.test.js
const bcrypt = require("bcryptjs");

jest.mock("../repositories/user.repository");

const createUserRepository = require("../repositories/user.repository");
const repoMock = createUserRepository();

const { registerUser, loginUser } = require("../services/auth.service");

describe("Auth Service", () => {
  beforeEach(() => jest.clearAllMocks());

  test("register creates user and returns token", async () => {
    repoMock.isEmailTaken.mockResolvedValue(false);
    repoMock.isUsernameTaken.mockResolvedValue(false);
    repoMock.createUser.mockResolvedValue({ _id: "1", email: "a@b.com" });

    const result = await registerUser({
      email: "a@b.com",
      username: "ronice",
      password: "123456",
    });

    expect(result.user.email).toBe("a@b.com");
    expect(result.token).toBeDefined();
  });

  test("login validates password", async () => {
    repoMock.findByEmail.mockResolvedValue({
      _id: "1",
      email: "a@b.com",
      password: await bcrypt.hash("123456", 10),
    });

    const result = await loginUser("a@b.com", "123456");

    expect(result.user.email).toBe("a@b.com");
  });
});
