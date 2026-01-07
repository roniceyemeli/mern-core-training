// __mocks__/user.repository.js
module.exports = () => ({
  isEmailTaken: jest.fn(),
  isUsernameTaken: jest.fn(),
  createUser: jest.fn(),
  findByEmail: jest.fn(),
});
