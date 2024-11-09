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
// import jwt from "jsonwebtoken"

function BlogPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  //   const user = JSON.parse(localStorage.getItem("user"));
  //   const token = JSON.parse(localStorage.getItem("token"));

  const { token, email, id: userId } = useSelector((state) => state.user);
  const { likes, comments, content } = useSelector(
    (state) => state.selectedBlog
  );
  const { isOpen } = useSelector((state) => state.comment);
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
      return toast.error("Please signin for like this blog");
    }
  }

  useEffect(() => {


    fetchBlogById();

    return () => {
      //   console.log(window.location.pathname); // currnt path
      //   console.log(location.pathname); //previous path
      dispatch(setIsOpen(false));
      if (window.location.pathname !== `/edit/${id}` && window.location.pathname !== `/blog/${id}`) {
        dispatch(removeSelectedBlog());
      }
    };
    
  }, [id]);

  return (
    <div className="max-w-[700px] mx-auto ">
      {blogData ? (
        <div>
          <h1 className="mt-10 font-bold text-6xl capitalize">
            {blogData.title}
          </h1>
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
              <i
                onClick={() => dispatch(setIsOpen())}
                className="fi fi-sr-comment-alt text-3xl mt-1"
              ></i>
              <p className="text-2xl">{comments.length}</p>
            </div>
          </div>

          <div className="my-10">
            {content.blocks.map((block) => {
              if (block.type == "header") {
                if (block.data.level == 2) {
                  return (
                    <h2 className="font-bold text-4xl my-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h2>
                  );
                } else if (block.data.level == 3) {
                  return (
                    <h3 className="font-bold text-3xl my-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h3>
                  );
                } else if (block.data.level == 4) {
                  return (
                    <h4  className="font-bold text-2xl my-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h4>
                  );
                }
              } else if (block.type == "paragraph") {
                return (
                  <p className="my-4" dangerouslySetInnerHTML={{ __html: block.data.text }}></p>
                );
              }
              else if (block.type == "image") {
                return (
                  <div className="my-4">
                    <img src={block.data.file.url} alt="" />
                    <p className="text-center my-2">{block.data.caption}</p>
                  </div>
                );
              }

            })}
          </div>
        </div>
      ) : (
        <h1>Loading....</h1>
      )}

      {isOpen && <Comment />}
    </div>
  );
}

export default BlogPage;
