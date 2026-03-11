/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoCallOutline, IoLocationOutline, IoMailOutline } from "react-icons/io5";
import { LuSend, LuArrowUpRight, LuHeart } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import Logo from "./Logo";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { t, language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const socialLinks = [
    { icon: FaFacebook, href: "https://web.facebook.com/zayeduddin.official/", color: "#1877F2", label: "Facebook" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/zayeduddin/", color: "#0A66C2", label: "LinkedIn" },
    { icon: FaXTwitter, href: "#", color: "#000000", label: "X" },
    { icon: FaYoutube, href: "#", color: "#FF0000", label: "YouTube" },
  ];

  const digitalProducts = [
    { href: "/design-template", label: language === 'bn' ? 'গ্রাফিক ডিজাইন' : 'Graphic Design' },
    { href: "/design-template?cat=uiux", label: language === 'bn' ? 'ইউআই/ইউএক্স ডিজাইন' : 'UX/UI Design' },
    { href: "/website", label: language === 'bn' ? 'ওয়েবসাইট ডিজাইন' : 'Website Design' },
    { href: "/design-template?cat=font", label: language === 'bn' ? 'ফন্ট ডিজাইন' : 'Font Design' },
  ];

  const trainingServices = [
    { href: "/courses?type=online", label: language === 'bn' ? 'অনলাইন প্রশিক্ষণ' : 'Online Training' },
    { href: "/courses?type=offline", label: language === 'bn' ? 'অফলাইন প্রশিক্ষণ' : 'Offline Training' },
    { href: "/courses?type=recorded", label: language === 'bn' ? 'রেকর্ডেড প্রশিক্ষণ' : 'Recorded Training' },
    { href: "/resource-library", label: language === 'bn' ? 'রিসোর্স ও লাইব্রেরি' : 'Resource & Library' },
  ];

  const aboutText = language === 'bn'
    ? 'জায়েদ উদ্দিন একটি প্রিমিয়াম আইটি প্রশিক্ষণ এবং সৃজনশীল প্ল্যাটফর্ম যা ডিজাইন, ডেভেলপমেন্ট এবং ডিজিটাল আর্টসে শিল্প-নেতৃস্থানীয় দক্ষতা দিয়ে ব্যক্তিদের ক্ষমতায়ন করতে নিবেদিত।'
    : 'Zayed Uddin is a premium IT training and creative platform dedicated to empowering individuals with industry-leading skills in design, development, and digital arts.';

  return (
    <footer className="relative bg-[#021E14] overflow-hidden text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#021E14]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#021E14]/5 rounded-full blur-3xl"></div>

      {/* Top CTA Section */}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-16 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden backdrop-blur-sm">
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

      {/* ═══════════════════════ MAIN FOOTER CONTENT ═══════════════════════ */}
      <div className="relative container mx-auto px-4 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* ──── Column 01: Logo + About + Social ──── */}
          <div className="lg:col-span-4 space-y-5">
            <div className="inline-block mb-4">
              <Logo color="#D4AF37" size="large" align="left" />
            </div>
            <p className={`text-gray-300 work text-sm leading-relaxed max-w-sm ${bengaliClass}`}>
              {aboutText.substring(0, 160)}{aboutText.length > 160 ? '...' : ''}
            </p>
            <Link href="/about" className="inline-flex items-center gap-1.5 text-[#D4AF37] text-sm font-semibold hover:text-white transition-colors group">
              {language === 'bn' ? 'আরও দেখুন' : 'Read More'}
              <LuArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            {/* Get in touch */}
            <div className="pt-2">
              <p className={`text-white/50 text-xs font-semibold uppercase tracking-widest mb-3 ${bengaliClass}`}>
                {language === 'bn' ? 'যোগাযোগ করুন' : 'Get in Touch'}
              </p>
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
                    <social.icon className="text-gray-300 group-hover:text-white transition-colors relative z-10" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: social.color }}></div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ──── Column 02: Digital Products + Training Service ──── */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            {/* Digital Products */}
            <div>
              <h4 className={`text-white font-semibold outfit mb-5 flex items-center gap-2 ${bengaliClass}`}>
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                {language === 'bn' ? 'ডিজিটাল প্রোডাক্টস' : 'Digital Products'}
              </h4>
              <ul className="space-y-3">
                {digitalProducts.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`text-gray-300 hover:text-[#D4AF37] text-sm work transition-colors inline-flex items-center gap-2 group ${bengaliClass}`}
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-[#D4AF37] transition-all duration-300"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Training Service */}
            <div>
              <h4 className={`text-white font-semibold outfit mb-5 flex items-center gap-2 ${bengaliClass}`}>
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                {language === 'bn' ? 'প্রশিক্ষণ সেবা' : 'Training Service'}
              </h4>
              <ul className="space-y-3">
                {trainingServices.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`text-gray-300 hover:text-[#D4AF37] text-sm work transition-colors inline-flex items-center gap-2 group ${bengaliClass}`}
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-[#D4AF37] transition-all duration-300"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ──── Column 03: Contact + Newsletter + Payment ──── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Contact Me */}
            <div>
              <h4 className={`text-white font-semibold outfit mb-5 flex items-center gap-2 ${bengaliClass}`}>
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                {language === 'bn' ? 'যোগাযোগ' : 'Contact Me'}
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="tel:+8801714117701" className="group flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37] transition-colors">
                      <IoCallOutline className="text-[#D4AF37] text-sm" />
                    </div>
                    <span className="text-gray-300 text-sm work group-hover:text-[#D4AF37] transition-colors">+880 17141 117701</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:support@zayeduddin.com" className="group flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37] transition-colors">
                      <IoMailOutline className="text-[#D4AF37] text-sm" />
                    </div>
                    <span className="text-gray-300 text-sm work group-hover:text-[#D4AF37] transition-colors">support@zayeduddin.com</span>
                  </a>
                </li>
                <li>
                  <div className="group flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <IoLocationOutline className="text-[#D4AF37] text-sm" />
                    </div>
                    <span className={`text-gray-300 text-sm work ${bengaliClass}`}>
                      {language === 'bn' ? 'বাড়ি নং ৫৯/১/বি, টি.বি. হাজারীবাগ, ঢাকা ১২০৯ বাংলাদেশ।' : 'House No. 59/1/B, T.B. Hazaribagh, Dhaka 1209 Bangladesh.'}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Subscribe to Newsletter */}
            <div>
              <h4 className={`text-white font-semibold outfit mb-3 flex items-center gap-2 ${bengaliClass}`}>
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                {language === 'bn' ? 'নিউজলেটার সাবস্ক্রাইব করুন' : 'Subscribe to Newsletter'}
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার ইমেইল লিখুন' : 'Enter your email'}
                  className={`flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-md text-white text-sm work placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors ${bengaliClass}`}
                />
                <button className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#FFD700] text-[#021E14] rounded-md transition-colors font-bold">
                  <LuSend className="text-lg" />
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className={`text-white font-semibold outfit mb-3 flex items-center gap-2 ${bengaliClass}`}>
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                {language === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Method'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {['bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard'].map((method) => (
                  <span key={method} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-gray-300 text-xs font-medium work">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════ BOTTOM BAR ═══════════════════════ */}
      <div className="relative border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className={`text-gray-400 text-sm work text-center md:text-left ${bengaliClass}`}>
              © 2003 - 2025 Zayed Uddin. {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All Rights Reserved.'}
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <Link href="/terms" className={`text-gray-400 hover:text-[#D4AF37] text-sm work transition-colors ${bengaliClass}`}>
                {language === 'bn' ? 'শর্তাবলী' : 'Terms & Conditions'}
              </Link>
              <span className="text-gray-600 text-xs">|</span>
              <Link href="/privacy" className={`text-gray-400 hover:text-[#D4AF37] text-sm work transition-colors ${bengaliClass}`}>
                {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
              </Link>
              <span className="text-gray-600 text-xs">|</span>
              <Link href="/return-policy" className={`text-gray-400 hover:text-[#D4AF37] text-sm work transition-colors ${bengaliClass}`}>
                {language === 'bn' ? 'রিটার্ন নীতি' : 'Return Policy'}
              </Link>
            </div>

            {/* Made with + Developer */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2">
              <span className={`text-gray-400 text-sm work flex items-center gap-1 ${bengaliClass}`}>
                {language === 'bn' ? 'তৈরি করা হয়েছে' : 'Made with'} <LuHeart className="text-[#D4AF37] text-xs" /> {language === 'bn' ? 'বাংলাদেশ' : 'Bangladesh'}
              </span>
              <span className="text-gray-400 text-sm work flex items-center gap-1">
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
