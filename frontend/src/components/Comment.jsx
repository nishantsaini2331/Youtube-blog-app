import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "../utils/commentSlice";
import { useState } from "react";
import axios from "axios";
import { combineReducers } from "@reduxjs/toolkit";
import { setCommentLikes, setComments } from "../utils/selectedBlogSlice";

import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";

function Comment() {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  console.log(comment);
  const { _id: blogId, comments } = useSelector((state) => state.selectedBlog);
  const { token, id: userId } = useSelector((state) => state.user);

  async function handleComment() {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${blogId}`,
        {
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      dispatch(setComments(res.data.newComment));
      setComment("");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCommentLike(commentId) {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/like-comment/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      console.log(res.data);
      dispatch(setCommentLikes({ commentId, userId }));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-white h-screen p-5 fixed top-0 right-0 w-[400px] border-l drop-shadow-xl overflow-y-scroll">
      <div className="flex  justify-between">
        <h1 className="text-xl font-medium">Comment ({comments.length})</h1>
        <i
          onClick={() => dispatch(setIsOpen(false))}
          className="fi fi-br-cross text-lg mt-1 cursor-pointer"
        ></i>
      </div>

      <div className="my-4">
        <textarea
          type="text"
          placeholder="Comment..."
          className=" h-[150px] resize-none drop-shadow w-full p-3 text-lg focus:outline-none"
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleComment} className="bg-green-500 px-7 py-3 my-2">
          Add
        </button>
      </div>

      <div className="mt-4">
        {comments.map((comment) => (
          <>
            <hr className="my-2" />
            <div className="flex flex-col gap-2 my-4">
              <div className="flex w-full justify-between">
                <div className="flex gap-2">
                  <div className="w-10 h-10">
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${comment.user.name}`}
                      alt=""
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="capitalize font-medium">
                      {comment.user.name}
                    </p>
                    <p>{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
                <i className="fi fi-bs-menu-dots"></i>
              </div>

              <p className="font-medium text-lg">{comment.comment}</p>

              <div className="flex justify-between">
                <div className="flex gap-4">
                  <div className="cursor-pointer flex gap-2 ">
                    {comment.likes.includes(userId) ? (
                      <i
                        onClick={() => handleCommentLike(comment._id)}
                        className="fi fi-sr-thumbs-up text-blue-600 text-xl mt-1"
                      ></i>
                    ) : (
                      <i
                        onClick={() => handleCommentLike(comment._id)}
                        className="fi fi-rr-social-network text-lg mt-1"
                      ></i>
                    )}
                    <p className="text-lg">{comment.likes.length}</p>
                  </div>
                  <div className="flex gap-2 cursor-pointer">
                    <i className="fi fi-sr-comment-alt text-lg mt-1"></i>
                    <p className="text-lg">5</p>
                  </div>
                </div>
                <p className="text-lg hover:underline cursor-pointer">reply</p>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default Comment;
