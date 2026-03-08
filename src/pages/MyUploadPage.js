import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, Plus, FileText, Video, Clock, Trash2, Edit3, Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import UserSidebar from "../components/UserSidebar";
import Topbar from "../components/Topbar";

// --- Internal Component: StatusBadge ---
// This fixes the "StatusBadge is not defined" error
const StatusBadge = ({ status }) => {
  const styles = {
    Published: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Private: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.Published}`}>
      {status}
    </span>
  );
};

export default function MyUploads() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const userId = localStorage.getItem("userId");

  const [filters, setFilters] = useState({
    search: '',
    subject: 'All',
    status: 'All'
  });

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchUploads = async () => {
      if (!userId) {
        setError("User ID not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://192.168.1.9:8080/api/resources/user/${userId}`);
        
        if (!response.ok) throw new Error("Failed to fetch your resources");

        const data = await response.json();
        setUploads(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, [userId]);

  // --- 2. Handle Delete ---
  const handleDelete = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;

    try {
      const response = await fetch(`http://192.168.1.9:8080/api/resourcesdetails/${resourceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploads(prev => prev.filter(u => (u._id || u.id) !== resourceId));
      } else {
        throw new Error("Could not delete the file from the server.");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // --- 3. Filtering Logic ---
  const filteredUploads = useMemo(() => {
    return uploads.filter(item => {
      const matchesSearch = (item.title || "").toLowerCase().includes(filters.search.toLowerCase());
      const matchesSubject = filters.subject === 'All' || item.subject === filters.subject;
      const matchesStatus = filters.status === 'All' || item.status === filters.status;
      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [filters, uploads]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22D3EE]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-gray-100 font-sans flex overflow-x-hidden">
      {/* Sidebar Component */}
      <UserSidebar isOpen={sidebarOpen} activePage="uploads" />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:pl-[250px]' : 'pl-0'}`}>
        <Topbar toggleSidebar={toggleSidebar} title="My Uploaded Resources" />

        <main className="p-6 lg:p-10 max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Manage Uploads</h1>
              <p className="text-gray-500 text-sm">You have {uploads.length} active resources.</p>
            </div>
            {/* Navigates to your actual upload page/route */}
            <button 
              onClick={() => navigate("/mynewupload")} 
              className="w-full sm:w-auto px-6 py-3 bg-[#22D3EE] text-[#0B1220] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#06B6D4] transition-all shadow-lg shadow-[#22D3EE]/10"
            >
              <Plus size={20} />
              Upload New
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0B1220]/50 border-b border-[#1F2937] text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Resource</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Upload Date</th>
                    <th className="px-6 py-4 font-semibold">Engagement</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937]">
                  {filteredUploads.map((file) => (
                    <tr key={file._id || file.id} className="hover:bg-[#1F2937]/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[#0B1220] flex items-center justify-center text-[#22D3EE] border border-[#22D3EE]/20">
                            {file.type === 'Video' ? <Video size={20} /> : <FileText size={20} />}
                          </div>
                          <div>
                            <p className="text-white font-medium mb-0.5">{file.title}</p>
                            <p className="text-gray-500 text-xs uppercase tracking-tighter">{file.subject} • {file.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={file.status || "Published"} />
                      </td>
                      <td className="px-6 py-5 text-gray-400 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {new Date(file.uploadDate || file.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-gray-400 text-sm">
                        <span className="text-white font-semibold">{file.views || 0}</span> views
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-[#1F2937] rounded-lg text-gray-400 hover:text-[#22D3EE] transition-all">
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(file._id || file.id)}
                            className="p-2 hover:bg-[#1F2937] rounded-lg text-gray-400 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Empty State Logic */}
            {filteredUploads.length === 0 && (
              <div className="p-20 text-center flex flex-col items-center">
                <FileText className="text-gray-700 mb-4" size={60} />
                <h3 className="text-xl font-bold text-white mb-2">No resources found</h3>
                <p className="text-gray-500 max-w-xs">Try adjusting your filters or upload your first educational resource.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}