"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { LuChevronLeft, LuChevronRight, LuSparkles, LuLayoutGrid } from "react-icons/lu";
import CourseCard from "../sheard/CourseCard";
import { useLanguage } from "@/context/LanguageContext";

// Loading Skeleton Component
const CourseCardSkeleton = () => (
  <div className="w-full md:w-[360px] animate-pulse">
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Image Skeleton */}
      <div className="h-48 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-shimmer"></div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded-lg w-1/3"></div>
        <div className="h-6 bg-gray-100 rounded-lg w-3/4"></div>
        <div className="h-4 bg-gray-100 rounded-lg w-1/2"></div>
        <div className="h-px bg-gray-50 my-3"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-100 rounded-lg w-1/4"></div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-4 bg-gray-100 rounded-full"></div>)}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PopularCourseCard = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startIndex, setStartIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const { language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const { items: courseCategories = [] } = useSelector((state) => state.categories);
  const { courses = [], loading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) setVisibleItems(1);
      else if (window.innerWidth <= 1024) setVisibleItems(2);
      else setVisibleItems(3);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter courses by category _id
  const filteredCourses =
    selectedCategory === "All"
      ? courses
      : courses.filter((course) => {
        const courseCategoryId = course.category?._id || course.category;
        return courseCategoryId === selectedCategory;
      });

  const visibleCourses = filteredCourses.slice(startIndex, startIndex + visibleItems);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStartIndex((prevIndex) =>
      prevIndex - 1 < 0 ? Math.max(filteredCourses.length - visibleItems, 0) : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStartIndex((prevIndex) =>
      prevIndex + visibleItems >= filteredCourses.length ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setStartIndex(0);
  };

  return (
    <div className="relative">


      {/* Courses Display with Navigation */}
      <div className="relative px-4 sm:px-12 lg:px-20">
        {/* Navigation Buttons */}
        {!loading && filteredCourses.length > visibleItems && (
          <>
            <button
              onClick={handlePrev}
              disabled={isAnimating}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:bg-[#E62D26] hover:text-white hover:border-[#E62D26] hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              <LuChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:bg-[#E62D26] hover:text-white hover:border-[#E62D26] hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              <LuChevronRight size={20} />
            </button>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center gap-6 lg:gap-8 overflow-hidden">
            {[1, 2, 3].slice(0, visibleItems).map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className={`text-gray-600 text-lg font-medium ${bengaliClass}`}>
              {language === 'bn' ? '????? ??? ???? ??????' : 'Failed to load courses'}
            </p>
            <p className="text-gray-400 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Course Cards Grid */}
        {!loading && !error && (
          <div className="flex justify-center gap-6 lg:gap-8 overflow-hidden">
            {visibleCourses.length > 0 ? (
              visibleCourses.map((course, index) => (
                <div
                  key={course.id || course._id}
                  className={`transition-all duration-400 ${isAnimating ? "opacity-0 scale-95 translate-y-2" : "opacity-100 scale-100 translate-y-0"}`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <div className="text-center py-16 w-full">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <LuSparkles className="w-10 h-10 text-gray-300" />
                </div>
                <p className={`text-gray-500 text-lg ${bengaliClass}`}>
                  {language === 'bn' ? '?? ??????????? ??? ????? ???' : 'No courses found in this category'}
                </p>
                <p className={`text-gray-400 text-sm mt-1 ${bengaliClass}`}>
                  {language === 'bn' ? '???? ????????? ???????? ????' : 'Try selecting a different category'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination Dots */}
        {!loading && filteredCourses.length > visibleItems && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: Math.ceil(filteredCourses.length / visibleItems) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setStartIndex(index * visibleItems)}
                className={`transition-all duration-300 rounded-full ${Math.floor(startIndex / visibleItems) === index
                  ? "w-8 h-2 bg-[#E62D26]"
                  : "w-2 h-2 bg-gray-200 hover:bg-gray-300"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Shimmer Animation Style */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default PopularCourseCard;
