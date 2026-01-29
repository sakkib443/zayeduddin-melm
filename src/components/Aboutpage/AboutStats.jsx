"use client";

import React, { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useScroll } from 'framer-motion';

const AboutStats = () => {
    const { language, t } = useLanguage();
    const sectionRef = useRef(null);

    const stats = [
        {
            key: 'students',
            target: language === 'bn' ? t("aboutPage.stats.studentsVal") : '10,000+',
            label: language === 'bn' ? t("aboutPage.stats.students") : 'Active Students',
        },
        {
            key: 'courses',
            target: language === 'bn' ? t("aboutPage.stats.coursesVal") : '250+',
            label: language === 'bn' ? t("aboutPage.stats.courses") : 'Premium Courses',
        },
        {
            key: 'instructors',
            target: language === 'bn' ? t("aboutPage.stats.expertsVal") : '325+',
            label: language === 'bn' ? t("aboutPage.stats.experts") : 'Expert Instructors',
        },
        {
            key: 'countries',
            target: language === 'bn' ? t("aboutPage.stats.successRateVal") : '415+',
            label: language === 'bn' ? t("aboutPage.stats.successRate") : 'Worldwide Impact',
        },
    ];

    const bengaliClass = language === "bn" ? "font-hind-siliguri" : "font-poppins";
    const headingFont = "font-outfit";

    return (
        <section ref={sectionRef} className="bg-white dark:bg-[#1E293B] transition-colors duration-700 relative py-16 lg:py-24">
            <div className="container mx-auto px-4 lg:px-16 relative z-10">
                {/* Minimal Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-[1px] w-8 bg-red-500" />
                            <span className={`text-[10px] font-black tracking-[0.4em] uppercase text-red-600 dark:text-red-400 ${headingFont}`}>
                                {language === 'bn' ? t("aboutPage.stats.analyticsBadge") : 'Impact Analytics'}
                            </span>
                        </div>
                        <h2 className={`${headingFont} text-4xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[0.95] tracking-tight`}>
                            {language === 'bn' ? t("aboutPage.stats.storyNumbers") : 'THE STORY'} <br />
                            {language === 'bn' ? '' : <><span className="text-red-500 italic font-serif text-5xl lg:text-7xl">NUMBERS</span></>}
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`text-gray-500 dark:text-gray-400 leading-relaxed font-normal ${bengaliClass} max-w-sm`}
                    >
                        {language === 'bn'
                            ? t("aboutPage.stats.statDesc")
                            : 'We reflect growth through consistent impact and professional excellence, establishing a global standard for digital education.'
                        }
                    </motion.p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-gray-100 dark:border-white/5">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.key}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`p-10 lg:p-12 border-l border-b ${index % 2 === 1 ? 'border-r md:border-r-0' : ''} ${index >= 4 ? 'lg:border-b-0' : ''} lg:border-b-0 border-gray-100 dark:border-white/5 group relative overflow-hidden`}
                        >
                            {/* Sharp Hover Effect */}
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                            <h4 className={`${headingFont} text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter group-hover:text-red-500 transition-colors duration-500`}>
                                {stat.target}
                            </h4>
                            <p className={`text-[10px] lg:text-[11px] font-black tracking-[0.2em] uppercase text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-500 ${bengaliClass}`}>
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Refined Media Component */}
                <div className="mt-20 lg:mt-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative rounded-[60px] overflow-hidden aspect-[16/9] lg:aspect-[21/9] bg-gray-100 dark:bg-white/5 group shadow-2xl"
                    >
                        <img
                            src="/images/aboutah.jpg"
                            alt="Our Story"
                            className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-red-500/90 backdrop-blur-md flex items-center justify-center shadow-2xl relative mb-10 group/play cursor-pointer"
                            >
                                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
                                <div className="w-0 h-0 border-y-[15px] border-y-transparent border-l-[24px] border-l-black ml-2 relative z-10" />
                            </motion.div>

                            <h3 className={`${headingFont} text-2xl lg:text-4xl font-black text-white tracking-tight uppercase`}>
                                Experience the <span className="text-red-500">Journey</span>
                            </h3>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutStats;
