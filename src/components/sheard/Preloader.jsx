"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        // Lock scroll during loading
        document.body.style.overflow = "hidden";

        // Counter animation
        const timer = setInterval(() => {
            setPercent((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setIsLoading(false), 500);
                    return 100;
                }
                return prev + 1;
            });
        }, 20); // Controls loading speed

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            // Unlock scroll after animations complete
            setTimeout(() => {
                document.body.style.overflow = "auto";
            }, 1000);
        }
    }, [isLoading]);

    const slideUp = {
        initial: { y: 0 },
        exit: {
            y: "-100vh",
            transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] }
        }
    };

    // Letter animation for "HIICTPARK"
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="preloader"
                    variants={slideUp}
                    initial="initial"
                    exit="exit"
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary"
                    style={{ backgroundColor: '#300000' }}
                >
                    <div className="flex flex-col items-center justify-center z-10 w-full px-4 text-white">

                        {/* Brand Logo - Animated */}
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col items-center mb-8"
                        >
                            <motion.span
                                variants={child}
                                className="text-4xl md:text-6xl font-serif italic mb-2 relative"
                            >
                                Zayed Uddin
                                <span className="absolute inset-0 blur-lg opacity-40 text-white animate-pulse">Zayed Uddin</span>
                            </motion.span>

                            <motion.div
                                variants={child}
                                className="w-16 h-[1px] bg-white opacity-50 mb-2"
                            />

                            <motion.span
                                variants={child}
                                className="text-[10px] md:text-sm tracking-[0.4em] font-light uppercase opacity-90"
                            >
                                DESIGNER & TRAINER
                            </motion.span>
                        </motion.div>

                        {/* Counter Section */}
                        <div className="flex items-baseline space-x-2 relative mt-2">
                            <h2 className="text-6xl md:text-8xl font-bold font-mono tracking-tighter">
                                {percent}
                            </h2>
                            <span className="text-3xl md:text-4xl font-bold text-white/90 absolute -right-8 md:-right-10 top-2 md:top-4">%</span>
                        </div>

                        {/* Progress Bar with Glow */}
                        <div className="w-64 md:w-96 h-2 bg-black/20 rounded-full mt-8 overflow-hidden backdrop-blur-sm border border-white/10">
                            <motion.div
                                className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 text-white/90 font-semibold tracking-[0.4em] text-sm uppercase flex items-center gap-2"
                        >
                            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                            Loading Experience
                            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
