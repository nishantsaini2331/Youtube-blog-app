import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { handleSaveBlogs } from "../pages/BlogPage";
import { useSelector } from "react-redux";
import DisplayBlogs from "./DisplayBlogs";

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const { token, id: userId } = useSelector((state) => state.user);

  async function fetchBlogs() {
    let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs`);
    console.log(res.data.blogs);
    setBlogs(res.data.blogs);
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="w-[50%] mx-auto">
      <DisplayBlogs blogs={blogs} />
    </div>
  );
}

export default HomePage;
