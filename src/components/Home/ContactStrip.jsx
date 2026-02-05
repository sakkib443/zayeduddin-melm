"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const ContactStrip = () => {
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    return (
        <section className="py-8 bg-white dark:bg-[#080808] overflow-hidden border-y border-slate-50 dark:border-white/5">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-4"
                >
                    {/* Enquiry Button */}
                    <Link
                        href="/contact"
                        className={`inline-block px-10 py-4 bg-[#300000] text-white text-lg md:text-xl font-semibold rounded-full hover:bg-[#4a0000] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 ${bengaliClass}`}
                    >
                        {t("contactStrip.enquiry")}
                    </Link>

                    {/* Or Text */}
                    <div className="flex flex-col items-center mt-2">
                        <span className={`text-gray-500 font-medium ${bengaliClass}`}>
                            {t("contactStrip.or")}
                        </span>

                        {/* Call Text */}
                        <a
                            href="tel:+8801714117701"
                            className={`text-base md:text-lg font-bold text-gray-800 dark:text-gray-200 mt-1 hover:text-[#300000] transition-colors ${bengaliClass}`}
                        >
                            {t("contactStrip.call")}
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactStrip;
