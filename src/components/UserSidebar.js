import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, FileUp, Download as DownloadIcon, LayoutDashboard } from "lucide-react";

// Changed prop name to 'isOpen' to match your internal logic
const UserSidebar = ({ isOpen }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        department: "",
        year: "",
        profile_image: ""
    });

    const role = localStorage.getItem("role");

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const userId = localStorage.getItem("userId");
            console.log(userId)
            if (!userId) return;
            const response = await fetch(`http://192.168.1.9:8080/api/profile/${userId}`);
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-[250px] bg-[#0F172A] border-r border-[#1F2937] transition-transform duration-300 ease-in-out transform flex flex-col
            ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>

            {/* Header */}
            <div className="h-[70px] flex items-center px-6 border-b border-[#1F2937] shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#22D3EE] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                        <LayoutDashboard size={18} className="text-[#0B1220]" />
                    </div>
                    <span className="text-white font-black uppercase tracking-widest text-sm">UniBridge</span>
                </div>
            </div>

            {/* Profile Section */}
            <div className="px-6 py-10 text-center shrink-0">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-[#22D3EE] to-[#06B6D4] p-[3px] shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                    <div className="w-full h-full bg-[#0B1220] rounded-full flex items-center justify-center overflow-hidden border-2 border-[#0B1220]">
                        {user.profile_image ? (
                            <img src={user.profile_image} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={40} className="text-[#22D3EE]" strokeWidth={1} />
                        )}
                    </div>
                </div>
                <h3 className="text-white font-bold text-lg mt-4 truncate">{user.name || "User"}</h3>
                <div className="mt-2 inline-block px-4 py-1 bg-[#FACC15] text-[#0B1220] text-[10px] font-black uppercase tracking-widest rounded-full shadow-md">
                    {role || "Student"}
                </div>
            </div>

            {/* Menu Section */}
            <nav className="px-4 mt-4 space-y-1 flex-1 overflow-y-auto">
                <li
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#9CA3AF] hover:bg-[#111827] hover:text-[#22D3EE] cursor-pointer transition-all list-none font-bold text-sm group"
                >
                    <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform" />
                    Dashboard
                </li>
                <li onClick={() => navigate("/profile")} className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#9CA3AF] hover:bg-[#111827] hover:text-[#22D3EE] cursor-pointer transition-all list-none font-bold text-sm">
                    <User size={18} /> Profile
                </li>
                <li onClick={() => navigate("/myuploads")} className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#9CA3AF] hover:bg-[#111827] hover:text-[#22D3EE] cursor-pointer transition-all list-none font-bold text-sm">
                    <FileUp size={18} /> My Uploads
                </li>
                <li onClick={() => navigate("/downloads")} className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#9CA3AF] hover:bg-[#111827] hover:text-[#22D3EE] cursor-pointer transition-all list-none font-bold text-sm">
                    <DownloadIcon size={18} /> My Downloads
                </li>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-[#1F2937] shrink-0">
                <p className="text-[10px] text-[#4B5563] font-mono tracking-tighter uppercase text-center">
                    Verified Institutional Access
                </p>
            </div>
        </div>
    );
};

export default UserSidebar;