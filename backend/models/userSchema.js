const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      unique: true,
      select: false,
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    isVerify: {
      type: Boolean,
      default: false,
      select: false,
    },
    googleAuth: {
      type: Boolean,
      default: false,
      select: false,
    },
    profilePic: {
      type: String,
      default: null,
    },
    profilePicId: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    saveBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    likeBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    showLikedBlogs: {
      type: Boolean,
      default: true,
    },
    showSavedBlogs: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
