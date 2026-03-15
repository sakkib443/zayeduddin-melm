"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { LuQuote } from "react-icons/lu";
import { FiBook, FiMonitor, FiLayout } from "react-icons/fi";
import { API_URL } from "@/config/api";

const Testimonials = () => {
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const [activeIndex, setActiveIndex] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch real reviews from API
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${API_URL}/reviews/featured?limit=10`);
                const data = await res.json();
                if (data.success && data.data && data.data.length > 0) {
                    setReviews(data.data);
                } else {
                    // Fallback to static data from translations
                    loadStaticData();
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
                loadStaticData();
            } finally {
                setLoading(false);
            }
        };

        const loadStaticData = () => {
            const testimonialsList = t("testimonials.items", { returnObjects: true }) || [];
            const staticAvatars = [
                "https://i.pravatar.cc/150?img=11",
                "https://i.pravatar.cc/150?img=12",
                "https://i.pravatar.cc/150?img=13",
                "https://i.pravatar.cc/150?img=14",
                "https://i.pravatar.cc/150?img=15",
            ];
            const staticReviews = testimonialsList.map((item, index) => ({
                _id: `static-${index}`,
                user: { firstName: item.name?.split(' ')[0] || '', lastName: item.name?.split(' ').slice(1).join(' ') || '', avatar: staticAvatars[index % staticAvatars.length] },
                comment: item.review,
                rating: 5,
                productType: 'course',
                productDetails: { title: item.designation || '' },
            }));
            if (staticReviews.length > 0) setReviews(staticReviews);
        };

        fetchReviews();
    }, []);

    // Auto-slide effect
    useEffect(() => {
        if (reviews.length === 0) return;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % reviews.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [reviews.length]);

    const getUserName = (review) => {
        if (review.user?.firstName) {
            return `${review.user.firstName} ${review.user.lastName || ''}`.trim();
        }
        return 'Anonymous';
    };

    const getUserAvatar = (review) => {
        return review.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName(review))}&background=021E14&color=fff&size=200`;
    };

    const getProductLabel = (review) => {
        if (review.productDetails?.title) return review.productDetails.title;
        const typeLabels = { course: 'Course Student', website: 'Website User', 'design-template': 'Design User' };
        return typeLabels[review.productType] || 'Student';
    };

    const getProductIcon = (type) => {
        if (type === 'course') return <FiBook size={12} />;
        if (type === 'website') return <FiMonitor size={12} />;
        return <FiLayout size={12} />;
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(<FaStar key={i} className="text-[#D4AF37]" size={14} />);
            } else if (i - 0.5 <= rating) {
                stars.push(<FaStarHalfAlt key={i} className="text-[#D4AF37]" size={14} />);
            } else {
                stars.push(<FaRegStar key={i} className="text-[#D4AF37]/40" size={14} />);
            }
        }
        return stars;
    };

    if (loading || reviews.length === 0) {
        return null;
    }

    const activeReview = reviews[activeIndex];

    return (
        <section className="py-12 bg-[#efefef] dark:bg-[#050505] overflow-hidden">
            <div className="container mx-auto px-4 lg:px-16">

                {/* Header */}
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-2xl md:text-3xl lg:text-4xl font-bold text-[#021E14] ${bengaliClass}`}
                        style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                        {t("testimonials.title")}
                    </motion.h2>
                </div>

                {/* Avatars Ribbon - Overlapping Style */}
                <div className="relative mb-14 overflow-visible flex justify-center">
                    <div className="flex items-center -space-x-4 md:-space-x-8">
                        {reviews.map((review, idx) => {
                            const isActive = idx === activeIndex;
                            return (
                                <motion.button
                                    key={review._id}
                                    onClick={() => setActiveIndex(idx)}
                                    animate={{
                                        scale: isActive ? 1.1 : 0.8,
                                        opacity: isActive ? 1 : 0.4,
                                        zIndex: isActive ? 30 : 10 + idx,
                                    }}
                                    whileHover={{ scale: isActive ? 1.1 : 0.9, opacity: 1, zIndex: 40 }}
                                    className="relative shrink-0"
                                >
                                    <div className={`w-12 h-12 md:w-20 md:h-20 rounded-full p-0.5 md:p-1 transition-all duration-500 bg-white shadow-xl ${isActive ? 'ring-2 md:ring-4 ring-[#021E14]/20' : ''}`}>
                                        <div className="relative w-full h-full rounded-full overflow-hidden border border-[#021E14]/30 md:border-2 md:border-[#021E14]">
                                            <img
                                                src={getUserAvatar(review)}
                                                alt={getUserName(review)}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Testimonial Card */}
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="relative flex flex-col md:flex-row items-center bg-white dark:bg-[#0d0d0d] rounded-[2rem] shadow-xl shadow-black/5 border border-slate-100 dark:border-white/5"
                        >
                            {/* Profile Image Circle (Overlapping) */}
                            <div className="relative md:absolute md:-left-12 lg:-left-20 w-48 h-48 md:w-56 md:h-56 shrink-0 z-20 -mt-24 md:mt-0 mb-6 md:mb-0">
                                <div className="w-full h-full rounded-full bg-[#021E14] p-2.5 shadow-2xl flex items-center justify-center">
                                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20">
                                        <img
                                            src={getUserAvatar(activeReview)}
                                            alt={getUserName(activeReview)}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 p-6 md:p-10 md:pl-56 lg:pl-48 flex flex-col justify-center">
                                <div className="mb-4 flex items-center justify-between">
                                    <LuQuote className="text-[#021E14] opacity-10" size={40} />
                                    <div className="flex items-center gap-1">
                                        {renderStars(activeReview.rating)}
                                    </div>
                                </div>

                                <p className={`text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-6 italic ${bengaliClass}`}>
                                    {activeReview.comment}
                                </p>

                                <div className="flex flex-col">
                                    <h4 className={`text-base md:text-lg font-bold text-[#021E14] ${bengaliClass}`}>
                                        {getUserName(activeReview)}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[#D4AF37] font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-1.5">
                                            {getProductIcon(activeReview.productType)}
                                            {getProductLabel(activeReview)}
                                        </span>
                                        {activeReview.isVerifiedPurchase && (
                                            <span className="text-[9px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">
                                                ✓ Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Gold Sidebar with Rating */}
                            <div className="w-full md:w-14 bg-[#D4AF37] self-stretch md:rounded-r-[2rem] flex flex-row md:flex-col items-center justify-center gap-3 p-3 md:p-0">
                                <div className="text-white font-bold text-xl md:text-2xl">
                                    {activeReview.rating}
                                </div>
                                <div className="w-6 h-px md:w-px md:h-6 bg-white/30"></div>
                                <div className="text-white/80 text-[10px] font-semibold uppercase">
                                    {activeReview.rating >= 4.5 ? '★★★★★' : activeReview.rating >= 3.5 ? '★★★★' : '★★★'}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-2 mt-8">
                    {reviews.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex
                                ? 'w-6 bg-[#021E14]'
                                : 'bg-[#021E14]/20 hover:bg-[#021E14]/40'
                                }`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Testimonials;
