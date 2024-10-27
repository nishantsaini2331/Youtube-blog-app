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
// import jwt from "jsonwebtoken"

function BlogPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  //   const user = JSON.parse(localStorage.getItem("user"));
  //   const token = JSON.parse(localStorage.getItem("token"));

  const { token, email, id: userId } = useSelector((slice) => slice.user);
  const { likes } = useSelector((slice) => slice.selectedBlog);
  //   console.log(token);

  //   console.log();

  const [blogData, setBlogData] = useState(null);

  const [islike, setIsLike] = useState(false);

  //   console.log(blogData);
  async function fetchBlogById() {
    try {
      let {
        data: { blog },
      } = await axios.get(`http://localhost:3000/api/v1/blogs/${id}`);
      setBlogData(blog);
      if (blog.likes.includes(userId)) {
        setIsLike((prev) => !prev);
      }

      dispatch(addSlectedBlog(blog));
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
      return toast.error("Please signin for like this blog");
    }
  }

  useEffect(() => {
    fetchBlogById();

    return () => {
    //   console.log(window.location.pathname); // currnt path
    //   console.log(location.pathname); //previous path

      if (window.location.pathname !== `/edit/${id}`) {
        dispatch(removeSelectedBlog());
      }
    };
  }, [id]);

  return (
    <div className="max-w-[700px]">
      {blogData ? (
        <div>
          <h1 className="mt-10 font-bold text-6xl">{blogData.title}</h1>
          <h2 className="my-5 text-3xl">{blogData.creator.name}</h2>
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
              <i className="fi fi-sr-comment-alt text-3xl mt-1"></i>
              <p className="text-2xl">{blogData.comments.length}</p>
            </div>
          </div>
        </div>
      ) : (
        <h1>Loading....</h1>
      )}
    </div>
  );
}

export default BlogPage;
