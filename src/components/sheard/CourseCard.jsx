"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import { BiCategory } from "react-icons/bi";
import { FaStar, FaArrowRight } from "react-icons/fa";
import { LuBookOpenCheck, LuClock, LuUsers, LuPlay, LuLayoutGrid, LuShoppingCart, LuHeart, LuList, LuCheck, LuEye, LuSparkles } from "react-icons/lu";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/providers/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

const CourseCard = ({ course, view = "grid" }) => {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const courseId = course._id || course.id;
  const { items: categories = [] } = useSelector((state) => state.categories);
  const { t, language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  // Get category name from ID or object
  const getCategoryName = (categoryData) => {
    if (!categoryData) return t("coursesPage.category") || "General";
    if (typeof categoryData === "object" && categoryData.name) return categoryData.name;
    const category = categories.find(cat => cat._id === categoryData || cat.id === categoryData);
    return category?.name || categoryData || "General";
  };

  // Field mapping - bilingual
  const title = language === 'bn' && course.titleBn ? course.titleBn : (course.title || "Untitled Course");
  const thumbnail = course.thumbnail || course.image || "/placeholder-course.jpg";
  const price = course.price !== undefined ? course.price : (parseInt(course.fee?.replace(/[^\d]/g, '') || 0));
  const discountPrice = course.discountPrice || course.offerPrice;
  const type = course.courseType || course.type || "Recorded";
  const totalLessons = course.totalLessons || course.totalVideos || 10;
  const lessons = language === 'bn' ? `${totalLessons} লেসন` : `${totalLessons} Lessons`;
  const students = course.totalEnrollments !== undefined
    ? (language === 'bn' ? `${course.totalEnrollments}+ শিক্ষার্থী` : `${course.totalEnrollments}+ Enrolled`)
    : (language === 'bn' ? '৫০+ শিক্ষার্থী' : '50+ Enrolled');
  const rating = course.averageRating || course.rating || 5;
  const lastUpdated = course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : "Recently Updated";
  const duration = course.duration || course.totalDuration || "3 Months";
  const displayPrice = discountPrice && discountPrice > 0 ? discountPrice : price;

  // Handle Add to Cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      id: courseId,
      title: title,
      price: displayPrice,
      image: thumbnail,
      type: "course"
    }));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const colors = {
    darkRed: "#021E14",
    gold: "#D4AF37",
    lightGold: "#F5E6BE",
    bg: "#ffffff"
  };

  // List View Rendering
  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="group w-full flex flex-col md:flex-row bg-white dark:bg-[#0d0d0d] rounded-md border border-slate-100 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        {/* Left: Image (35%) */}
        <div className="relative w-full md:w-[35%] h-56 md:h-auto shrink-0 overflow-hidden p-3">
          <Link href={`/courses/${courseId}`} className="block h-full w-full">
            <Image
              width={400}
              height={300}
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover rounded-md transition-transform duration-700 group-hover:scale-105"
            />
          </Link>
          {/* Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px]">
            <Link href={`/courses/${courseId}`} className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-md flex items-center justify-center text-white border border-white/50 hover:bg-[#021E14] hover:border-[#021E14] transition-all hover:scale-110">
              <LuPlay className="ml-1" size={20} fill="currentColor" />
            </Link>
          </div>
        </div>

        {/* Middle: Content (40%) */}
        <div className="flex-1 p-6 border-r border-slate-50 dark:border-white/5 flex flex-col justify-center">
          <Link href={`/courses/${courseId}`}>
            <h3 className={`text-[22px] font-bold text-slate-800 dark:text-white leading-tight mb-2 hover:text-[#021E14] transition-colors ${bengaliClass}`}>
              {title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mb-4 text-[15px] text-slate-500">
            <span className="italic">in</span>
            <span className="font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-[15px] uppercase tracking-wide">
              {getCategoryName(course.category)}
            </span>
          </div>

          <ul className="space-y-2 mb-4">
            <li className="flex items-start gap-2 text-[15px] text-slate-600 dark:text-slate-400">
              <LuClock className="text-[#D4AF37] mt-0.5 shrink-0" size={16} />
              <span>Duration: {duration}</span>
            </li>
            <li className="flex items-start gap-2 text-[15px] text-slate-600 dark:text-slate-400">
              <LuUsers className="text-[#D4AF37] mt-0.5 shrink-0" size={16} />
              <span>{students}</span>
            </li>
            <li className="flex items-start gap-2 text-[15px] text-slate-600 dark:text-slate-400">
              <LuCheck className="text-[#D4AF37] mt-0.5 shrink-0" size={16} />
              <span>Lifetime Access</span>
            </li>
          </ul>
        </div>

        {/* Right: Actions (25%) */}
        <div className="w-full md:w-[25%] p-6 bg-slate-50/50 dark:bg-white/5 flex flex-col items-center justify-center text-center gap-1 border-l border-slate-100 dark:border-white/5">
          <div className="flex w-full justify-end gap-2 mb-2 text-slate-400">
            <button className="hover:text-[#021E14] transition-colors"><LuList size={18} /></button>
            <button className="hover:text-[#D4AF37] transition-colors"><LuHeart size={18} /></button>
          </div>

          <div className="text-3xl font-bold text-[#021E14] font-serif italic mb-1">
            ৳{(discountPrice || price).toLocaleString()}
          </div>

          <div className="flex text-[#D4AF37] gap-0.5 text-xs mb-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.round(rating) ? "fill-current" : "text-slate-200 dark:text-slate-600"} />
            ))}
            <span className="text-slate-400 ml-1 font-medium text-[15px]">({course.reviews?.length || 0})</span>
          </div>

          <p className="text-[15px] text-slate-500 dark:text-slate-400 mb-1">{students}</p>
          <p className="text-[15px] text-slate-400 mb-4">Last updated: {lastUpdated}</p>

          <div className="flex items-center gap-3 w-full">
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`p-2.5 border rounded-md transition-all shadow-sm ${isAdded ? 'bg-[#021E14] border-[#021E14] text-white' : 'bg-white dark:bg-white/10 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white hover:text-[#021E14] hover:border-[#021E14]'}`}
            >
              {isAdded ? <LuCheck size={20} /> : <LuShoppingCart size={20} />}
            </button>
            <Link
              href={`/courses/${courseId}`}
              className="flex-1 py-2.5 bg-white dark:bg-white/10 border border-[#021E14] text-[#021E14] rounded-md text-[15px] font-medium hover:bg-[#021E14] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Details
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View Rendering - Enhanced
  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group w-full h-full flex flex-col pt-4"
    >
      <div className={`relative h-full bg-white dark:bg-[#0d0d0d] rounded-md border border-slate-100 dark:border-white/10 overflow-hidden hover:shadow-2xl hover:border-[#021E14]/20 transition-all duration-500 flex flex-col shadow-lg shadow-black/5`}>

        {/* Image Section */}
        <div className="relative h-64 w-full overflow-hidden shrink-0">
          <Link href={`/courses/${courseId}`} className="block h-full w-full">
            <Image
              width={400}
              height={250}
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </Link>

          {/* Type Badge (Top Left) */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[15px] font-bold text-white shadow-lg backdrop-blur-md bg-[#021E14]/80`}>
              <LuSparkles size={10} />
              {type.toUpperCase()}
            </span>
          </div>

          {/* Play Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-300"
          >
            <Link href={`/courses/${courseId}`} className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-md flex items-center justify-center text-white border-2 border-white/40 hover:bg-[#021E14] hover:border-[#021E14] transition-all hover:scale-110 shadow-2xl">
              <LuPlay className="ml-1" size={20} fill="currentColor" />
            </Link>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="px-5 py-4 flex flex-col flex-1 relative">
          {/* Category */}
          <div className="mb-1.5">
            <span className={`text-[15px] font-bold text-[#D4AF37] uppercase tracking-widest ${bengaliClass}`}>
              {getCategoryName(course.category)}
            </span>
          </div>

          {/* Title */}
          <Link href={`/courses/${courseId}`} className="mb-2 block">
            <h3 className={`text-xl font-bold text-slate-800 dark:text-white leading-snug line-clamp-2 hover:text-[#021E14] transition-colors ${bengaliClass}`}>
              {title}
            </h3>
          </Link>

          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-50 dark:border-white/5">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <div className="flex items-center gap-1">
                <LuBookOpenCheck className="text-[#021E14]" size={12} />
                <span>{lessons}</span>
              </div>
              <div className="flex items-center gap-1">
                <LuUsers className="text-[#021E14]" size={12} />
                <span>{students}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <FaStar className="text-[#D4AF37]" size={12} />
              <span className="text-[15px] font-bold text-slate-700 dark:text-slate-300">{rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between mt-auto gap-4">
            <div className="flex flex-col">
              <span className="text-[15px] text-slate-400 font-bold uppercase tracking-tighter">PRICE</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-serif italic font-bold text-[#021E14]">
                  ৳{(discountPrice || price).toLocaleString()}
                </span>
                {discountPrice && (
                  <span className="text-[15px] text-slate-300 line-through">৳{price.toLocaleString()}</span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${isAdded
                  ? 'bg-[#021E14] text-white'
                  : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white hover:bg-[#021E14] hover:text-white'
                  }`}
              >
                {isAdded ? <LuCheck size={18} /> : <LuShoppingCart size={18} />}
              </button>
              <Link
                href={`/courses/${courseId}`}
                className="w-10 h-10 rounded-md bg-[#021E14] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#021E14]/20"
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

export default CourseCard;
