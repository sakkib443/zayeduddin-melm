"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LuHouse, LuArrowLeft, LuSearch, LuTriangleAlert } from "react-icons/lu";

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050505] overflow-hidden relative selection:bg-red-500/30">

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-full blur-[100px] opacity-50" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">

                {/* Animated 404 Text */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative mb-8"
                >
                    <h1 className="text-[150px] sm:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500/20 via-gray-200 dark:via-gray-800 to-orange-500/20 select-none">
                        404
                    </h1>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <div className="bg-white dark:bg-[#0d0d0d] p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-2xl shadow-red-500/10 backdrop-blur-xl">
                            <LuTriangleAlert className="w-12 h-12 text-orange-500 mx-auto" />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="max-w-2xl mx-auto"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-10">
                        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-3 shadow-lg"
                        >
                            <LuHouse size={20} />
                            <span>Back to Home</span>
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <LuArrowLeft size={20} />
                            <span>Go Back</span>
                        </button>
                    </div>
                </motion.div>

                {/* Footer Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-16 text-sm text-gray-400 dark:text-gray-600 font-medium"
                >
                    Error Code: 404 � ejobsit System
                </motion.p>

            </div>
        </div>
    );
};

export default NotFound;
