import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, FileText, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Added
import Topbar from '../components/Topbar';
import UserSidebar from "../components/UserSidebar";

const UploadPage = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        category: '',
        description: ''
    });

    // Handle sidebar
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const fileInputRef = useRef(null);

    const subjects = ['Mathematics', 'Computer Science', 'Physics', 'History', 'Engineering', 'OS'];
    const categories = ['Typed Notes', 'Lecture Notes', 'Assignment', 'Past Paper', 'Reference Book'];

    // Update form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) setFile(selectedFile);
    };

    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation
    if (!file || !formData.title) {
        return alert("Please select a file and provide a title.");
    }

    const data = new FormData();
    data.append("file", file);
    data.append("title", formData.title);
    data.append("subject", formData.subject);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("uploadedBy", 1); 

    try {
        const response = await fetch("http://192.168.1.9:8080/api/resources/upload", {
            method: "POST",
            body: data,
        });

        if (response.ok) {
            alert("Resource Published Successfully!");

            // 2. RESET EVERYTHING TO GO BACK TO "NEW" STATE
            setFile(null); // Clear file state
            setFormData({  // Clear text fields
                title: '',
                subject: '',
                category: '',
                description: ''
            });

            // 3. CLEAR FILE INPUT (Crucial so you can select the same file again if needed)
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // Note: We removed navigate("/my-uploads") so you stay on this page
        } else {
            // Handle specific status codes (like the 413 you saw earlier)
            if (response.status === 413) {
                alert("Error: File is too large! Check your Spring Boot settings.");
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.message || "Upload failed"));
            }
        }
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Server connection failed. Is your backend running on port 8080?");
    }
};
    return (
        <div className="flex min-h-screen bg-[#0B1220]">
            <UserSidebar isOpen={sidebarOpen} activePage="upload" />
            
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:pl-[250px]' : 'pl-0'}`}>
                <Topbar toggleSidebar={toggleSidebar} title="Upload Hub" />
                
                <main className="pb-20 pt-10 px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-[#111827] rounded-3xl border border-[#1F2937] overflow-hidden shadow-2xl">
                            <div className="px-10 pt-10 pb-6 border-b border-[#1F2937]/50">
                                <h2 className="text-2xl font-bold text-[#F9FAFB]">Upload Resource</h2>
                                <p className="text-[#9CA3AF] text-sm mt-1">Share your materials with the community.</p>
                            </div>

                            <form className="p-10" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                    {/* Left Column: Dropzone */}
                                    <div className="lg:col-span-5">
                                        <div
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current.click()}
                                            className="relative h-full min-h-[400px] border-2 border-dashed border-[#1F2937] hover:border-[#22D3EE] bg-[#0B1220]/40 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer group transition-all"
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <div className="mb-6">
                                                <div className="bg-[#1F2937] p-6 rounded-3xl group-hover:scale-110 transition-transform border border-[#1F2937]">
                                                    <UploadIcon className="w-12 h-12 text-[#22D3EE]" />
                                                </div>
                                            </div>

                                            {file ? (
                                                <div className="text-center">
                                                    <div className="flex items-center gap-3 bg-[#111827] px-4 py-3 rounded-xl border border-[#22D3EE]/30">
                                                        <FileText className="w-5 h-5 text-[#FACC15]" />
                                                        <span className="text-sm text-[#D1D5DB] truncate max-w-[150px]">{file.name}</span>
                                                    </div>
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-4 text-xs text-red-400 hover:text-red-300">Remove</button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <span className="bg-[#22D3EE] text-[#0B1220] px-10 py-3 rounded-full font-bold uppercase tracking-widest text-sm">browse files</span>
                                                    <p className="mt-6 text-sm text-[#D1D5DB]">Drag and drop files here</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column: Inputs */}
                                    <div className="lg:col-span-7 space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest ml-1">Document Title</label>
                                            <input 
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                type="text" 
                                                placeholder="e.g. OS Unit 1" 
                                                className="w-full bg-[#0B1220] border border-[#1F2937] rounded-xl px-5 py-4 text-[#F9FAFB] focus:border-[#22D3EE] transition-all" 
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest ml-1">Subject</label>
                                                <div className="relative">
                                                    <select 
                                                        name="subject"
                                                        value={formData.subject}
                                                        onChange={handleInputChange}
                                                        className="w-full appearance-none bg-[#0B1220] border border-[#1F2937] rounded-xl px-5 py-4 text-[#D1D5DB] focus:border-[#22D3EE] cursor-pointer"
                                                    >
                                                        <option value="">Choose Subject</option>
                                                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4B5563] pointer-events-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest ml-1">Category</label>
                                                <div className="relative">
                                                    <select 
                                                        name="category"
                                                        value={formData.category}
                                                        onChange={handleInputChange}
                                                        className="w-full appearance-none bg-[#0B1220] border border-[#1F2937] rounded-xl px-5 py-4 text-[#D1D5DB] focus:border-[#22D3EE] cursor-pointer"
                                                    >
                                                        <option value="">Choose Category</option>
                                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4B5563] pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest ml-1">Description</label>
                                            <textarea 
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows="5" 
                                                placeholder="Describe topics covered..." 
                                                className="w-full bg-[#0B1220] border border-[#1F2937] rounded-xl px-5 py-4 text-[#F9FAFB] focus:border-[#22D3EE] transition-all resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t border-[#1F2937]/50 flex justify-center">
                                    <button 
                                        type="submit" 
                                        className="group relative inline-flex items-center justify-center px-16 py-4 font-black text-sm uppercase tracking-[0.3em] text-[#0B1220] transition-all duration-200 bg-[#22D3EE] rounded-full shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:shadow-[0_0_40px_rgba(34,211,238,0.45)] hover:scale-105 active:scale-95"
                                    >
                                        <span className="relative z-10">complete upload</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UploadPage;