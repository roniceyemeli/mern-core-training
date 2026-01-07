// services/user.service.js
const userRepository = require("../repositories/user.repository");

async function listUsers() {
  return userRepository.findAll({}, "-password"); // exclude password
}

async function getUserById(userId) {
  const user = await userRepository.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
}

async function updateUser(userId, data) {
  if (data.password) {
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  }
  const updatedUser = await userRepository.updateById(userId, data);
  if (!updatedUser) throw new Error("User not found");
  return updatedUser;
}

async function deleteUser(userId) {
  const deletedUser = await userRepository.deleteById(userId);
  if (!deletedUser) throw new Error("User not found");
  return deletedUser;
}

module.exports = {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};
