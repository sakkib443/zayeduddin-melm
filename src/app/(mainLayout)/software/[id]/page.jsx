"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchSoftwareById, fetchSoftware, toggleSoftwareLike } from "@/redux/softwareSlice";
import { useLanguage } from "@/context/LanguageContext";
import { addToCart } from "@/redux/cartSlice";
import {
    LuDownload, LuExternalLink, LuClock, LuTrophy,
    LuLayoutGrid, LuEye, LuPackage, LuShieldCheck,
    LuSettings, LuFileCode, LuGlobe, LuCheck, LuSparkles, LuCode, LuZap
} from "react-icons/lu";
import { FaHeart, FaRegHeart, FaStar, FaArrowRight } from "react-icons/fa";
import { MdVerified, MdOutlineMenuBook, MdPlayCircleOutline } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ReviewsSection from "@/components/Reviews/ReviewsSection";

// Animated Counter - smoother animation
const AnimatedCounter = ({ value }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (value === 0) { setCount(0); return; }
        const duration = 1200;
        const steps = 50;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [value]);

    const formatNumber = (num) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    };
    return <span className="tabular-nums">{formatNumber(count)}</span>;
};

const SoftwareDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { singleSoftware: software, softwareList = [], loading, error } = useSelector((state) => state.software || {});
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState("overview");
    const [popularSoftware, setPopularSoftware] = useState([]);
    const [isLiking, setIsLiking] = useState(false);
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    useEffect(() => {
        if (id) dispatch(fetchSoftwareById(id));
        dispatch(fetchSoftware());
    }, [id, dispatch]);

    useEffect(() => {
        if (softwareList.length > 0 && id) {
            setPopularSoftware(softwareList.filter(item => item._id !== id).slice(0, 3));
        }
    }, [softwareList, id]);

    const handleAddToCart = () => {
        if (!software) return;
        dispatch(addToCart({
            id: software._id,
            title: software.title,
            price: software.price,
            image: software.images?.[0] || "/images/placeholder.png",
            type: 'software'
        }));
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push('/cart');
    };

    const handleToggleLike = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to like this software");
            router.push('/login');
            return;
        }
        if (isLiking) return;
        setIsLiking(true);
        try {
            await dispatch(toggleSoftwareLike(id)).unwrap();
        } catch (err) {
            console.error("Like error:", err);
            alert(err.message || "Failed to like. Please try again.");
        } finally {
            setIsLiking(false);
        }
    };

    // Loading State - Professional skeleton
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 to-white dark:from-slate-950 dark:to-slate-900">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-gray-200 dark:border-slate-700 border-t-red-500 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-400 dark:text-gray-500 text-sm font-medium tracking-wide">Loading software...</p>
                </div>
            </div>
        );
    }

    // Error State - Professional design
    if (error || !software) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-slate-950 dark:to-slate-900 px-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-md flex items-center justify-center mb-6">
                    <LuCode className="text-gray-300 dark:text-slate-600 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white outfit mb-2">Software Not Found</h3>
                <p className="text-gray-500 dark:text-gray-400 poppins text-sm mb-6 text-center max-w-sm">The software you're looking for doesn't exist or has been removed.</p>
                <button
                    onClick={() => router.push('/software')}
                    className="px-6 py-2.5 bg-gray-900 dark:bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 transition-colors"
                >
                    Browse Software
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#f0fffe] via-[#e8f9f8] to-[#f5f5ff] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-12 pb-28 lg:pt-16 lg:pb-36">
                {/* Background Effects - Subtle */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-400/10 dark:from-red-500/5 to-transparent blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-400/8 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Animated Shapes */}
                <div className="absolute top-20 right-[15%] w-20 h-20 border-2 border-red-500/20 rounded-2xl rotate-12 animate-float"></div>
                <div className="absolute bottom-32 left-[10%] w-16 h-16 border-2 border-orange-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/3 right-[8%] w-12 h-12 bg-red-500/10 rounded-xl rotate-45 animate-float" style={{ animationDelay: '2s' }}></div>

                {/* Floating Elements - Refined */}
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-28 right-1/4 w-16 h-16 bg-gradient-to-br from-red-400/20 to-cyan-400/10 rounded-md blur-sm pointer-events-none"
                ></motion.div>
                <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-32 right-1/3 w-12 h-12 bg-gradient-to-br from-amber-400/15 to-orange-300/10 rounded-full blur-sm pointer-events-none"
                ></motion.div>

                {/* Grid Pattern - Lighter */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"></div>

                <div className="container mx-auto px-4 lg:px-24 relative z-10">
                    <div className="max-w-3xl">
                        {/* Breadcrumb */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6"
                        >
                            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
                            <span>/</span>
                            <Link href="/software" className="hover:text-red-600 transition-colors">Software</Link>
                            <span>/</span>
                            <span className="text-gray-700 dark:text-white font-medium truncate max-w-[200px]">{software.title}</span>
                        </motion.div>

                        {/* Badges - Refined spacing */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap items-center gap-2 mb-5"
                        >
                            <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 rounded text-white text-[11px] font-bold uppercase tracking-wider">
                                {software.softwareType || 'Software'}
                            </span>
                            <span className="px-3 py-1 bg-white/90 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-600 dark:text-gray-300 text-[11px] font-bold uppercase tracking-wider">
                                v{software.version || '1.0'}
                            </span>
                            {software.isFeatured && (
                                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <LuSparkles size={10} /> Featured
                                </span>
                            )}
                        </motion.div>

                        {/* Title - Better typography */}
                        <motion.h1
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold outfit leading-[1.2] tracking-tight text-gray-900 dark:text-white mb-4"
                        >
                            {software.title}
                        </motion.h1>

                        {/* Description - Better readability */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 poppins leading-relaxed mb-6 max-w-2xl"
                        >
                            {software.description?.substring(0, 160)}...
                        </motion.p>

                        {/* Stats Row - Cleaner design */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="flex flex-wrap items-center gap-3 mb-5"
                        >
                            {/* Rating */}
                            <div className="flex items-center gap-2 bg-white px-8 py-2.5 rounded-md border border-gray-200">
                                <div className="flex text-amber-400 gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => <FaStar key={s} size={12} />)}
                                </div>
                                <span className="font-bold outfit text-gray-900">{software.rating || '5.0'}</span>
                                <span className="text-gray-400 text-xs">({software.reviewCount || 0})</span>
                            </div>

                            {/* Sales */}
                            <div className="flex items-center gap-3 bg-white px-8 py-2.5 rounded-md border border-gray-200">
                                <div className="w-7 h-7 rounded bg-emerald-50 flex items-center justify-center">
                                    <LuPackage className="text-emerald-600" size={14} />
                                </div>
                                <span className="text-gray-700 font-medium text-sm">
                                    <AnimatedCounter value={software.salesCount || 0} />
                                    <span className="text-gray-400 ml-1">sold</span>
                                </span>
                            </div>

                            {/* Views */}
                            <div className="flex items-center gap-3 bg-white px-8 py-2.5 rounded-md border border-gray-200">
                                <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center">
                                    <LuEye className="text-blue-600" size={14} />
                                </div>
                                <span className="text-gray-700 font-medium text-sm">
                                    <AnimatedCounter value={software.viewCount || 0} />
                                    <span className="text-gray-400 ml-1">views</span>
                                </span>
                            </div>
                        </motion.div>

                        {/* Platform & Like - Better interaction states */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-3"
                        >
                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-200">
                                <span className="text-gray-400 text-sm">Platform</span>
                                <span className="text-red-600 font-semibold text-sm outfit">{software.platform}</span>
                                <MdVerified className="text-blue-500" size={16} />
                            </div>

                            <button
                                onClick={handleToggleLike}
                                disabled={isLiking}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all ${software.isLiked
                                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                                    : 'bg-white border-gray-150 text-gray-600 hover:border-rose-200 hover:text-rose-500'
                                    }`}
                            >
                                {software.isLiked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                                <span className="font-semibold text-sm">
                                    <AnimatedCounter value={software.likeCount || 0} />
                                </span>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4 lg:px-24 pb-20 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Left Content */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Mobile Pricing Card */}
                            <div className="lg:hidden bg-white dark:bg-slate-900 rounded-md border border-gray-200 dark:border-slate-800 overflow-hidden">
                                <img src={software.images?.[0] || "/images/placeholder.png"} alt={software.title} className="w-full aspect-video object-cover" />
                                <div className="p-5">
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-2xl font-bold text-gray-900 outfit">৳{software.price?.toLocaleString()}</span>
                                        {software.offerPrice && <span className="text-gray-400 line-through text-sm">৳{software.offerPrice?.toLocaleString()}</span>}
                                    </div>
                                    <button onClick={handleBuyNow} className="w-full py-3 bg-red-500 text-white font-semibold rounded-md active:scale-[0.98] transition-transform">
                                        Buy Now
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                                {/* Tab Headers */}
                                <div className="flex border-b border-gray-100 bg-gray-50/80">
                                    {[
                                        { id: "overview", label: "Overview", icon: LuLayoutGrid },
                                        { id: "features", label: "Features", icon: LuZap },
                                        { id: "requirements", label: "Requirements", icon: LuSettings },
                                        { id: "reviews", label: "Reviews", icon: FaStar },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 -mb-[1px] ${activeTab === tab.id
                                                ? "text-red-600 border-red-500 bg-white"
                                                : "text-gray-500 border-transparent hover:text-gray-700"
                                                }`}
                                        >
                                            <tab.icon size={16} />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
                                <div className="p-6 lg:p-8">
                                    <AnimatePresence mode="wait">
                                        {activeTab === "overview" && (
                                            <motion.div
                                                key="overview"
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -12 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-8"
                                            >
                                                {/* About */}
                                                <div>
                                                    <h2 className="text-lg font-bold outfit text-gray-900 mb-4 flex items-center gap-2">
                                                        <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                                                        About This Software
                                                    </h2>
                                                    <p className="text-gray-600 poppins text-[15px] leading-7">
                                                        {software.description}
                                                    </p>
                                                    {software.longDescription && (
                                                        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-100 text-gray-600 poppins text-sm leading-6">
                                                            {software.longDescription}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Tech Stack */}
                                                {software.technologies?.length > 0 && (
                                                    <div>
                                                        <h3 className="text-base font-bold outfit text-gray-900 mb-4 flex items-center gap-2">
                                                            <span className="w-1 h-5 bg-amber-500 rounded-full"></span>
                                                            Technologies Used
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {software.technologies.map((tech, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-gray-700 font-medium text-sm hover:border-teal-300 hover:bg-red-50 transition-colors cursor-default"
                                                                >
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}

                                        {activeTab === "features" && (
                                            <motion.div
                                                key="features"
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -12 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <h2 className="text-lg font-bold outfit text-gray-900 mb-5 flex items-center gap-2">
                                                    <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                                                    Key Features
                                                </h2>

                                                {software.features?.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {software.features.map((feature, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-md hover:border-teal-200 hover:bg-red-50/30 transition-colors"
                                                            >
                                                                <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center flex-shrink-0">
                                                                    <LuCheck className="text-red-600" size={16} strokeWidth={3} />
                                                                </div>
                                                                <span className="text-gray-700 font-medium text-sm leading-relaxed pt-1">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 bg-gray-50 rounded-md border border-dashed border-gray-200">
                                                        <LuLayoutGrid className="mx-auto text-2xl text-gray-300 mb-2" />
                                                        <p className="text-gray-400 text-sm">No features added yet</p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}

                                        {activeTab === "requirements" && (
                                            <motion.div
                                                key="requirements"
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -12 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-8"
                                            >
                                                {/* Requirements */}
                                                <div>
                                                    <h2 className="text-lg font-bold outfit text-gray-900 mb-5 flex items-center gap-2">
                                                        <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                                                        System Requirements
                                                    </h2>

                                                    {software.requirements?.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {software.requirements.map((req, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-md"
                                                                >
                                                                    <span className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-red-600 outfit">
                                                                        {idx + 1}
                                                                    </span>
                                                                    <span className="text-gray-700 text-sm">{req}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-12 bg-gray-50 rounded-md border border-dashed border-gray-200">
                                                            <LuSettings className="mx-auto text-2xl text-gray-300 mb-2" />
                                                            <p className="text-gray-400 text-sm">No requirements specified</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Browser Compatibility */}
                                                {software.browserCompatibility?.length > 0 && (
                                                    <div>
                                                        <h3 className="text-base font-bold outfit text-gray-900 mb-4 flex items-center gap-2">
                                                            <span className="w-1 h-5 bg-amber-500 rounded-full"></span>
                                                            Browser Support
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {software.browserCompatibility.map((browser, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded text-emerald-700 font-medium text-sm"
                                                                >
                                                                    <LuGlobe size={12} /> {browser}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                        {activeTab === "reviews" && (
                                            <motion.div
                                                key="reviews"
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -12 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ReviewsSection productId={software._id} productType="software" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-4 hidden lg:block">
                            <div className="sticky top-24 -mt-[28rem] space-y-5">
                                {/* Pricing Card */}
                                <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                                    {/* Image */}
                                    <div className="relative aspect-video group cursor-pointer overflow-hidden bg-gray-100">
                                        <img
                                            src={software.images?.[0] || "/images/placeholder.png"}
                                            alt={software.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MdPlayCircleOutline className="text-white text-5xl" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 space-y-5">
                                        {/* Price */}
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-gray-900 outfit">৳{software.price?.toLocaleString()}</span>
                                                {software.offerPrice && (
                                                    <span className="text-gray-400 line-through text-sm">৳{software.offerPrice?.toLocaleString()}</span>
                                                )}
                                            </div>
                                            <p className="text-red-600 text-xs font-semibold uppercase tracking-wide mt-1 poppins">Lifetime License</p>
                                        </div>

                                        {/* Buttons */}
                                        <div className="space-y-2.5">
                                            <button
                                                onClick={handleBuyNow}
                                                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
                                            >
                                                Buy Now <FaArrowRight size={12} />
                                            </button>
                                            <button
                                                onClick={handleAddToCart}
                                                className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-md hover:border-red-400 hover:text-red-600 transition-colors"
                                            >
                                                Add to Cart
                                            </button>
                                            {software.previewUrl && (
                                                <a
                                                    href={software.previewUrl}
                                                    target="_blank"
                                                    className="w-full py-2.5 bg-gray-50 border border-gray-200 text-gray-600 font-medium rounded-md hover:border-red-400 hover:text-red-600 transition-colors flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <LuExternalLink size={14} /> Live Preview
                                                </a>
                                            )}
                                        </div>

                                        {/* What's Included */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <h5 className="text-sm font-bold text-gray-900 mb-3 outfit">What's Included</h5>
                                            <ul className="space-y-2.5">
                                                {[
                                                    { icon: LuFileCode, text: 'Full Source Code' },
                                                    { icon: LuDownload, text: 'Instant Download' },
                                                    { icon: LuClock, text: '6 Months Updates' },
                                                    { icon: LuShieldCheck, text: 'Premium Support' },
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-center gap-2.5 text-gray-600 text-sm poppins">
                                                        <item.icon className="text-red-500" size={15} />
                                                        <span>{item.text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Recommended */}
                                <div className="bg-white rounded-md p-5 border border-gray-200 shadow-sm">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 outfit">You May Also Like</h3>
                                    <div className="space-y-4">
                                        {popularSoftware.map(item => (
                                            <Link href={`/software/${item._id}`} key={item._id} className="flex gap-3 group">
                                                <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                                                    <img
                                                        src={item.images?.[0] || "/images/placeholder.png"}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1 outfit">{item.title}</h4>
                                                    <div className="flex items-center gap-1 text-amber-400 mt-0.5">
                                                        <FaStar size={10} />
                                                        <span className="text-gray-600 text-xs font-medium poppins">{item.rating || '5.0'}</span>
                                                    </div>
                                                    <span className="text-red-600 font-bold text-xs poppins">৳{item.price?.toLocaleString()}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link
                                        href="/software"
                                        className="flex items-center justify-center w-full py-2.5 mt-4 text-red-600 font-semibold text-sm border border-dashed border-teal-200 rounded-md hover:bg-red-50 transition-colors poppins"
                                    >
                                        View All Software
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SoftwareDetailsPage;
