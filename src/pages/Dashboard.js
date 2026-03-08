import React, { useState } from "react";
import UserSidebar from "../components/UserSidebar";
import Topbar from "../components/Topbar";
import ResourceList from "../components/ResourceList";
import FilterModal from "../components/FilterModal"; // You'll create this or use the logic from the previous example
import { Search, Filter } from "lucide-react";
import "../styles/dashboard.css";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // State for searching and filtering
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState({
        subject: 'All',
        category: 'All',
        rating: 0
    });

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="min-h-screen bg-[#0B1220] flex">
            <UserSidebar isOpen={sidebarOpen} />

            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'pl-[250px]' : 'pl-0'}`}>
                <Topbar toggleSidebar={toggleSidebar} />

                <div className="p-[30px] max-w-7xl mx-auto">
                    {/* Search & Filter Bar */}
                    <div className="flex gap-[10px] mb-[25px]">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-3 pl-10 bg-[#111827] border border-[#1F2937] rounded-lg text-white focus:outline-none focus:border-[#22D3EE]"
                            />
                        </div>

                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="px-5 py-3 bg-[#22D3EE] text-[#0B1220] font-bold rounded-lg cursor-pointer hover:bg-[#06B6D4] transition-colors flex items-center gap-2"
                        >
                            <Filter size={18} />
                            Filters
                        </button>
                    </div>

                    {/* Pass the search and filter state to your existing ResourceList */}
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <ResourceList
                            searchQuery={searchQuery}
                            filters={activeFilters}
                        />
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            {isFilterOpen && (
                <FilterModal
                    filters={activeFilters}
                    setFilters={setActiveFilters}
                    onClose={() => setIsFilterOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;