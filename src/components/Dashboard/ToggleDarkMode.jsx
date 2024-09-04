import { useState, useEffect } from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";

function ToggleDarkMode() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full"
        >
            {darkMode ? <HiOutlineSun className="text-yellow-500" /> : <HiOutlineMoon className="text-gray-700 dark:text-gray-200" />}
        </button>
    );
}

export default ToggleDarkMode;
