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
      ? 'bg-gray-700 border-b border-[#021E14]/20'
      : 'bg-[#021E14] text-white'
      }`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Left - Contact Info */}
          <div className={`hidden md:flex items-center gap-4 ${isDark ? 'text-white/60' : 'text-white/80'}`}>
            <a href="mailto:support@zayeduddin.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              support@zayeduddin.com
            </a>
            <span className="w-px h-3 bg-white/30"></span>
            <a href="tel:+8801714117701" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
              </svg>
              +880 17141-117701
            </a>
          </div>

          {/* Center - Offer/Announcement */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-[#021E14]/30 text-[#021E14]' : 'bg-white/20 text-white'
              }`}>
              🔥 Hot
            </span>
            <span className={`hidden sm:inline ${isDark ? 'text-white/70' : 'text-white/90'} ${bengaliClass}`}>
              {language === 'bn'
                ? <>🔥 সকল কোর্সে ২০% ছাড় | কোড: <span className={`font-bold ${isDark ? 'text-[#021E14]' : 'text-yellow-300'}`}>JAYED20</span></>
                : <>Get 20% OFF on all courses | Use code: <span className={`font-bold ${isDark ? 'text-[#021E14]' : 'text-yellow-300'}`}>JAYED20</span></>
              }
            </span>
          </div>

          {/* Right - Social Links */}
          <div className={`flex items-center gap-3 ${isDark ? 'text-white/60' : 'text-white/80'}`}>
            <a href="https://www.facebook.com/zayeduddin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Facebook">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
            </a>
            <a href="https://twitter.com/zayeduddin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Twitter">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/zayeduddin/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Instagram">
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
