import React from "react";
import { 
  ArrowRight, 
  Sparkles, 
  Globe, 
  Zap, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  Layers,
  Building2,
  GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-8 rounded-3xl bg-[#111827]/40 border border-[#1F2937] backdrop-blur-md hover:border-[#22D3EE]/50 transition-all group hover:-translate-y-2 duration-300">
        <div className="w-12 h-12 bg-[#0B1220] rounded-2xl flex items-center justify-center text-[#22D3EE] mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-[#22D3EE]/5">
            {icon}
        </div>
        <h3 className="text-white text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </div>
);

const LandingPage = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-[#0B1220] text-gray-100 selection:bg-[#22D3EE]/30 selection:text-white font-sans overflow-x-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#22D3EE]/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
            </div>

            {/* Navigation Header */}
            <header className="relative z-50 h-20 flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter">
                    <div className="w-10 h-10 bg-[#22D3EE] rounded-xl flex items-center justify-center text-[#0B1220]">
                        <GraduationCap size={24} />
                    </div>
                    UniBridge
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 px-6 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827] border border-[#1F2937] text-[#22D3EE] text-xs font-bold tracking-widest uppercase mb-10 shadow-2xl">
                    <Building2 size={14} />
                    Exclusive College Intranet Access
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter max-w-5xl">
                    Our College <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-cyan-400 to-purple-500">
                        Knowledge Hub.
                    </span>
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                    The private academic portal designed exclusively for our students and faculty. Access shared notes, campus resources, and student-contributed academic resources within our secure network, making it easier for the campus community to discover, share, and learn from reliable study materials in one place.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    
                    <Link to="/login">
                <button 
                        
                        className="group relative flex items-center gap-3 px-12 py-5 bg-[#22D3EE] text-[#0B1220] rounded-2xl font-black text-xl hover:bg-[#06B6D4] transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(34,211,238,0.25)]"
                    >
                        Student & Faculty Login
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
            </Link>
                </div>
            </section>

            
            {/* Footer */}
            <footer className="relative z-10 py-12 border-t border-[#1F2937] text-center">
                <p className="text-gray-600 text-sm font-bold tracking-widest uppercase mb-4">
                    UniBridge @ Our College Portal &copy; 2026
                </p>
                <div className="flex justify-center gap-6 text-gray-500 text-sm font-medium">
                    <a href="#" className="hover:text-[#22D3EE] transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-[#22D3EE] transition-colors">Campus Terms</a>
                    <a href="#" className="hover:text-[#22D3EE] transition-colors">IT Support</a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;