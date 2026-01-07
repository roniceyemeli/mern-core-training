const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userRepository = require("../repositories/user.repository");

function signAccessToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

function signRefreshToken(id) {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

async function registerUser(data) {
  const user = await userRepository.createUser(data);

  user.verificationToken = crypto.randomBytes(32).toString("hex");
  await user.save();

  return {
    user,
    accessToken: signAccessToken(user._id),
    refreshToken: signRefreshToken(user._id),
  };
}

async function loginUser(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  user.refreshToken = signRefreshToken(user._id);
  await user.save();

  return {
    user,
    accessToken: signAccessToken(user._id),
    refreshToken: user.refreshToken,
  };
}

async function refreshTokenService(token) {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  return signAccessToken(decoded.id);
}

async function logoutService(userId) {
  await userRepository.updateById(userId, { refreshToken: null });
}

async function requestPasswordReset(email) {
  const user = await userRepository.findByEmail(email);
  if (!user) return;

  user.resetToken = crypto.randomBytes(32).toString("hex");
  user.resetTokenExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  return user.resetToken;
}

async function resetPassword(token, newPassword) {
  const user = await userRepository.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid token");

  user.password = newPassword;
  user.resetToken = null;
  await user.save();
}

async function verifyEmail(token) {
  const user = await userRepository.findOne({ verificationToken: token });

  if (!user) throw new Error("Invalid token");

  user.emailVerified = true;
  user.verificationToken = null;

  await user.save();
}

module.exports = {
  registerUser,
  loginUser,
  refreshTokenService,
  logoutService,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
};
