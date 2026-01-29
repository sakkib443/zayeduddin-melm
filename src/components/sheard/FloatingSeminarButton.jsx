"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const FloatingSeminarButton = () => {
  const { language } = useLanguage();
  const fontClass = language === "bn" ? "hind-siliguri" : "outfit";
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      // Treating devices < 1024px as requiring the mobile toggle behavior
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Trigger Button (Visible only on mobile when closed) */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 group"
          aria-label={language === "bn" ? "???????? ??????" : "Join Seminar"}
        >
          <div className="animated-gradient-btn text-white p-3 rounded-r-lg shadow-lg hover:shadow-xl hover:shadow-[#E62D26]/40 transition-all duration-300">
            <FaCalendarAlt size={20} />
          </div>
        </button>
      )}

      {/* Main Seminar Button (Visible on Desktop OR when Open on Mobile) */}
      {(!isMobile || isOpen) && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center">
          <Link
            href="/events"
            className="group relative"
            onClick={() => isMobile && setIsOpen(false)}
          >
            <div
              className="animated-gradient-btn text-white py-2 px-3 rounded-r-lg shadow-lg hover:shadow-xl hover:shadow-[#E62D26]/40 transition-all duration-300 hover:px-4 cursor-pointer"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
              <span
                className={`text-xs font-bold tracking-wider uppercase whitespace-nowrap ${fontClass}`}
              >
                {language === "bn" ? "???????? ??????" : "Join our Seminar"}
              </span>
            </div>
          </Link>

          {/* Close Button (Visible only on Mobile when Open) */}
          {isMobile && isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="ml-2 bg-white text-[#E62D26] p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all z-50"
              aria-label="Close"
            >
              <IoMdClose size={20} />
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .animated-gradient-btn {
          background: linear-gradient(
            180deg,
            #E62D26,
            #38a89d,
            #f79952,
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

export default FloatingSeminarButton;
