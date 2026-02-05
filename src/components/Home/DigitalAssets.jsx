"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchDesignTemplates, fetchDesignCategories } from "@/redux/designTemplateSlice";
import ProductCard from "@/components/sheard/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { LuSparkles } from "react-icons/lu";

const DigitalAssets = () => {
    const dispatch = useDispatch();
    const { items: templates = [], categories = [], loading } = useSelector((state) => state.designTemplates);
    const { language, t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState("all");

    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    useEffect(() => {
        dispatch(fetchDesignCategories());
        dispatch(fetchDesignTemplates({ limit: 6 }));
    }, [dispatch]);

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
        dispatch(fetchDesignTemplates({ category: categoryId, limit: 6 }));
    };

    return (
        <section className="py-16 bg-[#fafafa] dark:bg-[#050505] overflow-hidden">
            <div className="container mx-auto px-4 lg:px-16">
                {/* Section Header */}
                <div className="text-center mb-10 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#300000]/5 border border-[#300000]/10 mb-6"
                    >
                        <LuSparkles className="text-[#300000]" size={16} />
                        <span className="text-[10px] font-bold text-[#300000] uppercase tracking-[0.2em]">
                            {t("digitalAssets.title")}
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className={`text-3xl md:text-4xl lg:text-5xl font-bold text-[#300000] mb-4 ${bengaliClass}`}
                        style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                        {t("digitalAssets.title")}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className={`text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed ${bengaliClass}`}
                    >
                        {t("digitalAssets.subtitle")}
                    </motion.p>
                </div>

                {/* Categories Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    <button
                        onClick={() => handleCategoryChange("all")}
                        className={`px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm ${activeCategory === "all"
                            ? "bg-[#300000] text-white shadow-lg shadow-[#300000]/20"
                            : "bg-white dark:bg-white/5 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/10"
                            }`}
                    >
                        {t("digitalAssets.all")}
                    </button>

                    {categories
                        .filter(cat => cat.type === 'design-template')
                        .map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => handleCategoryChange(cat._id)}
                                className={`px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm ${activeCategory === cat._id
                                    ? "bg-[#300000] text-white shadow-lg shadow-[#300000]/20"
                                    : "bg-white dark:bg-white/5 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/10"
                                    }`}
                            >
                                {language === 'bn' ? cat.nameBn : cat.name}
                            </button>
                        ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            // Skeletons
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-white dark:bg-white/5 rounded-3xl h-[400px]"></div>
                            ))
                        ) : (
                            templates.map((template) => (
                                <motion.div
                                    key={template._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ProductCard product={template} type="design-template" />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* No Templates Message */}
                {!loading && templates.length === 0 && (
                    <div className="text-center py-20">
                        <p className={`text-slate-400 ${bengaliClass}`}>{t("digitalAssets.noAssets")}</p>
                    </div>
                )}
            </div>

            <style jsx global>{`
      `}</style>
        </section>
    );
};

export default DigitalAssets;
