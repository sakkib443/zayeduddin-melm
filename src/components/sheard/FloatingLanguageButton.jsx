"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const FloatingLanguageButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const fontClass = language === "bn" ? "hind-siliguri" : "outfit";

  return (
    <>
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center">
        {/* Toggle Handle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-gradient-to-b from-[#E62D26] to-[#38a89d] text-white px-2 py-6 rounded-l-md shadow-md hover:shadow-lg hover:px-3 transition-all duration-300 flex items-center justify-center ${isOpen ? 'px-0 w-0 overflow-hidden opacity-0' : 'px-2 opacity-100'}`}
        >
          {/* Drawer Pull Lines (Visible only when closed) */}
          <div className="flex flex-col gap-1">
            <div className="w-1 h-1 bg-white/80 rounded-full"></div>
            <div className="w-1 h-1 bg-white/80 rounded-full"></div>
            <div className="w-1 h-1 bg-white/80 rounded-full"></div>
          </div>
        </button>

        {/* Expandable Panel (Simulating the button appearance when open) */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'}`}>
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(false)}
              className="bg-[#38a89d] text-white py-6 px-1 rounded-l-md flex items-center justify-center hover:bg-[#2d8a80] transition-colors mr-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <Link href="/language-program">
              <div
                className="animated-gradient-btn text-white py-3 px-5 shadow-lg hover:shadow-xl hover:shadow-[#E62D26]/40 transition-all duration-300 hover:px-6 cursor-pointer rounded-l-3xl"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              >
                <span className={`text-base font-bold tracking-wider uppercase whitespace-nowrap ${fontClass}`}>
                  {language === "bn" ? "???? ?????????" : "Language Program"}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animated-gradient-btn {
          background: linear-gradient(
            180deg,
            #E62D26,
            #38a89d,
            #F79952,
            #e07832,
            #E62D26
          );
          background-size: 100% 400%;
          animation: gradientFlow 12s ease infinite;
        }

        @keyframes gradientFlow {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingLanguageButton;
