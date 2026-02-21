/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaFacebook, FaLinkedin, FaYoutube, FaInstagram } from "react-icons/fa";
import { IoCallOutline, IoLocationOutline, IoMailOutline } from "react-icons/io5";
import { LuSend, LuArrowUpRight, LuHeart } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import Logo from "./Logo";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { t, language } = useLanguage();

  // Apply Bengali font class when language is Bengali
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const quickLinks = [
    { to: "/", label: t("navbar.home") },
    { to: "/courses", label: t("navbar.courses") }, // Label is corrected to 'Training' via translation
    { to: "/website", label: t("navbar.websiteSelection") },
    { to: "/design-template", label: t("navbar.designTemplate") },
    { to: "/pricing", label: t("navbar.pricingPlan") },
    { to: "/blog", label: t("navbar.blog") },
    { to: "/about", label: t("navbar.about") },
    { to: "/contact", label: t("navbar.contact") },
  ];

  const categories = [
    { key: "Web Development", label: t("footer.programming") },
    { key: "Digital Marketing", label: t("footer.digitalMarketing") },
    { key: "Graphics Design", label: t("footer.artDesign") },
    { key: "UI/UX Design", label: t("footer.networking") },
    { key: "Motion Graphics", label: t("footer.database") },
    { key: "Video Editing", label: t("footer.languageSkills") },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "https://web.facebook.com/zayeduddin.official/", color: "#1877F2", label: "Facebook" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/zayeduddin/", color: "#0A66C2", label: "LinkedIn" },
    { icon: FaYoutube, href: "#", color: "#FF0000", label: "YouTube" },
    { icon: FaInstagram, href: "#", color: "#E4405F", label: "Instagram" },
  ];

  return (
    <footer className="relative bg-[#021E14] overflow-hidden text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#021E14]/5 dark:bg-[#021E14]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#021E14]/5 dark:bg-[#021E14]/10 rounded-full blur-3xl"></div>

      {/* Top CTA Section */}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-16 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden backdrop-blur-sm">
            {/* Decorative glares */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <div className="text-center lg:text-left relative z-10">
              <h3 className={`text-2xl lg:text-4xl font-serif italic text-white mb-3 ${bengaliClass}`}>
                {t("footer.ctaHeading")}
              </h3>
              <p className={`text-white/70 work text-sm lg:text-base max-w-xl ${bengaliClass}`}>
                {t("footer.ctaDescription")}
              </p>
            </div>
            <Link
              href="/courses"
              className={`group relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-[#D4AF37] text-[#021E14] rounded-xl font-bold hover:bg-white transition-all duration-300 shadow-xl hover:-translate-y-1 ${bengaliClass}`}
            >
              <span>{t("footer.exploreCourses")}</span>
              <LuArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-block mb-6">
              <Logo color="#D4AF37" size="large" align="left" />
            </div>
            <p className={`text-gray-300 work text-sm leading-relaxed max-w-sm ${bengaliClass}`}>
              {t("footer.brandDescription")}
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-10 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#D4AF37] hover:shadow-lg transition-all duration-300 overflow-hidden"
                  title={social.label}
                >
                  <social.icon
                    className="text-gray-300 group-hover:text-white transition-colors relative z-10"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: social.color }}
                  ></div>
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="pt-4">
              <h4 className={`text-white font-semibold outfit mb-3 ${bengaliClass}`}>{t("footer.subscribeNewsletter")}</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("footer.enterEmail")}
                  className={`flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-md text-white text-sm work placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors ${bengaliClass}`}
                />
                <button className="px-4 py-2.5 bg-[#021E14] hover:bg-[#38a89d] text-white rounded-md transition-colors">
                  <LuSend className="text-lg" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-white font-semibold outfit mb-5 flex items-center gap-2 ${bengaliClass}`}>
              <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.to}
                    className={`text-gray-300 hover:text-[#D4AF37] text-sm work transition-colors inline-flex items-center gap-2 group ${bengaliClass}`}
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[#D4AF37] transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className={`text-white font-semibold outfit mb-5 flex items-center gap-2 ${bengaliClass}`}>
              <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
              {t("footer.categories")}
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.key}>
                  <Link
                    href={`/courses?category=${encodeURIComponent(cat.key)}`}
                    className={`text-gray-300 hover:text-[#D4AF37] text-sm work transition-colors inline-flex items-center gap-2 group ${bengaliClass}`}
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[#D4AF37] transition-all duration-300"></span>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={`text-white font-semibold outfit mb-5 flex items-center gap-2 ${bengaliClass}`}>
              <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
              {t("footer.contactUs")}
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+8801741117701" className="group flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37] transition-colors">
                    <IoCallOutline className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className={`text-xs text-gray-400 work ${bengaliClass}`}>{t("footer.phone")}</p>
                    <p className="text-gray-200 text-sm work group-hover:text-[#D4AF37] transition-colors">+88 01741 117701</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@zayeduddin.com" className="group flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37] transition-colors">
                    <IoMailOutline className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className={`text-xs text-gray-400 work ${bengaliClass}`}>{t("footer.email")}</p>
                    <p className="text-gray-200 text-sm work group-hover:text-[#D4AF37] transition-colors break-all">info@zayeduddin.com</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="group flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <IoLocationOutline className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className={`text-xs text-gray-400 work ${bengaliClass}`}>{t("footer.address")}</p>
                    <p className={`text-gray-200 text-sm work ${bengaliClass}`}>{t("footer.addressValue")}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-gray-400 text-sm work text-center md:text-left ${bengaliClass}`}>
              {t("footer.copyright")}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">
              <span className="text-gray-400 text-xs work">
                {t("footer.tradeLicense")}
              </span>
              <span className={`text-gray-400 text-sm work flex items-center gap-1 ${bengaliClass}`}>
                {t("footer.madeWith")} <LuHeart className="text-[#D4AF37] text-xs" /> {t("footer.inBangladesh")}
              </span>
              <span className={`text-gray-400 text-sm work flex items-center gap-1 ${bengaliClass}`}>
                Developed by <a href="https://extrainweb.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[#D4AF37] transition-colors">Extrain Web</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
