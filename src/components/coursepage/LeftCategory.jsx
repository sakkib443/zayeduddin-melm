"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories, setSelectedCategories } from "@/redux/categorySlice";
import { IoSearchSharp, IoClose } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import { LuFilter, LuX, LuSparkles, LuGraduationCap, LuMonitor, LuUsers, LuVideo, LuLayoutGrid } from "react-icons/lu";
import { HiOutlineSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

const LeftCategory = ({ searchQuery, setSearchQuery, selectedType, setSelectedType }) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { items: courseCategories, status, selectedCategories } = useSelector(
    (state) => state.categories
  );
  const initialUrlCategorySet = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle URL category parameter - only once on initial load
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory && !initialUrlCategorySet.current) {
      initialUrlCategorySet.current = true;
      dispatch(setSelectedCategories([urlCategory]));
    }
  }, [searchParams, dispatch]);

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

  const filteredCategories = courseCategories.filter((category) => category.name !== "All");
  const hasActiveFilters = selectedCategories.length > 0 || searchQuery || (selectedType && selectedType !== "All");

  const typeOptions = [
    { value: "All", label: "All Courses", icon: LuLayoutGrid, color: "slate" },
    { value: "Online", label: "Live Online", icon: LuMonitor, color: "emerald" },
    { value: "Offline", label: "In-Person", icon: LuUsers, color: "blue" },
    { value: "Recorded", label: "Recorded", icon: LuVideo, color: "purple" },
  ];

  return (
    <div className="space-y-4">
      {/* Search Input - Enhanced */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-white/5 backdrop-blur-sm border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="relative group">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 bg-slate-50/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#E62D26] focus:ring-2 focus:ring-[#E62D26]/10 focus:bg-white dark:focus:bg-white/10 transition-all"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-br from-[#E62D26] to-[#F79952] rounded-md flex items-center justify-center">
            <IoSearchSharp className="text-white text-xs" />
          </div>
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-100 dark:bg-white/10 hover:bg-[#E62D26]/10 rounded-full flex items-center justify-center text-slate-400 hover:text-[#E62D26] transition-colors"
              >
                <IoClose className="text-sm" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Clear Filters - Animated */}
      <AnimatePresence>
        {isMounted && hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onClick={clearAllFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#E62D26]/10 to-[#F79952]/10 hover:from-[#E62D26]/20 hover:to-[#F79952]/20 text-[#E62D26] rounded-xl text-sm font-medium transition-all border border-[#E62D26]/20"
          >
            <LuX className="text-base" />
            Clear All Filters
          </motion.button>
        )}
      </AnimatePresence>

      {/* Course Type Filter - Redesigned */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-white/5 backdrop-blur-sm border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3.5 bg-gradient-to-r from-slate-50 to-white dark:from-white/5 dark:to-transparent border-b border-slate-100 dark:border-white/5">
          <div className="w-7 h-7 bg-gradient-to-br from-[#F79952] to-[#E62D26] rounded-lg flex items-center justify-center">
            <HiOutlineSparkles className="text-white text-sm" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-white outfit text-sm">Course Type</h3>
        </div>
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {typeOptions.map((type, index) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.value;
              return (
                <motion.button
                  key={type.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedType && setSelectedType(type.value)}
                  className={`relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-gradient-to-br from-[#E62D26] to-[#E62D26]/90 text-white shadow-lg shadow-[#E62D26]/20"
                      : "bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                  }`}
                >
                  <Icon className={`text-lg ${isSelected ? "text-white" : "text-slate-400"}`} />
                  <span className="whitespace-nowrap">{type.label}</span>
                  {isSelected && (
                    <motion.div
                      layoutId="typeIndicator"
                      className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-sm flex items-center justify-center"
                    >
                      <div className="w-1.5 h-1.5 bg-[#E62D26] rounded-full"></div>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Categories Filter - Enhanced */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-white/5 backdrop-blur-sm border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3.5 bg-gradient-to-r from-slate-50 to-white dark:from-white/5 dark:to-transparent border-b border-slate-100 dark:border-white/5">
          <div className="w-7 h-7 bg-gradient-to-br from-[#E62D26] to-[#F79952] rounded-lg flex items-center justify-center">
            <LuFilter className="text-white text-sm" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-white outfit text-sm">Categories</h3>
          {isMounted && selectedCategories.length > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto text-xs bg-gradient-to-r from-[#E62D26] to-[#F79952] text-white px-2.5 py-1 rounded-full font-medium"
            >
              {selectedCategories.length}
            </motion.span>
          )}
        </div>

        <div className="p-3 space-y-1.5 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {/* All Option */}
          <motion.button
            whileHover={{ x: 4 }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
              isMounted && selectedCategories.length === 0
                ? "bg-gradient-to-r from-[#E62D26]/10 to-[#F79952]/10 border border-[#E62D26]/20"
                : "hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent"
            }`}
            onClick={() => dispatch(setSelectedCategories([]))}
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              isMounted && selectedCategories.length === 0 
                ? "border-[#E62D26] bg-gradient-to-br from-[#E62D26] to-[#F79952]" 
                : "border-slate-300 dark:border-slate-600"
            }`}>
              {isMounted && selectedCategories.length === 0 && (
                <motion.svg 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </motion.svg>
              )}
            </div>
            <span className={`text-sm font-medium ${
              isMounted && selectedCategories.length === 0 
                ? "text-[#E62D26]" 
                : "text-slate-600 dark:text-slate-300"
            }`}>All Categories</span>
          </motion.button>

          {isMounted && status === "loading" && (
            <div className="text-center py-6">
              <div className="w-6 h-6 border-2 border-[#E62D26] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400 mt-2">Loading categories...</p>
            </div>
          )}

          {isMounted && status === "succeeded" &&
            filteredCategories.map((category, index) => {
              const isSelected = selectedCategories.includes(category.name);
              return (
                <motion.button
                  key={category._id || category.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-[#E62D26]/10 to-[#F79952]/10 border border-[#E62D26]/20"
                      : "hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent"
                  }`}
                  onClick={() => handleCategoryChange(category.name)}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-[#E62D26] bg-gradient-to-br from-[#E62D26] to-[#F79952]"
                      : "border-slate-300 dark:border-slate-600"
                  }`}>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.svg 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="w-3 h-3 text-white" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className={`text-sm ${
                    isSelected 
                      ? "text-[#E62D26] font-medium" 
                      : "text-slate-600 dark:text-slate-300"
                  }`}>{category.name}</span>
                </motion.button>
              );
            })}
        </div>
      </motion.div>

      {/* Promo Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#E62D26] to-[#F79952] rounded-xl p-4 text-white shadow-lg"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="relative z-10">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-2">
            <LuGraduationCap className="text-base" />
          </div>
          <h4 className="font-bold text-sm outfit mb-1">Need Help?</h4>
          <p className="text-white/80 text-[10px] mb-2 leading-relaxed">Can't find what you're looking for? Our team is here to help!</p>
          <button className="w-full py-2 bg-white text-[#E62D26] rounded-lg text-xs font-semibold hover:bg-white/90 transition-colors">
            Contact Support
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LeftCategory;
