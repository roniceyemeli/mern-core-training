const express = require("express");
const protect = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/roles.middleware");

const {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  reset,
  verify,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", reset);
router.get("/verify/:token", verify);
router.post("/logout", protect, logout);

// example admin route
router.get("/admin", protect, authorizeRole("admin"), (req, res) =>
  res.json({ message: "Welcome admin" })
);

module.exports = router;
