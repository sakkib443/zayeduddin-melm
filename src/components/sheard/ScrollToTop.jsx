"use client";

import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    onClick={scrollToTop}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group cursor-pointer"
                    aria-label="Scroll to top"
                >
                    {/* Tooltip */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{
                            opacity: isHovered ? 1 : 0,
                            x: isHovered ? 0 : 10
                        }}
                        className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm font-medium rounded-full shadow-lg"
                    >
                        Go to Top
                    </motion.div>

                    {/* Button */}
                    <div className="relative">
                        {/* Main Button */}
                        <div className="relative w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 hover:bg-red-700">
                            <FaArrowUp className="text-white text-lg" />
                        </div>
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
