"use client";

import React from "react";
import { motion } from "framer-motion";
import { LuBrain, LuAward, LuTarget, LuUsers } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const FeaturesBar = () => {
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const features = [
        {
            icon: LuBrain,
            title: language === 'bn' ? t("home_sections.learnEssential") : 'Learn The',
            subtitle: language === 'bn' ? t("home_sections.essentialSkills") : 'Essential Skills',
        },
        {
            icon: LuAward,
            title: language === 'bn' ? t("home_sections.earnCertificates") : 'Earn Certificates',
            subtitle: language === 'bn' ? t("home_sections.andDegrees") : 'And Degrees',
        },
        {
            icon: LuTarget,
            title: language === 'bn' ? t("home_sections.getReadyCareer") : 'Get Ready for The',
            subtitle: language === 'bn' ? t("home_sections.nextCareer") : 'Next Career',
        },
        {
            icon: LuUsers,
            title: language === 'bn' ? t("home_sections.masterAreas") : 'Master at',
            subtitle: language === 'bn' ? t("home_sections.differentAreas") : 'Different Areas',
        },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#0066CC] dark:bg-[#004C99] py-6"
        >
            <div className="container mx-auto px-4 lg:px-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="flex items-center gap-4 justify-center md:justify-start"
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            {/* Text */}
                            <div className={`text-white ${bengaliClass}`}>
                                <p className="text-sm font-medium leading-tight">
                                    {feature.title}
                                </p>
                                <p className="text-sm font-bold leading-tight">
                                    {feature.subtitle}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default FeaturesBar;
