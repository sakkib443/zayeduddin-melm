"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LuBrain,
    LuPalette,
    LuCode,
    LuMegaphone,
    LuFilm,
    LuServer,
    LuUsers,
    LuGraduationCap,
    LuChevronRight
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const TopCategories = () => {
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const categories = [
        {
            icon: LuGraduationCap,
            title: t("topCategories.trainingTitle"),
            subtitle: t("topCategories.trainingSubtitle"),
            href: '/courses',
            iconBg: 'bg-[#300000]',
            borderColor: 'border-l-[#300000]',
        },
        {
            icon: LuPalette,
            title: t("topCategories.graphicTitle"),
            subtitle: t("topCategories.graphicSubtitle"),
            href: '/design-template',
            iconBg: 'bg-[#D4AF37]',
            borderColor: 'border-l-[#D4AF37]',
        },
        {
            icon: LuPalette,
            title: t("topCategories.uiuxTitle"),
            subtitle: t("topCategories.uiuxSubtitle"),
            href: '/design-template',
            iconBg: 'bg-[#300000]',
            borderColor: 'border-l-[#300000]',
        },
        {
            icon: LuCode,
            title: t("topCategories.websiteTitle"),
            subtitle: t("topCategories.websiteSubtitle"),
            href: '/website',
            iconBg: 'bg-[#D4AF37]',
            borderColor: 'border-l-[#D4AF37]',
        },
    ];

    return (
        <section className="py-8 md:py-10 bg-[#f8f9fa] dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-4 lg:px-16">
                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <Link href={category.href}>
                                <div className={`bg-white dark:bg-gray-900 rounded-xl p-4 border-l-4 ${category.borderColor} shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col cursor-pointer group`}>
                                    {/* Top Section */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            {/* Icon */}
                                            <div className={`w-10 h-10 rounded-xl ${category.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                                <category.icon className="w-5 h-5 text-white" />
                                            </div>

                                            {/* Text */}
                                            <div>
                                                <h3 className={`font-semibold text-gray-800 dark:text-white text-sm ${bengaliClass}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                                                    {category.title}
                                                </h3>
                                                <p className={`text-[11px] text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                                                    {category.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="text-gray-300 dark:text-gray-600 group-hover:text-red-500 transition-colors">
                                            <LuChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>

                                    {/* Bottom Links */}
                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                                        <span
                                            className={`text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:hover:text-gray-300 transition-colors ${bengaliClass}`}
                                        >
                                            {t("topCategories.exploreMore")}
                                        </span>
                                        <span
                                            className={`text-sm font-medium text-[#300000] group-hover:text-red-600 transition-colors ${bengaliClass}`}
                                        >
                                            {t("topCategories.viewAll")}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopCategories;
