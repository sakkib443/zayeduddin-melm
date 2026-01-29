"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

const WhatsAppButton = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a
            href="https://wa.me/8801829818616?text=Hello%20Hi%20Ict%20Park!%20I%20want%20to%20know%20more%20about%20your%20courses."
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
        >
            {/* Tooltip */}
            <div
                className={`px-4 py-2 bg-white text-gray-800 text-sm font-medium rounded-full shadow-lg transition-all duration-300 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    }`}
            >
                Chat with us!
            </div>

            {/* Button */}
            <div className="relative">
                {/* Pulse Animation */}
                <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-30"></div>

                {/* Main Button */}
                <div className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
                    <FaWhatsapp className="text-white text-3xl" />
                </div>
            </div>
        </a>
    );
};

export default WhatsAppButton;
