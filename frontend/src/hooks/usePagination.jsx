import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function usePagination(path, queryParams = {}, limit = 1, page = 1) {
  const [hasMore, setHasMore] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
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
        navigate(-1);
        setBlogs([]);
        toast.error(error.response.data.message);
        setHasMore(false);
      }
    }
    fetchSeachBlogs();
  }, [page]);

  return { blogs, hasMore };
}

export default usePagination;
