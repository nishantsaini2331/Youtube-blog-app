import axios from "axios";
import { useEffect, useState } from "react";

function usePagination(path, queryParams = {}, limit = 1, page = 1) {
  const [hasMore, setHasMore] = useState(true);
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    async function fetchSeachBlogs() {
      try {
        let res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/${path}`,
          {
            params: { ...queryParams, limit, page },
          }
        );
        setBlogs((prev) => [...prev, ...res.data.blogs]);
        setHasMore(res.data.hasMore);
      } catch (error) {
        setBlogs([]);
        console.log(error);
      }
    }
    fetchSeachBlogs();
  }, [page]);

  return { blogs, hasMore };
}

export default usePagination;
