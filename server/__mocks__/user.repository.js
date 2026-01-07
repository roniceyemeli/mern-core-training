// __mocks__/user.repository.js
module.exports = jest.fn(() => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  updateById: jest.fn(),
  deleteById: jest.fn(),
  findByEmail: jest.fn(),
  createUser: jest.fn(),
  isEmailTaken: jest.fn(),
  isUsernameTaken: jest.fn(),
}));
