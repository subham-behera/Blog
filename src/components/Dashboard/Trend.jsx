import { useState, useEffect } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { RiStockLine, RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";

function Trend({ title, amount, sign, change, link }) {
    const [trendColor, setTrendColor] = useState('');
    const [trendIcon, setTrendIcon] = useState(null);

    useEffect(() => {
        if (sign === '+') {
            setTrendColor('text-green-500');
            setTrendIcon(<RiArrowUpSFill />);
        } else if (sign === '-') {
            setTrendColor('text-red-500');
            setTrendIcon(<RiArrowDownSFill />);
        } else {
            setTrendColor('text-gray-500');
            setTrendIcon(null);
        }
    }, [sign]);

    return (
        <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
                <button className="text-gray-500 dark:text-gray-400">
                    <HiDotsHorizontal />
                </button>
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">₹{amount}</p>
                <div className={`flex items-center ${trendColor} mt-2`}>
                    {trendIcon}
                    <span className="ml-1">{change}</span>
                </div>
            </div>
            <div className="mt-6">
                <a href={link} className="text-sm text-blue-500 dark:text-blue-400 hover:underline">
                    See details
                </a>
            </div>
        </div>
    );
}

export default Trend;
