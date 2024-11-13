import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import NestedList from "@editorjs/nested-list";
import CodeTool from "@editorjs/code";
import Marker from "@editorjs/marker";
import Underline from "@editorjs/underline";
import Embed from "@editorjs/embed";
import RawTool from "@editorjs/raw";
import ImageTool from "@editorjs/image";
import TextVariantTune from "@editorjs/text-variant-tune";

function AddBlog() {
  const { id } = useParams();
  const editorjsRef = useRef(null);

  const formData = new FormData();

  const { token } = useSelector((silce) => silce.user);
  const { title, description, image, content } = useSelector(
    (slice) => slice.selectedBlog
  );

  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
    content: "",
  });

  const navigate = useNavigate();

  // useEffect(() => {
  //     if (!token) {
  //         return navigate("/signin");
  //     }
  // }, []);

  async function handlePostBlog() {
    formData.append("title", blogData.title);
    formData.append("description", blogData.description);
    formData.append("image", blogData.image);
    formData.append("content", JSON.stringify(blogData.content));

    blogData.content.blocks.forEach((block) => {
      if (block.type === "image") {
        formData.append("images", block.data.file.image);
      }
    });

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/blogs",
        formData,
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

  async function handleUpdateBlog() {
    // console.log(blogData);

    let formData = new FormData();

    formData.append("title", blogData.title);
    formData.append("description", blogData.description);
    formData.append("image", blogData.image);

    formData.append("content", JSON.stringify(blogData.content));

    let existingImages = [];

    blogData.content.blocks.forEach((block) => {
      if (block.type === "image") {
        if (block.data.file.image) {
          formData.append("images", block.data.file.image);
        } else {
          existingImages.push({
            url: block.data.file.url,
            imageId: block.data.file.imageId,
          });
        }
      }
    });

    // for (let data of formData.entries()) {
    //   console.log(data);
    // }

    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      const res = await axios.patch(
        "http://localhost:3000/api/v1/blogs/" + id,
        formData,
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
      content: content,
    });
  }

  function initializeEditorjs() {
    editorjsRef.current = new EditorJS({
      holder: "editorjs",
      placeholder: "write something...",
      data: content,
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: "Enter a header",
            levels: [2, 3, 4],
            defaultLevel: 3,
          },
        },
        List: {
          class: NestedList,
          config: {},
          inlineToolbar: true,
        },
        code: CodeTool,
        Marker: Marker,
        Underline: Underline,
        Embed: Embed,
        raw: RawTool,
        textVariant: TextVariantTune,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (image) => {
                // console.log(image);
                return {
                  success: 1,

                  file: {
                    url: URL.createObjectURL(image),
                    image,
                  },
                };
              },
            },
          },
        },
      },
      tunes: ["textVariant"],
      onChange: async () => {
        let data = await editorjsRef.current.save();
        setBlogData((blogData) => ({ ...blogData, content: data }));
      },
    });
  }

  useEffect(() => {
    if (id) {
      fetchBlogById();
    }
  }, [id]);

  useEffect(() => {
    if (editorjsRef.current === null) {
      initializeEditorjs();
    }

    // return () => {
    //   editorjsRef.current = null;
    // };
  }, []);

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

      <div id="editorjs"></div>

      <button onClick={id ? handleUpdateBlog : handlePostBlog}>
        {id ? "Update blog" : "Post blog"}
      </button>
    </div>
  );
}

export default AddBlog;
