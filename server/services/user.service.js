// services/user.service.js

const UserRepository = require("../repositories/user.repository");
const userRepository = UserRepository();

async function registerUser(data) {
  const emailTaken = await userRepository.isEmailTaken(data.email);

  if (emailTaken) {
    throw new Error("Email already in use");
  }

  return userRepository.createUser(data);
}

module.exports = {
  registerUser,
};
