"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import SharedCourseCard from "@/components/sheard/CourseCard";

const CourseCardSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm">
      <div className="aspect-video bg-gray-200 dark:bg-gray-800" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-24" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-24" />
        </div>
      </div>
    </div>
  </div>
);

const PopularCourse = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { language, t } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const { items: categories = [] } = useSelector((state) => state.categories);
  const { courses = [], loading } = useSelector((state) => state.courses);

  const colors = {
    darkRed: "#300000",
    gold: "#D4AF37",
    bg: "#fafafa",
  };

  // Prepare Filters - Only show categories with type 'course'
  const courseCategories = categories.filter(cat => cat.type === 'course');

  const filters = [
    { id: 'all', label: t("popularCourse.allCourses") },
    ...courseCategories.map(cat => ({
      id: cat._id,
      label: language === 'bn' ? (cat.nameBn || cat.name).toUpperCase() : cat.name.toUpperCase()
    }))
  ];

  const filteredCourses = activeCategory === 'all'
    ? courses
    : courses.filter(c => (c.category?._id || c.category) === activeCategory);

  return (
    <section className="py-12 lg:py-16" style={{ backgroundColor: colors.bg }}>
      <div className="container mx-auto px-4">

        {/* Centered Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.darkRed, fontFamily: 'var(--font-poppins)' }}
          >
            {t("popularCourse.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-sm md:text-base opacity-70 leading-relaxed max-w-2xl mx-auto ${bengaliClass}`}
            style={{ color: colors.darkRed }}
          >
            {t("popularCourse.description")}
          </motion.p>
        </div>

        {/* Pill Filters */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
          {filters.map((filter, index) => (
            <motion.button
              key={filter.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveCategory(filter.id)}
              className={`px-6 py-2.5 md:px-8 md:py-3 rounded-full text-[10px] md:text-xs font-bold tracking-widest border transition-all duration-300 shadow-sm
                ${activeCategory === filter.id
                  ? 'text-white border-transparent'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
              style={{
                backgroundColor: activeCategory === filter.id ? colors.darkRed : 'white',
              }}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <CourseCardSkeleton key={i} />)}
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <motion.div
                      key={course._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SharedCourseCard course={course} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-20"
                  >
                    <p className={`text-gray-400 font-medium ${bengaliClass}`}>
                      {t("popularCourse.noCourses")}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

      </div>

      <style jsx global>{`
      `}</style>
    </section>
  );
};

export default PopularCourse;


