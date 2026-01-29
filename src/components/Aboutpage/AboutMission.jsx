"use client";

import React, { useRef } from 'react';
import { LuTarget, LuEye, LuHeart, LuStar, LuZap } from 'react-icons/lu';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';

const AboutMission = () => {
    const { language, t } = useLanguage();
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const yMove = useTransform(scrollYProgress, [0, 1], [40, -40]);

    const bengaliClass = language === "bn" ? "font-hind-siliguri" : "font-poppins";
    const headingFont = "font-outfit";

    const cards = [
        { icon: LuTarget, title: language === 'bn' ? t("aboutPage.mission.cards.mission") : 'Mission', desc: language === 'bn' ? t("aboutPage.mission.cards.missionDesc") : 'Forging the definitive path for elite digital talent.', number: '01' },
        { icon: LuEye, title: language === 'bn' ? t("aboutPage.mission.cards.vision") : 'Vision', desc: language === 'bn' ? t("aboutPage.mission.cards.visionDesc") : 'Redefining the standard of modern IT education.', number: '02' },
        { icon: LuHeart, title: language === 'bn' ? t("aboutPage.mission.cards.values") : 'Values', desc: language === 'bn' ? t("aboutPage.mission.cards.valuesDesc") : 'Radical transparency and industrial-scale innovation.', number: '03' },
        { icon: LuStar, title: language === 'bn' ? t("aboutPage.mission.cards.usp") : 'USP', desc: language === 'bn' ? t("aboutPage.mission.cards.uspDesc") : 'Hyper-practical training with 24/7 dedicated support.', number: '04' },
    ];

    return (
        <section ref={sectionRef} className="py-24 lg:py-48 relative overflow-hidden bg-white dark:bg-[#1E293B] transition-colors duration-700">
            {/* Professional Grid Background */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />

            <div className="container mx-auto px-4 lg:px-16 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-start">
                    {/* Header Section */}
                    <div className="lg:w-[45%]">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/5 border border-blue-500/10 rounded-full mb-8">
                                <LuZap className="text-blue-500" size={14} />
                                <span className={`text-[10px] font-black tracking-[0.3em] uppercase text-blue-600 dark:text-blue-400 ${headingFont}`}>{language === 'bn' ? t("aboutPage.mission.foundation") : 'Foundation'}</span>
                            </div>

                            <h2 className={`${headingFont} text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[0.9] mb-10 tracking-tight`}>
                                {language === 'bn' ? (t("aboutPage.mission.title").split(' ')[0]) : 'THE'} <span className="text-red-500 italic font-serif">{language === 'bn' ? (t("aboutPage.mission.title").split(' ')[1] || '') : 'CORE'}</span> <br />
                                {language === 'bn' ? (t("aboutPage.mission.title").split(' ').slice(2).join(' ')) : 'PRINCIPLES'} <br />
                                {language === 'bn' ? '' : 'OF SUCCESS'}
                            </h2>

                            <p className={`text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-12 max-w-lg ${bengaliClass}`}>
                                {language === 'bn'
                                    ? t("aboutPage.mission.desc")
                                    : 'We are architecting a future where skill meets strategy. Jayed Uddin is more than an academy; it\'s your partner in professional evolution.'
                                }
                            </p>

                            <div className="relative p-10 rounded-[40px] bg-gray-900 dark:bg-white text-white dark:text-black shadow-2xl overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-1000" />
                                <h4 className={`${headingFont} text-4xl font-black mb-4 relative z-10`}>{language === 'bn' ? t("aboutPage.mission.yearsExperience").split(' ')[0] : '5+ Years'}</h4>
                                <p className={`text-sm font-bold opacity-60 uppercase tracking-widest relative z-10 ${headingFont}`}>{language === 'bn' ? t("aboutPage.mission.yearsExperience").split(' ').slice(1).join(' ') : 'Of Industrial Experience'}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Cards Grid Section */}
                    <div className="lg:w-[55%] grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 lg:pt-16">
                        {cards.map((card, index) => (
                            <motion.div
                                key={index}
                                style={{ y: index % 2 === 0 ? 0 : yMove }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="relative">
                                    <div className={`absolute -top-10 -left-6 text-7xl font-black text-gray-100 dark:text-white/[0.02] select-none ${headingFont}`}>
                                        {card.number}
                                    </div>
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-8 group-hover:border-red-500 transition-colors duration-500 shadow-sm">
                                            <card.icon className="text-red-500" size={28} />
                                        </div>
                                        <h3 className={`${headingFont} text-2xl font-black mb-4 text-gray-900 dark:text-white tracking-tight`}>
                                            {card.title}
                                        </h3>
                                        <p className={`text-base leading-relaxed text-gray-500 dark:text-gray-400 font-medium ${bengaliClass}`}>
                                            {card.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMission;
