import React, { useState } from "react";
import { useSelector } from "react-redux";
import DisplayBlogs from "./DisplayBlogs";
import usePagination from "../hooks/usePagination";
import { Link } from "react-router-dom";

function HomePage() {
  const [page, setPage] = useState(1);
  const { token, id: userId } = useSelector((state) => state.user);

  const { blogs, hasMore } = usePagination("blogs", {}, 4, page);

  return (
    <div className=" w-full  lg:w-[80%] 2xl:w-[60%] mx-auto flex  p-5 ">
      <div className="w-full md:w-[65%] md:pr-10">
        {blogs.length > 0 && <DisplayBlogs blogs={blogs} />}
        {hasMore && (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-3xl mx-auto bg-blue-500 text-white px-7 py-2"
          >
            Load more
          </button>
        )}
      </div>
      <div className=" hidden md:block w-[30%] border-l pl-10 min-h-[calc(100vh_-_70px)] ">
        <div className="">
          <h1 className="text-xl font-semibold mb-4">Recommended topics</h1>
          <div className="flex flex-wrap">
            {["React", "Node js", "Code Thread", "Mern", "Express"].map(
              (tag, index) => (
                <Link to={`/tag/${tag}`}>
                  <div
                    key={index}
                    className="m-1 cursor-pointer bg-gray-200 text-black  hover:text-white hover:bg-blue-500 rounded-full px-5 py-2 flex justify-center items-center"
                  >
                    <p>{tag}</p>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
