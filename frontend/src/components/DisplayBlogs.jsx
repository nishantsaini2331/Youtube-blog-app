import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { useSelector } from "react-redux";

function DisplayBlogs({ blogs }) {
  const { token, id: userId } = useSelector((state) => state.user);
  return (
    <div>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <Link key={blog._id} to={"/blog/" + blog.blogId}>
            <div key={blog._id} className="w-full my-10 flex justify-between max-xsm:flex-col ">
              <div className="w-[60%] flex flex-col gap-2 max-xsm:w-full">
                <div className="flex items-center gap-2">
                  <Link to={`/@${blog.creator.username}`}>
                    <div>
                      <div className="w-6 h-6 cursor-pointer aspect-square rounded-full overflow-hidden">
                        <img
                          src={
                            blog?.creator?.profilePic
                              ? blog?.creator?.profilePic
                              : `https://api.dicebear.com/9.x/initials/svg?seed=${blog?.creator?.name}`
                          }
                          alt=""
                          className="rounded-full w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </Link>
                  <p className=" hover:underline ">{blog?.creator?.name}</p>
                </div>
                <h2 className="font-bold text-xl sm:text-2xl">{blog?.title}</h2>
                <h4 className="line-clamp-2">{blog?.description}</h4>
                <div className="flex gap-5">
                  <p>{formatDate(blog?.createdAt)}</p>
                  <div className="flex gap-7">
                    <div className="cursor-pointer flex gap-2 ">
                      <i className="fi fi-rr-social-network text-lg mt-1"></i>
                      <p className="text-lg">{blog?.likes?.length}</p>
                    </div>

                    <div className="flex gap-2">
                      <i className="fi fi-sr-comment-alt text-lg mt-1"></i>
                      <p className="text-lg">{blog?.comments?.length}</p>
                    </div>
                    <div
                      className="flex gap-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSaveBlogs(blog?._id, token);
                      }}
                    >
                      {blog?.totalSaves?.includes(userId) ? (
                        <i className="fi fi-sr-bookmark text-lg mt-1"></i>
                      ) : (
                        <i className="fi fi-rr-bookmark text-lg mt-1"></i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[40%] sm:w-[30%] max-xsm:w-full">
                <img
                  src={blog?.image}
                  alt=""
                  className="aspect-video object-cover w-full"
                />
              </div>
            </div>
          </Link>
        ))
      ) : (
        <h1 className="my-10 text-2xl font-semibold ">No data found</h1>
      )}
    </div>
  );
}

export default DisplayBlogs;
