// controllers/user.controller.js
const {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../services/user.service");

async function getAllUsers(req, res) {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getUser(req, res) {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function updateUserInfo(req, res) {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function deleteUserById(req, res) {
  try {
    const user = await deleteUser(req.params.id);
    res.json({ message: "User deleted", user });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

module.exports = {
  getAllUsers,
  getUser,
  updateUserInfo,
  deleteUserById,
};
