import React, { useState } from "react";

function Input({ type, placeholder, value, setUserData, field, icon }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <i
        className={
          "fi " +
          icon +
          "  absolute top-1/2 -translate-y-1/2 mt-1 left-4 opacity-50"
        }
      ></i>

      <input
        type={type !== "password" ? type : (showPassword ? "text" : type)}
        value={value}
        className="w-full h-[50px] pl-10 text-black text-xl p-2 rounded-full  focus:outline-none border "
        placeholder={placeholder}
        onChange={(e) =>
          setUserData((prev) => ({
            ...prev,
            [field]: e.target.value,
          }))
        }
      />
      {type == "password" && (
        <i
          onClick={() => setShowPassword((prev) => !prev)}
          className={`fi ${
            showPassword ? " fi-rs-eye " : " fi-rs-crossed-eye "
          }  absolute top-1/2 -translate-y-1/2 mt-1 right-4 opacity-50 cursor-pointer`}
        ></i>
      )}
    </div>
  );
}

export default Input;
