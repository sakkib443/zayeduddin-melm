"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "@/redux/blogSlice";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LuCalendar, LuUser, LuArrowRight, LuMessageSquare } from "react-icons/lu";

const BlogSection = () => {
    const dispatch = useDispatch();
    const { blogList = [], loading } = useSelector((state) => state.blogs);
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    useEffect(() => {
        dispatch(fetchBlogs({ limit: 3 }));
    }, [dispatch]);

    return (
        <section className="py-16 bg-white dark:bg-[#020202] overflow-hidden">
            <div className="container mx-auto px-4 lg:px-16">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1.5 rounded-full bg-[#300000]/5 text-[#300000] text-[10px] font-bold uppercase tracking-widest mb-4"
                        >
                            {t("blogSection.badge")}
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className={`text-3xl md:text-4xl lg:text-5xl font-bold text-[#300000] ${bengaliClass}`}
                            style={{ fontFamily: 'var(--font-poppins)' }}
                        >
                            {t("blogSection.title")}
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href="/blog"
                            className="group inline-flex items-center gap-2 text-[#300000] font-bold text-sm tracking-widest uppercase hover:gap-4 transition-all"
                        >
                            {t("blogSection.viewAll")}
                            <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        // Skeletons
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-slate-50 dark:bg-white/5 rounded-3xl h-[500px]"></div>
                        ))
                    ) : (
                        blogList.slice(0, 3).map((blog, index) => (
                            <motion.article
                                key={blog._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group flex flex-col h-full bg-[#fafafa] dark:bg-white/5 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/10 hover:shadow-2xl hover:shadow-[#300000]/5 hover:border-[#300000]/10 transition-all duration-500"
                            >
                                {/* Image Wrapper */}
                                <div className="relative h-64 w-full overflow-hidden shrink-0 p-4">
                                    <Link href={`/blog/${blog.slug}`} className="block h-full w-full relative overflow-hidden rounded-[2rem]">
                                        <Image
                                            src={blog.thumbnail || blog.image || "/images/placeholder.png"}
                                            alt={blog.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Date Badge */}
                                        <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl flex flex-col items-center shadow-lg">
                                            <span className="text-xl font-bold text-[#300000] leading-none">
                                                {new Date(blog.createdAt).getDate()}
                                            </span>
                                            <span className="text-[10px] font-bold text-[#300000] uppercase tracking-tighter opacity-70">
                                                {new Date(blog.createdAt).toLocaleString('default', { month: 'short' })}
                                            </span>
                                        </div>
                                    </Link>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <span className="px-3 py-1 bg-white dark:bg-white/10 rounded-full border border-slate-100 dark:border-white/10 text-[#D4AF37]">
                                            {language === 'bn' ? (blog.category?.nameBn || blog.category?.name || t("blogSection.category")) : (blog.category?.name || t("blogSection.category"))}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <LuMessageSquare className="text-[#300000]" size={14} />
                                            {blog.commentsCount || 0}
                                        </span>
                                    </div>

                                    <Link href={`/blog/${blog.slug}`} className="mb-3 block">
                                        <h3 className={`text-xl font-bold text-slate-800 dark:text-white leading-snug line-clamp-2 hover:text-[#300000] transition-colors ${bengaliClass}`}>
                                            {blog.title}
                                        </h3>
                                    </Link>

                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">
                                        {language === 'bn' ? (blog.summaryBn || blog.shortDescriptionBn || blog.summary || blog.shortDescription || t("blogSection.summaryFallback")) : (blog.summary || blog.shortDescription || t("blogSection.summaryFallback"))}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white dark:border-white/10 shadow-sm">
                                                <Image
                                                    src={blog.author?.profileImage || "/images/placeholder.png"}
                                                    alt={blog.author?.name || "Author"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                                                {language === 'bn' ? (blog.author?.nameBn || blog.author?.name || t("blogSection.author")) : (blog.author?.name || t("blogSection.author"))}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-[#300000] dark:text-white border border-slate-100 dark:border-white/10 hover:bg-[#300000] hover:text-white transition-all duration-300"
                                        >
                                            <LuArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))
                    )}
                </div>

            </div>
        </section>
    );
};

export default BlogSection;
