"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSoftware } from '@/redux/softwareSlice';
import { fetchWebsites } from '@/redux/websiteSlice';
import ProductCard from '@/components/sheard/ProductCard';
import { useLanguage } from '@/context/LanguageContext';
import { LuCpu, LuGlobe, LuSparkles, LuArrowRight } from 'react-icons/lu';
import { motion } from 'framer-motion';
import Link from 'next/link';

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Skeleton Component
const ProductCardSkeleton = () => (
    <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl p-4 border border-gray-100 dark:border-white/5 space-y-4">
        <div className="h-48 rounded-xl bg-gray-200 dark:bg-white/5 animate-pulse"></div>
        <div className="space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/5 rounded animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-white/5 rounded animate-pulse"></div>
        </div>
        <div className="flex justify-between items-center pt-2">
            <div className="h-8 w-24 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-white/5 rounded-full animate-pulse"></div>
        </div>
    </div>
);

import { API_BASE_URL } from '@/config/api';

const API_URL = API_BASE_URL;

const DigitalProducts = () => {
    const dispatch = useDispatch();
    const { softwareList = [], loading: softwareLoading } = useSelector((state) => state.software || {});
    const { websiteList = [], loading: websiteLoading } = useSelector((state) => state.websites || {});
    const { language, t } = useLanguage();
    const [activeType, setActiveType] = useState('software');
    const [content, setContent] = useState(null);
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    useEffect(() => {
        dispatch(fetchSoftware());
        dispatch(fetchWebsites());

        const fetchContent = async () => {
            try {
                const res = await fetch(`${API_URL}/design/digitalProducts`);
                const data = await res.json();
                if (data.success && data.data?.digitalProductsContent) {
                    setContent(data.data.digitalProductsContent);
                }
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };
        fetchContent();
    }, [dispatch]);

    // Get dynamic text functions
    const getBadge = () => {
        if (content?.badge) {
            return language === 'bn' ? (content.badge.textBn || t("concerns.digitalProducts")) : (content.badge.text || 'Digital Products');
        }
        return language === 'bn' ? t("concerns.digitalProducts") : 'Digital Products';
    };

    const getHeading = () => {
        if (content?.heading) {
            const text1 = language === 'bn' ? content.heading.text1Bn : content.heading.text1;
            const highlight = language === 'bn' ? content.heading.highlightBn : content.heading.highlight;
            return { text1: text1 || '', highlight: highlight || '' };
        }
        return language === 'bn'
            ? { text1: t("concerns.premium"), highlight: t("concerns.digitalProductsHighlight") }
            : { text1: 'Premium ', highlight: 'Digital Products' };
    };

    const getDescription = () => {
        if (content?.description) {
            return language === 'bn'
                ? (content.description.textBn || t("concerns.digitalProductsDesc"))
                : (content.description.text || 'Explore our collection of premium software and ready-made websites designed to scale your business.');
        }
        return language === 'bn' ? t("concerns.digitalProductsDesc") : 'Explore our collection of premium software and ready-made websites designed to scale your business.';
    };

    const getSoftwareTab = () => {
        if (content?.tabs) {
            return language === 'bn' ? (content.tabs.softwareBn || t("navbar.software")) : (content.tabs.software || 'Software');
        }
        return language === 'bn' ? t("navbar.software") : 'Software';
    };

    const getWebsiteTab = () => {
        if (content?.tabs) {
            return language === 'bn' ? (content.tabs.websiteBn || t("navbar.website")) : (content.tabs.website || 'Websites');
        }
        return language === 'bn' ? t("navbar.website") : 'Websites';
    };

    const heading = getHeading();

    const displayList = activeType === 'software' ? softwareList.slice(0, 4) : websiteList.slice(0, 4);
    const isLoading = activeType === 'software' ? softwareLoading : websiteLoading;

    return (
        <section className="relative py-24 overflow-hidden">

            {/* Background Elements - Static */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Static Circles */}
                <div className="absolute top-20 right-[10%] w-72 h-72 bg-gradient-to-br from-[#F79952]/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-[10%] w-80 h-80 bg-gradient-to-br from-[#E62D26]/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#F79952]/5 to-[#E62D26]/5 rounded-full blur-3xl"></div>

                {/* Static Geometric Shapes */}
                <div className="absolute top-32 left-[15%] w-16 h-16 border-2 border-[#F79952]/20 rounded-xl"></div>
                <div className="absolute top-1/4 right-[8%] w-12 h-12 border-2 border-[#E62D26]/20 rounded-full"></div>
                <div className="absolute bottom-1/4 left-[8%] w-20 h-20 border-2 border-[#F79952]/15 rounded-2xl"></div>
                <div className="absolute bottom-32 right-[20%] w-8 h-8 bg-[#E62D26]/10 rounded-lg"></div>

                {/* Dots Pattern */}
                <div className="absolute top-40 right-[5%] flex flex-col gap-2 opacity-30">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-2">
                            {[...Array(3)].map((_, j) => (
                                <div key={j} className="w-1.5 h-1.5 bg-[#F79952] rounded-full"></div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-40 left-[5%] flex flex-col gap-2 opacity-30">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-2">
                            {[...Array(3)].map((_, j) => (
                                <div key={j} className="w-1.5 h-1.5 bg-[#E62D26] rounded-full"></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-16 relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-3 mb-5 px-5 py-2.5 rounded-full bg-white dark:bg-black/50 border border-[#F79952]/30 dark:border-[#F79952]/20 shadow-sm backdrop-blur-md">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F79952]/20 to-amber-500/20 flex items-center justify-center">
                            <LuSparkles className="text-[#F79952]" size={14} />
                        </div>
                        <span className={`text-xs font-black text-[#F79952] uppercase tracking-[0.2em] ${bengaliClass}`}>
                            {getBadge()}
                        </span>
                    </div>

                    {/* Title */}
                    <div className="overflow-hidden mb-5">
                        <motion.h2
                            className={`text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight ${bengaliClass}`}
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {heading.text1}<span className="text-[#F79952]">{heading.highlight}</span>
                        </motion.h2>
                    </div>

                    <motion.p
                        className={`text-gray-500 dark:text-gray-400 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed ${bengaliClass}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {getDescription()}
                    </motion.p>
                </motion.div>

                {/* Tab Filters */}
                <motion.div
                    className="flex justify-center mb-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="inline-flex bg-white dark:bg-[#0d0d0d] rounded-2xl p-2 border border-gray-200 dark:border-white/10 shadow-sm">
                        <button
                            onClick={() => setActiveType('software')}
                            className={`group relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeType === 'software'
                                ? 'bg-[#E62D26]/10 text-[#E62D26]'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                                }`}
                        >
                            <LuCpu size={18} />
                            <span className={bengaliClass}>{getSoftwareTab()}</span>
                            {activeType === 'software' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#E62D26] to-[#c41e18] rounded-b-xl"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveType('website')}
                            className={`group relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeType === 'website'
                                ? 'bg-[#F79952]/10 text-[#F79952]'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                                }`}
                        >
                            <LuGlobe size={18} />
                            <span className={bengaliClass}>{getWebsiteTab()}</span>
                            {activeType === 'website' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#F79952] to-[#fb923c] rounded-b-xl"></div>
                            )}
                        </button>
                    </div>

                    {/* Count Badge */}
                    <div className="hidden sm:flex items-center gap-2 ml-4 px-4 py-2 bg-white dark:bg-[#0d0d0d] rounded-xl border border-gray-200 dark:border-white/10">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span className={`text-xs font-bold text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                            {isLoading ? (
                                <span className="animate-pulse w-8 h-4 bg-gray-200 rounded"></span>
                            ) : (
                                <span>
                                    {displayList.length}+ {activeType === 'software'
                                        ? (language === 'bn' ? t("concerns.readyScripts") : 'Ready Scripts')
                                        : (language === 'bn' ? t("concerns.premiumTemplates") : 'Premium Templates')}
                                </span>
                            )}
                        </span>
                    </div>
                </motion.div>

                {/* Products Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {isLoading ? (
                        // Show Skeletons when loading
                        [...Array(4)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))
                    ) : (
                        // Show Data when loaded
                        displayList.map((item, index) => (
                            <motion.div
                                key={item._id}
                                variants={cardVariants}
                                className="transition-transform duration-300 hover:-translate-y-2 h-full"
                            >
                                <ProductCard product={item} type={activeType} />
                            </motion.div>
                        ))
                    )}

                    {/* Only show "Not Found" if NOT loading AND list is empty */}
                    {!isLoading && displayList.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white dark:bg-[#0d0d0d] rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10">
                            <LuSparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className={`text-gray-400 font-medium ${bengaliClass}`}>
                                {language === 'bn' ? t("concerns.noProducts") : 'No products found in this category yet.'}
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    className="relative bg-white dark:bg-[#0d0d0d] rounded-[2rem] p-8 lg:p-12 border border-gray-200 dark:border-white/10 overflow-hidden"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    {/* Decorative Corner */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#F79952] to-[#fb923c] opacity-10"></div>
                    <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#E62D26] to-[#c41e18] opacity-10"></div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-center sm:text-left">
                            <h3 className={`text-xl lg:text-2xl font-black text-gray-900 dark:text-white mb-2 ${bengaliClass}`}>
                                {language === 'bn' ? t("concerns.readyToLaunch") : 'Ready to Launch Your Business?'}
                            </h3>
                            <p className={`text-gray-500 dark:text-gray-400 font-medium ${bengaliClass}`}>
                                {language === 'bn' ? t("concerns.allAssetsDesc") : 'Discover all our digital assets in one place'}
                            </p>
                        </div>

                        <Link
                            href={activeType === 'software' ? '/software' : '/website'}
                            className={`group relative bg-white dark:bg-[#0d0d0d] rounded-2xl px-8 py-4 border border-gray-200 dark:border-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center gap-4 ${bengaliClass}`}
                        >
                            <span className="font-bold text-gray-900 dark:text-white">
                                {language === 'bn'
                                    ? t("concerns.exploreAll")
                                    : `Explore All ${activeType === 'software' ? 'Software' : 'Websites'}`}
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-[#F79952]/10 flex items-center justify-center transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#F79952] group-hover:to-[#fb923c]">
                                <LuArrowRight size={18} className="text-[#F79952] transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5" />
                            </div>
                            {/* Bottom Accent Line */}
                            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#F79952] to-[#fb923c] group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DigitalProducts;
