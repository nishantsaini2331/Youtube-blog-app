import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";

function AddBlog() {
  const { id } = useParams();
  const { token } = useSelector((silce) => silce.user);
  const { title, description, image } = useSelector(
    (slice) => slice.selectedBlog
  );

  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
  });
  //   console.log(typeof(blogData.image));

  const navigate = useNavigate();

  // useEffect(() => {
  //     if (!token) {
  //         return navigate("/signin");
  //     }
  // }, []);

  async function handlePostBlog() {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/blogs",
        blogData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(URL.createObjectURL(blogData.image));

      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function handleUpdateBlog() {
    try {
      const res = await axios.patch(
        "http://localhost:3000/api/v1/blogs/" + id,
        blogData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function fetchBlogById() {
    // try {
    //   let res = await axios.get(`http://localhost:3000/api/v1/blogs/${id}`);
    //   setBlogData({
    //     title: res.data.blog.title,
    //     description: res.data.blog.description,
    //     image: res.data.blog.image,
    //   });
    //   console.log(res);
    // } catch (error) {
    //   toast.error(error.response.data.message);
    // }

    setBlogData({
      title: title,
      description: description,
      image: image,
    });
  }

  useEffect(() => {
    if (id) {
      fetchBlogById();
    }
  }, [id]);

  return token == null ? (
    <Navigate to={"/signin"} />
  ) : (
    <div className="w-[500px] mx-auto">
      <label htmlFor="">Title</label>
      <input
        type="text"
        placeholder="title"
        onChange={(e) =>
          setBlogData((blogData) => ({
            ...blogData,
            title: e.target.value,
          }))
        }
        value={blogData.title}
      />
      <br />
      <label htmlFor="">Description</label>
      <input
        type="text"
        placeholder="description"
        onChange={(e) =>
          setBlogData((blogData) => ({
            ...blogData,
            description: e.target.value,
          }))
        }
        value={blogData.description}
      />
      <br />
      <div>
        <label htmlFor="image" className=" ">
          {blogData.image ? (
            <img
              src={
                typeof blogData.image == "string"
                  ? blogData.image
                  : URL.createObjectURL(blogData.image)
              }
              alt=""
              className="aspect-video object-cover"
            />
          ) : (
            <div className=" bg-slate-500 aspect-video flex justify-center items-center text-4xl">
              Select Image
            </div>
          )}
        </label>
        <input
          className="hidden"
          id="image"
          type="file"
          accept=".png, .jpeg, .jpg"
          onChange={(e) =>
            setBlogData((blogData) => ({
              ...blogData,
              image: e.target.files[0],
            }))
          }
        />
      </div>

      <br />
      <button onClick={id ? handleUpdateBlog : handlePostBlog}>
        {id ? "Update blog" : "Post blog"}
      </button>
    </div>
  );
}

export default AddBlog;
