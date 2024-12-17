import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { handleFollowCreator, handleSaveBlogs } from "./BlogPage";
import { useSelector } from "react-redux";

function ProfilePage() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const { token, id: userId } = useSelector((state) => state.user);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        let res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/${username.split("@")[1]}`
        );
        setUserData(res.data.user);
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    }
    fetchUserDetails();
  }, [username]);

  return (
    <div className="w-full  flex justify-center">
      {userData ? (
        <div className="w-[80%] flex justify-evenly relative">
          <div className="w-[50%] ">
            <div className="flex justify-between my-10">
              <p className="text-4xl font-semibold">{userData.name}</p>
              <i className="fi fi-bs-menu-dots cursor-pointer opacity-70"></i>
            </div>
            <div className=" my-4">
              <p className="mb-10">Home</p>
              <div>
                {userData.blogs.map((blog) => (
                  <Link to={"/blog/" + blog.blogId}>
                    <div
                      key={blog._id}
                      className="w-full my-10 flex justify-between "
                    >
                      <div className="w-[60%] flex flex-col gap-2">
                        <div>
                          <img src="" alt="" />
                          <p className="">{blog.creator.name}</p>
                        </div>
                        <h2 className="font-bold text-3xl">{blog.title}</h2>
                        <h4 className="line-clamp-2">{blog.description}</h4>
                        <div className="flex gap-5">
                          <p>{formatDate(blog.createdAt)}</p>
                          <div className="flex gap-7">
                            <div className="cursor-pointer flex gap-2 ">
                              <i className="fi fi-rr-social-network text-lg mt-1"></i>
                              <p className="text-lg">{blog.likes.length}</p>
                            </div>

                            <div className="flex gap-2">
                              <i className="fi fi-sr-comment-alt text-lg mt-1"></i>
                              <p className="text-lg">{blog.comments.length}</p>
                            </div>
                            <div
                              className="flex gap-2 cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                handleSaveBlogs(blog._id, token);
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
                      <div className="w-[25%]">
                        <img src={blog.image} alt="" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className=" w-[20%] border-l pl-10 min-h-[calc(100vh_-_70px)] ">
            <div className="my-10">
              <div className="w-20 h-20">
                <img
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${userData.name}`}
                  alt=""
                  className="rounded-full"
                />
              </div>
              <p className="text-base font-medium my-3">{userData.name}</p>
              <p>{userData.followers.length} Followers</p>
              {/* <p className="text-slate-600 ">22.9K Followers</p> */}

              <p className="text-slate-600 text-sm font-normal my-3">
                {userData.bio}
              </p>

              {userId === userData._id ? (
                <button className="bg-green-600 px-7 py-3 rounded-full text-white my-3">
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => handleFollowCreator(userData._id, token)}
                  className="bg-green-600 px-7 py-3 rounded-full text-white my-3"
                >
                  follow
                </button>
              )}

              <div className="my-6 w-full">
                <h2 className="font-semibold">Following</h2>

                <div className="my-5">
                  {userData.following.map((user) => (
                    <div className="flex justify-between items-center">
                      <Link to={`/@${user.username}`}>
                        <div className="flex gap-2 items-center hover:underline cursor-pointer">
                          <div className="w-4 h-4">
                            <img
                              src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
                              alt=""
                              className="rounded-full"
                            />
                          </div>
                          <p className="text-base font-medium my-3">
                            {user.name}
                          </p>
                        </div>
                      </Link>
                      <i className="fi fi-bs-menu-dots cursor-pointer opacity-70"></i>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default ProfilePage;
