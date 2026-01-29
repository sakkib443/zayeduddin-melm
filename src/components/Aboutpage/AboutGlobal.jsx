"use client";

import React, { useRef } from 'react';
import { LuNetwork, LuCheck, LuUsers, LuTrendingUp } from 'react-icons/lu';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';

const AboutGlobal = () => {
    const { language, t } = useLanguage();
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const xMove = useTransform(scrollYProgress, [0, 1], [-50, 50]);

    const bengaliClass = language === "bn" ? "font-hind-siliguri" : "font-poppins";
    const headingFont = "font-outfit";

    const cards = [
        {
            icon: LuCheck,
            title: 'Elite Quality',
            description: language === 'bn' ? t("aboutPage.values.qualityContentDesc") : 'Ensuring the highest industrial standards.',
            color: 'teal'
        },
        {
            icon: LuUsers,
            title: '10K+ Community',
            description: language === 'bn' ? t("aboutPage.values.accessibilityDesc") : 'Vibrant and supportive learner network.',
            color: 'gray'
        },
        {
            icon: LuTrendingUp,
            title: 'Career Growth',
            description: language === 'bn' ? t("aboutPage.values.studentFirstDesc") : 'Direct pathway to professional success.',
            color: 'gray'
        },
        {
            icon: LuNetwork,
            title: 'Modern Reach',
            description: language === 'bn' ? t("aboutPage.values.innovationDesc") : 'Scalable digital education architecture.',
            color: 'teal'
        }
    ];

    return (
        <section ref={sectionRef} className="bg-gray-50 dark:bg-[#050505] relative overflow-hidden transition-colors duration-700">
            {/* Background Decorative Tech Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-40">
                <motion.div
                    style={{ x: xMove }}
                    className="absolute top-1/2 left-0 w-full h-[400px] border-y border-red-500/10 -translate-y-1/2 flex items-center justify-around overflow-hidden"
                >
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="w-[1px] h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent" />
                    ))}
                </motion.div>
            </div>

            <div className="container mx-auto px-4 lg:px-16 relative z-10">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    {/* Text Section */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-red-500/10 rounded-2xl">
                                    <LuNetwork className="text-red-500" size={24} />
                                </div>
                                <span className={`text-sm font-black tracking-[0.3em] text-red-600 dark:text-red-400 uppercase ${headingFont}`}>
                                    {language === 'bn' ? t("aboutPage.values.badge") : 'OUR ECOSYSTEM'}
                                </span>
                            </div>

                            <h2 className={`${headingFont} text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[0.9] mb-10`}>
                                BUILT FOR <br />
                                <span className="text-red-500 italic font-serif">PROFESSIONAL</span> <br />
                                EXCELLENCE
                            </h2>

                            <p className={`text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-normal mb-12 max-w-xl ${bengaliClass}`}>
                                {language === 'bn'
                                    ? t("aboutPage.vision.desc")
                                    : 'We have architected a professional ecosystem where students discover their peak potential. Our goal is to set the new standard for digital mastery.'
                                }
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                {['Industry Leaders', 'Elite Support', 'Project Driven', 'Future Proof'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        <span className={`text-sm font-bold text-gray-900 dark:text-gray-300 ${headingFont}`}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {cards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`p-10 rounded-[50px] border transition-all duration-500 hover:-translate-y-3 ${card.color === 'teal'
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-2xl'
                                    : 'bg-white dark:bg-white/5 text-gray-900 dark:text-white border-gray-100 dark:border-white/10 hover:border-red-500/30'
                                    }`}
                            >
                                <card.icon className={`${card.color === 'teal' ? 'text-red-400 dark:text-red-600' : 'text-red-500'} mb-8`} size={40} />
                                <h3 className={`${headingFont} text-2xl font-black mb-4 tracking-tight`}>
                                    {card.title}
                                </h3>
                                <p className={`text-sm leading-relaxed font-normal opacity-70 ${bengaliClass}`}>
                                    {card.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutGlobal;
