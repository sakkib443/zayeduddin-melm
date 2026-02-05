"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LuArrowRight } from "react-icons/lu";

const CTASection = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    return (
        <section className="py-12 bg-white dark:bg-[#020202]">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto bg-[#F9F7F3] dark:bg-white/5 p-8 md:p-14 rounded-[2.5rem] border border-amber-100/50 dark:border-white/10"
                >
                    <h2 className={`text-2xl md:text-4xl font-bold text-[#300000] mb-4 ${bengaliClass}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                        {language === 'bn'
                            ? 'আপনার শেখার যাত্রা শুরু করতে প্রস্তুত?'
                            : 'Ready to Start Your Learning Journey?'}
                    </h2>
                    <p className={`text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed ${bengaliClass}`}>
                        {language === 'bn'
                            ? 'হাজার হাজার সফল ছাত্রের সাথে যোগ দিন এবং আজই আপনার কর্মজীবন পরিবর্তন করুন।'
                            : 'Join thousands of successful students and transform your career today.'}
                    </p>
                    <Link
                        href="/courses"
                        className={`inline-flex items-center gap-2 px-10 py-4 bg-[#300000] text-white font-bold rounded-xl hover:bg-[#4a0000] transition-all shadow-xl hover:-translate-y-1 ${bengaliClass}`}
                    >
                        {language === 'bn' ? 'কোর্সগুলো দেখুন' : 'Explore Courses'}
                        <LuArrowRight />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
