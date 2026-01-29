"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "@/config/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiTrash2, FiExternalLink, FiSearch, FiFilter } from "react-icons/fi";
import { LuGlobe, LuCode, LuBookOpen, LuChevronRight } from "react-icons/lu";
import Link from "next/link";
import { useTheme } from "@/providers/ThemeProvider";

const FavoritesPage = () => {
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const { isDark } = useTheme();

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/wishlist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (result.success) {
                setWishlist(result.data);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (result.success) {
                // Refresh wishlist
                setWishlist((prev) => ({
                    ...prev,
                    items: prev.items.filter((item) => item.product._id !== productId),
                }));
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    const filteredItems = wishlist?.items?.filter(item => {
        if (filter === "all") return true;
        return item.productType === filter;
    }) || [];

    const getIcon = (type) => {
        switch (type) {
            case "website": return <LuGlobe className="text-blue-500" />;
            case "software": return <LuCode className="text-red-500" />;
            case "course": return <LuBookOpen className="text-purple-500" />;
            default: return null;
        }
    };

    const getLink = (item) => {
        const id = item.product?._id;
        switch (item.productType) {
            case "website": return `/website/${id}`;
            case "software": return `/software/${id}`;
            case "course": return `/courses/${id}`;
            default: return "#";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className={`text-2xl lg:text-3xl font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>My Favorites</h1>
                    <p className={`text-sm poppins mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Explore and manage the products and courses you love
                    </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    {[
                        { id: "all", label: "All Items" },
                        { id: "course", label: "Courses" },
                        { id: "software", label: "Software" },
                        { id: "website", label: "Websites" },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setFilter(t.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                ${filter === t.id
                                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                    : isDark
                                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {filteredItems.length === 0 ? (
                <div className={`flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                        <FiHeart className="text-rose-500 text-3xl" />
                    </div>
                    <h3 className={`text-xl font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>No favorites yet</h3>
                    <p className={`text-sm poppins mt-2 text-center max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        You haven't liked any {filter === 'all' ? 'products' : filter} yet. Browse our marketplace to find things you like!
                    </p>
                    <Link
                        href={filter === 'course' ? '/courses' : filter === 'website' ? '/website' : filter === 'software' ? '/software' : '/'}
                        className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-rose-600 transition-all flex items-center gap-2"
                    >
                        Explore Now <FiExternalLink />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item.product?._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`group relative rounded-2xl overflow-hidden border transition-all hover:shadow-xl
                  ${isDark ? 'bg-slate-900/50 border-white/5 hover:border-rose-500/50' : 'bg-white border-slate-200 hover:border-rose-200'}`}
                            >
                                {/* Image Container */}
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src={item.product?.thumbnail || item.product?.images?.[0] || "/images/placeholder.png"}
                                        alt={item.product?.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Category Badge */}
                                    <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg shadow-sm">
                                        {getIcon(item.productType)}
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 poppins">
                                            {item.productType}
                                        </span>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemove(item.product?._id)}
                                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md text-rose-500 rounded-lg flex items-center justify-center shadow-sm hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110"
                                        title="Remove from favorites"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className={`font-bold text-lg mb-2 line-clamp-1 outfit transition-colors ${isDark ? 'text-white group-hover:text-rose-400' : 'text-slate-800 group-hover:text-rose-600'}`}>
                                        {item.product?.title}
                                    </h3>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex flex-col">
                                            <span className={`text-[10px] font-medium uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Price</span>
                                            <span className={`text-lg font-bold outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                ?{(item.product?.price || 0).toLocaleString()}
                                            </span>
                                        </div>

                                        <Link
                                            href={getLink(item)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
                        ${isDark
                                                    ? 'bg-slate-800 text-white hover:bg-rose-500'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-rose-500 hover:text-white'}`}
                                        >
                                            View Details <LuChevronRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
