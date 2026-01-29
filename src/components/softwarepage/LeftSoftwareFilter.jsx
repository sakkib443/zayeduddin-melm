"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCategories, fetchCategories } from "@/redux/categorySlice";
import { IoSearchSharp, IoClose } from "react-icons/io5";
import { LuFilter, LuX } from "react-icons/lu";
import { HiOutlineSparkles } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";

const LeftSoftwareFilter = ({ searchQuery, setSearchQuery, selectedType, setSelectedType }) => {
    const dispatch = useDispatch();
    const { items: categories, status, selectedCategories } = useSelector(
        (state) => state.categories
    );
    const { t, language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    useEffect(() => {
        dispatch(fetchCategories({ type: 'software' }));
    }, [dispatch]);

    const handleCategoryChange = (categoryName) => {
        const newSelection = selectedCategories.includes(categoryName)
            ? []
            : [categoryName];
        dispatch(setSelectedCategories(newSelection));
    };

    const clearAllFilters = () => {
        dispatch(setSelectedCategories([]));
        if (setSearchQuery) setSearchQuery("");
        if (setSelectedType) setSelectedType("All");
    };

    const hasActiveFilters = selectedCategories.length > 0 || searchQuery || (selectedType && selectedType !== "All");

    const softwareTypes = [
        { name: 'All', bn: '??' },
        { name: 'Script', bn: '?????????' },
        { name: 'Plugin', bn: '???????' },
        { name: 'Full Software', bn: '??? ?????????' }
    ];

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={language === 'bn' ? '????????? ??????...' : "Search software..."}
                        value={searchQuery || ""}
                        onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-[#E62D26] focus:bg-white transition-colors work"
                    />
                    <IoSearchSharp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <IoClose />
                        </button>
                    )}
                </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <button
                    onClick={clearAllFilters}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm font-medium work hover:bg-red-100 transition-colors"
                >
                    <LuX className="text-base" />
                    {language === 'bn' ? '??????? ?????' : 'Clear All Filters'}
                </button>
            )}

            {/* Software Type Filter */}
            <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <HiOutlineSparkles className="text-[#F79952]" />
                    <h3 className={`font-semibold text-gray-800 outfit text-sm ${bengaliClass}`}>
                        {language === 'bn' ? '????????? ???' : 'Software Type'}
                    </h3>
                </div>
                <div className="p-3 flex flex-wrap gap-2">
                    {softwareTypes.map((type) => (
                        <button
                            key={type.name}
                            onClick={() => setSelectedType && setSelectedType(type.name)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium work transition-all duration-200 ${selectedType === type.name
                                ? "bg-[#E62D26] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                } ${bengaliClass}`}
                        >
                            {language === 'bn' ? type.bn : type.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Categories Filter */}
            <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <LuFilter className="text-[#E62D26]" />
                    <h3 className={`font-semibold text-gray-800 outfit text-sm ${bengaliClass}`}>
                        {language === 'bn' ? '?????????' : 'Categories'}
                    </h3>
                    {selectedCategories.length > 0 && (
                        <span className="ml-auto text-xs bg-[#E62D26] text-white px-2 py-0.5 rounded-full">
                            {selectedCategories.length}
                        </span>
                    )}
                </div>

                <div className="p-3 space-y-1">
                    {/* All Option */}
                    <label
                        className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition-colors ${selectedCategories.length === 0
                            ? "bg-[#E62D26]/10 text-[#E62D26]"
                            : "hover:bg-gray-50 text-gray-700"
                            }`}
                        onClick={() => dispatch(setSelectedCategories([]))}
                    >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${selectedCategories.length === 0 ? "border-[#E62D26] bg-[#E62D26]" : "border-gray-300"
                            }`}>
                            {selectedCategories.length === 0 && (
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <span className={`text-sm font-medium work ${bengaliClass}`}>
                            {language === 'bn' ? '?? ?????????' : 'All Categories'}
                        </span>
                    </label>

                    {status === "loading" && (
                        <div className="text-center py-4">
                            <div className="w-5 h-5 border-2 border-[#E62D26] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                    )}

                    {status === "succeeded" &&
                        categories
                            .filter(cat => cat.name.toLowerCase() !== 'all')
                            .map((category) => (
                                <label
                                    key={category._id || category.id}
                                    className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition-colors ${selectedCategories.includes(category.name)
                                        ? "bg-[#E62D26]/10 text-[#E62D26]"
                                        : "hover:bg-gray-50 text-gray-700"
                                        }`}
                                    onClick={() => handleCategoryChange(category.name)}
                                >
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${selectedCategories.includes(category.name)
                                        ? "border-[#E62D26] bg-[#E62D26]"
                                        : "border-gray-300"
                                        }`}>
                                        {selectedCategories.includes(category.name) && (
                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`text-sm work ${bengaliClass}`}>{category.name}</span>
                                </label>
                            ))}
                </div>
            </div>
        </div>
    );
};

export default LeftSoftwareFilter;
