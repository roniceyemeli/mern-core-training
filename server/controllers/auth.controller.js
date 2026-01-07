const {
  registerSchema,
  loginSchema,
} = require("../validation/auth.validation");

const {
  registerUser,
  loginUser,
  refreshTokenService,
  logoutService,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} = require("../services/auth.service");

async function register(req, res) {
  try {
    registerSchema.parse(req.body);
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    loginSchema.parse(req.body);
    const result = await loginUser(req.body.email, req.body.password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

async function refresh(req, res) {
  try {
    const token = req.body.refreshToken;
    const accessToken = await refreshTokenService(token);
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

async function logout(req, res) {
  await logoutService(req.user._id);
  res.json({ message: "Logged out" });
}

async function forgotPassword(req, res) {
  const token = await requestPasswordReset(req.body.email);
  res.json({ token });
}

async function reset(req, res) {
  await resetPassword(req.body.token, req.body.password);
  res.json({ message: "Password updated" });
}

async function verify(req, res) {
  await verifyEmail(req.params.token);
  res.json({ message: "Email verified" });
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  reset,
  verify,
};
