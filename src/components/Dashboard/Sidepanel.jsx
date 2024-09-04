import { useState } from "react";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoMdHelpCircle } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { MdAnalytics, MdDashboard, MdOutlineStorefront, MdProductionQuantityLimits } from "react-icons/md";
import { RiPagesLine } from "react-icons/ri";

function Sidepanel() {
    const [activeButton, setActiveButton] = useState('dashboard');

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return (
        <div className="w-[250px] bg-white dark:bg-gray-800 h-screen shadow-lg">
            <div className="flex flex-row p-6 items-center gap-x-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
                <MdOutlineStorefront />
                Blog Dashboard
            </div>
            <div className="flex flex-col mt-6 space-y-2">
                <SidepanelButton 
                    label="Dashboard"
                    icon={<MdDashboard />}
                    isActive={activeButton === 'dashboard'}
                    onClick={() => handleButtonClick('dashboard')}
                />
                <SidepanelButton 
                    label="Posts"
                    icon={<MdProductionQuantityLimits />}
                    isActive={activeButton === 'posts'}
                    onClick={() => handleButtonClick('posts')}
                />
                <SidepanelButton 
                    label="Analytics"
                    icon={<MdAnalytics />}
                    isActive={activeButton === 'analytics'}
                    onClick={() => handleButtonClick('analytics')}
                />
                <SidepanelButton 
                    label="Pages"
                    icon={<RiPagesLine />}
                    isActive={activeButton === 'pages'}
                    onClick={() => handleButtonClick('pages')}
                />
                <SidepanelButton 
                    label="Audience"
                    icon={<BsFillPeopleFill />}
                    isActive={activeButton === 'audience'}
                    onClick={() => handleButtonClick('audience')}
                />
            </div>
            <div className="mt-auto flex flex-col space-y-2">
                <SidepanelButton 
                    label="Settings"
                    icon={<IoSettings />}
                    isActive={activeButton === 'settings'}
                    onClick={() => handleButtonClick('settings')}
                />
                <SidepanelButton 
                    label="Help Center"
                    icon={<IoMdHelpCircle />}
                    isActive={activeButton === 'help'}
                    onClick={() => handleButtonClick('help')}
                />
            </div>
        </div>
    );
}

function SidepanelButton({ label, icon, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-row items-center px-6 py-3 text-lg font-medium text-gray-700 dark:text-gray-300 ${isActive ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-600 dark:border-blue-500' : ''} hover:bg-gray-200 dark:hover:bg-gray-700`}
        >
            <span className="mr-4">{icon}</span>
            {label}
        </button>
    );
}

export default Sidepanel;
