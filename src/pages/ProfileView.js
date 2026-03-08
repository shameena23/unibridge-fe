import React, { useState } from 'react';
import {
    User, Settings, Edit3, LogOut, ShieldCheck,
    School, Calendar, Upload, Download, Star,
    Award, Briefcase, GraduationCap, ArrowLeft, Layers
} from 'lucide-react';
import UserSidebar from "../components/UserSidebar";
import Topbar from "../components/Topbar";

const StatBox = ({ icon: Icon, value, label, colorClass }) => (
    <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-[2rem] text-center shadow-lg hover:border-[#22D3EE]/20 transition-all duration-300">
        <div className={`flex justify-center mb-3 ${colorClass}`}>
            <Icon size={24} />
        </div>
        <p className="text-3xl font-black text-white">{value}</p>
        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] mt-1">{label}</p>
    </div>
);

const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-5 p-5 bg-[#111827]/50 border border-[#1F2937] rounded-[1.5rem] group hover:border-[#22D3EE]/30 transition-all">
        <div className="p-3 bg-[#0B1220] border border-[#1F2937] rounded-xl text-[#22D3EE] group-hover:scale-110 transition-transform">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.15em] mb-1">{label}</p>
            <p className="text-[#F9FAFB] font-bold text-lg">{value || 'N/A'}</p>
        </div>
    </div>
);

const ProfileView = ({ userData, onBack, role }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex min-h-screen bg-[#0B1220] text-[#F9FAFB] font-sans overflow-x-hidden">

            {/* 1. SIDEBAR CONTAINER */}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <UserSidebar isOpen={sidebarOpen} />
            </div>

            {/* 2. MAIN CONTENT AREA */}
            <div
                className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'ml-0'
                    }`}
            >
                {/* Topbar fixed inside this container */}
                <Topbar toggleSidebar={toggleSidebar} />

                {/* 3. SCROLLABLE CONTENT */}
                <main className="flex-1 pt-24 pb-12 px-6 sm:px-10 lg:px-16 w-full max-w-5xl mx-auto">

                    {/* Hero Identity Card */}
                    <div className="bg-gradient-to-br from-[#111827] to-[#0B1220] border border-[#1F2937] rounded-[3rem] p-8 md:p-12 mb-10 shadow-2xl relative overflow-hidden group">
                        {/* Interactive Background Glow */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#22D3EE]/5 blur-[100px] rounded-full group-hover:bg-[#22D3EE]/10 transition-colors duration-700"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            {/* Profile Image with Cyan Ring */}
                            <div className="relative shrink-0">
                                <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-tr from-[#22D3EE] via-[#06B6D4] to-[#0891B2] p-[2px] shadow-[0_0_40px_rgba(34,211,238,0.1)]">
                                    <div className="w-full h-full bg-[#0B1220] rounded-[calc(2.5rem-2px)] flex items-center justify-center overflow-hidden">
                                        <User size={80} className="text-[#22D3EE]" strokeWidth={1} />
                                    </div>
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-3 bg-[#1F2937] border border-[#374151] rounded-2xl text-[#22D3EE] hover:bg-[#22D3EE] hover:text-[#0B1220] shadow-xl transition-all active:scale-90">
                                    <Edit3 size={18} />
                                </button>
                            </div>

                            {/* Text Info */}
                            <div className="text-center md:text-left flex-1 space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#22D3EE]/10 border border-[#22D3EE]/20 rounded-full text-[#22D3EE] text-[10px] font-black uppercase tracking-widest">
                                    <ShieldCheck size={14} /> Official Profile
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">
                                    {userData.name}
                                </h1>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-[#1F2937] rounded-lg text-[#22D3EE] text-xs font-bold uppercase tracking-widest">
                                        {userData.role === 'Staff' ? <Briefcase size={14} /> : <GraduationCap size={14} />}
                                        {userData.role}
                                    </div>
                                    <div className="px-3 py-1 bg-yellow-500/10 rounded-lg text-yellow-500 text-xs font-bold uppercase tracking-widest border border-yellow-500/20">
                                        {role || "Active Member"}
                                    </div>
                                    <span className="text-[#9CA3AF] font-mono text-sm ml-1">{userData.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        <StatBox icon={Upload} value={userData.stats?.uploads || 0} label="Assets Shared" colorClass="text-cyan-400" />
                        <StatBox icon={Download} value={userData.stats?.downloads || 0} label="Cloud Downloads" colorClass="text-indigo-400" />
                        <StatBox icon={Star} value={userData.stats?.avgRating || "0.0"} label="Community Rating" colorClass="text-amber-400" />
                    </div>

                    {/* Academic Records */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-[#4B5563]">Academic Credentials</h2>
                            <div className="h-px flex-1 bg-[#1F2937]"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailRow icon={School} label="Current Department" value={userData.department} />
                            <DetailRow icon={Layers} label="Academic Session" value={userData.year} />
                        </div>
                    </div>

                    {/* Footer Signature */}
                    <footer className="mt-20 pt-8 border-t border-[#1F2937] flex flex-col md:flex-row justify-between items-center gap-4 opacity-40">
                        <p className="text-[#4B5563] text-[10px] font-mono tracking-widest uppercase italic">
                            System Hash: {userData.user_id}
                        </p>
                        <p className="text-[#4B5563] text-[10px] font-mono tracking-widest uppercase">
                            UniBridge v2.0 Institutional Network
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default ProfileView;