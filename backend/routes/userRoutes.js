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
  followUser,
  changeSavedLikedBlog
} = require("../controllers/userController");
const verifyUser = require("../middlewares/auth");
const upload = require("../utils/multer");

const route = express.Router();

route.post("/signup", createUser);
route.post("/signin", login);

route.get("/users", getAllUsers);

route.get("/users/:username", getUserById);

route.patch("/users/:id", verifyUser, upload.single("profilePic"), updateUser);

route.delete("/users/:id", verifyUser, deleteUser);

// verify email/token

route.get("/verify-email/:verificationToken", verifyEmail);

//google auth route
route.post("/google-auth", googleAuth);

// follow /unfollow
route.patch("/follow/:id", verifyUser, followUser);

route.patch("/change-saved-liked-blog-visibility" , verifyUser , changeSavedLikedBlog)

module.exports = route;
