"use client";

import React, { useRef } from 'react';
import { LuRocket, LuShield, LuHeadphones, LuGraduationCap, LuTrophy, LuInfinity, LuCornerRightDown, LuArrowRight } from 'react-icons/lu';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';

const FeaturePair = ({ pair, pairIdx, headingFont, bengaliClass, language }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

    return (
        <div
            ref={ref}
            className="lg:sticky w-full h-fit flex flex-col md:flex-row gap-6 py-6"
            style={{
                top: `${140 + pairIdx * 25}px`,
                zIndex: pairIdx + 1,
            }}
        >
            {pair.map((item, idx) => (
                <motion.div
                    key={idx}
                    style={{ scale, opacity }}
                    className="w-full md:w-1/2"
                >
                    <div className="p-10 lg:p-12 h-full bg-[#fafafa] dark:bg-[#1E293B] rounded-[60px] border border-gray-100 dark:border-gray-600/30 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] transition-all duration-700 hover:border-red-500/30 group relative overflow-hidden">
                        {/* Interactive Border Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="w-16 h-16 rounded-3xl bg-white dark:bg-white/5 group-hover:bg-red-500 flex items-center justify-center transition-all duration-700 shadow-sm group-hover:shadow-red-500/30">
                                <item.icon className="text-red-500 group-hover:text-black transition-colors duration-500" size={32} />
                            </div>
                            <span className={`${headingFont} text-5xl font-black text-gray-200/50 dark:text-white/[0.02] group-hover:text-red-500/10 transition-colors duration-700`}>
                                0{pairIdx * 2 + idx + 1}
                            </span>
                        </div>

                        <div className="relative z-10">
                            <h3 className={`${headingFont} text-3xl font-black text-gray-900 dark:text-white mb-5 tracking-tight group-hover:text-red-500 transition-colors duration-500`}>
                                {item.title}
                            </h3>
                            <p className={`text-base text-gray-500 dark:text-gray-400 leading-relaxed font-normal ${bengaliClass}`}>
                                {item.description}
                            </p>
                        </div>

                        <div className="mt-10 h-[2px] w-full bg-gray-100 dark:bg-white/5 overflow-hidden relative z-10">
                            <div className="h-full w-0 group-hover:w-full bg-red-500 transition-all duration-1000 origin-left" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const AboutFeatures = () => {
    const { language, t } = useLanguage();
    const sectionRef = useRef(null);

    const bengaliClass = language === "bn" ? "font-hind-siliguri" : "font-poppins";
    const headingFont = "font-outfit";

    const features = [
        {
            icon: LuGraduationCap,
            title: language === 'bn' ? t("aboutPage.vision.list.1") : 'Expert Mentorship',
            description: language === 'bn' ? t("aboutPage.vision.desc") : 'Direct access to high-impact workflows and professional support systems.',
            color: 'teal'
        },
        {
            icon: LuRocket,
            title: language === 'bn' ? t("aboutPage.history.items.2024.title") : 'Project Mastery',
            description: language === 'bn' ? t("aboutPage.history.items.2024.desc") : 'Direct access to high-impact workflows and professional support systems.',
            color: 'blue'
        },
        {
            icon: LuShield,
            title: language === 'bn' ? t("aboutPage.vision.list.3") : 'Elite Certification',
            description: 'Direct access to high-impact workflows and professional support systems.',
            color: 'purple'
        },
        {
            icon: LuHeadphones,
            title: language === 'bn' ? t("aboutPage.vision.list.4") : 'Priority Support',
            description: 'Direct access to high-impact workflows and professional support systems.',
            color: 'orange'
        },
        {
            icon: LuInfinity,
            title: language === 'bn' ? t("aboutPage.vision.list.5") : 'Edge Curriculum',
            description: 'Direct access to high-impact workflows and professional support systems.',
            color: 'teal'
        },
        {
            icon: LuTrophy,
            title: language === 'bn' ? t("aboutPage.vision.list.6") : 'Career Engine',
            description: 'Direct access to high-impact workflows and professional support systems.',
            color: 'blue'
        },
    ];

    const pairs = [];
    for (let i = 0; i < features.length; i += 2) {
        pairs.push(features.slice(i, i + 2));
    }

    return (
        <section ref={sectionRef} className="bg-white dark:bg-[#1E293B] relative transition-colors duration-700 py-16 lg:py-24">
            <div className="container mx-auto px-4 lg:px-16 relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                    {/* Sticky Sidebar */}
                    <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit mb-16 lg:mb-0">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-[1px] w-8 bg-red-500" />
                                <span className={`text-[10px] font-black tracking-[0.4em] uppercase text-red-600 dark:text-red-400 ${headingFont}`}>
                                    {language === 'bn' ? t("aboutPage.vision.badge") : 'Why Choose Us'}
                                </span>
                            </div>

                            <h2 className={`${headingFont} text-4xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[0.95] tracking-tight mb-8`}>
                                THE <span className="text-red-500 italic font-serif">SYSTEM</span> <br />
                                FOR YOUR <br />
                                SUCCESS
                            </h2>
                            <p className={`text-base lg:text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-normal ${bengaliClass} mb-10 max-w-xs`}>
                                {language === 'bn'
                                    ? t("aboutPage.vision.desc")
                                    : 'A performance-engineered curriculum designed to transform ambition into success.'
                                }
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                className="group/btn relative flex items-center gap-4 pl-2 pr-6 py-2 bg-gray-50 dark:bg-white/5 rounded-full transition-all duration-500 border border-gray-100 dark:border-white/10 backdrop-blur-md shadow-lg shadow-black/5"
                            >
                                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-black shadow-lg">
                                    <LuTrophy size={18} />
                                </div>
                                <div className="text-left">
                                    <span className={`block text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 leading-none mb-1`}>
                                        Join the elite
                                    </span>
                                    <span className={`${headingFont} block text-sm font-black text-gray-900 dark:text-white leading-none`}>
                                        10,000+ Alumni
                                    </span>
                                </div>
                                <div className="ml-2 w-6 h-6 rounded-full border border-gray-200 dark:border-white/20 flex items-center justify-center group-hover/btn:bg-red-500 group-hover/btn:border-red-500 transition-all duration-500">
                                    <LuArrowRight className="text-gray-400 dark:text-gray-500 group-hover/btn:text-black transition-colors" size={12} />
                                </div>
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Stacking Features Column */}
                    <div className="lg:col-span-8 flex flex-col gap-32 lg:gap-40 pb-40">
                        {pairs.map((pair, pairIdx) => (
                            <FeaturePair
                                key={pairIdx}
                                pair={pair}
                                pairIdx={pairIdx}
                                headingFont={headingFont}
                                bengaliClass={bengaliClass}
                                language={language}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutFeatures;
