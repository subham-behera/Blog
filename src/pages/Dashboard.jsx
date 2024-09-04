import Main from "../components/Dashboard/Main";
import Navbar from "../components/Dashboard/Navbar";
import Sidepanel from "../components/Dashboard/Sidepanel";

function Dashboard() {
    return (
        <div className="flex flex-col md:flex-row w-screen h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">    
            <Sidepanel />
            <div id="right" className="flex flex-col w-full p-6 space-y-6 overflow-y-auto">
                <Navbar />
                <Main />
            </div>
        </div>
    );
}

export default Dashboard;
