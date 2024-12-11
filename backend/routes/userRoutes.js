const express = require("express");

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  googleAuth,
  verifyEmail,
  followUser
} = require("../controllers/userController");
const verifyUser = require("../middlewares/auth");

const route = express.Router();

route.post("/signup", createUser);
route.post("/signin", login);

route.get("/users", getAllUsers);

route.get("/users/:id", getUserById);

route.patch("/users/:id", verifyUser, updateUser);

route.delete("/users/:id", verifyUser, deleteUser);

// verify email/token

route.get("/verify-email/:verificationToken", verifyEmail);

//google auth route
route.post("/google-auth", googleAuth);

// follow /unfollow
route.patch("/follow/:id" , verifyUser , followUser)

module.exports = route;
