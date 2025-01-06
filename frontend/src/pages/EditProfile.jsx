import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../utils/userSilce";
import { Navigate, useNavigate } from "react-router-dom";
import useLoader from "../hooks/useLoader";

function EditProfile() {
  const {
    token,
    id: userId,
    email,
    name,
    username,
    profilePic,
    bio,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, startLoading, stopLoading] = useLoader();

  const [userData, setUserData] = useState({
    profilePic,
    username,
    name,
    bio,
  });

  const [initialData, setInitialData] = useState({
    profilePic,
    username,
    name,
    bio,
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  function handleChange(e) {
    const { value, name, files } = e.target;
    if (files) {
      setUserData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setUserData((prevData) => ({ ...prevData, [name]: value }));
    }
  }

  async function handleUpdateProfile() {
    startLoading();
    setIsButtonDisabled(true);
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("username", userData.username);
    if (userData.profilePic) {
      formData.append("profilePic", userData.profilePic);
    }
    formData.append("bio", userData.bio);

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      dispatch(login({ ...res.data.user, token, email, id: userId }));
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      stopLoading();
    }
  }

  useEffect(() => {
    if (initialData) {
      const isEqual = JSON.stringify(userData) === JSON.stringify(initialData);
      setIsButtonDisabled(isEqual);
    }
  }, [userData, initialData]);
  return token == null ? (
    <Navigate to={"/signin"} />
  ) : (
    <div className="w-full p-5">
      <div className=" w-full  md:w-[70%] lg:w-[55%] mx-auto my-10 lg:px-10">
        <h1 className="text-center text-3xl font-medium my-4">Edit Profile</h1>
        <div>
          <div className="">
            <h2 className="text-2xl font-semibold my-2">Photo</h2>
            <div className="flex items-center flex-col gap-3">
              <div className="w-[150px] h-[150px] cursor-pointer aspect-square rounded-full overflow-hidden">
                <label htmlFor="image" className=" ">
                  {userData?.profilePic ? (
                    <img
                      src={
                        typeof userData?.profilePic == "string"
                          ? userData?.profilePic
                          : URL.createObjectURL(userData?.profilePic)
                      }
                      alt=""
                      className="rounded-full w-full h-full object-cover"
                    />
                  ) : (
                    <div className=" w-[150px] h-[150px] bg-white border-2 border-dashed rounded-full aspect-square  flex justify-center items-center text-xl">
                      Select Image
                    </div>
                  )}
                </label>
              </div>
              <h2
                className="text-lg text-red-500 font-medium cursor-pointer"
                onClick={() => {
                  setUserData((prevData) => ({
                    ...prevData,
                    profilePic: null,
                  }));
                }}
              >
                Remove
              </h2>
            </div>
            <input
              className="hidden"
              id="image"
              type="file"
              name="profilePic"
              accept=".png, .jpeg, .jpg"
              onChange={handleChange}
            />
          </div>

          <div className="my-4">
            <h2 className="text-2xl font-semibold my-2">Name</h2>
            <input
              name="name"
              type="text"
              placeholder="name"
              defaultValue={userData.name}
              onChange={handleChange}
              className="border focus:outline-none rounded-lg w-full p-2 placeholder:text-lg"
            />
          </div>
          <div className="my-4">
            <h2 className="text-2xl font-semibold my-2">Username</h2>
            <input
              type="text"
              name="username"
              placeholder="username"
              defaultValue={userData.username}
              onChange={handleChange}
              className="border focus:outline-none rounded-lg w-full p-2 placeholder:text-lg"
            />
          </div>

          <div className="my-4">
            <h2 className="text-2xl font-semibold my-2">Bio</h2>
            <textarea
              type="text"
              name="bio"
              placeholder="description"
              defaultValue={userData.bio}
              className=" h-[100px] resize-none w-full p-3 rounded-lg border text-lg focus:outline-none"
              onChange={handleChange}
            />
          </div>

          {!isLoading ? (
            <div>
              <button
                disabled={isButtonDisabled}
                className={` px-7 py-3 rounded-full text-white my-3  ${
                  isButtonDisabled ? " bg-green-300 " : " bg-green-600 "
                } `}
                onClick={handleUpdateProfile}
              >
                Update
              </button>
              <button
                className={` mx-4 px-7 py-3 rounded-full text-white my-3 bg-black`}
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          ) : (
            <span className="loader"></span>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
