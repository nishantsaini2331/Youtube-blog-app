import React from "react";
import { Outlet } from "react-router-dom";

function Navbar() {
    return (
        <div className="w-full h-full flex flex-col items-center overflow-x-hidden">
            <div className="flex-none w-full bg-gray-700 h-[70px] text-white">
              Blog App
            </div>
            <Outlet />
        </div>
    );
}

export default Navbar;
