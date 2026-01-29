"use client";

import React, { useRef } from 'react';
import { LuQuote, LuLinkedin, LuTwitter, LuGlobe, LuExternalLink } from 'react-icons/lu';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';

const AboutFounder = () => {
    const { language, t } = useLanguage();
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

    const bengaliClass = language === "bn" ? "font-hind-siliguri" : "font-poppins";
    const headingFont = "font-outfit";

    return (
        <section ref={sectionRef} className="bg-gray-50 dark:bg-[#050505] overflow-hidden transition-colors duration-700">
            <div className="container mx-auto px-4 lg:px-16">
                <motion.div
                    style={{ scale }}
                    className="relative rounded-[40px] overflow-hidden bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 shadow-xl"
                >
                    <div className="grid lg:grid-cols-12 items-stretch">
                        {/* Executive Profile Section */}
                        <div className="lg:col-span-5 relative bg-gray-100/50 dark:bg-[#080808] overflow-hidden flex items-center justify-center p-6 lg:p-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, x: -30 }}
                                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="relative w-full aspect-[4/5] max-w-[380px] group"
                            >
                                {/* Multi-layered Ambient Glow */}
                                <div className="absolute -inset-10 bg-red-500/15 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                                {/* Founder Image - Floating Professional Frame */}
                                <div className="relative w-full h-full rounded-[35px] border-[5px] border-white dark:border-[#111] shadow-xl overflow-hidden">
                                    <img
                                        src="/images/ahsahullahshaon.jpg"
                                        alt="Ahsanullah Shaon - Founder & CEO"
                                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110"
                                    />
                                    {/* Glass Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-700" />

                                    {/* Floating Professional Label */}
                                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                        <div className="inline-block bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2 rounded-xl">
                                            <p className={`text-white text-[9px] font-black tracking-[0.3em] uppercase ${headingFont}`}>CEO & VISIONARY</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Experience Badge - Professional Placement */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                    animate={{ y: [0, -10, 0] }}
                                    className="absolute -top-4 -right-4 px-6 py-4 bg-white dark:bg-[#111] rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 z-20"
                                >
                                    <div className="relative text-center">
                                        <span className={`${headingFont} text-3xl font-black text-red-500 block leading-none`}>15+</span>
                                        <span className={`text-[8px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mt-1.5 block ${bengaliClass}`}>
                                            {language === 'bn' ? t("aboutPage.founder.experience") : 'Years Experience'}
                                        </span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Executive Content Section */}
                        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center relative bg-white dark:bg-[#0a0a0a]">
                            {/* Decorative Background Quote */}
                            <motion.div
                                initial={{ opacity: 0, rotate: -10 }}
                                whileInView={{ opacity: 0.03, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5 }}
                                className="absolute top-8 right-8 pointer-events-none"
                            >
                                <LuQuote className="text-gray-900 dark:text-white" size={150} />
                            </motion.div>

                            <div className="relative z-10">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="inline-flex items-center gap-3 mb-6"
                                >
                                    <div className="h-[2px] w-10 bg-red-500" />
                                    <span className={`text-[10px] font-black tracking-[0.4em] uppercase text-red-600 dark:text-red-400 ${headingFont}`}>{language === 'bn' ? t("aboutPage.founder.perspective") : "Founder's Perspective"}</span>
                                </motion.div>

                                <motion.h3
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.1 }}
                                    className={`${headingFont} text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-[1] mb-8 tracking-tight`}
                                >
                                    {language === 'bn' ? t("aboutPage.founder.title").split(' ')[0] : 'EMPOWERING'} <br />
                                    {language === 'bn' ? '' : 'THE '} <span className="text-red-500 italic font-serif">{language === 'bn' ? t("aboutPage.founder.title").split(' ').slice(1).join(' ') : 'FUTURE'}</span> {language === 'bn' ? '' : 'OF'} <br />
                                    {language === 'bn' ? '' : 'DIGITAL MASTERY'}
                                </motion.h3>

                                <div className="space-y-5 mb-10">
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className={`text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-normal ${bengaliClass}`}
                                    >
                                        {language === 'bn'
                                            ? t("aboutPage.founder.quote1")
                                            : '"Our objective isn\'t just to teach code—it\'s to engineer a problem-solving mindset that dominates on a global scale."'
                                        }
                                    </motion.p>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                        className={`text-sm lg:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg font-normal ${bengaliClass}`}
                                    >
                                        {language === 'bn'
                                            ? t("aboutPage.founder.quote2")
                                            : 'We believe that boundless potential lies within every individual. ejobs it exists to serve as the high-performance catalyst for that potential.'
                                        }
                                    </motion.p>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="flex flex-wrap items-center gap-10"
                                >
                                    <div>
                                        <h4 className={`${headingFont} text-2xl font-black text-gray-900 dark:text-white`}>
                                            {language === 'bn' ? t("aboutPage.founder.name") : 'AHSANULLAH SHAON'}
                                        </h4>
                                        <p className="text-red-500 font-bold uppercase tracking-widest text-[9px] mt-1">{language === 'bn' ? t("aboutPage.founder.designation") : 'Founder & CEO, Ejobs IT Ltd'}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        {[LuLinkedin, LuTwitter, LuGlobe].map((Icon, i) => (
                                            <motion.a
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: 0.5 + (i * 0.1) }}
                                                whileHover={{ y: -5, scale: 1.1 }}
                                                href="#"
                                                className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 border border-gray-100 dark:border-white/10 transition-all shadow-sm"
                                            >
                                                <Icon size={18} />
                                            </motion.a>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutFounder;
