const bcrypt = require("bcryptjs");

// set env variables for JWT
process.env.JWT_SECRET = "testsecret";
process.env.JWT_REFRESH_SECRET = "refreshsecret";

jest.mock("../repositories/user.repository", () => ({
  createUser: jest.fn(),
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
  isEmailTaken: jest.fn(),
  isUsernameTaken: jest.fn(),
  updateById: jest.fn(),
}));

const repoMock = require("../repositories/user.repository");
const { registerUser, loginUser } = require("../services/auth.service");

describe("Auth Service", () => {
  beforeEach(() => jest.clearAllMocks());

  test("register creates user and returns token", async () => {
    repoMock.isEmailTaken.mockResolvedValue(false);
    repoMock.isUsernameTaken.mockResolvedValue(false);
    repoMock.createUser.mockResolvedValue({
      _id: "1",
      email: "a@b.com",
      save: jest.fn().mockResolvedValue(true), // mocked save
    });

    const result = await registerUser({
      email: "a@b.com",
      username: "ronice",
      password: "123456",
    });

    expect(result.user.email).toBe("a@b.com");
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  test("login validates password", async () => {
    repoMock.findByEmail.mockResolvedValue({
      _id: "1",
      email: "a@b.com",
      password: await bcrypt.hash("123456", 10),
      save: jest.fn().mockResolvedValue(true), // mocked save
    });

    const result = await loginUser("a@b.com", "123456");

    expect(result.user.email).toBe("a@b.com");
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });
});
