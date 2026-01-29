"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { LuQuote } from "react-icons/lu";

const Testimonials = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);

    const testimonials = [
        {
            id: 1,
            name: "Oliver Beddows",
            designation: "Designer, Manchester",
            avatar: "https://i.pravatar.cc/150?img=11",
            review: "But not all testimonials are created equal. A generic \"Great product!\" doesn't carry much weight. To truly resonate, testimonials need to be well-designed. This means ensuring they're authentic, with specific details that paint a vivid picture of the customer's experience.",
        },
        {
            id: 2,
            name: "Madley Pondor",
            designation: "Reporter, San Diego",
            avatar: "https://i.pravatar.cc/150?img=12",
            review: "ThemeMove deserves 5 star for theme's features, design quality, flexibility, and support service! If you can include a photo or video, even better! Visuals add a layer of credibility that text alone can't achieve. Ultimately, well-crafted testimonials boost conversions.",
        },
        {
            id: 3,
            name: "Mina Hollace",
            designation: "Reporter, London",
            avatar: "https://i.pravatar.cc/150?img=13",
            review: "Very good and fast support during the week. They know what you need, exactly when you need it. When people see that others have benefited from your offering, they're far more likely to take the leap themselves. Letting your happy customers do the talking.",
        },
        {
            id: 4,
            name: "James Wilson",
            designation: "Developer, New York",
            avatar: "https://i.pravatar.cc/150?img=14",
            review: "The courses are beautifully crafted. Every lesson is easy to understand and practical. Visuals add a layer of credibility that text alone can't achieve. Ultimately, well-crafted testimonials boost conversions by addressing potential customers' concerns.",
        },
        {
            id: 5,
            name: "Sophie Chen",
            designation: "Student, Singapore",
            avatar: "https://i.pravatar.cc/150?img=15",
            review: "Best platform for online learning. All courses are updated and professional. When people see that others have benefited from your offering, they're far more likely to take the leap themselves. It's about letting your experiences speak for themselves.",
        },
    ];

    // Auto-slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    const activeTestimonial = testimonials[activeIndex];

    return (
        <section className="py-12 bg-[#efefef] dark:bg-[#050505] overflow-hidden">
            <div className="container mx-auto px-4 lg:px-16">

                {/* Header */}
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-2xl md:text-3xl lg:text-4xl font-serif italic text-[#300000] ${bengaliClass}`}
                    >
                        {language === 'bn' ? 'মানুষ আমার সম্পর্কে যা বলে' : 'Peoples Say About me'}
                    </motion.h2>
                </div>

                {/* Avatars Ribbon - Overlapping Style */}
                <div className="relative mb-14 overflow-visible flex justify-center">
                    <div className="flex items-center -space-x-4 md:-space-x-8">
                        {testimonials.map((t, idx) => {
                            const isActive = idx === activeIndex;
                            return (
                                <motion.button
                                    key={t.id}
                                    onClick={() => setActiveIndex(idx)}
                                    animate={{
                                        scale: isActive ? 1.1 : 0.8,
                                        opacity: isActive ? 1 : 0.4,
                                        zIndex: isActive ? 30 : 10 + idx,
                                    }}
                                    whileHover={{ scale: isActive ? 1.1 : 0.9, opacity: 1, zIndex: 40 }}
                                    className="relative shrink-0"
                                >
                                    <div className={`w-12 h-12 md:w-20 md:h-20 rounded-full p-0.5 md:p-1 transition-all duration-500 bg-white shadow-xl ${isActive ? 'ring-2 md:ring-4 ring-[#300000]/20' : ''}`}>
                                        <div className="relative w-full h-full rounded-full overflow-hidden border border-[#300000]/30 md:border-2 md:border-[#300000]">
                                            <img
                                                src={t.avatar}
                                                alt={t.name}
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
                                <div className="w-full h-full rounded-full bg-[#300000] p-2.5 shadow-2xl flex items-center justify-center">
                                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20">
                                        <img
                                            src={activeTestimonial.avatar}
                                            alt={activeTestimonial.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 p-6 md:p-10 md:pl-56 lg:pl-48 flex flex-col justify-center">
                                <div className="mb-4">
                                    <LuQuote className="text-[#300000] opacity-10" size={40} />
                                </div>

                                <p className={`text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-6 italic ${bengaliClass}`}>
                                    {activeTestimonial.review}
                                </p>

                                <div className="flex flex-col">
                                    <h4 className={`text-base md:text-lg font-bold text-[#300000] ${bengaliClass}`}>
                                        {activeTestimonial.name}
                                    </h4>
                                    <p className="text-[#D4AF37] font-bold text-[10px] md:text-xs uppercase tracking-widest mt-0.5">
                                        {activeTestimonial.designation}
                                    </p>
                                </div>
                            </div>

                            {/* Gold Sidebar with Social Icons */}
                            <div className="w-full md:w-12 bg-[#D4AF37] self-stretch md:rounded-r-[2rem] flex flex-row md:flex-col items-center justify-center gap-4 p-3 md:p-0">
                                <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#300000] hover:scale-110 transition-transform shadow-sm">
                                    <FaFacebookF size={14} />
                                </a>
                                <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#300000] hover:scale-110 transition-transform shadow-sm">
                                    <FaLinkedinIn size={14} />
                                </a>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
};

export default Testimonials;
