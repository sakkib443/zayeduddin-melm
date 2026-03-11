"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FiUsers, FiBookOpen, FiDownload, FiCheckCircle, FiArrowDownCircle } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { API_URL } from "@/config/api";

const CounterItem = ({ icon: Icon, target, label, suffix = "+", delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView && target > 0) {
            let start = 0;
            const end = parseInt(target);
            const duration = 2000;
            const steps = 60;
            const increment = end / steps;

            let timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, duration / steps);
            return () => clearInterval(timer);
        }
    }, [isInView, target]);

    const bengaliClass = useLanguage().language === 'bn' ? 'hind-siliguri' : '';

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
            className="group relative p-8 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-[#021E14]/10 transition-all duration-500 overflow-hidden"
        >
            {/* Subtle background element */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#021E14]/5 dark:bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-[#021E14] to-[#500000] dark:from-[#D4AF37] dark:to-[#B8860B] flex items-center justify-center text-[#D4AF37] dark:text-[#021E14] shadow-xl group-hover:rotate-[10deg] transition-transform duration-300">
                    <Icon size={28} />
                </div>

                <div className="mb-2">
                    <span className="text-3xl md:text-4xl font-black text-[#021E14] dark:text-white tracking-tighter">
                        {count.toLocaleString()}
                    </span>
                    <span className="text-xl font-bold text-[#D4AF37] ml-0.5">{suffix}</span>
                </div>

                <p className={`text-[12px] font-normal text-slate-500 dark:text-white/60 uppercase tracking-[0.1em] ${bengaliClass}`}>
                    {label}
                </p>
            </div>
        </motion.div>
    );
};

const StatisticsBar = () => {
    const { language, t } = useLanguage();
    const bengaliClass = language === 'bn' ? 'hind-siliguri' : '';
    const [apiStats, setApiStats] = useState(null);

    // Fetch real-time stats from backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/stats/dashboard`);
                const data = await res.json();
                if (data.success && data.data) {
                    setApiStats(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        {
            icon: FiBookOpen,
            target: apiStats?.breakdown?.courses || 50,
            label: t("statisticsBar.totalCourses"),
            suffix: "+"
        },
        {
            icon: FiUsers,
            target: apiStats?.activeUsers || 5000,
            label: t("statisticsBar.totalStudents"),
            suffix: "+"
        },
        {
            icon: FiCheckCircle,
            target: apiStats?.breakdown?.enrollments || apiStats?.downloads || 3500,
            label: t("statisticsBar.totalEnrollment"),
            suffix: "+"
        },
        {
            icon: FiDownload,
            target: apiStats?.breakdown?.designTemplates || 1200,
            label: t("statisticsBar.totalTemplates"),
            suffix: "+"
        },
        {
            icon: FiArrowDownCircle,
            target: apiStats?.breakdown?.downloads || apiStats?.totalDownloads || 0,
            label: t("statisticsBar.totalDownloads"),
            suffix: "+"
        }
    ];

    return (
        <section className="py-20 bg-white dark:bg-[#050505]">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
                    {stats.map((stat, idx) => (
                        <CounterItem
                            key={idx}
                            icon={stat.icon}
                            target={stat.target}
                            label={stat.label}
                            suffix={stat.suffix}
                            delay={idx * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatisticsBar;
