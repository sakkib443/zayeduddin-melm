"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

const AboutMe = () => {
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const socialLinks = [
        { icon: <FaFacebookF />, href: "https://web.facebook.com/zayeduddin.official/", color: "#1877F2" },
        { icon: <FaLinkedinIn />, href: "https://www.linkedin.com/in/zayeduddin/", color: "#0A66C2" },
    ];

    return (
        <section className="py-16 bg-[#fafafa] dark:bg-[#050505] overflow-hidden">
            <div className="container mx-auto px-4 lg:px-16">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Left Side: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 order-2 lg:order-1"
                    >
                        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-[#021E14] mb-6 ${bengaliClass}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                            {t("aboutMe.title")}
                        </h2>

                        <div className={`space-y-4 text-slate-700 dark:text-slate-400 text-sm md:text-base leading-relaxed ${bengaliClass}`}>
                            <p>
                                {t("aboutMe.text1")}
                            </p>

                            <p>
                                {t("aboutMe.text2")}
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-10">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-[#021E14] hover:text-white hover:border-[#021E14] transition-all duration-300 shadow-sm"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side: Visual Image Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end"
                    >
                        <div className="relative w-full max-w-lg mx-auto">

                            {/* Main Grid Layout */}
                            <div className="grid grid-cols-2 gap-4">

                                {/* Top Left — Tall Image */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: 0.1 }}
                                    className="relative h-96 rounded-[2rem] overflow-hidden shadow-2xl"
                                >
                                    <Image
                                        src="/images/training.jpg"
                                        alt="Training Session 1"
                                        fill
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#021E14]/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <span className="text-white text-xs font-bold uppercase tracking-widest opacity-80">Training</span>
                                    </div>
                                </motion.div>

                                {/* Right Column — Two Stacked Images */}
                                <div className="flex flex-col gap-4">
                                    {/* Top Right — Square Image */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.7, delay: 0.2 }}
                                        className="relative h-56 rounded-[2rem] overflow-hidden shadow-xl"
                                    >
                                        <Image
                                            src="/images/training2.jpg"
                                            alt="Training Session 2"
                                            fill
                                            className="object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#021E14]/50 via-transparent to-transparent" />
                                    </motion.div>

                                    {/* Bottom Right — Experience Badge Card */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.35 }}
                                        className="relative h-36 rounded-[2rem] overflow-hidden shadow-xl"
                                    >
                                        <Image
                                            src="/images/training3.jpg"
                                            alt="Training Session 3"
                                            fill
                                            className="object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#021E14]/70 via-[#021E14]/20 to-transparent" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Since Badge — floating bottom-left */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="absolute -bottom-6 -left-6 bg-[#021E14] text-white rounded-[1.5rem] p-5 shadow-2xl z-30 flex flex-col items-center justify-center w-28 h-28 border-4 border-[#fafafa] dark:border-[#050505]"
                            >
                                <span className={`text-[9px] uppercase tracking-wider text-white/60 leading-tight font-bold ${bengaliClass}`}>
                                    {language === 'bn' ? 'শুরু থেকে' : 'Since'}
                                </span>
                                <span className="text-2xl font-bold leading-none mt-1 text-[#D4AF37]" style={{ fontFamily: 'var(--font-poppins)' }}>2003</span>
                            </motion.div>

                            {/* Gold accent bar */}
                            <div className="absolute -bottom-2 left-28 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full opacity-50" />

                            {/* Subtle background glow */}
                            <div className="absolute -top-8 -right-8 w-40 h-40 bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-8 left-0 w-32 h-32 bg-[#021E14]/5 rounded-full blur-2xl pointer-events-none" />
                        </div>
                    </motion.div>

                </div>
            </div>
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default AboutMe;
