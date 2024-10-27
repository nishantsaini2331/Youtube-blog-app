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
        });

        await Blog.findByIdAndUpdate(id, {
            $push: { comments: newComment._id },
        });

        return res.status(200).json({
            success: true,
            message: "Comment added successfully",
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
        console.log(comment, userId, comment.blog.creator, comment.user);

        if (!comment) {
            return res.status(500).json({
                message: "Comment not found",
            });
        }

        //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXI1QGdtYWlsLmNvbSIsImlkIjoiNjZlZGFhM2VhM2Y5MDYwOTJiYzNlMjAxIiwiaWF0IjoxNzI2ODUxNjQ3fQ.FUUMC7t9Ij8BTd6ipCC3WMoneEXQVP-UqZou_TDpMG8

        //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5pc2hhbnRAZ21haWwuY29tIiwiaWQiOiI2NmViMDFjMTQzYmJjZGRiYTA4OGY2NDYiLCJpYXQiOjE3Mjc3MTMzOTd9.FjEqKCWv6P3V5YNqEPIWt3CoHFB8mwpjpWZlTma5r5w
        if (comment.user != userId && comment.blog.creator != userId) {
            return res.status(500).json({
                message: "You are not authorized",
            });
        }

        await Blog.findByIdAndUpdate(comment.blog._id, {
            $pull: { comments: id },
        });
        await Comment.findByIdAndDelete(id);

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
        const { updateComment } = req.body;

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

        await Comment.findByIdAndUpdate(id, { comment: updateComment });

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
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

module.exports = {
    addComment,
    deleteComment,
    editComment,
    likeComment,
};
