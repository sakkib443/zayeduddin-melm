'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiClock,
    FiTrendingUp,
    FiBookOpen,
    FiArrowRight,
    FiCalendar,
    FiChevronLeft,
    FiChevronRight,
    FiUser,
    FiTag,
    FiSearch
} from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogPage() {
    const { language } = useLanguage();
    const [blogs, setBlogs] = useState([]);
    const [featuredBlogs, setFeaturedBlogs] = useState([]);
    const [popularBlogs, setPopularBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState('popular');
    const [searchTerm, setSearchTerm] = useState('');

    const bengaliClass = language === 'bn' ? 'hind-siliguri' : '';

    // Translations
    const t = {
        bn: {
            blog: 'ব্লগ',
            popular: 'জনপ্রিয়',
            recent: 'সাম্প্রতিক',
            editorsPick: 'সম্পাদকের পছন্দ',
            trending: 'ট্রেন্ডিং',
            aboutUs: 'আমাদের সম্পর্কে',
            popularPosts: 'জনপ্রিয় পোস্ট',
            followUs: 'আমাদের অনুসরণ করুন',
            noBlogsFound: 'কোনো ব্লগ পাওয়া যায়নি',
            comingSoon: 'নতুন কন্টেন্ট শীঘ্রই আসছে!',
            min: 'মিঃ',
            knowledge: 'জ্ঞান ও ',
            inspiration: 'অনুপ্রেরণা',
            allArticles: 'সব নিবন্ধ',
            readMore: 'আরও পড়ুন',
            searchPlaceholder: 'ব্লগ খুঁজুন...',
            heroSubtitle: 'প্রযুক্তি, ডিজাইন এবং ক্যারিয়ার সম্পর্কে আমাদের সেরা নিবন্ধগুলি পড়ুন',
        },
        en: {
            blog: 'Blog',
            popular: 'Popular',
            recent: 'Recent',
            editorsPick: "Editor's Pick",
            trending: 'Trending',
            aboutUs: 'About Us',
            popularPosts: 'Popular Posts',
            followUs: 'Follow Us',
            noBlogsFound: 'No blogs found',
            comingSoon: 'New content coming soon!',
            min: 'min',
            knowledge: 'Knowledge & ',
            inspiration: 'Inspiration',
            allArticles: 'All Articles',
            readMore: 'Read More',
            searchPlaceholder: 'Search articles...',
            heroSubtitle: 'Explore our latest insights on technology, design, and professional growth.',
        }
    };

    const text = t[language] || t.en;

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                let url = `${API_BASE_URL}/blogs?status=published&page=${currentPage}&limit=9`;
                if (searchTerm) {
                    url += `&searchTerm=${searchTerm}`;
                }

                const res = await fetch(url);
                const data = await res.json();
                if (data.success) {
                    setBlogs(data.data || []);
                    setTotalPages(data.meta?.totalPages || 1);
                }

                const featuredRes = await fetch(`${API_BASE_URL}/blogs/featured?limit=5`);
                const featuredData = await featuredRes.json();
                if (featuredData.success) setFeaturedBlogs(featuredData.data || []);

                const popularRes = await fetch(`${API_BASE_URL}/blogs/popular?limit=5`);
                const popularData = await popularRes.json();
                if (popularData.success) setPopularBlogs(popularData.data || []);
            } catch (error) {
                console.error('Failed to fetch blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [currentPage, searchTerm]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] transition-colors duration-300">

            {/* --- Premium Hero Section --- */}
            <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#300000]/5 dark:bg-[#300000]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D4AF37]/5 dark:bg-[#D4AF37]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="container mx-auto px-4 lg:px-16 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#300000]/5 dark:bg-white/5 border border-[#300000]/10 dark:border-white/10 text-[#300000] dark:text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-6">
                                <FiTag size={12} />
                                {text.blog}
                            </span>

                            <h1 className={`text-4xl md:text-[50px] font-bold text-[#300000] dark:text-white mb-8 leading-[1.1] tracking-tight ${bengaliClass}`}>
                                {text.knowledge}
                                <span className="text-[#D4AF37] block md:inline">{text.inspiration}</span>
                            </h1>

                            <p className={`text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed ${bengaliClass}`}>
                                {text.heroSubtitle}
                            </p>

                            {/* Modern Search Bar */}
                            <div className="relative max-w-xl mx-auto group">
                                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#300000] dark:group-focus-within:text-[#D4AF37] transition-colors">
                                    <FiSearch size={20} />
                                </div>
                                <input
                                    type="text"
                                    placeholder={text.searchPlaceholder}
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className={`w-full pl-16 pr-8 py-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#300000]/20 dark:focus:ring-[#D4AF37]/20 shadow-xl shadow-black/5 text-slate-800 dark:text-white transition-all ${bengaliClass}`}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 lg:px-16 pb-20">
                {/* --- Featured & Sidebar Section --- */}
                {!searchTerm && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
                        {/* Main Featured Component */}
                        <div className="lg:col-span-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                {featuredBlogs[0] || blogs[0] ? (
                                    <Link href={`/blog/${(featuredBlogs[0] || blogs[0]).slug}`} className="group block">
                                        <div className="relative h-[400px] md:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl">
                                            {/* Main Image */}
                                            <Image
                                                src={(featuredBlogs[0] || blogs[0]).thumbnail || "/images/blog-placeholder.jpg"}
                                                alt={(featuredBlogs[0] || blogs[0]).title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#300000] via-[#300000]/40 to-transparent"></div>

                                            {/* Content Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                                <span className="inline-block px-4 py-1.5 rounded-lg bg-[#D4AF37] text-[#300000] text-xs font-bold uppercase tracking-wider mb-6">
                                                    {(featuredBlogs[0] || blogs[0]).category?.name || 'Featured'}
                                                </span>
                                                <h2 className={`text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight group-hover:text-[#D4AF37] transition-colors duration-300 ${bengaliClass}`}>
                                                    {(featuredBlogs[0] || blogs[0]).title}
                                                </h2>
                                                <div className="flex items-center gap-6 text-white/80 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] p-0.5">
                                                            <div className="w-full h-full rounded-full bg-[#300000] flex items-center justify-center text-[#D4AF37] font-bold overflow-hidden relative">
                                                                {(featuredBlogs[0] || blogs[0]).author?.avatar ? (
                                                                    <Image src={(featuredBlogs[0] || blogs[0]).author.avatar} alt="Author" fill className="object-cover" />
                                                                ) : (featuredBlogs[0] || blogs[0]).author?.firstName?.[0] || 'A'}
                                                            </div>
                                                        </div>
                                                        <span className="font-bold">{(featuredBlogs[0] || blogs[0]).author?.firstName} {(featuredBlogs[0] || blogs[0]).author?.lastName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FiCalendar className="text-[#D4AF37]" />
                                                        <span>{formatDate((featuredBlogs[0] || blogs[0]).publishedAt || (featuredBlogs[0] || blogs[0]).createdAt)}</span>
                                                    </div>
                                                    <div className="hidden md:flex items-center gap-2">
                                                        <FiClock className="text-[#D4AF37]" />
                                                        <span>{(featuredBlogs[0] || blogs[0]).readingTime || 5} {text.min}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="h-[500px] rounded-[2.5rem] bg-slate-100 dark:bg-white/5 animate-pulse"></div>
                                )}
                            </motion.div>
                        </div>

                        {/* Sidebar Tabbed Posts */}
                        <div className="lg:col-span-4">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="h-full"
                            >
                                <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-6 h-full shadow-xl shadow-black/5">
                                    <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-2xl mb-8">
                                        <button
                                            onClick={() => setActiveTab('popular')}
                                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'popular'
                                                ? 'bg-[#300000] text-white shadow-lg'
                                                : 'text-slate-500 hover:text-[#300000] dark:text-slate-400 dark:hover:text-[#D4AF37]'
                                                }`}
                                        >
                                            {text.popular}
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('recent')}
                                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'recent'
                                                ? 'bg-[#300000] text-white shadow-lg'
                                                : 'text-slate-500 hover:text-[#300000] dark:text-slate-400 dark:hover:text-[#D4AF37]'
                                                }`}
                                        >
                                            {text.recent}
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeTab}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-6"
                                            >
                                                {(activeTab === 'popular' ? popularBlogs : blogs).slice(0, 4).map((blog) => (
                                                    <Link key={blog._id} href={`/blog/${blog.slug}`} className="group flex items-center gap-4">
                                                        <div className="w-24 h-24 relative rounded-2xl overflow-hidden shrink-0 shadow-lg">
                                                            <Image
                                                                src={blog.thumbnail || "/images/blog-placeholder.jpg"}
                                                                alt={blog.title}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-1 block">
                                                                {blog.category?.name || 'Article'}
                                                            </span>
                                                            <h4 className={`text-sm md:text-base font-bold text-[#300000] dark:text-white leading-snug line-clamp-2 group-hover:text-[#D4AF37] transition-colors ${bengaliClass}`}>
                                                                {blog.title}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                                                <FiCalendar size={12} />
                                                                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* --- Main Blog Grid --- */}
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h2 className={`text-2xl md:text-3xl font-bold text-[#300000] dark:text-white ${bengaliClass}`}>
                        {searchTerm ? `${text.searchPlaceholder} (${blogs.length})` : text.allArticles}
                    </h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-[450px] rounded-[2rem] bg-slate-100 dark:bg-white/5 animate-pulse"></div>
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10">
                        <div className="w-24 h-24 mx-auto mb-8 bg-[#300000]/5 dark:bg-[#D4AF37]/10 rounded-3xl flex items-center justify-center">
                            <FiBookOpen className="text-[#300000] dark:text-[#D4AF37]" size={40} />
                        </div>
                        <h3 className={`text-2xl font-bold text-[#300000] dark:text-white mb-3 ${bengaliClass}`}>{text.noBlogsFound}</h3>
                        <p className={`text-slate-500 dark:text-slate-400 ${bengaliClass}`}>{text.comingSoon}</p>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                    >
                        {blogs.map((blog) => (
                            <motion.div
                                key={blog._id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                <Link href={`/blog/${blog.slug}`} className="group block h-full">
                                    <div className="bg-white dark:bg-[#0d0d0d] rounded-[2rem] h-full overflow-hidden border border-slate-100 dark:border-white/5 hover:border-[#300000]/20 dark:hover:border-[#D4AF37]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#300000]/5 hover:-translate-y-2 flex flex-col">
                                        {/* Card Image */}
                                        <div className="relative h-64 overflow-hidden shrink-0">
                                            <Image
                                                src={blog.thumbnail || "/images/blog-placeholder.jpg"}
                                                alt={blog.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            {/* Date Badge */}
                                            <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 dark:bg-[#300000]/90 backdrop-blur-md rounded-2xl flex flex-col items-center shadow-lg">
                                                <span className="text-lg font-bold text-[#300000] dark:text-[#D4AF37] leading-none">
                                                    {new Date(blog.publishedAt || blog.createdAt).getDate()}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-500 dark:text-white uppercase tracking-tighter opacity-70">
                                                    {new Date(blog.publishedAt || blog.createdAt).toLocaleString('default', { month: 'short' })}
                                                </span>
                                            </div>
                                            {/* Reading Time */}
                                            <div className="absolute bottom-4 right-4">
                                                <span className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/10 uppercase tracking-widest">
                                                    <FiClock size={12} className="text-[#D4AF37]" />
                                                    {blog.readingTime || 5} {text.min}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-8 flex flex-col flex-1">
                                            <span className="inline-block px-3 py-1 rounded-lg bg-[#300000]/5 dark:bg-white/5 text-[#300000] dark:text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-4 border border-[#300000]/10 dark:border-white/10">
                                                {blog.category?.name || 'Article'}
                                            </span>

                                            <h3 className={`text-xl font-bold text-[#300000] dark:text-white group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 mb-4 leading-snug ${bengaliClass}`}>
                                                {blog.title}
                                            </h3>

                                            <p className={`text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6 flex-1 ${bengaliClass}`}>
                                                {blog.excerpt || 'Read more about this interesting topic and gain new insights for your growth.'}
                                            </p>

                                            {/* Author Info & Read more */}
                                            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#300000] dark:bg-[#D4AF37] flex items-center justify-center text-white text-xs font-bold overflow-hidden relative">
                                                        {blog.author?.avatar ? (
                                                            <Image src={blog.author.avatar} alt="Author" fill className="object-cover" />
                                                        ) : blog.author?.firstName?.[0] || 'A'}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                                                        {blog.author?.firstName || 'Zayed Uddin'}
                                                    </span>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-[#300000] dark:text-white border border-slate-100 dark:border-white/5 group-hover:bg-[#300000] group-hover:text-white transition-all duration-300">
                                                    <FiArrowRight size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* --- Pagination --- */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-20">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-[#300000] dark:text-white disabled:opacity-40 hover:bg-[#300000] hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-[#300000] transition-all duration-300 shadow-xl shadow-black/5"
                        >
                            <FiChevronLeft size={24} />
                        </button>

                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-14 h-14 rounded-2xl font-bold text-sm transition-all duration-300 ${currentPage === page
                                        ? 'bg-[#300000] text-white shadow-xl shadow-[#300000]/30 scale-110'
                                        : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:border-[#300000] hover:text-[#300000] dark:hover:text-[#D4AF37]'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-[#300000] dark:text-white disabled:opacity-40 hover:bg-[#300000] hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-[#300000] transition-all duration-300 shadow-xl shadow-black/5"
                        >
                            <FiChevronRight size={24} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
