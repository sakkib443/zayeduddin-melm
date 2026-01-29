"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { HiLanguage } from "react-icons/hi2";
import { LuCheck, LuChevronDown } from "react-icons/lu";

const LanguageSwitcher = ({ variant = "default" }) => {
    const { language, setLanguage, isLoaded } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const languages = [
        { code: "en", label: "English", shortLabel: "EN", flag: "🇺🇸" },
        { code: "bn", label: "বাংলা", shortLabel: "বাং", flag: "🇧🇩" },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];

    // ALL RENDERING LOGIC AT THE BOTTOM TO ENSURE HOOKS LOADED
    // Compact variant for mobile menu
    const renderCompact = () => (
        <div className="flex gap-2">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 ${language === lang.code
                        ? "bg-[#E62D26]/10 border-[#E62D26] text-[#0f766e]"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                >
                    <span className="text-lg">{lang.flag}</span>
                    <span className={`text-sm font-medium ${lang.code === "bn" ? "hind-siliguri" : ""}`}>
                        {lang.label}
                    </span>
                    {language === lang.code && (
                        <LuCheck className="text-[#E62D26] text-sm" />
                    )}
                </button>
            ))}
        </div>
    );

    if (!isLoaded) {
        return (
            <div className="w-20 h-9 bg-gray-100 rounded-md animate-pulse"></div>
        );
    }

    if (variant === "compact") {
        return renderCompact();
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all duration-300"
                aria-label="Switch Language"
            >
                <HiLanguage className="text-lg text-[#E62D26]" />
                <span className={`text-[13px] font-medium text-gray-700 ${language === "bn" ? "hind-siliguri" : ""}`}>
                    {currentLang.shortLabel}
                </span>
                <LuChevronDown
                    className={`text-gray-400 text-sm transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Dropdown Menu */}
            <div
                className={`absolute top-full mt-2 right-0 w-40 bg-white rounded-xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden z-50 transition-all duration-300 ${isOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                    }`}
            >
                <div className="p-1.5">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${language === lang.code
                                ? "bg-gradient-to-r from-[#E62D26]/10 to-transparent"
                                : "hover:bg-gray-50"
                                }`}
                        >
                            <span className="text-lg">{lang.flag}</span>
                            <span
                                className={`flex-1 text-left text-[13px] font-medium ${language === lang.code ? "text-[#0f766e]" : "text-gray-600"
                                    } ${lang.code === "bn" ? "hind-siliguri" : ""}`}
                            >
                                {lang.label}
                            </span>
                            {language === lang.code && (
                                <LuCheck className="text-[#E62D26] text-sm" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Accent Line */}
                <div className="h-1 bg-gradient-to-r from-[#E62D26] via-[#F79952] to-[#E62D26]"></div>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
