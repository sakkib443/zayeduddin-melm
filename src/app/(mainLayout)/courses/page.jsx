"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoursesData } from "@/redux/CourseSlice";
import { fetchCategories, setSelectedCategories } from "@/redux/categorySlice";
import Link from "next/link";
import CourseCard from "@/components/sheard/CourseCard";
import {
  LuSearch,
  LuGrid3X3,
  LuChevronDown,
  LuPalette,
  LuBookOpen,
  LuX,
  LuFilter,
  LuLayoutGrid
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

// Loading fallback component
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} className="animate-pulse bg-slate-50 dark:bg-white/5 rounded-3xl h-[400px]"></div>
    ))}
  </div>
);

const FilterDropdown = ({ label, options, value, onChange, icon: Icon, language, align = "left" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === (Array.isArray(value) ? value[0] : value));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border ${isOpen || (value && value !== 'All' && value !== 'default' && (Array.isArray(value) ? value.length !== 0 : true))
          ? "bg-[#300000] text-white border-[#300000] shadow-lg shadow-[#300000]/20"
          : "bg-white dark:bg-white/5 text-slate-500 border-slate-100 dark:border-white/10 hover:border-slate-300"
          }`}
      >
        {Icon && <Icon size={14} />}
        <span>{(selectedOption && selectedOption.value !== 'default' && selectedOption.value !== 'All') ? selectedOption.label.toUpperCase() : label.toUpperCase()}</span>
        <LuChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={14} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute top-full mt-2 w-64 bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 z-50 py-2 max-h-80 overflow-y-auto ${align === 'right' ? 'right-0' : 'left-0'}`}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-3 text-xs font-bold transition-colors flex items-center justify-between ${(Array.isArray(value) ? value.includes(opt.value) : value === opt.value)
                  ? "text-[#300000] bg-slate-50 dark:bg-white/5"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
              >
                <span>{opt.label.toUpperCase()}</span>
                {opt.count !== undefined && (
                  <span className="text-[10px] opacity-50 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full">{opt.count}</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CourseContent = () => {
  const dispatch = useDispatch();
  const { courses = [], loading } = useSelector((state) => state.courses || {});
  const { items: categories = [], selectedCategories = [] } = useSelector((state) => state.categories || {});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const { language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  useEffect(() => {
    dispatch(fetchCoursesData());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    if (!course) return false;

    // Type filter
    const rawType = course?.courseType || course?.type || course?.mode || "";
    const cType = rawType.toString().toLowerCase();
    const sType = (selectedType || "All").toLowerCase();
    const typeMatch = sType === "all" || cType === sType;

    // Category filter
    let categoryMatch = true;
    if (selectedCategories.length > 0) {
      const catName = typeof course.category === 'object' ? course.category.name : course.category;
      categoryMatch = selectedCategories.includes(catName);
    }

    // Search filter
    const q = (searchQuery || "").trim().toLowerCase();
    const searchMatch = q === "" ||
      (course.title && course.title.toLowerCase().includes(q)) ||
      (course.technology && course.technology.toLowerCase().includes(q));

    return typeMatch && categoryMatch && searchMatch;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'rating') return (b.averageRating || 5) - (a.averageRating || 5);
    return 0;
  });

  const getCategoryCount = (catName) => {
    if (catName === 'all') return courses.length;
    return courses.filter(course => {
      const courseCat = typeof course.category === 'object' ? course.category.name : course.category;
      return courseCat === catName;
    }).length;
  };

  const courseTypes = [
    { value: 'All', label: language === 'bn' ? 'সব' : 'All' },
    { value: 'Online', label: language === 'bn' ? 'অনলাইন' : 'Online' },
    { value: 'Offline', label: language === 'bn' ? 'অফলাইন' : 'Offline' },
    { value: 'Recorded', label: language === 'bn' ? 'রেকর্ডেড' : 'Recorded' }
  ];

  const sortOptions = [
    { value: 'default', label: language === 'bn' ? 'ডিফল্ট' : 'Default' },
    { value: 'rating', label: language === 'bn' ? 'টপ রেটেড' : 'Top Rated' },
    { value: 'price-low', label: language === 'bn' ? 'কম দাম' : 'Price: Low' },
    { value: 'price-high', label: language === 'bn' ? 'বেশি দাম' : 'Price: High' },
  ];

  const categoryOptions = [
    { value: 'All', label: language === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories', count: courses.length },
    ...categories.filter(c => c.name !== 'All').map(c => ({
      value: c.name,
      label: c.name,
      count: getCategoryCount(c.name)
    }))
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#020202]">
      {/* Header Section */}
      <header className="pt-24 pb-6 bg-white dark:bg-[#020202]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`text-4xl md:text-[50px] font-bold text-[#300000] mb-4 ${bengaliClass}`}>
              {language === 'bn' ? 'ট্রেনিং কোর্স' : 'Training Courses'}
            </h1>
            <p className={`text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10 ${bengaliClass}`}>
              {language === 'bn'
                ? 'আপনার দক্ষতা বাড়িয়ে পেশাদার ক্যারিয়ার গড়তে আমাদের প্রিমিয়াম কোর্সগুলো বেছে নিন।'
                : 'Choose our premium courses to enhance your skills and build a professional career with industry experts.'}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-16 px-4">
              <div className="relative group">
                <LuSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#300000] transition-colors" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'কোর্স বা টেকনোলজি খুঁজুন...' : 'Search courses or technology...'}
                  className="w-full pl-16 pr-8 py-5 md:py-6 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-full shadow-lg shadow-black/5 outline-none focus:ring-4 focus:ring-[#300000]/5 transition-all text-slate-800 dark:text-white dark:placeholder-slate-500"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors">
                    <LuX size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* New Filter Bar Layout */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-slate-50 dark:border-white/5 pb-8 lg:px-16">
              {/* Left Part: Type Pills & Category Dropdown */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Type Pills */}
                <div className="flex items-center p-1 bg-slate-50 dark:bg-white/5 rounded-full">
                  {courseTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`px-5 py-2 rounded-full text-[10px] font-bold transition-all duration-300 ${selectedType === type.value
                        ? "bg-[#300000] text-white shadow-md shadow-[#300000]/20"
                        : "text-slate-500 hover:text-[#300000]"
                        }`}
                    >
                      {type.label.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="hidden md:block w-px h-6 bg-slate-100 dark:bg-white/10 mx-1" />

                {/* Category Dropdown */}
                <FilterDropdown
                  label={language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  options={categoryOptions}
                  value={selectedCategories}
                  onChange={(val) => {
                    if (val === 'All') dispatch(setSelectedCategories([]));
                    else dispatch(setSelectedCategories([val]));
                  }}
                  icon={LuPalette}
                  language={language}
                />
              </div>

              {/* Right Part: Sort & View Toggle */}
              <div className="flex items-center gap-4">
                {/* Clear All Button (Floating style) */}
                {(selectedType !== 'All' || selectedCategories.length > 0 || sortBy !== 'default' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedType('All');
                      dispatch(setSelectedCategories([]));
                      setSortBy('default');
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                  >
                    <LuX size={12} />
                    <span>{language === 'bn' ? 'সব মুছুন' : 'CLEAR'}</span>
                  </button>
                )}

                {/* Sort Dropdown */}
                <FilterDropdown
                  label={language === 'bn' ? 'সর্ট করুন' : 'Sort By'}
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  icon={LuFilter}
                  language={language}
                  align="right"
                />

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-slate-50 dark:bg-white/5 p-1 rounded-full border border-slate-100 dark:border-white/10">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-full transition-all ${viewMode === "grid"
                      ? "bg-[#300000] text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    <LuGrid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-full transition-all ${viewMode === "list"
                      ? "bg-[#300000] text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    <LuLayoutGrid size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Content Section */}
      <main className="pb-24 pt-4">
        <div className="container mx-auto px-4 lg:px-16">
          {loading ? (
            <LoadingSkeleton />
          ) : sortedCourses.length === 0 ? (
            <div className="text-center py-24">
              <LuBookOpen className="mx-auto text-slate-200 mb-6" size={64} />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Courses found</h3>
              <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {sortedCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  view={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
                .font-script {
                    font-family: var(--font-poppins);
                }
            `}</style>
    </div>
  );
};

const CoursePage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#300000]/30 border-t-[#300000] rounded-full animate-spin"></div>
      </div>
    }>
      <CourseContent />
    </Suspense>
  );
};

export default CoursePage;
