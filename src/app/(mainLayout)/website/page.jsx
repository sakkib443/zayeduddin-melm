"use client";
import { API_URL } from '@/config/api';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LuGlobe,
    LuSearch,
    LuGrid3X3,
    LuChevronDown,
    LuSparkles
} from "react-icons/lu";
import ProductCard from "@/components/sheard/ProductCard";
import { useLanguage } from "@/context/LanguageContext";

const WebsitePage = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [websites, setWebsites] = useState([]);
    const [categories, setCategories] = useState([]);

    // Colors
    const colors = {
        darkRed: "#300000",
        gold: "#D4AF37",
    };

    // Fetch websites from API
    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/websites?limit=50`);
                const data = await res.json();
                if (data.success) {
                    setWebsites(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching websites:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCats = async () => {
            try {
                const res = await fetch(`${API_URL}/categories?type=website`);
                const data = await res.json();
                if (data.success && data.data) {
                    setCategories(data.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchWebsites();
        fetchCats();
    }, []);

    const filteredWebsites = websites.filter(site => {
        const matchesSearch = (site.title || site.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" ||
            site.category?._id === selectedCategory ||
            site.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryCount = (categoryId) => {
        if (categoryId === 'all') return websites.length;
        return websites.filter(s => (s.category?._id || s.category) === categoryId).length;
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#020202]">
            {/* Header Section */}
            <header className="pt-24 pb-6 bg-white dark:bg-[#020202]">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className={`text-4xl md:text-7xl font-script italic text-[#300000] mb-4 ${bengaliClass}`}>
                            {language === 'bn' ? 'প্রিমিয়াম ওয়েবসাইট' : 'Premium Websites'}
                        </h1>
                        <p className={`text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10 ${bengaliClass}`}>
                            {language === 'bn'
                                ? 'আপনার ব্যবসার জন্য আধুনিক এবং প্রফেশনাল রেডি-টু-ইউজ ওয়েবসাইট। স্টার্টআপ থেকে করপোরেট সলিউশন - সব এক জায়গায়।'
                                : 'Modern and professional ready-to-use websites for your business. From startups to corporate solutions - all in one place.'}
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto mb-16 px-4">
                            <div className="relative group">
                                <LuSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#300000] transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={language === 'bn' ? 'ওয়েবসাইট খুঁজুন...' : 'Search websites...'}
                                    className="w-full pl-16 pr-8 py-5 md:py-6 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-full shadow-lg shadow-black/5 outline-none focus:ring-4 focus:ring-[#300000]/5 transition-all text-slate-800 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-50 dark:border-white/5 pb-8 lg:px-16">
                            <div className="flex flex-wrap items-center gap-3">
                                {/* All Button */}
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${selectedCategory === "all"
                                        ? "bg-[#300000] text-white shadow-lg shadow-[#300000]/20"
                                        : "bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-slate-100"
                                        }`}
                                >
                                    <LuGrid3X3 size={14} />
                                    <span>{language === 'bn' ? 'সব ওয়েবসাইট' : 'All Websites'}</span>
                                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] ${selectedCategory === "all" ? "bg-white/20" : "bg-slate-200 dark:bg-white/10"
                                        }`}>{websites.length}</span>
                                </button>

                                {/* Dynamic Categories */}
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => setSelectedCategory(cat._id)}
                                        className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${selectedCategory === cat._id
                                            ? "bg-[#300000] text-white shadow-lg shadow-[#300000]/20"
                                            : "bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-slate-100"
                                            }`}
                                    >
                                        <LuGlobe size={14} />
                                        <span>{language === 'bn' ? (cat.nameBn || cat.name) : cat.name.toUpperCase()}</span>
                                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] ${selectedCategory === cat._id ? "bg-white/20" : "bg-slate-200 dark:bg-white/10"
                                            }`}>{getCategoryCount(cat._id)}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center gap-3 px-6 py-2.5 bg-slate-50 dark:bg-white/5 text-slate-500 rounded-full text-xs font-bold hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                                    <span>Most Popular</span>
                                    <LuChevronDown size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Content Section */}
            <main className="pb-24 pt-4">
                <div className="container mx-auto px-4 lg:px-16">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="animate-pulse bg-slate-50 dark:bg-white/5 rounded-3xl h-[400px]"></div>
                            ))}
                        </div>
                    ) : filteredWebsites.length === 0 ? (
                        <div className="text-center py-24">
                            <LuGlobe className="mx-auto text-slate-200 mb-6" size={64} />
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No websites found</h3>
                            <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredWebsites.map((site) => (
                                <ProductCard
                                    key={site._id}
                                    product={site}
                                    type="website"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
                .font-script {
                    font-family: 'Dancing Script', cursive;
                }
            `}</style>
        </div>
    );
};

export default WebsitePage;
