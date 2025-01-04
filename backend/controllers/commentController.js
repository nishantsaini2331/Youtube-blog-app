const Blog = require("../models/blogSchema");
const Comment = require("../models/commentSchema");

async function addComment(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(500).json({
        message: "Please enter the comment",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found",
      });
    }

    // create the comment

    const newComment = await Comment.create({
      comment,
      blog: id,
      user: creator,
    }).then((comment) => {
      return comment.populate({
        path: "user",
        select: "name email username profilePic",
      });
    });

    await Blog.findByIdAndUpdate(id, {
      $push: { comments: newComment._id },
    });

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      newComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteComment(req, res) {
  try {
    const userId = req.user;
    const { id } = req.params;

    const comment = await Comment.findById(id).populate({
      path: "blog",
      select: "creator",
    });

    if (!comment) {
      return res.status(500).json({
        message: "Comment not found",
      });
    }

    if (comment.user != userId && comment.blog.creator != userId) {
      return res.status(500).json({
        message: "You are not authorized",
      });
    }

    async function deleteCommentAndReplies(id) {
      let comment = await Comment.findById(id);

      for (let replyId of comment.replies) {
        await deleteCommentAndReplies(replyId);
      }

      if (comment.parentComment) {
        await Comment.findByIdAndUpdate(comment.parentComment, {
          $pull: { replies: id },
        });
      }

      await Comment.findByIdAndDelete(id);
    }

    await deleteCommentAndReplies(id);

    await Blog.findByIdAndUpdate(comment.blog._id, {
      $pull: { comments: id },
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function editComment(req, res) {
  try {
    const userId = req.user;
    const { id } = req.params;
    const { updatedCommentContent } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(500).json({
        message: "Comment is not found",
      });
    }

    if (comment.user != userId) {
      return res.status(400).json({
        success: false,
        message: "You are not valid user to edit this comment",
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      {
        comment: updatedCommentContent,
      },
      { new: true }
    ).then((comment) => {
      return comment.populate({
        path: "user",
        select: "name email",
      });
    });

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      updatedComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function likeComment(req, res) {
  try {
    const userId = req.user;
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(500).json({
        message: "comment is not found",
      });
    }

    if (!comment.likes.includes(userId)) {
      await Comment.findByIdAndUpdate(id, { $push: { likes: userId } });
      return res.status(200).json({
        success: true,
        message: "Comment Liked successfully",
      });
    } else {
      await Comment.findByIdAndUpdate(id, { $pull: { likes: userId } });
      return res.status(200).json({
        success: true,
        message: "Comment DisLiked successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function addNestedComment(req, res) {
  try {
    const userId = req.user;

    const { id: blogId, parentCommentId } = req.params;

    const { reply } = req.body;

    const comment = await Comment.findById(parentCommentId);

    const blog = await Blog.findById(blogId);

    if (!comment) {
      return res.status(500).json({
        message: "parent comment is not found",
      });
    }

    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found",
      });
    }

    const newReply = await Comment.create({
      blog: blogId,
      comment: reply,
      parentComment: parentCommentId,
      user: userId,
    }).then((reply) => {
      return reply.populate({
        path: "user",
        select: "name email",
      });
    });

    await Comment.findByIdAndUpdate(parentCommentId, {
      $push: { replies: newReply._id },
    });

    return res.status(200).json({
      success: true,
      message: "Reply added successfully",
      newReply,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  addComment,
  deleteComment,
  editComment,
  likeComment,
  addNestedComment,
};
