import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Download,
    Star,
    Share2,
    Info,
    FileText,
    Calendar,
    HardDrive,
    User,
    ExternalLink,
    BookOpen,
    Check,
    Copy,
    MessageCircle,
    Mail,
    AlertTriangle,
    ShieldAlert
} from 'lucide-react';
import Report from './Report';
/**
 * ResourceViewPage Component
 * Location: /src/pages/ResourceViewPage.jsx
 * Theme: UniBridge Dark Cyber
 */
const ResourceViewPage = () => {
    const { id } = useParams(); // resource ID from URL
    console.log({ id })
    const location = useLocation();
    const resource = location.state?.resource; // full object if passed
    console.log({ resource })
    // Ensure we have an object to destructure even if resource is null
    const data = resource || {};

    // Mapping the specific props from your resource object with safe fallbacks
    const {
        title,
        uploadedByName,
        subject,
        category,
        description,
        filePath,
        rating,
        uploadDate,
        fileSizeMB,
        fileType// Defaulting to PDF
    } = data;
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isReported, setIsReported] = useState(false);
    const [showReportConfirm, setShowReportConfirm] = useState(false);


    // Function to copy link to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(filePath);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset "Copied!" text after 2s
    };

    // Share Links
    const baseUrl = window.location.origin;

    const shareLinks = {
        // We use encodeURIComponent to ensure spaces and special characters don't break the URL
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
            `Check out this resource: ${title} - ${baseUrl}/resourcereview/${resource?.id}`
        )}`,

        email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
            `You can view the resource here: ${baseUrl}/resources/${resource?.id}`
        )}`
    };
    const [viewMode, setViewMode] = useState('details');
    const handleReport = () => {
        setIsReported(true);          // This triggers the green success box
        setShowReportConfirm(false);  // This ensures the red confirm box is closed
        setViewMode('details');       // This brings the user back to the main view
    };

    if (viewMode === 'report') {
        return (
            <Report
                // Pass the ID from useParams or the resource object
                resourceId={id || data.id || data._id}
                resourceTitle={title}
                onBack={() => setViewMode('details')}
                onSubmit={handleReport}
            />
        );
    }
    const submitRating = async (ratingValue) => {
        try {
            const response = await fetch(`http://localhost:8080/api/resources/${id}/rate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    rating: ratingValue
                })
            });

            const data = await response.json();
            console.log("Rating saved:", data);

        } catch (error) {
            console.error("Error submitting rating:", error);
        }
    };
    const handleDownload = async (e) => {
        e.preventDefault(); // Prevent default anchor behavior

        try {
            const userId = localStorage.getItem("userId");
            const resourceId = id; // resource id from your resource card

            const response = await fetch(`http://localhost:8080/api/resources/files/${filePath}`);
            if (!response.ok) throw new Error("Download failed");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            // This forces the browser to download the file with the actual title
            link.setAttribute('download', `${title || 'resource'}.${displayExtension}`);

            document.body.appendChild(link);
            link.click();

            // Clean up
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            // 🔹 Save download record in database
            await fetch("http://localhost:8080/api/download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    downloadedby: userId,
                    resourceid: resourceId
                })
            });
        } catch (error) {
            console.error("Download Error:", error);
            alert("Could not download the file. Please try again.");
        }
    };
    // Safe helper to handle the lowercasing for the UI
    const displayExtension = (fileType || "PDF").toLowerCase();

    return (
        <div className="min-h-screen bg-[#0B1220] text-[#F9FAFB] font-sans selection:bg-[#22D3EE]/30">
            {/* Fixed Header / Navbar - Height 70px */}
            <nav className="fixed top-0 w-full h-[70px] bg-[#0F172A]/90 backdrop-blur-md border-b border-[#1F2937] z-50 flex items-center justify-between px-6">
                <Link to="/dashboard">
                    <button

                        className="group flex items-center gap-2 text-[#9CA3AF] hover:text-[#22D3EE] transition-all font-medium"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Back to Resources</span>
                    </button>
                </Link>
                <div className="flex items-center gap-4">
                    {/* SHARE BUTTON CONTAINER */}
                    <div className="relative">
                        <button
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors text-sm font-bold uppercase tracking-wider"
                        >
                            <Share2 size={18} />
                            Share
                        </button>

                        {/* SHARE DROPDOWN MENU */}
                        {showShareMenu && (
                            <>
                                {/* Invisible overlay to close menu when clicking outside */}
                                <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)}></div>

                                <div className="absolute right-0 mt-3 w-48 bg-[#111827] border border-[#1F2937] rounded-xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in duration-200">
                                    <button
                                        onClick={copyToClipboard}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#D1D5DB] hover:bg-[#22D3EE]/10 hover:text-[#22D3EE] transition-colors"
                                    >
                                        <ExternalLink size={16} />
                                        {copied ? "Copied!" : "Copy Link"}
                                    </button>

                                    <a
                                        href={shareLinks.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#D1D5DB] hover:bg-[#25D366]/10 hover:text-[#25D366] transition-colors"
                                    >
                                        <Share2 size={16} />
                                        WhatsApp
                                    </a>

                                    <a
                                        href={shareLinks.email}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#D1D5DB] hover:bg-[#FACC15]/10 hover:text-[#FACC15] transition-colors"
                                    >
                                        <FileText size={16} />
                                        Email
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                    <button
                        onClick={handleDownload}
                        className="bg-[#22D3EE] text-[#0B1220] px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-[#06B6D4] transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] active:scale-95"
                    >
                        <Download size={18} />
                        Download
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="pt-[90px] pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Preview Column (Left) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#111827] border border-[#1F2937] rounded-3xl overflow-hidden flex flex-col min-h-[550px] shadow-2xl relative">
                            {/* Preview Tab Bar */}
                            <div className="bg-[#0F172A] px-6 py-3 border-b border-[#1F2937] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#22D3EE]/10 rounded-lg text-[#22D3EE]">
                                        <FileText size={18} />
                                    </div>
                                    <span className="text-sm font-mono text-[#D1D5DB] truncate max-w-[200px] sm:max-w-md">
                                        {title}.{displayExtension}
                                    </span>
                                </div>
                                <span className="text-[10px] text-[#22D3EE] font-black uppercase tracking-widest px-2 py-1 bg-[#22D3EE]/5 border border-[#22D3EE]/20 rounded">
                                    {(fileType || "PDF")} PREVIEW
                                </span>
                            </div>

                            {/* Viewer Content Placeholder */}
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[radial-gradient(circle_at_center,_#111827_0%,_#0B1220_100%)]">
                                <div className="relative mb-8">
                                    <div className="absolute -inset-6 bg-[#22D3EE]/10 blur-2xl rounded-full"></div>
                                    <FileText size={100} strokeWidth={1} className="text-[#22D3EE] relative opacity-80" />
                                </div>
                                <h3 className="text-2xl font-black mb-3 tracking-tight uppercase">Viewer Ready</h3>
                                <p className="text-[#9CA3AF] max-w-md text-sm leading-relaxed mb-8">
                                    The document viewer is ready to initialize. For security, files are scanned before rendering.
                                </p>
                                <a
                                    href={`http://localhost:8080/api/resources/files/${filePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[#22D3EE] hover:text-[#06B6D4] font-bold uppercase text-xs tracking-[0.2em] transition-all group"
                                >
                                    <ExternalLink size={16} className="group-hover:rotate-12 transition-transform" />
                                    Open in New Tab
                                </a>
                            </div>
                        </div>
                        {/* Rating & Feedback Section */}
                        <div className="bg-[#0B1220] border border-[#1F2937] rounded-2xl p-6 mb-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Your Rating</h4>
                                {userRating > 0 && <span className="text-[10px] text-[#22D3EE] font-mono">SUBMITTED</span>}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => {
                                                setUserRating(star);
                                                submitRating(star);
                                            }}
                                            className="transition-transform active:scale-90"
                                        >
                                            <Star
                                                size={24}
                                                // Logic: Only color the star if there is an active hover OR a saved user selection
                                                className={`transition-colors ${(hoverRating || userRating) >= star
                                                    ? "fill-[#FACC15] text-[#FACC15]"
                                                    : "text-[#1F2937] fill-none" // added fill-none for clarity
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Removed || rating here so it only shows YOUR interaction */}
                                <span className="text-sm font-bold text-[#F9FAFB] ml-auto">
                                    {(hoverRating || userRating || 0)}.0
                                </span>
                            </div>
                            <p className="text-[9px] text-[#4B5563] font-mono leading-tight">
                                Rate this resource to help the community discover quality content.
                            </p>
                        </div>
                    </div>

                    {/* Metadata & Details Column (Right) */}
                    <div className="space-y-6">
                        <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-8 sticky top-[90px] shadow-xl">
                            {/* Subject & Category Labels */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <div className="px-3 py-1 bg-[#22D3EE]/10 border border-[#22D3EE]/30 rounded-full text-[#22D3EE] text-[10px] uppercase font-black tracking-widest">
                                    {category}
                                </div>
                                {subject && subject !== "N/A" && (
                                    <div className="px-3 py-1 bg-[#FACC15]/10 border border-[#FACC15]/30 rounded-full text-[#FACC15] text-[10px] uppercase font-black tracking-widest">
                                        {subject}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-3xl font-black leading-tight mb-4 uppercase tracking-tighter decoration-[#22D3EE] decoration-4">
                                {title}
                            </h1>

                            {/* Uploader Profile */}
                            <div className="flex items-center gap-3 mb-8 p-3 bg-[#0B1220] border border-[#1F2937] rounded-2xl">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22D3EE] to-[#06B6D4] flex items-center justify-center text-[#0B1220] shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#9CA3AF] uppercase font-black tracking-tighter leading-none mb-1">Uploaded By</p>
                                    <p className="text-[#F9FAFB] font-bold text-lg leading-none">{uploadedByName}</p>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-[#1F2937] mb-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1">
                                        {[0, 1, 2, 3, 4].map((index) => {
                                            // Force the check: Is this star index less than our rating?
                                            const active = index < Number(rating || 0);

                                            return (
                                                <svg
                                                    key={index}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    // This forces the color regardless of Tailwind
                                                    fill={active ? "#FACC15" : "none"}
                                                    stroke={active ? "#FACC15" : "#1F2937"}
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                </svg>
                                            );
                                        })}
                                    </div>
                                    <p className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-tighter">Verified Rating</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#F9FAFB] font-mono font-bold text-lg">{fileSizeMB}</p>
                                    <p className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-tighter">Digital Size</p>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#22D3EE]">
                                    <BookOpen size={14} />
                                    Information
                                </h4>
                                <div className="bg-[#0B1220]/50 p-4 rounded-xl border border-[#1F2937]">
                                    <p className="text-[#D1D5DB] text-sm leading-relaxed italic">
                                        "{description}"
                                    </p>
                                </div>
                            </div>
                            <div className="mb-8">
                                {isReported ? (
                                    <div className="w-full py-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-center gap-2 text-green-400 text-xs font-black uppercase tracking-widest">
                                        <Check size={16} /> Successfully Reported
                                    </div>
                                ) : showReportConfirm ? (
                                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-in fade-in slide-in-from-top-2">
                                        <p className="text-[10px] text-red-200 mb-3 font-bold uppercase text-center tracking-tight">Confirm Resource Report?</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => setViewMode('report')} className="flex-1 py-2 bg-red-500 text-white text-[10px] font-black uppercase rounded-lg hover:bg-red-600">Report</button>
                                            <button onClick={() => setShowReportConfirm(false)} className="flex-1 py-2 bg-[#1F2937] text-white text-[10px] font-black uppercase rounded-lg">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowReportConfirm(true)}
                                        className="w-full py-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center justify-center gap-3 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 font-black uppercase text-xs tracking-[0.2em] group"
                                    >
                                        <ShieldAlert size={18} className="group-hover:scale-110 transition-transform" />
                                        Report Resource
                                    </button>
                                )}
                            </div>
                            {/* System Meta */}
                            <div className="mt-8 flex items-center justify-between text-[#4B5563] font-mono text-[10px]">
                                <div className="flex items-center gap-2">
                                    <Calendar size={12} />
                                    <span>PUBLISHED: {uploadDate}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <HardDrive size={12} />
                                    <span>SECURE_LINK</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default ResourceViewPage;