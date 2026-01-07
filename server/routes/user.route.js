const express = require("express");
const protect = require("../middlewares/auth.middleware");
const authorizeRole = require("../middlewares/roles.middleware");

const {
  getAllUsers,
  getUser,
  updateUserInfo,
  deleteUserById,
} = require("../controllers/user.controller");

const router = express.Router();

// Only admin can list all users or delete any user
router.get("/", protect, authorizeRole("admin"), getAllUsers);
router.get("/:id", protect, getUser);
router.put("/:id", protect, updateUserInfo);
router.delete("/:id", protect, authorizeRole("admin"), deleteUserById);

module.exports = router;
