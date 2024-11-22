const express = require("express");

const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
} = require("../controllers/blogController");

const verifyUser = require("../middlewares/auth");

const {
  addComment,
  deleteComment,
  editComment,
  likeComment,
  addNestedComment,
} = require("../controllers/commentController");
const upload = require("../utils/multer");

const route = express.Router();

//blogs
// route.post(
//   "/blogs",
//   verifyUser,
//   upload.fields([{ name: "image" }, { name: "images" }]),
//   createBlog
// );
route.post(
  "/blogs",
  verifyUser,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "images" }]),
  createBlog
);
route.get("/blogs", getBlogs);

route.get("/blogs/:blogId", getBlog);

route.patch(
  "/blogs/:id",
  verifyUser,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "images" }]),
  updateBlog
);
route.delete("/blogs/:id", verifyUser, deleteBlog);

//like
route.post("/blogs/like/:id", verifyUser, likeBlog);

//comment
route.post("/blogs/comment/:id", verifyUser, addComment);
route.delete("/blogs/comment/:id", verifyUser, deleteComment);
route.patch("/blogs/edit-comment/:id", verifyUser, editComment);
route.patch("/blogs/like-comment/:id", verifyUser, likeComment);

// for nested comment
route.post("/comment/:parentCommentId/:id", verifyUser, addNestedComment);

module.exports = route;
