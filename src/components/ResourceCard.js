import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Download, Star } from 'lucide-react';
const ResourceCard = ({ resource, onView }) => {

    const { id,
        title,
        uploadedByName,
        subject,
        category,
        description,
        filePath,
        rating,
        uploadDate,
        fileSizeMB,
        fileType
    } = resource;
    const displayExtension = (fileType || "PDF").toLowerCase();
    const handleDownload = async (e) => {
        e.preventDefault(); // Prevent default anchor behavior

        try {
            const userId = localStorage.getItem("userId");
            const resourceId = id; // resource id from your resource card

            const response = await fetch(`http://192.168.1.9:8080/api/resources/files/${filePath}`);
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
            await fetch("http://192.168.1.9:8080/api/download", {
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

    return (
        <div className="group relative w-full max-w-[320px] bg-[#111827] border border-[#1F2937] rounded-2xl p-6 transition-all duration-300 hover:border-[#22D3EE]/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]">

            {/* 1. Resource Name */}
            <h3 className="text-[#F9FAFB] text-xl font-bold leading-tight group-hover:text-[#22D3EE] transition-colors truncate">
                {title}
            </h3>

            {/* 2. "by username" label */}
            <p className="text-[#9CA3AF] text-sm mt-1 mb-4">
                by <span className="text-[#D1D5DB] hover:underline cursor-pointer">{uploadedByName}</span>
            </p>

            {/* 3. Category Section */}
            <div className="flex flex-col gap-1 mb-4">
                <span className="text-[#9CA3AF] text-[10px] uppercase tracking-[0.2em] font-bold">Category:</span>
                <span className="text-[#FACC15] font-medium text-sm">{category}</span>
            </div>

            {/* 4. Rating Stars */}
            <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={i < rating ? "fill-[#FACC15] text-[#FACC15]" : "text-[#1F2937]"}
                    />
                ))}
            </div>

            {/* 5. Action Buttons */}
            <div className="flex flex-col gap-3">
                {/* Updated View Button to trigger the transition to ResourceViewPage */}
                <Link to={`/resourcereview/${resource.id}`} state={{ resource }}>
                    <button
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-[#22D3EE] text-[#22D3EE] text-sm font-bold uppercase tracking-wider hover:bg-[#22D3EE]/10 transition-all duration-200 cursor-pointer"
                    >
                        <Eye size={16} />
                        View Details
                    </button>
                </Link>

                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#22D3EE] text-[#0B1220] text-sm font-black uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:bg-[#06B6D4] transition-all duration-200 text-center"
                >
                    <Download size={16} />
                    Download
                </button>
            </div>

            {/* Subtle bottom accent line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#22D3EE] transition-all duration-500 group-hover:w-1/2 opacity-50 rounded-full"></div>
        </div>
    );
};

export default ResourceCard;