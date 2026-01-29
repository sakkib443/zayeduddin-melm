"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const TopHeader = () => {
  const [isDark, setIsDark] = useState(false);
  const { language } = useLanguage();

  // Apply Bengali font class when language is Bengali
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  // Check for dark mode on mount
  useEffect(() => {
    const checkDarkMode = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedTheme = localStorage.getItem("theme");
          setIsDark(savedTheme === "dark" || document.documentElement.classList.contains("dark"));
        }
      } catch (error) {
        setIsDark(document.documentElement.classList.contains("dark"));
      }
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`w-full py-2.5 text-sm font-medium font-outfit transition-all duration-300 ${isDark
      ? 'bg-gray-700 border-b border-red-500/20'
      : 'bg-red-600 text-white'
      }`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Left - Contact Info */}
          <div className={`hidden md:flex items-center gap-4 ${isDark ? 'text-white/60' : 'text-white/80'}`}>
            <a href="mailto:info@jayeduddin.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              info@jayeduddin.com
            </a>
            <span className="w-px h-3 bg-white/30"></span>
            <a href="tel:+8801829818616" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              +880 1829-818616
            </a>
          </div>

          {/* Center - Offer/Announcement */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-red-500/30 text-red-400' : 'bg-white/20 text-white'
              }`}>
              🔥 Hot
            </span>
            <span className={`hidden sm:inline ${isDark ? 'text-white/70' : 'text-white/90'} ${bengaliClass}`}>
              {language === 'bn'
                ? <>🔥 সকল কোর্সে ২০% ছাড় | কোড: <span className={`font-bold ${isDark ? 'text-red-400' : 'text-yellow-300'}`}>JAYED20</span></>
                : <>Get 20% OFF on all courses | Use code: <span className={`font-bold ${isDark ? 'text-red-400' : 'text-yellow-300'}`}>JAYED20</span></>
              }
            </span>
          </div>

          {/* Right - Social Links */}
          <div className={`flex items-center gap-3 ${isDark ? 'text-white/60' : 'text-white/80'}`}>
            <a href="https://www.facebook.com/jayeduddin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Facebook">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
            </a>
            <a href="https://twitter.com/jayeduddin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Twitter">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/jayeduddin/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Instagram">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"></path></svg>
            </a>
            <span className="w-px h-3 bg-white/30 hidden sm:block"></span>
            <span className={`hidden sm:inline ${isDark ? 'text-white/40' : 'text-white/70'}`}>🇧🇩 Bangladesh</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
