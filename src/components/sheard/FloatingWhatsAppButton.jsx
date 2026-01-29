"use client";
import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

/**
 * A fixed floating button that links to WhatsApp.
 * Positioned at the bottom-right of the screen.
 * Moves up when scrolled to make room for ScrollToTop button.
 */
const FloatingWhatsAppButton = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <a
            href="https://wa.me/8801829818616"
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed right-6 z-[60] flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-110 hover:-translate-y-1 transition-all duration-300 group ${isScrolled ? 'bottom-24' : 'bottom-6'
                }`}
            aria-label="Contact on WhatsApp"
        >
            {/* Ping animation effect */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-20 animate-ping group-hover:animate-none"></span>

            <FaWhatsapp size={32} className="relative z-10" />

            {/* Tooltip */}
            <span className="absolute right-16 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat with us
            </span>
        </a>
    );
};

export default FloatingWhatsAppButton;
