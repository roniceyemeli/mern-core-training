// repositories/user.repository.js

const coreRepository = require("./core.repository");
const User = require("../models/User");

function UserRepository() {
  const coreRepo = coreRepository(User);

  return {
    ...coreRepo,

    findByEmail: (email) => User.findOne({ email }).select("+password"),

    findByUsername: (username) => User.findOne({ username }),

    createUser: (data) => User.create(data),

    promoteToAdmin: (userId) =>
      User.findByIdAndUpdate(userId, { role: "admin" }, { new: true }),

    isEmailTaken: (email) => User.exists({ email }),

    isUsernameTaken: (username) => User.exists({ username }),
  };
}

module.exports = UserRepository();
