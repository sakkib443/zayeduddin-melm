"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/providers/ThemeProvider";
import { API_URL } from "@/config/api";
import {
    LuShoppingCart,
    LuCheck,
    LuStar,
    LuShare2,
    LuShieldCheck,
    LuLayers,
    LuMaximize2,
    LuDownload,
    LuFileCode,
    LuSearch,
    LuHeart
} from "react-icons/lu";

// Loading Skeleton Component
const DetailSkeleton = () => (
    <div className="container mx-auto px-4 lg:px-16 py-12 animate-pulse">
        <div className="h-8 w-1/3 bg-slate-200 dark:bg-white/5 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-4">
                <div className="aspect-[4/3] bg-slate-200 dark:bg-white/5 rounded-2xl" />
                <div className="flex gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-24 h-24 bg-slate-200 dark:bg-white/5 rounded-xl" />
                    ))}
                </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
                <div className="h-10 w-3/4 bg-slate-200 dark:bg-white/5 rounded" />
                <div className="h-6 w-1/2 bg-slate-200 dark:bg-white/5 rounded" />
                <div className="h-24 w-full bg-slate-200 dark:bg-white/5 rounded" />
            </div>
        </div>
    </div>
);

const DesignTemplateDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { language } = useLanguage();
    const { isDark } = useTheme();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState("");
    const [isAdded, setIsAdded] = useState(false);
    const [activeTab, setActiveTab] = useState("description");

    // Colors
    const colors = {
        primary: "#300000",
        gold: "#D4AF37",
        bgLight: "#ffffff",
        bgDark: "#020202",
        surfaceLight: "#f8fafc",
        surfaceDark: "#0f0f0f"
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`${API_URL}/design-templates/${id}`);
                const data = await res.json();
                if (data.success) {
                    setTemplate(data.data);
                    setActiveImage(data.data.images?.[0] || data.data.image);
                }
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id]);

    const handleAddToCart = () => {
        if (!template) return;
        dispatch(addToCart({
            id: template._id,
            title: template.title,
            price: template.offerPrice || template.price,
            image: activeImage,
            type: "design-template"
        }));
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (loading) return <DetailSkeleton />;

    if (!template) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <LuSearch size={48} className="text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Template Not Found</h2>
            <Link href="/design-template" className="mt-4 text-[#D4AF37] hover:underline text-sm font-medium">
                Back to Templates
            </Link>
        </div>
    );

    // Calculate Pricing
    const hasDiscount = template.offerPrice && template.offerPrice > 0 && template.offerPrice < template.price;
    const currentPrice = hasDiscount ? template.offerPrice : template.price;
    const discountPercent = hasDiscount ? Math.round(((template.price - template.offerPrice) / template.price) * 100) : 0;

    return (
        <div className="min-h-screen bg-white dark:bg-[#020202] text-slate-800 dark:text-slate-200">
            {/* Breadcrumb Header */}
            <div className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="container mx-auto px-4 lg:px-16 py-4">
                    <nav className="flex items-center gap-2 text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">
                        <Link href="/" className="hover:text-[#300000] dark:hover:text-[#D4AF37] transition-colors">Home</Link>
                        <span className="opacity-40">/</span>
                        <Link href="/design-template" className="hover:text-[#300000] dark:hover:text-[#D4AF37] transition-colors">Templates</Link>
                        <span className="opacity-40">/</span>
                        <span className="text-slate-800 dark:text-white truncate max-w-[200px]">{template.title}</span>
                    </nav>
                </div>
            </div>

            <main className="container mx-auto px-4 lg:px-16 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* Left Column - Gallery */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-50 dark:bg-[#0a0a0a] rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl shadow-black/5 relative group mb-6"
                        >
                            <div className="relative aspect-[4/3] w-full">
                                <Image
                                    src={activeImage || "/images/placeholder.png"}
                                    alt={template.title}
                                    fill
                                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="absolute top-4 right-4 flex flex-col gap-3">
                                <button className="w-10 h-10 rounded-full bg-white dark:bg-black/50 backdrop-blur text-slate-600 dark:text-white flex items-center justify-center hover:bg-[#300000] hover:text-white transition-all shadow-lg border border-slate-100 dark:border-white/10" title="Preview">
                                    <LuMaximize2 size={16} />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-white dark:bg-black/50 backdrop-blur text-slate-600 dark:text-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg border border-slate-100 dark:border-white/10" title="Add to Wishlist">
                                    <LuHeart size={16} />
                                </button>
                            </div>
                        </motion.div>

                        {/* Thumbnails */}
                        {template.images?.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {template.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? "border-[#300000] dark:border-[#D4AF37]" : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <Image src={img} fill className="object-cover" alt={`View ${idx}`} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Description Tabs */}
                        <div className="mt-12">
                            <div className="flex items-center gap-8 border-b border-slate-100 dark:border-white/10 mb-8">
                                {['description', 'specifications', 'reviews'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === tab
                                            ? 'text-[#300000] dark:text-[#D4AF37]'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#300000] dark:bg-[#D4AF37]" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTab === 'description' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed ${bengaliClass}`}
                                    >
                                        <p>{template.description || "No description provided for this template."}</p>
                                    </motion.div>
                                )}
                                {activeTab === 'specifications' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs"
                                    >
                                        {[
                                            { label: "Software", value: template.software || "Adobe Photoshop" },
                                            { label: "File Type", value: template.fileType || "PSD, JPG" },
                                            { label: "Resolution", value: template.resolution || "300 DPI" },
                                            { label: "Layered", value: "Yes, Organized" },
                                            { label: "Version", value: template.version || "1.0" },
                                            { label: "Last Updated", value: new Date(template.updatedAt || Date.now()).toLocaleDateString() },
                                        ].map((spec, i) => (
                                            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-white/5">
                                                <span className="font-bold text-slate-700 dark:text-slate-300">{spec.label}</span>
                                                <span className="text-slate-500">{spec.value}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Column - Info & Actions */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-28 space-y-8">

                            {/* Header Info */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full bg-[#300000]/5 dark:bg-[#D4AF37]/10 text-[#300000] dark:text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest border border-[#300000]/10 dark:border-[#D4AF37]/20">
                                        {template.category?.name || "Design Template"}
                                    </span>
                                    {hasDiscount && (
                                        <span className="px-3 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest">
                                            {discountPercent}% OFF
                                        </span>
                                    )}
                                </div>
                                <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4 ${bengaliClass}`}>
                                    {template.title}
                                </h1>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-1 text-amber-400">
                                        <LuStar fill="currentColor" size={14} />
                                        <span className="font-bold text-slate-800 dark:text-white">{template.rating || "5.0"}</span>
                                        <span className="text-slate-400">(24 Reviews)</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span>{template.salesCount || "100+"} Sales</span>
                                </div>
                            </div>

                            {/* Price Card */}
                            <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                                <div className="flex items-end gap-3 mb-6">
                                    <span className="text-4xl font-serif italic text-[#300000] dark:text-[#D4AF37]">
                                        ৳{currentPrice.toLocaleString()}
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-lg text-slate-400 line-through mb-1">
                                            ৳{template.price.toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full py-4 bg-[#300000] text-white rounded-xl font-bold text-sm hover:bg-[#450a0a] transition-all shadow-lg shadow-[#300000]/20 flex items-center justify-center gap-2 group"
                                    >
                                        <LuShoppingCart size={18} />
                                        <span>{isAdded ? "Added to Cart" : "Add to Cart"}</span>
                                    </button>
                                    <button
                                        className="w-full py-4 bg-white dark:bg-[#020202] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span>Buy Now</span>
                                    </button>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
                                    {[
                                        { icon: LuCheck, text: "Instant Download" },
                                        { icon: LuShieldCheck, text: "Secure Payment" },
                                        { icon: LuFileCode, text: "Source File Included" },
                                        { icon: LuLayers, text: "Fully Editable" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                                <item.icon size={10} />
                                            </div>
                                            <span>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Share & Support */}
                            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                                <button className="flex items-center gap-2 hover:text-[#300000] dark:hover:text-[#D4AF37] transition-colors">
                                    <LuShare2 size={14} />
                                    Share Template
                                </button>
                                <Link href="/contact" className="hover:text-[#300000] dark:hover:text-[#D4AF37] transition-colors">
                                    Need Support?
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DesignTemplateDetails;
