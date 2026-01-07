// middleware/auth.js
const jwt = require("jsonwebtoken");
const createUserRepository = require("../repositories/user.repository");

const userRepository = createUserRepository();

async function protect(req, res, next) {
  let token = null;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userRepository.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = protect;
