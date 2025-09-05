import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Shield, Star, Heart, Diamond } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const { data } = await axios.post('https://kmrl-doc-system-backend.onrender.com/api/auth/login', {
                email,
                password,
            });

            localStorage.setItem("userInfo", JSON.stringify(data));

         if (data.role === 'Staff') {
    navigate('/dashboard');
} else if (data.role === 'Manager') {
    navigate('/manager-dashboard');
} else { 
    navigate('/admin-dashboard');
}
        } catch (err) {
            console.error("Login failed:", err);
            setError(err.response?.data?.message || "Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden flex items-center justify-center p-4">
            
            {/* --- All the background animations from your code --- */}
            <div className="absolute inset-0 opacity-[0.02]">
                <motion.div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
                        backgroundSize: "50px 50px",
                    }}
                    animate={{ backgroundPosition: ["0px 0px", "50px 50px"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
            </div>
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.3, 0.8, 1.2, 1], rotate: [0, 180, 360], x: [0, 50, -30, 0], y: [0, -20, 40, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
                    animate={{ scale: [1.2, 0.9, 1.4, 1], rotate: [360, 180, 0], x: [0, -40, 20, 0], y: [0, 30, -50, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
       

            <motion.div
                className="relative z-10 w-full max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl overflow-hidden relative">
                    <motion.div
                        className="w-1/2 relative hidden md:block overflow-hidden"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <motion.img
                            src="https://kochimetro.org/wp-content/uploads/2018/01/train.png"
                            alt="3D Steam Engine Train"
                            className="w-full h-full object-cover"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-purple-900/30" />
                    </motion.div>

                    <div className="w-full md:w-1/2 p-8 lg:p-12 relative">
                        <motion.div
                            className="h-full flex flex-col justify-center"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="text-center space-y-4 mb-8">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <motion.h1
                                        className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                                        style={{ backgroundSize: "200% 100%" }}
                                        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    >
                                        Welcome Back
                                    </motion.h1>
                                    <motion.div
                                        className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mt-2"
                                        animate={{ scaleX: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </motion.div>
                                <p className="text-gray-600 text-lg">Sign in to your account to continue</p>
                            </div>

                            <form onSubmit={handleLoginSubmit} className="space-y-6">
                                {/* Form content remains the same, but custom components replaced with styled HTML elements */}
                                <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }} whileHover={{ scale: 1.02 }}>
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email Address
                                    </label>
                                    <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="p-2.5 w-full bg-white/60 border border-white/40 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:shadow-xl focus:shadow-blue-400/30 transition-all duration-300 hover:bg-white/70 hover:shadow-lg rounded-md"
                                        placeholder="Enter your email"
                                    />
                                </motion.div>
                                <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }} whileHover={{ scale: 1.02 }}>
                                    <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Lock className="w-4 h-4" /> Password
                                    </label>
                                    <div className="relative">
                                        <input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                                            className="p-2.5 w-full bg-white/60 border border-white/40 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:shadow-xl focus:shadow-blue-400/30 transition-all duration-300 pr-10 hover:bg-white/70 hover:shadow-lg rounded-md"
                                            placeholder="Enter your password"
                                        />
                                        <motion.button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </motion.button>
                                    </div>
                                </motion.div>

                                {error && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                        <div className="bg-red-50/80 border border-red-200 p-3 rounded-md text-red-700 text-sm">
                                            {error}
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.9 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <button type="submit" disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                                    >
                                        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" animate={{ x: [-200, 200] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}/>
                                        {isLoading ? (
                                            <div className="flex items-center justify-center gap-2 relative z-10">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Signing in...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 relative z-10">
                                                Sign In
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        )}
                                    </button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;