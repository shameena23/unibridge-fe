import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, FileText, ChevronDown, User, LayoutDashboard, FileUp, Settings, LogOut, Menu } from 'lucide-react';

import Topbar from '../components/Topbar';
import UserSidebar from "../components/UserSidebar";
const UploadPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // ✅ Function to toggle sidebar
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        category: '',
        description: ''
    });

    const fileInputRef = useRef(null);

    // Dummy Data for Dropdowns
    const subjects = ['Mathematics', 'Computer Science', 'Physics', 'History', 'Engineering'];
    const categories = ['Lecture Notes', 'Assignment', 'Past Paper', 'Reference Book', 'Project Report'];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    };

    return (
        <div className="flex">
            {sidebarOpen && <UserSidebar />}
            <div className="flex-1">
                <Topbar toggleSidebar={toggleSidebar} />
                <div className="min-h-screen bg-[#0B1220] text-[#F9FAFB] font-sans selection:bg-[#22D3EE]/30 flex flex-col">


                    {/* Main Content - Smoothly adjusts its margin/width */}
                    <main className="flex-1 pb-20 overflow-y-auto transition-all duration-300 ease-in-out bg-[#0B1220]">
                        <div className="max-w-5xl mx-auto px-6 pt-10">
                            <div className="bg-[#111827] w-full rounded-3xl border border-[#1F2937] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <div className="px-10 pt-10 pb-6 border-b border-[#1F2937]/50">
                                    <h2 className="text-2xl font-bold text-[#F9FAFB]">Upload Resource</h2>
                                    <p className="text-[#9CA3AF] text-sm mt-1">Share your academic materials with the community.</p>
                                </div>

                                <form className="p-10" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                        {/* Left Column: File Dropzone */}
                                        <div className="lg:col-span-5">
                                            <div
                                                onDragOver={handleDragOver}
                                                onDrop={handleDrop}
                                                onClick={() => fileInputRef.current.click()}
                                                className="relative h-full min-h-[400px] border-2 border-dashed border-[#1F2937] hover:border-[#22D3EE] bg-[#0B1220]/40 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer group transition-all duration-300"
                                            >
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    accept=".pdf,.ppt,.pptx,.jpg,.png,.txt,.doc,.docx"
                                                />
                                                <div className="mb-6 relative">
                                                    <div className="absolute inset-0 bg-[#22D3EE] blur-2xl opacity-10 group-hover:opacity-20"></div>
                                                    <div className="bg-[#1F2937] p-6 rounded-3xl group-hover:scale-110 transition-transform duration-500 border border-[#1F2937]">
                                                        <UploadIcon className="w-12 h-12 text-[#22D3EE]" />
                                                    </div>
                                                </div>

                                                {file ? (
                                                    <div className="text-center">
                                                        <div className="flex items-center gap-3 bg-[#111827] px-4 py-3 rounded-xl border border-[#22D3EE]/30">
                                                            <FileText className="w-5 h-5 text-[#FACC15]" />
                                                            <span className="text-sm font-medium text-[#D1D5DB] truncate max-w-[150px]">{file.name}</span>
                                                        </div>
                                                        <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-4 text-xs text-red-400 hover:text-red-300 underline underline-offset-4">Remove</button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <button type="button" className="bg-[#22D3EE] text-[#0B1220] px-10 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all uppercase tracking-widest text-sm">browse files</button>
                                                        <p className="mt-6 text-sm text-[#D1D5DB]">Drag and drop files here</p>
                                                        <p className="mt-2 text-[11px] text-[#9CA3AF] uppercase tracking-[0.2em]">PDF • PPT • IMG • DOC • TXT</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Column: Inputs */}
                                        <div className="lg:col-span-7 space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest ml-1">Document Title</label>
                                                <input type="text" placeholder="e.g. CS50 Lecture 1 Notes" className="w-full bg-[#0B1220] border border-[#1F2937] rounded-xl px-5 py-4 text-[#F9FAFB] focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/20 transition-all placeholder:text-[#374151]" />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest ml-1">Subject</label>
                                                    <div className="relative">
                                                        <select className="w-full appearance-none bg-[#0B1220] border border-[#1F2937] rounded-xl px-5 py-4 text-[#D1D5DB] focus:outline-none focus:border-[#22D3EE] cursor-pointer">
                                                            <option value="">Choose Subject</option>
                                                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4B5563] pointer-events-none" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest ml-1">Category</label>
                                                    <div className="relative">
                                                        <select className="w-full appearance-none bg-[#0B1220] border border-[#1F2937] rounded-xl px-5 py-4 text-[#D1D5DB] focus:outline-none focus:border-[#22D3EE] cursor-pointer">
                                                            <option value="">Choose Category</option>
                                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4B5563] pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">Description</label>
                                                    <span className="text-[10px] text-[#FACC15] font-medium uppercase bg-[#FACC15]/10 px-2 py-0.5 rounded">50 words limit</span>
                                                </div>
                                                <textarea rows="5" placeholder="Describe topics covered..." className="w-full bg-[#0B1220] border border-[#1F2937] rounded-xl px-5 py-4 text-[#F9FAFB] focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/20 transition-all resize-none placeholder:text-[#374151]"></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-[#1F2937]/50 flex justify-center">
                                        <button type="submit" className="group relative inline-flex items-center justify-center px-16 py-4 font-black text-sm uppercase tracking-[0.3em] text-[#0B1220] transition-all duration-200 bg-[#22D3EE] rounded-full shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:shadow-[0_0_40px_rgba(34,211,238,0.45)] hover:scale-105 active:scale-95">
                                            <span className="relative z-10">complete upload</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>

    );
};

export default UploadPage;