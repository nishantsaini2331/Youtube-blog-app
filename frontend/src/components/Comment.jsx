import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "../utils/commentSlice";
import { useState } from "react";
import axios from "axios";
import {
  deleteCommentAndReply,
  setCommentLikes,
  setComments,
  setReplies,
  setUpdatedComments,
} from "../utils/selectedBlogSlice";

import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";

function Comment() {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [activeReply, setActiveReply] = useState(null);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [currentEditComment, setCurrentEditComment] = useState(null);
  const {
    _id: blogId,
    comments,
    creator: { _id: creatorId },
  } = useSelector((state) => state.selectedBlog);
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


      setComment("");
      dispatch(setComments(res.data.newComment));
    } catch (error) {
      toast.error(error.response.data.message);
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
          value={comment}
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
        <DisplayComments
          comments={comments}
          userId={userId}
          blogId={blogId}
          token={token}
          activeReply={activeReply}
          setActiveReply={setActiveReply}
          currentPopup={currentPopup}
          setCurrentPopup={setCurrentPopup}
          currentEditComment={currentEditComment}
          setCurrentEditComment={setCurrentEditComment}
          creatorId={creatorId}
        />
      </div>
    </div>
  );
}

function DisplayComments({
  comments,
  userId,
  blogId,
  token,
  setActiveReply,
  activeReply,
  currentPopup,
  setCurrentPopup,
  currentEditComment,
  setCurrentEditComment,
  creatorId,
}) {
  const [reply, setReply] = useState("");
  const [updatedCommentContent, setUpdatedCommentContent] = useState("");

  const dispatch = useDispatch();

  async function handleReply(parentCommentId) {
    try {
      let res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/comment/${parentCommentId}/${blogId}`,
        {
          reply,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReply("");
      setActiveReply(null);
      dispatch(setReplies(res.data.newReply));
    } catch (error) {
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
      dispatch(setCommentLikes({ commentId, userId }));
    } catch (error) {
    }
  }

  function handleActiveReply(id) {
    setActiveReply((prev) => (prev === id ? null : id));
  }

  async function handleCommentUpdate(id) {
    try {
      let res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/edit-comment/${id}`,
        {
          updatedCommentContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      dispatch(setUpdatedComments(res.data.updatedComment));
    } catch (error) {
      toast.success(error.response.data.message);
    } finally {
      setUpdatedCommentContent("");
      setCurrentEditComment(null);
    }
  }

  async function handleCommentDelete(id) {
    try {
      let res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      dispatch(deleteCommentAndReply(id));
    } catch (error) {
      toast.success(error.response.data.message);
    } finally {
      setUpdatedCommentContent("");
      setCurrentEditComment(null);
    }
  }

  return (
    <>
      {comments.map((comment) => (
        <>
          <hr className="my-2" />
          <div className="flex flex-col gap-2 my-4">
            {currentEditComment === comment._id ? (
              <div className="my-4">
                <textarea
                  defaultValue={comment.comment}
                  type="text"
                  placeholder="Reply..."
                  className=" h-[150px] resize-none drop-shadow w-full p-3 text-lg focus:outline-none"
                  onChange={(e) => setUpdatedCommentContent(e.target.value)}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentEditComment(null)}
                    className="bg-red-500 px-7 py-3 my-2 rounded-3xl "
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleCommentUpdate(comment._id);
                    }}
                    className="bg-green-500 px-7 py-3 my-2 rounded-3xl "
                  >
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <>
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

                  {comment.user._id === userId || userId === creatorId ? (
                    currentPopup == comment._id ? (
                      <div className="bg-gray-200 w-[70px] rounded-lg">
                        <i
                          onClick={() =>
                            setCurrentPopup((prev) =>
                              prev == comment._id ? null : comment._id
                            )
                          }
                          className="fi fi-br-cross relative left-12 text-sm mt-1 cursor-pointer"
                        ></i>
                        {comment.user._id === userId ? (
                          <p
                            className="p-2 py-1 hover:bg-blue-300"
                            onClick={() => {
                              setCurrentEditComment(comment._id);
                              setCurrentPopup(null);
                            }}
                          >
                            Edit
                          </p>
                        ) : (
                          ""
                        )}

                        <p
                          className="p-2 py-1 hover:bg-blue-300"
                          onClick={() => {
                            handleCommentDelete(comment._id);
                            setCurrentPopup(null);
                          }}
                        >
                          Delete
                        </p>
                      </div>
                    ) : (
                      <i
                        className="fi fi-bs-menu-dots cursor-pointer"
                        onClick={() => setCurrentPopup(comment._id)}
                      ></i>
                    )
                  ) : (
                    ""
                  )}
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
                      <p className="text-lg">{comment.replies.length}</p>
                    </div>
                  </div>
                  <p
                    onClick={() => handleActiveReply(comment._id)}
                    className="text-lg hover:underline cursor-pointer"
                  >
                    reply
                  </p>
                </div>
              </>
            )}

            {activeReply === comment._id && (
              <div className="my-4">
                <textarea
                  type="text"
                  placeholder="Reply..."
                  className=" h-[150px] resize-none drop-shadow w-full p-3 text-lg focus:outline-none"
                  onChange={(e) => setReply(e.target.value)}
                />
                <button
                  onClick={() => handleReply(comment._id)}
                  className="bg-green-500 px-7 py-3 my-2"
                >
                  Add
                </button>
              </div>
            )}

            {comment.replies.length > 0 && (
              <div className="pl-6 border-l ">
                <DisplayComments
                  comments={comment.replies}
                  userId={userId}
                  blogId={blogId}
                  token={token}
                  activeReply={activeReply}
                  setActiveReply={setActiveReply}
                  currentPopup={currentPopup}
                  setCurrentPopup={setCurrentPopup}
                  currentEditComment={currentEditComment}
                  setCurrentEditComment={setCurrentEditComment}
                  creatorId={creatorId}
                />
              </div>
            )}
          </div>
        </>
      ))}
    </>
  );
}

export default Comment;
