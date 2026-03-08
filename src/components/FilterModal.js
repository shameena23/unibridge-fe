import React from "react";
import { X, Star } from "lucide-react";

const SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Arts", "Economics", "Biology"];
const CATEGORIES = ["Video", "PDF", "Quiz", "Notes"];

const FilterModal = ({ filters, setFilters, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-[#1F2937] flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold">Advanced Filters</h2>
                    <button onClick={onClose} className="hover:text-[#22D3EE] transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Subject Selection */}
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-bold block mb-3">Subject</label>
                        <div className="flex flex-wrap gap-2">
                            {['All', ...SUBJECTS].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilters({ ...filters, subject: s })}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filters.subject === s
                                        ? 'bg-[#22D3EE] text-[#0B1220]'
                                        : 'bg-[#1F2937] text-gray-400 hover:text-white border border-transparent hover:border-[#1F2937]'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-bold block mb-3">Resource Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['All', ...CATEGORIES].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setFilters({ ...filters, category: c })}
                                    className={`px-3 py-2 rounded-lg text-sm transition-all text-left flex justify-between items-center ${filters.category === c
                                        ? 'bg-[#1F2937] border-[#22D3EE] border text-[#22D3EE]'
                                        : 'bg-[#1F2937] border-transparent border text-gray-400 hover:bg-[#1F2937]/80'
                                        }`}
                                >
                                    {c}
                                    {filters.category === c && <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rating Selection */}
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-bold block mb-3">Minimum Rating</label>
                        <div className="flex gap-4 items-center bg-[#0B1220] p-4 rounded-xl border border-[#1F2937]">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setFilters({ ...filters, rating: star })}
                                    className="transition-transform active:scale-90"
                                >
                                    <Star
                                        size={24}
                                        fill={star <= filters.rating ? "#EAB308" : "none"}
                                        className={star <= filters.rating ? "text-yellow-500" : "text-gray-600"}
                                    />
                                </button>
                            ))}
                            <span className="text-white font-bold ml-auto">{filters.rating}+ Stars</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-[#1F2937]/30 flex gap-3">
                    <button
                        onClick={() => {
                            setFilters({ subject: 'All', category: 'All', rating: 0 });
                            onClose();
                        }}
                        className="flex-1 py-3 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        Reset All
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-[#22D3EE] text-[#0B1220] rounded-xl font-bold hover:bg-[#06B6D4] transition-all shadow-lg"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;