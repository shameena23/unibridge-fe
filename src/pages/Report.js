import React, { useState } from 'react';
import { ArrowLeft, Check, Flag, AlertTriangle, Send } from 'lucide-react';

// Added resourceId to the props
const Report = ({ resourceId, resourceTitle, onBack, onSubmit }) => {
    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const reasons = [
        "Inaccurate Content",
        "Copyright/IP Violation",
        "Poor Document Quality",
        "Irrelevant/Spam",
        "Offensive Material",
        "Other"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Safety check if resourceId is missing
        if (!resourceId) {
            alert("Error: Resource ID is missing.");
            return;
        }

        setIsSubmitting(true);

        try {
            const userId = localStorage.getItem("userId");

            const response = await fetch("http://192.168.1.9:8080/api/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    reportedBy: userId,
                    resourceId: resourceId, // Now correctly defined via props
                    category: reason,
                    description: details
                })
            });

            if (!response.ok) {
                throw new Error("Failed to submit report");
            }

            // Keep your UI animation delay
            setTimeout(() => {
                setIsSubmitting(false);
                setSubmitted(true);

                setTimeout(() => {
                    onSubmit(); // close modal or redirect
                }, 2000);
            }, 1500);

        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            alert("Something went wrong while submitting the report");
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-[#111827] border border-green-500/30 p-10 rounded-3xl text-center shadow-2xl animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                        <Check size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-[#F9FAFB] mb-2 uppercase tracking-tight">Report Received</h2>
                    <p className="text-[#9CA3AF] mb-4 text-sm">Thank you for helping keep UniBridge safe. Our moderators will review this document shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B1220] text-[#F9FAFB] pt-[100px] pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#22D3EE] mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-xs">Cancel & Return</span>
                </button>

                <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
                            <Flag size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight">Report Resource</h1>
                            <p className="text-sm text-[#9CA3AF]">Flagging: <span className="text-[#F9FAFB] font-bold">{resourceTitle || "Selected Document"}</span></p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#22D3EE] mb-3">Select Reason</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {reasons.map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setReason(r)}
                                        className={`px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all ${reason === r
                                            ? "bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                                            : "bg-[#0B1220] border-[#1F2937] text-[#9CA3AF] hover:border-[#4B5563]"
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#22D3EE] mb-3">Additional Details</label>
                            <textarea
                                required
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Please describe the issue in detail..."
                                className="w-full bg-[#0B1220] border border-[#1F2937] rounded-2xl p-4 text-[#F9FAFB] text-sm focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] outline-none transition-all min-h-[150px] resize-none"
                            ></textarea>
                        </div>

                        <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl flex gap-3 items-start">
                            <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-red-200/60 leading-relaxed uppercase font-bold">
                                Misuse of the reporting system may lead to account restrictions.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={!reason || !details || isSubmitting}
                            className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${!reason || !details || isSubmitting
                                ? "bg-[#1F2937] text-[#4B5563] cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700 shadow-[0_10px_20px_rgba(220,38,38,0.2)] active:scale-[0.98]"
                                }`}
                        >
                            {isSubmitting ? "Processing..." : <><Send size={18} /> Submit Report</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Report;