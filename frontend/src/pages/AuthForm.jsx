import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../utils/userSilce";
import Input from "../components/Input";
import googleIcon from "../assets/google-icon-logo-svgrepo-com.svg";
import { googleAuth } from "../utils/firebase";

function AuthForm({ type }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleAuthForm(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/${type}`,
        userData
      );

      if (type == "signup") {
        toast.success(res.data.message);
        navigate("/signin");
      } else {
        dispatch(login(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setUserData({
        name: "",
        email: "",
        password: "",
      });
    }
  }

  async function handleGoogleAuth() {
    try {
      let data = await googleAuth();
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/google-auth`,
        {
          accessToken: data.accessToken,
        }
      );
      console.log(res);
      dispatch(login(res.data.user));
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className="w-full">
      <div className=" bg-gray-100 p-4 rounded-xl mx-auto max-w-[400px] flex flex-col items-center gap-5 mt-52">
        <h1 className="text-3xl">
          {type === "signin" ? "Sign in" : "Sign up"}
        </h1>
        <form
          className="w-[100%] flex flex-col items-center gap-5"
          onSubmit={handleAuthForm}
        >
          {type == "signup" && (
            <Input
              type={"text"}
              placeholder={"Enter you name"}
              setUserData={setUserData}
              field={"name"}
              value={userData.name}
              icon={"fi-br-user"}
            />
          )}

          <Input
            type={"email"}
            placeholder={"Enter your email"}
            setUserData={setUserData}
            field={"email"}
            value={userData.email}
            icon={"fi-rr-at"}
          />

          <Input
            type={"password"}
            placeholder={"Enter your password"}
            setUserData={setUserData}
            field={"password"}
            value={userData.password}
            icon={"fi-rr-lock"}
          />

          <button className="w-[100px] h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-blue-500">
            {type == "signin" ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-xl font-semibold">or</p>

        <div
          onClick={handleGoogleAuth}
          className="bg-white border hover:bg-blue-200 w-full flex gap-4 cursor-pointer items-center justify-center overflow-hidden py-3 px-4 rounded-full"
        >
          <p className="text-2xl font-medium">continue with</p>
          <div className="">
            <img className="w-8 h-8" src={googleIcon} alt="" />
          </div>
        </div>

        {type == "signin" ? (
          <p>
            Don't have an account <Link to={"/signup"}>Sign up</Link>
          </p>
        ) : (
          <p>
            Already have an account <Link to={"/signin"}>Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
