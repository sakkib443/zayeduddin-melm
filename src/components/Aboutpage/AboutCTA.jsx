"use client";

import React, { useRef } from 'react';
import { LuArrowRight, LuMail, LuPhone, LuMapPin, LuSend } from 'react-icons/lu';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';

const AboutCTA = () => {
    const { language } = useLanguage();
    const sectionRef = useRef(null);

    const bengaliClass = language === "bn" ? "font-hind-siliguri" : "font-poppins";
    const headingFont = "font-outfit";

    return (
        <section ref={sectionRef} className="bg-white dark:bg-[#1E293B] relative transition-colors duration-700 border-t border-gray-100 dark:border-gray-700/50 overflow-hidden py-16 lg:py-24">
            {/* Dynamic Background Effects */}
            <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-16 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                    {/* Left Side: Editorial Content */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-[1px] w-8 bg-red-500" />
                                <span className={`text-[10px] font-black tracking-[0.4em] uppercase text-red-600 dark:text-red-400 ${headingFont}`}>
                                    {language === 'bn' ? '??? ???? ????' : 'Get Started Today'}
                                </span>
                            </div>

                            <h2 className={`${headingFont} text-4xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[0.95] tracking-tight mb-8`}>
                                ARCHITECT <br />
                                YOUR <br />
                                <span className="text-red-500 italic font-serif">PROFESSIONAL</span> LEGACY
                            </h2>

                            <p className={`text-base lg:text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-normal ${bengaliClass} mb-12 max-w-lg`}>
                                {language === 'bn'
                                    ? '????? ???????? ????????? ????? ???? ???? ????? ?????? ???? ??? ??? ??? ????? ?????? ?????? ?????'
                                    : 'Take the definitive step towards mastering your craft. Join the elite community of high-performers today and build your future.'
                                }
                            </p>

                            <div className="flex flex-wrap items-center gap-5 mt-10">
                                <Link
                                    href="/courses"
                                    className="group relative inline-flex items-center gap-3 bg-red-500 text-white px-8 py-4 rounded-xl font-medium text-base transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
                                >
                                    <span className="uppercase tracking-tighter font-normal">{language === 'bn' ? '????? ????' : 'ENROLL NOW'}</span>
                                    <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <button className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-gray-100 dark:border-white/10 text-gray-900 dark:text-white font-medium text-base hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all uppercase tracking-tighter">
                                    {language === 'bn' ? '??????? ????' : 'CONTACT US'}
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Professional Contact Grid */}
                    <div className="lg:col-span-5 pt-8 lg:pt-16">
                        <div className="flex flex-col gap-8">
                            {[
                                {
                                    icon: LuMail,
                                    text: 'info@jayeduddin.com',
                                    label: 'SUPPORT EMAIL',
                                    action: 'mailto:info@jayeduddin.com'
                                },
                                {
                                    icon: LuPhone,
                                    text: '+880 1829-818616',
                                    label: 'HELPLINE',
                                    action: 'tel:+8801829818616'
                                },
                                {
                                    icon: LuMapPin,
                                    text: 'Dhaka, Bangladesh',
                                    label: 'HEADQUARTERS',
                                    action: '#'
                                }
                            ].map((item, i) => (
                                <motion.a
                                    key={i}
                                    href={item.action}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className="group flex items-start gap-6"
                                >
                                    <div className="w-12 h-12 lg:w-14 lg:h-14 shrink-0 rounded-xl bg-gray-50 dark:bg-white/[0.03] flex items-center justify-center group-hover:bg-red-500 transition-all duration-500 shadow-sm border border-gray-100 dark:border-white/5">
                                        <item.icon size={22} className="text-red-600 dark:text-red-500 group-hover:text-black transition-colors" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className={`text-[9px] font-black tracking-[0.3em] text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors uppercase ${headingFont}`}>
                                            {item.label}
                                        </span>
                                        <p className={`text-lg lg:text-xl font-normal text-gray-800 dark:text-gray-200 tracking-tight leading-none ${headingFont}`}>
                                            {item.text}
                                        </p>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutCTA;
