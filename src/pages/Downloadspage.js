import { useState, useMemo, useEffect } from "react";
import {
    Search, Download, FileText, Video, 
    Trash2, Clock, 
    HardDrive, Star,
    Eye,
    
} from "lucide-react";
import UserSidebar from "../components/UserSidebar";
import Topbar from "../components/Topbar";
import { useNavigate, Link } from "react-router-dom";
export default function DownloadsPage() {

    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [downloads, setDownloads] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const SUBJECTS = [
        "Mathematics",
        "Physics",
        "Computer Science",
        "Biology",
        "Chemistry",
        "History"
    ];
    // Assuming this is the logged-in user's ID
    const userId = localStorage.getItem("userId");

    const [filters, setFilters] = useState({
        search: '',
        subject: 'All'
    });

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        const fetchDownloadsData = async () => {
            try {
                setLoading(true);

                // 1. Get the total count for the stat card
                const countRes = await fetch(`http://192.168.1.9:8080/api/download/count/${userId}`);
                const countData = await countRes.json();
                setTotalCount(countData);

                const idRes = await fetch(`http://192.168.1.9:8080/api/download/user/${userId}`);
                const downloadRecords = await idRes.json();

                // 3. Fetch details using the correct lowercase key from your log
                const detailPromises = downloadRecords.map(async (record) => {
                    // 🔍 The log shows the key is 'resourceid'
                    const actualId = record.resourceid;

                    if (!actualId) {
                        console.error("Mapping error: Could not find 'resourceid' in:", record);
                        return null;
                    }

                    try {
                        const detailRes = await fetch(`http://192.168.1.9:8080/api/resources/resourcedetails/${actualId}`);
                        if (!detailRes.ok) return null;

                        const resourceData = await detailRes.json();

                        // 4. Fetch uploader's name using the 'uploadedBy' field from the resource
                        if (resourceData.uploadedBy) {
                            const userRes = await fetch(`http://192.168.1.9:8080/api/profile/${resourceData.uploadedBy}`);
                            const userData = await userRes.json();
                            return { ...resourceData, uploadedByName: userData.name };
                        }

                        return { ...resourceData, uploadedByName: "Anonymous" };
                    } catch (err) {
                        console.error(`Error fetching details for ID ${actualId}:`, err);
                        return null;
                    }
                });

                // Final step: Filter out failed requests
                const finalResults = (await Promise.all(detailPromises)).filter(r => r !== null);
                setDownloads(finalResults);
            } catch (err) {
                console.error("Error fetching downloads:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDownloadsData();
    }, [userId]);

    const filteredDownloads = useMemo(() => {
        return downloads.filter(item => {
            const matchesSearch = item.title?.toLowerCase().includes(filters.search.toLowerCase());
            const matchesSubject = filters.subject === 'All' || item.subject === filters.subject;
            return matchesSearch && matchesSubject;
        });
    }, [filters, downloads]);

    const removeDownload = async (id) => {
        // Optional: Add a DELETE request here to your backend if you want to remove it permanently
        setDownloads(downloads.filter(item => item.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#0B1220] text-gray-100 font-sans">
            <UserSidebar isOpen={sidebarOpen} activePage="downloads" />

            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:pl-[250px]' : 'pl-0'}`}>
                <Topbar toggleSidebar={toggleSidebar} title="My Downloads" />

                <main className="p-6 lg:p-10 max-w-7xl mx-auto">
                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <StatCard icon={<Download className="text-[#22D3EE]" />} label="Total Files" value={downloads.length} />
                        <StatCard icon={<HardDrive className="text-purple-400" />} label="Storage Used" value="1.34 GB" />
                        <StatCard icon={<Star className="text-yellow-400" />} label="Avg. Rating" value="4.2" />
                    </div>

                    {/* Search & Simple Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#22D3EE]" size={20} />
                            <input
                                type="text"
                                placeholder="Search downloaded resources..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full p-4 pl-12 bg-[#111827] border border-[#1F2937] rounded-xl text-white focus:outline-none focus:border-[#22D3EE] transition-all"
                            />
                        </div>

                        <select
                            value={filters.subject}
                            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                            className="bg-[#111827] border border-[#1F2937] text-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-[#22D3EE] min-w-[180px]"
                        >
                            <option value="All">All Subjects</option>
                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Downloads Content */}
                    <div className="grid gap-4">
                        {filteredDownloads.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-[#22D3EE]/50 transition-all group"
                            >
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.type === 'Video' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {item.type === 'Video' ? <Video size={24} /> : <FileText size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold group-hover:text-[#22D3EE] transition-colors">{item.title}</h3>
                                        <p className="text-gray-500 text-sm flex items-center gap-2">
                                            {item.subject} • <span className="text-gray-600 font-mono text-xs">{item.fileSizeMB}MB</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-6 w-full md:w-auto text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} />
                                        <span>Downloaded on {item.uploadDate}</span>
                                    </div>
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < item.rating ? "currentColor" : "none"} />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 border-[#1F2937] pt-4 md:pt-0">
                                    {/* <button
                                        onClick={() => navigate(`/resourcereview/${item.id || item._id}`)}
                                        className="flex-1 md:flex-none px-4 py-2 bg-[#1F2937] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#22D3EE] hover:text-[#0B1220] transition-all text-sm font-medium"
                                    >
                                        
                                        <ExternalLink size={16} state={{ resource: item }} /> View
                                    </button> */}
                                    <Link to={`/resourcereview/${item.id}`} state={{ resource: item }}>
                                        <button
                                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-[#22D3EE] text-[#22D3EE] text-sm font-bold uppercase tracking-wider hover:bg-[#22D3EE]/10 transition-all duration-200 cursor-pointer"
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => removeDownload(item.id)}
                                        className="p-2 bg-[#1F2937] text-gray-400 hover:text-red-400 rounded-lg transition-all"
                                        title="Remove from history"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredDownloads.length === 0 && (
                        <div className="p-20 text-center bg-[#111827] rounded-3xl border border-[#1F2937] border-dashed">
                            <Download className="mx-auto text-gray-700 mb-4" size={56} />
                            <h3 className="text-xl font-bold text-white mb-2">No downloads found</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">It looks like you haven't saved any resources yet or your search query didn't match anything.</p>
                            <button
                                onClick={() => setFilters({ search: '', subject: 'All' })}
                                className="mt-6 text-[#22D3EE] hover:underline font-medium"
                            >
                                View all downloads
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}



const StatCard = ({ icon, label, value }) => (
    <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl flex items-center gap-4">
        <div className="p-3 bg-[#0B1220] rounded-xl">{icon}</div>
        <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
            <p className="text-white text-xl font-bold">{value}</p>
        </div>
    </div>
);