"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BiMenu, BiX } from "react-icons/bi";
import {
  LuChevronDown, LuLogOut, LuLayoutDashboard, LuShoppingCart, LuUser, LuSettings, LuMail, LuPhone
} from "react-icons/lu";
import { useSelector } from "react-redux";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const { items = [] } = useSelector((state) => state.cart || {});
  const { t, language, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsSticky(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMobileMenuOpen(false);
    router.replace("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-dropdown')) {
        setIsProfileDropdownOpen(false);
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Top bar links
  const topBarLeft = [
    { href: "/about", label: t("navbar.about") },
    { href: "/contact", label: t("navbar.contact") },
  ];

  // Navbar left links
  const navLeft = [
    { href: "/courses", label: t("navbar.courses") },
    { href: "/resource-library", label: t("navbar.blog") },
  ];

  // Navbar right links
  const navRight = [
    { href: "/design-template", label: t("navbar.designTemplate") },
    { href: "/website", label: t("navbar.webTemplate") },
  ];

  const colors = {
    bg: "#021E14",
    text: "#D4AF37",
    hover: "#FFD700",
    border: "rgba(212, 175, 55, 0.2)"
  };

  const NavLink = ({ href, label }) => (
    <Link
      href={href}
      className="relative group text-[15px] font-normal tracking-[0.15em] transition-colors poppins"
      style={{ color: pathname === href ? colors.hover : colors.text }}
    >
      {label}
      <span className={`absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${pathname === href ? 'w-full' : ''}`} style={{ backgroundColor: colors.hover }} />
    </Link>
  );

  return (
    <>
      {/* ═══════════════════════════ TOP BAR ═══════════════════════════ */}
      <div
        className="w-full border-b transition-all duration-300 relative z-[70]"
        style={{ backgroundColor: "rgba(2, 30, 20, 0.95)", borderColor: "rgba(212, 175, 55, 0.08)" }}
      >
        <div className="container mx-auto px-4 lg:px-16">
          <div className="flex items-center justify-between h-12">
            {/* Top Left: About Me, Contact */}
            <div className="hidden md:flex items-center gap-1">
              {topBarLeft.map((item, idx) => (
                <span key={item.href} className="flex items-center">
                  <Link
                    href={item.href}
                    className="text-[11px] font-medium tracking-widest uppercase transition-colors hover:text-[#FFD700] poppins"
                    style={{ color: pathname === item.href ? colors.hover : "rgba(212, 175, 55, 0.7)" }}
                  >
                    {item.label}
                  </Link>
                  {idx < topBarLeft.length - 1 && (
                    <span className="w-px h-3 mx-3" style={{ backgroundColor: "rgba(212, 175, 55, 0.2)" }} />
                  )}
                </span>
              ))}
            </div>

            {/* Top Right: Cart, Language, Login */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Cart */}
              <Link href="/cart" className="relative transition-transform hover:scale-110" style={{ color: colors.text }}>
                <LuShoppingCart size={16} />
                {mounted && items.length > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: colors.text, color: "#021E14" }}>
                    {items.length}
                  </span>
                )}
              </Link>

              <span className="w-px h-3" style={{ backgroundColor: "rgba(212, 175, 55, 0.15)" }} />

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="relative flex items-center bg-white/5 rounded-full p-0.5 w-20 h-7 border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-500 overflow-hidden"
                title={language === "en" ? "বাংলায় দেখুন" : "Switch to English"}
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 bottom-0.5 w-[calc(50%-2px)] bg-[#D4AF37] rounded-full shadow-[0_2px_6px_rgba(212,175,55,0.3)]"
                  animate={{ x: language === 'bn' ? 0 : '100%' }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
                <span className={`flex-1 text-[9px] font-bold text-center relative z-10 transition-colors duration-300 ${language === 'bn' ? 'text-[#021E14]' : 'text-[#D4AF37]'} ${language === 'bn' ? 'hind-siliguri' : ''}`}>
                  বাংলা
                </span>
                <span className={`flex-1 text-[9px] font-black tracking-widest text-center relative z-10 transition-colors duration-300 ${language === 'en' ? 'text-[#021E14]' : 'text-[#D4AF37]'}`}>
                  EN
                </span>
              </button>

              <span className="w-px h-3" style={{ backgroundColor: "rgba(212, 175, 55, 0.15)" }} />

              {/* Login / Profile */}
              {mounted && user ? (
                <div className="relative nav-dropdown">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    }}
                    className="group relative flex items-center justify-center transition-all duration-300"
                  >
                    <div className="w-7 h-7 rounded-full border-2 p-0.5 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105"
                      style={{ borderColor: isProfileDropdownOpen ? colors.hover : "rgba(212, 175, 55, 0.3)" }}>
                      {user.image ? (
                        <img src={user.image} alt="User" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                          <LuUser size={12} style={{ color: colors.text }} />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#021E14] rounded-full" />
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-3 w-48 shadow-2xl border bg-[#021E14] rounded-sm overflow-hidden z-[100]"
                        style={{ borderColor: colors.border }}
                      >
                        <div className="p-4 border-b border-white/10 bg-white/5">
                          <p className="text-[10px] font-bold text-white/50 uppercase tracking-tighter mb-1">Signed in as</p>
                          <p className="text-xs font-bold truncate" style={{ color: colors.text }}>{user.name}</p>
                        </div>
                        <Link
                          href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/user"}
                          className="flex items-center gap-3 px-4 py-3 text-xs hover:bg-white/10 transition-colors"
                          style={{ color: colors.text }}
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <LuLayoutDashboard size={14} />
                          {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                        </Link>
                        {user.role === "admin" && (
                          <Link
                            href="/dashboard/admin/settings"
                            className="flex items-center gap-3 px-4 py-3 text-xs hover:bg-white/10 transition-colors"
                            style={{ color: colors.text }}
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <LuSettings size={14} />
                            Settings
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-xs hover:bg-[#021E14]/10 transition-colors border-t border-white/5"
                          style={{ color: "#ff4d4d" }}
                        >
                          <LuLogOut size={14} />
                          Log Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login" className="text-[10px] font-bold tracking-widest border px-3 py-1 rounded-sm transition-all hover:bg-white/5" style={{ color: colors.text, borderColor: colors.text }}>
                  {t("navbar.signIn").toUpperCase()}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════ MAIN NAVBAR ═══════════════════════════ */}
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: isSticky ? "#021E14" : "rgba(2, 30, 20, 0.98)",
          paddingTop: isSticky ? "6px" : "14px",
          paddingBottom: isSticky ? "6px" : "14px",
          boxShadow: isSticky ? "0 10px 40px rgba(0,0,0,0.3)" : "none",
          backdropFilter: isSticky ? "blur(10px)" : "none",
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 left-0 w-full z-50 border-b border-white/5"
      >
        <div className="mx-auto px-6 w-full max-w-[1800px]">
          <div className="flex items-center justify-between h-14 lg:h-16">

            {/* Mobile Toggle */}
            <button
              className="lg:hidden text-2xl"
              style={{ color: colors.text }}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <BiMenu />
            </button>

            {/* Left Nav: Training, Resource & Library */}
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-end pr-10">
              {navLeft.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}
            </div>

            {/* Center: Logo */}
            <div className="flex-shrink-0 flex items-center justify-center px-6">
              <Logo color={colors.text} />
            </div>

            {/* Right Nav: Design Template, Web Template */}
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-start pl-10">
              {navRight.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}
            </div>

            {/* Mobile View Cart Icon */}
            <div className="lg:hidden">
              <Link href="/cart" className="relative" style={{ color: colors.text }}>
                <LuShoppingCart size={22} />
              </Link>
            </div>

          </div>
        </div>

        {/* ═══════════ Mobile Menu ═══════════ */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60]"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                className="fixed top-0 left-0 h-full w-[280px] z-[70] shadow-2xl p-8 flex flex-col"
                style={{ backgroundColor: colors.bg }}
              >
                <div className="flex justify-between items-center mb-12">
                  <Logo size="small" align="left" color={colors.text} />
                  <button onClick={() => setIsMobileMenuOpen(false)} style={{ color: colors.text }}>
                    <BiX size={32} />
                  </button>
                </div>

                <div className="flex flex-col gap-8 overflow-y-auto pb-8">
                  {/* All nav links for mobile */}
                  {[...navLeft, ...navRight, ...topBarLeft].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-bold tracking-[0.2em]"
                      style={{ color: colors.text }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}

                  <div className="mt-8 pt-8 border-t border-gold/10 flex flex-col gap-6">
                    {/* Mobile Language Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase">{t("language.switchLanguage")}</span>
                      <button
                        onClick={toggleLanguage}
                        className="relative flex items-center bg-white/10 rounded-full p-1 w-28 h-10 border border-[#D4AF37]/30 overflow-hidden"
                      >
                        <motion.div
                          className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-[#D4AF37] rounded-full"
                          animate={{ x: language === 'bn' ? 0 : '100%' }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        />
                        <span className={`flex-1 text-[11px] font-bold text-center relative z-10 transition-colors duration-300 ${language === 'bn' ? 'text-[#021E14]' : 'text-[#D4AF37]'} ${language === 'bn' ? 'hind-siliguri' : ''}`}>
                          বাংলা
                        </span>
                        <span className={`flex-1 text-[11px] font-black tracking-widest text-center relative z-10 transition-colors duration-300 ${language === 'en' ? 'text-[#021E14]' : 'text-[#D4AF37]'}`}>
                          EN
                        </span>
                      </button>
                    </div>

                    {user ? (
                      <button onClick={handleLogout} className="text-sm font-bold tracking-widest text-left" style={{ color: colors.text }}>{t("navbar.logout").toUpperCase()}</button>
                    ) : (
                      <Link href="/login" className="text-sm font-bold tracking-widest" onClick={() => setIsMobileMenuOpen(false)} style={{ color: colors.text }}>{t("navbar.signIn").toUpperCase()}</Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from hiding under sticky nav */}
      <div className="h-0" />
    </>
  );
};

export default Navbar;
