// server.js
require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const connectDB = require("./config/db");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

connectDB(process.env.MONGODB_URI);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
