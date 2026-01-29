"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LuGraduationCap, LuCode, LuGlobe, LuWrench, LuArrowRight } from 'react-icons/lu';
import { motion } from 'framer-motion';



// Animation variants - Entry only, no scroll effects
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
};

const HomeCategory = () => {
    const [stats, setStats] = useState(null);
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    // Fetch real stats from database
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/stats/dashboard`);
                const data = await res.json();
                if (data.success && data.data) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    // Get dynamic count for each category
    const getCategoryCount = (id) => {
        if (!stats?.breakdown) return '0';

        switch (id) {
            case 'courses':
                return stats.breakdown.courses || 0;
            case 'software':
                return stats.breakdown.software || 0;
            case 'websites':
                return stats.breakdown.websites || 0;
            case 'tools':
                return stats.breakdown.software || 0;
            default:
                return 0;
        }
    };

    const categories = [
        {
            id: 'courses',
            icon: LuGraduationCap,
            title: language === 'bn' ? t("navbar.courses") : 'Courses',
            subtitle: language === 'bn' ? t("home_sections.professionalSkills") : 'Professional Skills',
            itemLabel: language === 'bn' ? t("hero_home.coursesSuffix") : 'Courses',
            color: 'teal',
            href: '/courses'
        },
        {
            id: 'software',
            icon: LuCode,
            title: language === 'bn' ? t("navbar.software") : 'Software',
            subtitle: language === 'bn' ? t("home_sections.premiumScripts") : 'Premium Scripts',
            itemLabel: language === 'bn' ? t("home_sections.readyItems") : 'Items',
            color: 'orange',
            href: '/software'
        },
        {
            id: 'websites',
            icon: LuGlobe,
            title: language === 'bn' ? t("navbar.website") : 'Websites',
            subtitle: language === 'bn' ? t("homeCategory.categories.diplomaSub") : 'Premium Templates',
            itemLabel: language === 'bn' ? t("home_sections.readyItems") : 'Templates',
            color: 'teal',
            href: '/website'
        },
        {
            id: 'tools',
            icon: LuWrench,
            title: language === 'bn' ? t("home_sections.categoryHighlight") : 'Tools',
            subtitle: language === 'bn' ? t("homeCategory.exploreCourses") : 'Productivity Tools',
            itemLabel: language === 'bn' ? t("home_sections.readyItems") : 'Tools',
            color: 'orange',
            href: '/tools'
        }
    ];

    const getColorClasses = (color) => {
        if (color === 'teal') {
            return {
                gradient: 'from-[#E62D26] to-[#c41e18]',
                light: 'bg-[#E62D26]/5',
                text: 'text-[#E62D26]',
                border: 'border-[#E62D26]/15',
                shadow: 'shadow-[#E62D26]/10'
            };
        }
        return {
            gradient: 'from-[#F79952] to-[#fb923c]',
            light: 'bg-[#F79952]/5',
            text: 'text-[#F79952]',
            border: 'border-[#F79952]/15',
            shadow: 'shadow-[#F79952]/10'
        };
    };

    return (
        <section className='relative py-24 overflow-hidden'>

            {/* Background Elements - Static */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Static Circles */}
                <div className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-[#E62D26]/5 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-gradient-to-br from-[#F79952]/5 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#E62D26]/3 to-[#F79952]/3 rounded-full blur-3xl"></div>

                {/* Static Geometric Shapes */}
                <div className="absolute top-32 right-[15%] w-16 h-16 border-2 border-[#E62D26]/20 rounded-xl"></div>
                <div className="absolute top-1/4 left-[8%] w-12 h-12 border-2 border-[#F79952]/20 rounded-full"></div>
                <div className="absolute bottom-1/4 right-[8%] w-20 h-20 border-2 border-[#E62D26]/15 rounded-2xl"></div>
                <div className="absolute bottom-32 left-[20%] w-8 h-8 bg-[#F79952]/10 rounded-lg"></div>

                {/* Dots Pattern */}
                <div className="absolute top-40 left-[5%] flex flex-col gap-2 opacity-30">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-2">
                            {[...Array(3)].map((_, j) => (
                                <div key={j} className="w-1.5 h-1.5 bg-[#E62D26] rounded-full"></div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-40 right-[5%] flex flex-col gap-2 opacity-30">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-2">
                            {[...Array(3)].map((_, j) => (
                                <div key={j} className="w-1.5 h-1.5 bg-[#F79952] rounded-full"></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className='container mx-auto px-4 lg:px-16 relative z-10'>
                {/* Section Header - Entry Animation */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-3 mb-5 px-5 py-2.5 rounded-full bg-white dark:bg-black/50 border border-red-500/30 dark:border-red-500/20 shadow-sm backdrop-blur-md"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500/20 to-cyan-500/20 flex items-center justify-center">
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                        </div>
                        <span className={`text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-[0.2em] ${bengaliClass}`}>
                            {language === 'bn' ? t("home_sections.ourProducts") : 'Our Products'}
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        className={`text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-5 tracking-tight ${bengaliClass}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {language === 'bn'
                            ? <>{t("home_sections.browseByCategory")} <span className="text-primary">{t("home_sections.categoryHighlight")}</span> {t("home_sections.accordingTo")}</>
                            : <>Browse by <span className="text-primary">Category</span></>}
                    </motion.h2>

                    <motion.p
                        className={`text-gray-500 dark:text-gray-400 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed ${bengaliClass}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {language === 'bn'
                            ? t("home_sections.homeCategoryDesc")
                            : 'Explore our diverse categories to find exactly what you need. Courses, software, website templates, and productivity tools - all in one place.'}
                    </motion.p>
                </motion.div>

                {/* Categories Grid - Entry Animation with stagger */}
                <motion.div
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {categories.map((cat, index) => {
                        const Icon = cat.icon;
                        const colors = getColorClasses(cat.color);
                        const count = getCategoryCount(cat.id);

                        return (
                            <motion.div key={cat.id} variants={cardVariants}>
                                <Link
                                    href={cat.href}
                                    className="group relative bg-white dark:bg-[#0d0d0d] rounded-md p-8 border border-gray-200 dark:border-white/10 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden block hover:-translate-y-2"
                                >
                                    {/* Decorative Corner */}
                                    <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${colors.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                    {/* Card Inner Design Lines */}
                                    <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        {/* Icon with Ring */}
                                        <div className="relative mb-5">
                                            <div className={`w-16 h-16 ${colors.light} rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}>
                                                <Icon size={28} className={`${colors.text} transition-all duration-300`} />
                                            </div>
                                            {/* Decorative ring on hover */}
                                            <div className={`absolute inset-0 w-16 h-16 rounded-2xl border-2 ${colors.border} scale-100 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-500`}></div>
                                        </div>

                                        {/* Title */}
                                        <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gray-800 dark:group-hover:text-white transition-colors ${bengaliClass}`}>
                                            {cat.title}
                                        </h3>

                                        {/* Subtitle */}
                                        <p className={`text-sm text-gray-500 dark:text-gray-400 mb-4 ${bengaliClass}`}>
                                            {cat.subtitle}
                                        </p>

                                        {/* Bottom Row */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
                                            {/* Dynamic Items Count */}
                                            <span className={`text-sm font-semibold ${colors.text} ${bengaliClass}`}>
                                                {count}+ {cat.itemLabel}
                                            </span>

                                            {/* Arrow */}
                                            <div className={`w-8 h-8 rounded-lg ${colors.light} flex items-center justify-center transition-all duration-300 group-hover:bg-gradient-to-r group-hover:${colors.gradient}`}>
                                                <LuArrowRight size={16} className={`${colors.text} transition-all duration-300 group-hover:text-white`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Accent Line */}
                                    <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${colors.gradient} rounded-b-md group-hover:w-full transition-all duration-500`}></div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default HomeCategory;

