import { BsThreeDots } from "react-icons/bs";
import { MdNotificationsNone } from "react-icons/md";
import { useState } from "react";
import SearchPanel from "./SearchPanel";
import ToggleDarkMode from "./ToggleDarkMode";

function Navbar() {
    return (
        <div className="flex flex-row w-full justify-between items-center py-4 border-b border-gray-300 dark:border-gray-700">
            <SearchPanel />
            <div className="flex flex-row items-center gap-x-4">
                <ToggleDarkMode />
                <MdNotificationsNone className="text-2xl text-gray-700 dark:text-gray-200" />
                <img 
                    src="https://cdn.pixabay.com/photo/2020/12/16/04/15/man-5835659_1280.jpg"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
                    <span className="font-bold">John Doe</span>
                    <span>Admin</span>
                </div>
                <BsThreeDots className="text-xl text-gray-700 dark:text-gray-200" />
            </div>
        </div>
    );
}

export default Navbar;
