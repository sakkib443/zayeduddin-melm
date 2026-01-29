"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWebsites } from "../../redux/websiteSlice";
import ProductCard from "../sheard/ProductCard";
import { LuLayoutGrid, LuList, LuArrowUpDown, LuGlobe } from "react-icons/lu";
import { HiOutlineSparkles } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";

// Loading Skeleton (Synced with Course/Software style)
const WebsiteCardSkeleton = () => (
    <div className="w-full animate-pulse">
        <div className="bg-white rounded-md border border-gray-100 overflow-hidden shadow-sm">
            <div className="h-48 bg-gray-100"></div>
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-50 rounded w-1/3"></div>
                <div className="h-6 bg-gray-50 rounded w-3/4"></div>
                <div className="h-4 bg-gray-50 rounded w-1/2"></div>
                <div className="h-px bg-gray-50"></div>
                <div className="flex justify-between">
                    <div className="h-8 bg-gray-50 rounded w-1/4"></div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-4 bg-gray-50 rounded-full"></div>)}
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <div className="flex-1 h-10 bg-gray-50 rounded-md"></div>
                    <div className="w-24 h-10 bg-gray-50 rounded-md"></div>
                </div>
            </div>
        </div>
    </div>
);

const RightWebsiteDetails = ({ searchQuery, selectedType }) => {
    const dispatch = useDispatch();
    const { websiteList = [], loading = false } = useSelector((state) => state.websites || {});
    const { items: categories = [], selectedCategories = [] } = useSelector((state) => state.categories || {});
    const { language } = useLanguage();
    const [sortBy, setSortBy] = useState("default");
    const [isGridView, setIsGridView] = useState(true);

    useEffect(() => {
        dispatch(fetchWebsites());
    }, [dispatch]);

    // Get category name
    const getCategoryName = (category) => {
        if (!category) return "";
        if (typeof category === "string") return category;
        return category.name || "";
    };

    // Filter websites
    const filteredWebsites = websiteList.filter((item) => {
        if (!item) return false;

        // Website Type filter (Static, Dynamic, Full System)
        const typeMatch = selectedType === "All" || item?.type === selectedType;

        // Category filter
        let categoryMatch = true;
        if (selectedCategories.length > 0) {
            const itemCategoryName = getCategoryName(item.category);
            categoryMatch = selectedCategories.includes(itemCategoryName);
        }

        // Search filter
        const q = (searchQuery || "").trim().toLowerCase();
        const searchMatch =
            q === "" ||
            (item.title && item.title.toLowerCase().includes(q)) ||
            (item.name && item.name.toLowerCase().includes(q)) ||
            getCategoryName(item.category).toLowerCase().includes(q);

        return typeMatch && categoryMatch && searchMatch;
    });

    // Sort websites
    const sortedWebsites = [...filteredWebsites].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return (a.offerPrice || a.price) - (b.offerPrice || b.price);
            case "price-high":
                return (b.offerPrice || b.price) - (a.offerPrice || a.price);
            case "rating":
                return (b.rating || 0) - (a.rating || 0);
            default:
                return 0;
        }
    });

    return (
        <div className="space-y-6">
            {/* Top Bar (Synced with Course/Software style) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-md p-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <HiOutlineSparkles className="text-[#E62D26]" />
                    <span className="text-gray-800 font-semibold outfit">
                        {sortedWebsites.length} <span className="text-gray-500 font-normal">{language === 'bn' ? '?? ????? ????' : 'websites found'}</span>
                    </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Sort Dropdown */}
                    <div className="relative flex-1 sm:flex-none">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none w-full pl-8 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 work focus:outline-none focus:border-[#E62D26] cursor-pointer"
                        >
                            <option value="default">{language === 'bn' ? '???? ????' : 'Sort By'}</option>
                            <option value="rating">{language === 'bn' ? '?? ?????' : 'Top Rated'}</option>
                            <option value="price-low">{language === 'bn' ? '???: ?? ???? ????' : 'Price: Low to High'}</option>
                            <option value="price-high">{language === 'bn' ? '???: ???? ???? ??' : 'Price: High to Low'}</option>
                        </select>
                        <LuArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    </div>

                    {/* View Toggle */}
                    <div className="hidden sm:flex items-center border border-gray-200 rounded-md overflow-hidden">
                        <button
                            onClick={() => setIsGridView(true)}
                            className={`p-2 ${isGridView ? 'bg-[#E62D26] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                        >
                            <LuLayoutGrid className="text-lg" />
                        </button>
                        <button
                            onClick={() => setIsGridView(false)}
                            className={`p-2 ${!isGridView ? 'bg-[#E62D26] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                        >
                            <LuList className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid display */}
            {loading ? (
                <div className={`grid gap-6 ${isGridView ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <WebsiteCardSkeleton key={i} />
                    ))}
                </div>
            ) : sortedWebsites.length > 0 ? (
                <div className={`grid gap-6 ${isGridView ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                    {sortedWebsites.map((item) => (
                        <ProductCard key={item._id} product={item} type="website" view={isGridView ? 'grid' : 'list'} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-md shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LuGlobe className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 outfit mb-2">
                        {language === 'bn' ? '???? ???????? ????? ?????' : 'No websites found'}
                    </h3>
                    <p className="text-gray-500 work text-sm">
                        {language === 'bn' ? '??????? ??? ???????? ????? ????' : 'Try adjusting your search or filter criteria'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default RightWebsiteDetails;
