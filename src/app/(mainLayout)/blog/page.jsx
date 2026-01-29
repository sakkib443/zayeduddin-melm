'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    FiClock,
    FiTrendingUp,
    FiBookOpen,
    FiArrowRight,
    FiCalendar,
    FiChevronLeft,
    FiChevronRight,
    FiFacebook,
    FiTwitter,
    FiInstagram,
    FiYoutube,
    FiLinkedin,
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

    // Translations
    const t = {
        bn: {
            popular: '????????',
            recent: '??????????',
            editorsPick: '????????? ?????',
            trending: '?????????',
            aboutUs: '?????? ????????',
            aboutDesc: '???? ?????????, ?????? ??? ?????????? ???????? ???????? ???????? ???? ???? ?????? ?????? ??? ??????? ???? ???? ????? ?????? ????',
            popularPosts: '???????? ?????',
            followUs: '?????? ??? ????',
            noBlogsFound: '???? ???? ?????? ??????',
            comingSoon: '?????? ???? ???????? ????!',
            min: '?????',
            heroTitle: '????',
            heroSubtitle: '?????????, ?????? ??? ?????????? ???????? ?????? ???? ???????? ?????',
        },
        en: {
            popular: 'Popular',
            recent: 'Recent',
            editorsPick: "Editor's Pick",
            trending: 'Trending',
            aboutUs: 'About Us',
            aboutDesc: 'We create quality content about technology, design, and career. Our goal is to share the best knowledge with you.',
            popularPosts: 'Popular Posts',
            followUs: 'Follow Us',
            noBlogsFound: 'No blogs found',
            comingSoon: 'New content coming soon!',
            min: 'min',
            heroTitle: 'Blog',
            heroSubtitle: 'Read our best articles about technology, design and career',
        }
    };

    const text = t[language] || t.bn;

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                let url = `${API_BASE_URL}/blogs?status=published&page=${currentPage}&limit=9`;

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
    }, [currentPage]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-[#E62D26]/30 border-t-[#E62D26] rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">

            {/* Clean Hero Section */}
            <section className="relative py-12 lg:py-16 overflow-hidden bg-white dark:bg-[#020202]">
                {/* Subtle Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-[15%] w-[400px] h-[400px] bg-gradient-to-br from-red-500/15 to-cyan-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-[15%] w-[350px] h-[350px] bg-gradient-to-br from-[#F79952]/10 to-amber-500/5 rounded-full blur-3xl"></div>
                    {/* Subtle Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.015)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                </div>

                <div className="container mx-auto px-4 lg:px-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        {/* Simple Badge */}
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
                            <FiBookOpen className="text-red-500" size={14} />
                            <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
                                {language === 'bn' ? '????' : 'Blog'}
                            </span>
                        </div>

                        {/* Title - Smaller */}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                            {language === 'bn' ? '????? ? ' : 'Knowledge & '}
                            <span className="text-red-500">{language === 'bn' ? '??????????' : 'Inspiration'}</span>
                        </h1>

                        {/* Description - Compact */}
                        <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
                            {text.heroSubtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 lg:px-16 py-8">

                {/* Featured Section - Main Featured Post + Popular/Recent Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

                    {/* Main Featured Post - Image Top, Content Below */}
                    <div className="lg:col-span-2 h-full">
                        {featuredBlogs[0] || blogs[0] ? (
                            <Link href={`/blog/${(featuredBlogs[0] || blogs[0]).slug}`} className="group block h-full">
                                <div className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/10 h-full flex flex-col">
                                    {/* Image */}
                                    <div className="relative h-[350px] overflow-hidden">
                                        {(featuredBlogs[0] || blogs[0]).thumbnail ? (
                                            <Image
                                                src={(featuredBlogs[0] || blogs[0]).thumbnail}
                                                alt={(featuredBlogs[0] || blogs[0]).title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-red-600 to-cyan-700" />
                                        )}
                                        {/* Category Badge on Image */}
                                        <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-wide">
                                            {(featuredBlogs[0] || blogs[0]).category?.name || 'Featured'}
                                        </span>
                                    </div>

                                    {/* Content Below Image */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        {/* Title */}
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-red-500 transition-colors line-clamp-2">
                                            {(featuredBlogs[0] || blogs[0]).title}
                                        </h2>

                                        {/* Excerpt */}
                                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
                                            {(featuredBlogs[0] || blogs[0]).excerpt || 'Read our latest featured article...'}
                                        </p>

                                        {/* Author & Date */}
                                        <div className="flex items-center gap-4 text-sm pt-4 border-t border-gray-100 dark:border-white/10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                                                    {(featuredBlogs[0] || blogs[0]).author?.firstName?.[0] || 'A'}
                                                </div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">{(featuredBlogs[0] || blogs[0]).author?.firstName}</span>
                                            </div>
                                            <span className="text-gray-300 dark:text-gray-600">�</span>
                                            <span className="text-gray-500 dark:text-gray-400">{formatDate((featuredBlogs[0] || blogs[0]).publishedAt || (featuredBlogs[0] || blogs[0]).createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="h-full min-h-[400px] rounded-2xl bg-gray-200 dark:bg-slate-800 flex items-center justify-center">
                                <FiBookOpen className="text-gray-400 dark:text-slate-500" size={48} />
                            </div>
                        )}
                    </div>

                    {/* Popular/Recent Sidebar */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-5 min-h-[400px] flex flex-col">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-5">
                            <button
                                onClick={() => setActiveTab('popular')}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'popular'
                                    ? 'bg-red-500 text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                    }`}
                            >
                                {text.popular}
                            </button>
                            <button
                                onClick={() => setActiveTab('recent')}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'recent'
                                    ? 'bg-red-500 text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                    }`}
                            >
                                {text.recent}
                            </button>
                        </div>

                        {/* Posts List - Equal Height Cards with Excerpt */}
                        <div className="flex-1 flex flex-col">
                            {(activeTab === 'popular' ? popularBlogs : blogs).slice(0, 4).map((blog, index) => (
                                <Link key={blog._id} href={`/blog/${blog.slug}`} className={`group flex-1 flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${index !== 3 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}>
                                    <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                        {blog.thumbnail ? (
                                            <Image
                                                src={blog.thumbnail}
                                                alt={blog.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-red-100 to-cyan-100 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                                                <FiBookOpen className="text-red-400 dark:text-slate-500" size={18} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <h4 className="font-semibold text-gray-800 dark:text-white text-sm leading-snug line-clamp-1 group-hover:text-red-500 transition-colors">
                                            {blog.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                            {blog.excerpt ? `${blog.excerpt.substring(0, 60)}...` : 'Read this article to learn more about this topic...'}
                                        </p>
                                        <p className="text-xs text-red-500 font-medium mt-1.5">
                                            {formatDate(blog.publishedAt || blog.createdAt)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Blog Cards Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                        {language === 'bn' ? '??? ????????' : 'All Articles'}
                    </h2>
                </div>

                {/* Blog Grid */}
                {blogs.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                        <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-2xl flex items-center justify-center">
                            <FiBookOpen className="text-red-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{text.noBlogsFound}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{text.comingSoon}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(activeTab === 'popular' ? popularBlogs : blogs).map((blog, index) => (
                            <motion.div
                                key={blog._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group"
                            >
                                <Link href={`/blog/${blog.slug}`} className="block">
                                    <div className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 hover:border-red-500/30 dark:hover:border-red-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-2">
                                        {/* Image Container */}
                                        <div className="relative h-52 overflow-hidden">
                                            {blog.thumbnail ? (
                                                <Image
                                                    src={blog.thumbnail}
                                                    alt={blog.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-red-500/20 via-cyan-500/10 to-red-500/5 dark:from-red-500/10 dark:via-white/5 dark:to-cyan-500/5 flex items-center justify-center">
                                                    <FiBookOpen className="text-red-400 dark:text-red-500/50" size={40} />
                                                </div>
                                            )}
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            {/* Category Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1.5 rounded-lg bg-white/90 dark:bg-black/60 backdrop-blur-md text-xs font-bold text-gray-800 dark:text-white border border-white/20">
                                                    {blog.category?.name || (language === 'bn' ? '????' : 'Blog')}
                                                </span>
                                            </div>

                                            {/* Reading Time Badge */}
                                            <div className="absolute top-4 right-4">
                                                <span className="px-3 py-1.5 rounded-lg bg-red-500/90 backdrop-blur-md text-xs font-bold text-white flex items-center gap-1.5">
                                                    <FiClock size={12} />
                                                    5 {text.min}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            {/* Meta Info */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-red-500/30">
                                                    {blog.author?.firstName?.[0] || 'A'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                        {blog.author?.firstName || 'Author'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatDate(blog.publishedAt || blog.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-500 transition-colors duration-300 line-clamp-2 mb-3 leading-snug">
                                                {blog.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-5">
                                                {blog.excerpt || 'Click to read more about this interesting topic...'}
                                            </p>

                                            {/* Read More */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
                                                <span className="text-sm font-semibold text-red-500 group-hover:text-red-600 transition-colors flex items-center gap-2">
                                                    {language === 'bn' ? '??? ?????' : 'Read More'}
                                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                                                </span>
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <FiTrendingUp size={14} />
                                                    <span className="text-xs font-medium">{blog.views || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-14">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:bg-red-500 hover:border-red-500 hover:text-white transition-all shadow-sm"
                        >
                            <FiChevronLeft size={20} />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-12 h-12 rounded-xl font-bold text-sm transition-all ${currentPage === page
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                    : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:border-red-500 hover:text-white'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:bg-red-500 hover:border-red-500 hover:text-white transition-all shadow-sm"
                        >
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
}

