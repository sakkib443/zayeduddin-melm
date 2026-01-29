"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import { fetchCoursesData } from "../../redux/CourseSlice";
import CourseCard from "../sheard/CourseCard";
import { LuLayoutGrid, LuList, LuArrowUpDown, LuLoader, LuTrendingUp, LuStar, LuDollarSign, LuUsers, LuSearch } from "react-icons/lu";
import { HiOutlineSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

// Loading Skeleton - Enhanced
const CourseCardSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="w-full"
  >
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
      <div className="h-48 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-white/10 dark:to-white/5 animate-pulse"></div>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 bg-slate-100 dark:bg-white/10 rounded-lg animate-pulse"></div>
          <div className="h-5 w-12 bg-slate-100 dark:bg-white/10 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-6 bg-slate-100 dark:bg-white/10 rounded-xl w-4/5 animate-pulse"></div>
        <div className="flex items-center gap-4">
          <div className="h-4 w-20 bg-slate-100 dark:bg-white/10 rounded-lg animate-pulse"></div>
          <div className="h-4 w-24 bg-slate-100 dark:bg-white/10 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-px bg-slate-50 dark:bg-white/5"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-8 bg-slate-100 dark:bg-white/10 rounded-xl w-24 animate-pulse"></div>
          <div className="h-10 bg-slate-100 dark:bg-white/10 rounded-xl w-28 animate-pulse"></div>
        </div>
      </div>
    </div>
  </motion.div>
);

const RightCoursesDetalis = ({ searchQuery, selectedType }) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const { courses = [], loading = false } = useSelector((state) => state.courses || {});
  const { items: categories = [], selectedCategories = [] } = useSelector((state) => state.categories || {});

  const [sortBy, setSortBy] = useState("default");
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    dispatch(fetchCoursesData());
  }, [dispatch]);

  // Get category name from ID
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "";
    if (typeof categoryId === "object" && categoryId.name) return categoryId.name;
    if (typeof categoryId === "string" && categoryId.length < 20) return categoryId;
    const category = categories.find(cat => cat._id === categoryId || cat.id === categoryId);
    return category?.name || "";
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    if (!course) return false;

    const rawType = course?.courseType || course?.type || course?.mode || "";
    const cType = rawType.toString().toLowerCase();
    const sType = (selectedType || "All").toLowerCase();
    const typeMatch = sType === "all" || cType === sType;

    let categoryMatch = true;
    if (selectedCategories.length > 0) {
      const courseCategoryName = getCategoryName(course.category);
      categoryMatch = selectedCategories.includes(courseCategoryName);
    }

    const q = (searchQuery || "").trim().toLowerCase();
    const searchMatch =
      q === "" ||
      (course.title && course.title.toLowerCase().includes(q)) ||
      (course.technology && course.technology.toLowerCase().includes(q)) ||
      getCategoryName(course.category).toLowerCase().includes(q);

    return typeMatch && categoryMatch && searchMatch;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const aPrice = a.price || (parseInt(a.fee?.replace(/[^\d]/g, '') || 0));
    const bPrice = b.price || (parseInt(b.fee?.replace(/[^\d]/g, '') || 0));
    const aRating = a.averageRating || a.rating || 5;
    const bRating = b.averageRating || b.rating || 5;
    const aStudents = a.totalEnrollments || a.totalStudentsEnroll || 0;
    const bStudents = b.totalEnrollments || b.totalStudentsEnroll || 0;

    switch (sortBy) {
      case "rating":
        return bRating - aRating;
      case "price-low":
        return aPrice - bPrice;
      case "price-high":
        return bPrice - aPrice;
      case "students":
        return bStudents - aStudents;
      default:
        return 0;
    }
  });

  const sortOptions = [
    { value: "default", label: "Default", icon: LuArrowUpDown },
    { value: "rating", label: "Top Rated", icon: LuStar },
    { value: "students", label: "Most Popular", icon: LuUsers },
    { value: "price-low", label: "Price: Low → High", icon: LuDollarSign },
    { value: "price-high", label: "Price: High → Low", icon: LuTrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar - Enhanced */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm sticky top-20 z-10"
      >
        {/* Left - Course Count */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#E62D26]/10 to-[#F79952]/10 rounded-lg border border-[#E62D26]/20">
            <HiOutlineSparkles className="text-[#E62D26] text-sm" />
            <span className="text-slate-800 dark:text-white font-bold outfit text-sm">
              {sortedCourses.length}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">Courses Found</span>
          </div>
        </div>

        {/* Right - Sort & View Toggle */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown - Enhanced */}
          <div className="relative group flex-1 sm:flex-none">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E62D26]/20 focus:border-[#E62D26] cursor-pointer transition-all hover:bg-white dark:hover:bg-white/10"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <LuArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
          </div>

          {/* View Toggle - Enhanced */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-white/10 rounded-xl">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-2 rounded-lg transition-all ${isGridView 
                ? 'bg-white dark:bg-white/20 text-[#E62D26] shadow-sm' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
            >
              <LuLayoutGrid size={18} />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-2 rounded-lg transition-all ${!isGridView 
                ? 'bg-white dark:bg-white/20 text-[#E62D26] shadow-sm' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
            >
              <LuList size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Courses Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`grid gap-6 ${isGridView ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </motion.div>
        ) : sortedCourses.length > 0 ? (
          <motion.div 
            key="courses"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`grid gap-6 ${isGridView ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
          >
            {sortedCourses.map((course, index) => (
              <motion.div
                key={course?._id || course?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <CourseCard
                  course={course}
                  view={isGridView ? 'grid' : 'list'}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-20 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-3xl shadow-sm"
          >
            {/* Empty State Illustration */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E62D26]/20 to-[#F79952]/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                <LuSearch className="w-12 h-12 text-slate-300 dark:text-slate-600" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white outfit mb-2">
              No Courses Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-6">
              We couldn't find any courses matching your criteria. Try adjusting your filters or search query.
            </p>
            
            {/* Suggestions */}
            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
              <span className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full text-xs">
                Try different keywords
              </span>
              <span className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full text-xs">
                Clear all filters
              </span>
              <span className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full text-xs">
                Browse all categories
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RightCoursesDetalis;
