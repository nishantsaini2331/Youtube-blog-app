import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import DisplayBlogs from "./DisplayBlogs";
import usePagination from "../hooks/usePagination";

function SearchBlogs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(1);

  const q = searchParams.get("q");

  const { blogs, hasMore } = usePagination(
    "search-blogs",
    { search: q },
    1,
    page
  );

  return (
    <div className="w-[50%] mx-auto">
      <h1 className="my-10 text-4xl text-gray-500 font-bold ">
        Results for <span className="text-black">{q}</span>
      </h1>
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
  );
}

export default SearchBlogs;
