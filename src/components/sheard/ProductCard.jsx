'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import {
    LuShoppingCart,
    LuEye,
    LuCheck,
    LuClock,
    LuUsers,
    LuLayoutGrid,
    LuLayers,
    LuList,
    LuHeart,
    LuPlay,
    LuSparkles
} from 'react-icons/lu';
import { FaStar, FaArrowRight } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/providers/ThemeProvider";
import { motion } from "framer-motion";

const ProductCard = ({ product, type, view = "grid" }) => {
    const dispatch = useDispatch();
    const [isAdded, setIsAdded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { isDark } = useTheme();
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const detailUrl = `/${type}/${product._id || product.id}`;

    // Get first image from images array or fallback
    const productImage = product.images?.[0] || product.image || "/images/placeholder.png";

    // Calculate discount percentage
    const hasDiscount = product.offerPrice && product.offerPrice > 0 && product.offerPrice < product.price;

    // Display Price logic
    const displayPrice = hasDiscount ? product.offerPrice : product.price;
    const originalPrice = product.price;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id: product._id || product.id,
            title: product.title || product.name,
            price: displayPrice,
            image: productImage,
            type: type
        }));
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    // Fields
    const title = product.title || product.name || "Untitled Product";
    const categoryName = product.category?.name || product.templateType || (type === 'website' ? 'Website' : 'Design');
    const version = product.version || 'v1.0';
    const sales = product.salesCount || product.totalSales || 0;
    const rating = product.rating || 5;
    const reviewsCount = product.reviewCount || product.reviews?.length || 0;

    const colors = {
        darkRed: "#300000",
        gold: "#D4AF37",
    };

    // Grid View Rendering
    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group w-full h-full flex flex-col pt-4"
        >
            <div className={`relative h-full bg-white dark:bg-[#0d0d0d] rounded-3xl border border-slate-100 dark:border-white/10 overflow-hidden hover:shadow-2xl hover:border-[#300000]/20 transition-all duration-500 flex flex-col shadow-lg shadow-black/5`}>

                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden shrink-0">
                    <Link href={detailUrl} className="block h-full w-full">
                        <img
                            src={productImage}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </Link>

                    {/* Type Badge (Top Left) */}
                    <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold text-white shadow-lg backdrop-blur-md bg-[#300000]/80">
                            <LuSparkles size={10} />
                            {type.replace('-', ' ').toUpperCase()}
                        </span>
                    </div>

                    {/* Play Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-300"
                    >
                        <Link href={detailUrl} className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border-2 border-white/40 hover:bg-[#300000] hover:border-[#300000] transition-all hover:scale-110 shadow-2xl">
                            <LuEye size={20} />
                        </Link>
                    </motion.div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1 relative">
                    {/* Category */}
                    <div className="mb-3">
                        <span className={`text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest ${bengaliClass}`}>
                            {categoryName}
                        </span>
                    </div>

                    {/* Title */}
                    <Link href={detailUrl} className="mb-4 block">
                        <h3 className={`md:text-lg font-bold text-slate-800 dark:text-white leading-snug line-clamp-2 hover:text-[#300000] transition-colors ${bengaliClass}`}>
                            {title}
                        </h3>
                    </Link>

                    {/* Stats Bar */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50 dark:border-white/5">
                        <div className="flex items-center gap-3 text-[10px] font-medium text-slate-500">
                            <div className="flex items-center gap-1">
                                <LuLayers className="text-[#300000]" size={12} />
                                <span>{version}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <LuUsers className="text-[#300000]" size={12} />
                                <span>{sales}+ Sales</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <FaStar className="text-amber-400" size={12} />
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{rating.toFixed(1)}</span>
                        </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between mt-auto gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">PRICE</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-serif italic font-bold text-[#300000]">
                                    ৳{displayPrice?.toLocaleString()}
                                </span>
                                {hasDiscount && (
                                    <span className="text-xs text-slate-300 line-through">৳{originalPrice?.toLocaleString()}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdded}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isAdded
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white hover:bg-[#300000] hover:text-white'
                                    }`}
                            >
                                {isAdded ? <LuCheck size={18} /> : <LuShoppingCart size={18} />}
                            </button>
                            <Link
                                href={detailUrl}
                                className="w-10 h-10 rounded-full bg-[#300000] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#300000]/20"
                            >
                                <FaArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
