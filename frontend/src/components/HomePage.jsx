import React, { useState } from "react";
import { useSelector } from "react-redux";
import DisplayBlogs from "./DisplayBlogs";
import usePagination from "../hooks/usePagination";

function HomePage() {
  const [page, setPage] = useState(1);
  const { token, id: userId } = useSelector((state) => state.user);

  const { blogs, hasMore } = usePagination("blogs", {}, 1, page);

  return (
    <div className="w-[50%] mx-auto">
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

export default HomePage;
