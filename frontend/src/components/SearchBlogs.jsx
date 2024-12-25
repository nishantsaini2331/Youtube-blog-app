import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DisplayBlogs from "./DisplayBlogs";

function SearchBlogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const q = searchParams.get("q");
  useEffect(() => {
    if (q) {
      async function fetchSeachBlogs() {
        try {
          let res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/search-blogs?search=${q}`
          );
          setBlogs(res.data.blogs);
        } catch (error) {
            setBlogs([]);
          console.log(error);
        }
      }

      fetchSeachBlogs();
    }
  }, [q]);

  return (
    <div className="w-[50%] mx-auto">
      <h1 className="my-10 text-4xl text-gray-500 font-bold ">
        Results for <span className="text-black">{q}</span>
      </h1>
      <DisplayBlogs blogs={blogs} />
    </div>
  );
}

export default SearchBlogs;
