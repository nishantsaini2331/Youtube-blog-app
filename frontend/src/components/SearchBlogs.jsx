import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DisplayBlogs from "./DisplayBlogs";
import usePagination from "../hooks/usePagination";

function SearchBlogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tag } = useParams();
  const [page, setPage] = useState(1);

  const q = searchParams.get("q");

  const query = tag
    ? { tag: tag.toLowerCase().replace(" ", "-") }
    : { search: q };

  const { blogs, hasMore } = usePagination("search-blogs", query, 1, page);

  return (
    <div className="w-full p-5 sm:w-[80%] md:w-[60%] lg:w-[55%] mx-auto">
      <h1 className="my-10 text-4xl text-gray-500 font-bold ">
        Results for <span className="text-black">{tag ? tag : q}</span>
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
