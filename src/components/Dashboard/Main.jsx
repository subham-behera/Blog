import { FaFileCsv } from "react-icons/fa";
import Trend from "./Trend";
import trendData from './data/trendData.json';

function Main() {
    return (
        <div className="flex flex-col mt-8">
            <div className="flex flex-row justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Analytics Overview</h1>
                <button
                    className="flex flex-row items-center gap-x-2 shadow-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
                >
                    <FaFileCsv />
                    Export CSV
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {trendData.map((data, index) => (
                    <Trend
                        key={index}
                        title={data.title}
                        amount={data.amount}
                        sign={data.sign}
                        change={data.change}
                        link={data.link}
                    />
                ))}
            </div>
        </div>
    );
}

export default Main;
