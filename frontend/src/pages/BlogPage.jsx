import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  addSlectedBlog,
  changeLikes,
  removeSelectedBlog,
} from "../utils/selectedBlogSlice";
import Comment from "../components/Comment";
import { setIsOpen } from "../utils/commentSlice";
import { formatDate } from "../utils/formatDate";
import { updateData } from "../utils/userSilce";
// import jwt from "jsonwebtoken"

export async function handleSaveBlogs(id, token) {
  try {
    let res = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/save-blog/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(res.data.message);

    // dispatch(addSlectedBlog(blog));
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

export async function handleFollowCreator(id, token, dispatch) {
  try {
    let res = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/follow/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(res.data.message);

    dispatch(updateData(["followers", id]));
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
}

function BlogPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  //   const user = JSON.parse(localStorage.getItem("user"));
  //   const token = JSON.parse(localStorage.getItem("token"));
  const [isBlogSaved, setIsBlogSaved] = useState(false);

  const {
    token,
    email,
    id: userId,
    profilePic,
    following,
  } = useSelector((state) => state.user);
  const { likes, comments, content, creator } = useSelector(
    (state) => state.selectedBlog
  );

  const { isOpen } = useSelector((state) => state.comment);

  const [blogData, setBlogData] = useState(null);

  const [islike, setIsLike] = useState(false);

  async function fetchBlogById() {
    try {
      let {
        data: { blog },
      } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`);
      setBlogData(blog);
      setIsBlogSaved(blog?.totalSaves?.includes(userId));

      dispatch(addSlectedBlog(blog));

      if (blog.likes.includes(userId)) {
        setIsLike((prev) => !prev);
      }
    } catch (error) {
      toast.error(error);
    }
  }

  async function handleLike() {
    if (token) {
      setIsLike((prev) => !prev);

      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/like/${blogData._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(changeLikes(userId));
      toast.success(res.data.message);
    } else {
      return toast.error("Please signin to like this blog");
    }
  }

  useEffect(() => {
    fetchBlogById();

    return () => {
      dispatch(setIsOpen(false));
      if (
        window.location.pathname !== `/edit/${id}` &&
        window.location.pathname !== `/blog/${id}`
      ) {
        dispatch(removeSelectedBlog());
      }
    };
  }, [id]);

  return (
    <div className="max-w-[700px] mx-auto p-5 ">
      {blogData ? (
        <div>
          <h1 className="mt-10 font-bold text-3xl  sm:text-4xl lg:text-6xl capitalize">
            {blogData.title}
          </h1>

          <div className="flex items-center my-5 gap-3">
            <Link to={`/@${blogData.creator.username}`}>
              <div>
                <div className="w-10 h-10 cursor-pointer aspect-square rounded-full overflow-hidden">
                  <img
                    src={
                      blogData?.creator?.profilePic
                        ? blogData?.creator?.profilePic
                        : `https://api.dicebear.com/9.x/initials/svg?seed=${blogData.creator.name}`
                    }
                    alt=""
                    className="rounded-full w-full h-full object-cover"
                  />
                </div>
              </div>
            </Link>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 ">
                <Link to={`/@${blogData.creator.username}`}>
                  <h2 className="text-xl hover:underline cursor-pointer">
                    {blogData.creator.name}
                  </h2>
                </Link>
                {userId !== blogData.creator._id && (
                  <p
                    onClick={() =>
                      handleFollowCreator(blogData.creator._id, token, dispatch)
                    }
                    className="text-xl my-2 font-medium text-green-700 cursor-pointer"
                  >
                    .
                    {!following?.includes(creator?._id)
                      ? "follow"
                      : "following"}
                  </p>
                )}
              </div>
              <div>
                <span>6 min read</span>
                <span className="mx-2">{formatDate(blogData.createdAt)}</span>
              </div>
            </div>
          </div>

          <img src={blogData.image} alt="" />

          {token && email === blogData.creator.email && (
            <Link to={"/edit/" + blogData.blogId}>
              <button className="bg-green-400 mt-5 px-6 py-2 text-xl rounded ">
                Edit
              </button>
            </Link>
          )}
          <div className="flex gap-7 mt-4">
            <div className="cursor-pointer flex gap-2 ">
              {islike ? (
                <i
                  onClick={handleLike}
                  className="fi fi-sr-thumbs-up text-blue-600 text-3xl mt-1"
                ></i>
              ) : (
                <i
                  onClick={handleLike}
                  className="fi fi-rr-social-network text-3xl mt-1"
                ></i>
              )}
              <p className="text-2xl">{likes.length}</p>
            </div>

            <div className="flex gap-2">
              <i
                onClick={() => dispatch(setIsOpen())}
                className="fi fi-sr-comment-alt text-3xl mt-1"
              ></i>
              <p className="text-2xl">{comments.length}</p>
            </div>
            <div
              className="flex gap-2 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleSaveBlogs(blogData._id, token);
                setIsBlogSaved((prev) => !prev);
              }}
            >
              {isBlogSaved ? (
                <i className="fi fi-sr-bookmark text-3xl mt-1"></i>
              ) : (
                <i className="fi fi-rr-bookmark text-3xl mt-1"></i>
              )}
            </div>
          </div>

          <div className="my-10">
            {content.blocks.map((block, index) => {
              if (block.type == "header") {
                if (block.data.level == 2) {
                  return (
                    <h2
                      key={index}
                      className="font-bold text-4xl my-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h2>
                  );
                } else if (block.data.level == 3) {
                  return (
                    <h3
                      key={index}
                      className="font-bold text-3xl my-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h3>
                  );
                } else if (block.data.level == 4) {
                  return (
                    <h4
                      key={index}
                      className="font-bold text-2xl my-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h4>
                  );
                }
              } else if (block.type == "paragraph") {
                return (
                  <p
                    key={index}
                    className="my-4"
                    dangerouslySetInnerHTML={{ __html: block.data.text }}
                  ></p>
                );
              } else if (block.type == "image") {
                return (
                  <div className="my-4" key={index}>
                    <img src={block.data.file.url} alt="" />
                    <p className="text-center my-2">{block.data.caption}</p>
                  </div>
                );
              } else if (block.type == "List") {
                if (block.data.style == "ordered") {
                  return (
                    <ol key={index} className="list-decimal my-4">
                      {block.data.items.map((item, index) => (
                        <li key={index}>{item?.content}</li>
                      ))}
                    </ol>
                  );
                } else {
                  return (
                    <ul key={index} className="list-disc my-4">
                      {block.data.items.map((item, index) => (
                        <li key={index}>{item?.content}</li>
                      ))}
                    </ul>
                  );
                }
              }
            })}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-[calc(100vh-500px)]">
          <span className="loader"></span>
        </div>
      )}

      {isOpen && <Comment />}
    </div>
  );
}

export default BlogPage;
