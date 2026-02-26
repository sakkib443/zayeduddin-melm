"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "@/redux/blogSlice";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { FiClock, FiArrowRight, FiCalendar, FiTag } from "react-icons/fi";

const BlogSection = () => {
    const dispatch = useDispatch();
    const { blogList = [], loading } = useSelector((state) => state.blogs);
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    useEffect(() => {
        dispatch(fetchBlogs({ limit: 3 }));
    }, [dispatch]);

    const text = {
        bn: {
            badge: 'রিসোর্স লাইব্রেরি',
            title: 'রিসোর্স এন্ড লাইব্রেরি',
            viewAll: 'সব দেখুন',
            min: 'মিঃ',
        },
        en: {
            badge: 'Resource Library',
            title: 'Resource & Library',
            viewAll: 'View All',
            min: 'min',
        }
    };

    const tx = text[language] || text.en;

    return (
        <section className="py-16 md:py-24 bg-white dark:bg-[#020202] overflow-hidden">
            <div className="container mx-auto px-4 lg:px-16">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#021E14]/5 dark:bg-white/5 border border-[#021E14]/10 dark:border-white/10 text-[#021E14] dark:text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-4"
                        >
                            <FiTag size={12} />
                            {tx.badge}
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className={`text-3xl md:text-4xl lg:text-5xl font-bold text-[#021E14] dark:text-white leading-tight ${bengaliClass}`}
                        >
                            {tx.title}
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href="/resource-library"
                            className="group inline-flex items-center gap-2 text-[#021E14] dark:text-[#D4AF37] font-bold text-sm tracking-widest uppercase hover:gap-4 transition-all"
                        >
                            {tx.viewAll}
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Blog Grid - Same card design as Resource Library page */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="h-[450px] rounded-[2rem] bg-slate-100 dark:bg-white/5 animate-pulse"></div>
                        ))
                    ) : (
                        blogList.slice(0, 3).map((blog, index) => (
                            <motion.div
                                key={blog._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.12 }}
                            >
                                <Link href={blog.slug ? `/resource-library/${blog.slug}` : '#'} className="group block h-full">
                                    <div className="bg-white dark:bg-[#0d0d0d] rounded-[2rem] h-full overflow-hidden border border-slate-100 dark:border-white/5 hover:border-[#021E14]/20 dark:hover:border-[#D4AF37]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#021E14]/5 hover:-translate-y-2 flex flex-col">
                                        {/* Card Image */}
                                        <div className="relative h-64 overflow-hidden shrink-0">
                                            <Image
                                                src={blog.thumbnail || blog.image || "/images/placeholder.png"}
                                                alt={blog.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            {/* Date Badge */}
                                            <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 dark:bg-[#021E14]/90 backdrop-blur-md rounded-2xl flex flex-col items-center shadow-lg">
                                                <span className="text-lg font-bold text-[#021E14] dark:text-[#D4AF37] leading-none">
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
                                                    {blog.readingTime || 5} {tx.min}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-8 flex flex-col flex-1">
                                            <span className="inline-block px-3 py-1 rounded-lg bg-[#021E14]/5 dark:bg-white/5 text-[#021E14] dark:text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-4 border border-[#021E14]/10 dark:border-white/10 self-start">
                                                {blog.category?.name || 'Article'}
                                            </span>

                                            <h3 className={`text-xl font-bold text-[#021E14] dark:text-white group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 mb-4 leading-snug ${bengaliClass}`}>
                                                {blog.title}
                                            </h3>

                                            <p className={`text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6 flex-1 ${bengaliClass}`}>
                                                {blog.excerpt || blog.summary || blog.shortDescription || 'Read more about this interesting topic and gain new insights for your growth.'}
                                            </p>

                                            {/* Author Info & Read more */}
                                            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#021E14] dark:bg-[#D4AF37] flex items-center justify-center text-white text-xs font-bold overflow-hidden relative">
                                                        {blog.author?.avatar ? (
                                                            <Image src={blog.author.avatar} alt="Author" fill className="object-cover" />
                                                        ) : blog.author?.firstName?.[0] || 'A'}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                                                        {blog.author?.firstName || blog.author?.name || 'Zayed Uddin'}
                                                    </span>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-[#021E14] dark:text-white border border-slate-100 dark:border-white/5 group-hover:bg-[#021E14] group-hover:text-white transition-all duration-300">
                                                    <FiArrowRight size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>

            </div>
        </section>
    );
};

export default BlogSection;
