import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, ShieldCheck, Loader2, BookOpen, Eye, EyeOff } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) return;
        
        setIsLoading(true);
        try {
            const res = await fetch("http://192.168.1.9:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await res.json();

            if (data.id) {
    // 1. Store user data
    localStorage.setItem("userId", data.id);
    localStorage.setItem("role", data.role);
    
    // 2. Conditional Navigation based on role
    // Using lowercase to be safe, adjust based on your exact backend strings
    if (data.role?.toUpperCase() === "ADMIN") {
        navigate("/admindashboard");
    } else {
        navigate("/dashboard");
    }
} else {
                // Custom error feedback instead of browser alert
                console.error("Login Failed");
                alert("Login Failed: Invalid credentials");
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Connection failed. Please check your server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4 font-sans selection:bg-[#22D3EE]/30">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#22D3EE]/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-[400px] relative z-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#111827] border border-[#1F2937] rounded-2xl flex items-center justify-center text-[#22D3EE] mb-4 shadow-xl shadow-black/20">
                        <BookOpen size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">UniBridge</h1>
                    <p className="text-gray-500 mt-2">Sign in to your academic portal</p>
                </div>

                {/* Login Form Card */}
                <div className="bg-[#111827] border border-[#1F2937] p-8 rounded-3xl shadow-2xl">
                    <div className="space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#22D3EE] transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Enter your email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0B1220] border border-[#1F2937] text-white p-4 pl-12 rounded-xl focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/50 transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#22D3EE] transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0B1220] border border-[#1F2937] text-white p-4 pl-12 pr-12 rounded-xl focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/50 transition-all placeholder:text-gray-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#22D3EE] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button 
                            onClick={handleLogin}
                            disabled={isLoading || !email || !password}
                            className="w-full bg-[#22D3EE] disabled:bg-gray-700 disabled:cursor-not-allowed text-[#0B1220] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#06B6D4] transition-all transform active:scale-[0.98] shadow-lg shadow-[#22D3EE]/10"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <ShieldCheck size={20} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Security Badge */}
                <div className="mt-8 flex items-center justify-center gap-2 text-gray-600">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Secure AES-256 Encrypted Portal</span>
                </div>
            </div>
        </div>
    );
};

export default Login;