/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchCoursesData, fetchSingleCourse, toggleCourseLike } from "@/redux/CourseSlice";
import { useLanguage } from "@/context/LanguageContext";
import { addToCart } from "@/redux/cartSlice";
import {
  LuDownload, LuExternalLink, LuClock, LuTrophy,
  LuLayoutGrid, LuEye, LuPackage, LuShieldCheck,
  LuSettings, LuFileCode, LuGlobe, LuCheck, LuSparkles, LuCode, LuZap, LuImage, LuX, LuBookOpen, LuMonitor, LuVideo, LuUsers, LuCalendar, LuTimer, LuGraduationCap
} from "react-icons/lu";
import { FaHeart, FaRegHeart, FaStar, FaArrowRight } from "react-icons/fa";
import { MdVerified, MdOutlineMenuBook, MdPlayCircleOutline } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ReviewsSection from "@/components/Reviews/ReviewsSection";
import { API_URL } from "@/config/api";

// Animated Counter - matching Website Details
const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (value === 0) { setCount(0); return; }
    const duration = 1200;
    const steps = 50;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };
  return <span className="tabular-nums">{formatNumber(count)}</span>;
};

const SingleCourse = () => {
  const { courseid: id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  const { courses = [], currentCourse: reduxCourse, loading } = useSelector((state) => state.courses || {});

  const [activeTab, setActiveTab] = useState("overview");
  const [currentCourse, setCurrentCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [popularCourses, setPopularCourses] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [expandedModules, setExpandedModules] = useState([0]); // First module expanded by default
  const [showVideoModal, setShowVideoModal] = useState(false);

  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  // Helper to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;
    // youtube.com/watch?v=ID
    const match1 = url.match(/[?&]v=([^&#]+)/);
    // youtu.be/ID
    const match2 = url.match(/youtu\.be\/([^?&#]+)/);
    // youtube.com/embed/ID
    const match3 = url.match(/youtube\.com\/embed\/([^?&#]+)/);
    videoId = match1?.[1] || match2?.[1] || match3?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
  };

  const courseVideoUrl = currentCourse?.previewVideo || currentCourse?.videoUrl || currentCourse?.introVideo || null;

  useEffect(() => {
    dispatch(fetchSingleCourse(id));
    dispatch(fetchCoursesData());
    fetchBatches();
  }, [dispatch, id]);

  const fetchBatches = async () => {
    try {
      setLoadingBatches(true);
      // Fetch batches for this course (without isActive filter to get all)
      const res = await fetch(`${API_URL}/batches?course=${id}`);
      const data = await res.json();
      console.log('Batches API response:', data);
      if (data.success) {
        // Filter only active batches on frontend
        const activeBatches = (data.data || []).filter(b => b.isActive !== false);
        setBatches(activeBatches);
        console.log('Active batches:', activeBatches);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoadingBatches(false);
    }
  };

  useEffect(() => {
    dispatch(fetchSingleCourse(id));
    dispatch(fetchCoursesData());
  }, [dispatch, id]);

  useEffect(() => {
    if (reduxCourse) {
      setCurrentCourse(reduxCourse);
      // Set instructor from course data if available
      if (reduxCourse.instructor) {
        setInstructor(reduxCourse.instructor);
      }
    }
  }, [reduxCourse]);

  useEffect(() => {
    if (courses && courses.length > 0) {
      setPopularCourses(courses.filter((c) => (c._id !== id && c.id !== id)).slice(0, 3));
    }
  }, [courses, id]);

  const handleAddToCart = () => {
    if (!currentCourse) return;
    dispatch(addToCart({
      id: currentCourse._id,
      title: currentCourse.title,
      price: currentCourse.price,
      image: currentCourse.thumbnail || currentCourse.image || "/images/placeholder.png",
      type: 'course'
    }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const handleToggleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to like this course");
      router.push('/login');
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    try {
      await dispatch(toggleCourseLike(id)).unwrap();
    } catch (err) {
      console.error("Like error:", err);
      alert(err.message || "Failed to like. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  // Loading State
  if (loading && !currentCourse) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-200 dark:border-slate-700 border-t-[#300000] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400 dark:text-gray-500 text-sm font-medium tracking-wide poppins">Loading course...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (!currentCourse && !loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-slate-950 dark:to-slate-900 px-4">
        <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-md flex items-center justify-center mb-6">
          <LuBookOpen className="text-gray-300 dark:text-slate-600 text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white outfit mb-2">Course Not Found</h3>
        <p className="text-gray-500 dark:text-gray-400 poppins text-sm mb-6 text-center max-w-sm">The course you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => router.push('/courses')}
          className="px-6 py-2.5 bg-[#300000] text-white text-sm font-semibold rounded-md hover:bg-[#300000]/90 transition-colors"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  const price = currentCourse.price || 0;
  const discountPrice = currentCourse.discountPrice;

  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950">
      {/* Hero Section - with Dark Mode Support */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f0fffe] via-[#e8f9f8] to-[#f5f5ff] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-12 pb-28 lg:pt-16 lg:pb-36">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#300000]/10 dark:from-[#300000]/5 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-400/8 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Animated Shapes */}
        <div className="absolute top-20 right-[15%] w-20 h-20 border-2 border-[#300000]/20 rounded-2xl rotate-12 animate-float"></div>
        <div className="absolute bottom-32 left-[10%] w-16 h-16 border-2 border-[#D4AF37]/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-[8%] w-12 h-12 bg-[#300000]/10 rounded-xl rotate-45 animate-float" style={{ animationDelay: '2s' }}></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"></div>

        <div className="container mx-auto px-4 lg:px-24 relative z-10">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 poppins"
            >
              <Link href="/" className="hover:text-[#300000] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/courses" className="hover:text-[#300000] transition-colors">Courses</Link>
              <span>/</span>
              <span className="text-gray-700 dark:text-white font-medium truncate max-w-[200px]">{currentCourse.title}</span>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2 mb-5"
            >
              <span className="px-3 py-1 bg-[#300000] rounded text-white text-[11px] font-bold uppercase tracking-wider poppins">
                {currentCourse.courseType || 'Recorded'}
              </span>
              <span className="px-3 py-1 bg-white/90 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-600 dark:text-gray-300 text-[11px] font-bold uppercase tracking-wider poppins">
                {currentCourse.level || 'Beginner'}
              </span>
              {currentCourse.isFeatured && (
                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <LuSparkles size={10} /> Featured
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold outfit leading-[1.2] tracking-tight text-gray-900 dark:text-white mb-4"
            >
              {currentCourse.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 poppins leading-relaxed mb-6 max-w-2xl"
            >
              {currentCourse.shortDescription || currentCourse.description?.substring(0, 160)}...
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap items-center gap-3 mb-5"
            >
              {/* Rating */}
              <div className="flex items-center gap-2 bg-white px-8 py-2.5 rounded-md border border-gray-200">
                <div className="flex text-amber-400 gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => <FaStar key={s} size={12} />)}
                </div>
                <span className="font-bold outfit text-gray-900">{currentCourse.averageRating || '5.0'}</span>
                <span className="text-gray-400 text-xs poppins">({currentCourse.reviewCount || 0})</span>
              </div>

              {/* Students */}
              <div className="flex items-center gap-3 bg-white px-8 py-2.5 rounded-md border border-gray-200">
                <div className="w-7 h-7 rounded bg-emerald-50 flex items-center justify-center">
                  <LuUsers className="text-emerald-600" size={14} />
                </div>
                <span className="text-gray-700 font-medium text-sm poppins">
                  <AnimatedCounter value={currentCourse.totalEnrollments || 0} />
                  <span className="text-gray-400 ml-1">students</span>
                </span>
              </div>

              {/* Lessons */}
              <div className="flex items-center gap-3 bg-white px-8 py-2.5 rounded-md border border-gray-200">
                <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center">
                  <LuMonitor className="text-blue-600" size={14} />
                </div>
                <span className="text-gray-700 font-medium text-sm poppins">
                  <AnimatedCounter value={currentCourse.totalLessons || 0} />
                  <span className="text-gray-400 ml-1">lessons</span>
                </span>
              </div>
            </motion.div>

            {/* Instructor & Like mirroring style */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-200">
                <span className="text-gray-400 text-sm poppins">Instructor</span>
                <span className="text-[#300000] font-semibold text-sm outfit underline underline-offset-4">{instructor?.name || 'Industry Expert'}</span>
                <MdVerified className="text-blue-500" size={16} />
              </div>

              <button
                onClick={handleToggleLike}
                disabled={isLiking}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all ${currentCourse.isLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-rose-200 hover:text-rose-500'
                  }`}
              >
                {currentCourse.isLiked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                <span className="font-semibold text-sm poppins">
                  <AnimatedCounter value={currentCourse.likeCount || 0} />
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 lg:px-24 pb-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Mobile Pricing Card */}
              <div className="lg:hidden bg-white dark:bg-slate-900 rounded-md border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="relative group cursor-pointer" onClick={() => { if (courseVideoUrl) setShowVideoModal(true); }}>
                  <img src={currentCourse.thumbnail || currentCourse.image || "/images/placeholder.png"} alt={currentCourse.title} className="w-full aspect-video object-cover" />
                  {courseVideoUrl && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 bg-[#300000] rounded-full flex items-center justify-center shadow-lg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="ml-1">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900 outfit">৳{price.toLocaleString()}</span>
                    {discountPrice && <span className="text-gray-400 line-through text-sm">৳{(price + 2000).toLocaleString()}</span>}
                  </div>
                  <button onClick={handleBuyNow} className="w-full py-3 bg-[#300000] text-white font-semibold rounded-md active:scale-[0.98] transition-transform poppins">
                    Enroll Now
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
                {/* Tab Headers */}
                <div className="flex border-b border-gray-100 bg-gray-50/80">
                  {[
                    { id: "overview", label: "Overview", icon: LuLayoutGrid },
                    { id: "curriculum", label: "Curriculum", icon: MdOutlineMenuBook },
                    { id: "whatyoulearn", label: "Learning", icon: LuZap },
                    { id: "instructor", label: "Instructor", icon: LuUsers },
                    { id: "reviews", label: "Reviews", icon: FaStar },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 -mb-[1px] poppins ${activeTab === tab.id
                        ? "text-[#300000] border-[#300000] bg-white"
                        : "text-gray-500 border-transparent hover:text-gray-700"
                        }`}
                    >
                      <tab.icon size={16} />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6 lg:p-8">
                  <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-8"
                      >
                        {/* About */}
                        <div>
                          <h2 className="text-lg font-bold outfit text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-[#300000] rounded-full"></span>
                            Course Description
                          </h2>
                          <div className="text-gray-600 poppins text-[15px] leading-7 whitespace-pre-line">
                            {currentCourse.description || currentCourse.details}
                          </div>
                        </div>

                        {/* Course Features mirroring Tech Stack */}
                        {currentCourse.features?.length > 0 && (
                          <div>
                            <h3 className="text-base font-bold outfit text-gray-900 mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-amber-500 rounded-full"></span>
                              Key Features
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {currentCourse.features.map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-gray-700 font-medium text-sm hover:border-[#300000]/30 hover:bg-[#300000]/5 transition-colors cursor-default poppins"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "curriculum" && (
                      <motion.div
                        key="curriculum"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-bold outfit text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                            Course Curriculum
                          </h2>
                          {currentCourse.curriculum?.length > 0 && (
                            <div className="flex items-center gap-3 text-xs text-gray-500 poppins">
                              <span className="flex items-center gap-1.5">
                                <LuLayoutGrid size={13} />
                                {currentCourse.curriculum.length} Modules
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MdPlayCircleOutline size={14} />
                                {currentCourse.curriculum.reduce((sum, m) => sum + (m.totalLessons || 0), 0)} Lessons
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          {currentCourse.curriculum?.map((module, idx) => {
                            const isExpanded = expandedModules?.includes(idx);
                            const durationMinutes = module.totalDuration || 0;
                            const durationText = durationMinutes >= 60
                              ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
                              : `${durationMinutes} min`;

                            return (
                              <div key={idx} className="border border-gray-200 dark:border-slate-700 rounded-md overflow-hidden bg-white dark:bg-slate-900">
                                {/* Module Header - Clickable */}
                                <button
                                  onClick={() => {
                                    setExpandedModules(prev => {
                                      if (prev.includes(idx)) {
                                        return prev.filter(i => i !== idx);
                                      } else {
                                        return [...prev, idx];
                                      }
                                    });
                                  }}
                                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="w-8 h-8 rounded-md bg-[#300000]/10 dark:bg-[#300000]/10 text-[#300000] flex items-center justify-center font-bold text-xs outfit shrink-0">
                                      {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <div className="min-w-0">
                                      <h3 className="font-semibold text-gray-900 dark:text-white outfit text-sm truncate">{module.moduleTitle}</h3>
                                      <p className="text-[11px] text-gray-400 poppins mt-0.5">
                                        {module.totalLessons || 0} Lessons {durationMinutes > 0 && `• ${durationText}`}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-all shrink-0 ${isExpanded ? 'bg-[#300000]/10 dark:bg-[#300000]/10 text-[#300000] rotate-180' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                  </div>
                                </button>

                                {/* Lessons List - Collapsible */}
                                {isExpanded && module.lessons?.length > 0 && (
                                  <div className="border-t border-gray-100 dark:border-slate-800 divide-y divide-gray-50 dark:divide-slate-800/50">
                                    {module.lessons.map((lesson, lIdx) => {
                                      const lessonDuration = lesson.videoDuration || 0;
                                      const lessonDurText = lessonDuration >= 60
                                        ? `${Math.floor(lessonDuration / 60)}:${String(lessonDuration % 60).padStart(2, '0')}`
                                        : `0:${String(lessonDuration).padStart(2, '0')}`;

                                      return (
                                        <div key={lIdx} className="flex items-center justify-between px-4 py-3 pl-[52px] hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group">
                                          <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <MdPlayCircleOutline className="text-gray-300 dark:text-slate-600 group-hover:text-[#300000] transition-colors shrink-0" size={18} />
                                            <span className="text-sm text-gray-600 dark:text-gray-400 poppins group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate">
                                              {lesson.title}
                                            </span>
                                            {lesson.isFree && (
                                              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-500/20 shrink-0">
                                                FREE
                                              </span>
                                            )}
                                          </div>
                                          {lessonDuration > 0 && (
                                            <span className="text-[11px] font-medium text-gray-400 poppins ml-3 shrink-0">
                                              {lessonDurText}
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Empty module */}
                                {isExpanded && (!module.lessons || module.lessons.length === 0) && (
                                  <div className="border-t border-gray-100 dark:border-slate-800 px-4 py-6 text-center">
                                    <p className="text-xs text-gray-400 poppins">No lessons available in this module yet.</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Empty State */}
                          {!currentCourse.curriculum?.length && (
                            <div className="text-center py-12 border border-dashed border-gray-200 dark:border-slate-700 rounded-md">
                              <MdOutlineMenuBook className="mx-auto text-3xl text-gray-300 dark:text-slate-600 mb-3" />
                              <p className="text-gray-400 text-sm poppins">Curriculum details coming soon.</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "whatyoulearn" && (
                      <motion.div
                        key="whatyoulearn"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h2 className="text-lg font-bold outfit text-gray-900 mb-5 flex items-center gap-2">
                          <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                          What You Will Learn
                        </h2>

                        {currentCourse.whatYouWillLearn?.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {currentCourse.whatYouWillLearn.map((topic, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-md hover:border-[#300000]/30 hover:bg-[#300000]/5 transition-colors"
                              >
                                <div className="w-8 h-8 rounded bg-[#300000]/10 flex items-center justify-center flex-shrink-0">
                                  <LuCheck className="text-[#300000]" size={16} strokeWidth={3} />
                                </div>
                                <span className="text-gray-700 font-medium text-sm leading-relaxed pt-1 poppins">{topic}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-gray-50 rounded-md border border-dashed border-gray-200">
                            <LuZap className="mx-auto text-2xl text-gray-300 mb-2" />
                            <p className="text-gray-400 text-sm poppins">Learning topics not listed yet</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "instructor" && (
                      <motion.div
                        key="instructor"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-8"
                      >
                        <h2 className="text-lg font-bold outfit text-gray-900 mb-6 flex items-center gap-2">
                          <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                          Meet Your Instructor
                        </h2>

                        {instructor ? (
                          <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="relative group">
                              <div className="absolute -inset-1 bg-gradient-to-tr from-[#300000] to-[#D4AF37] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                              <div className="relative w-40 h-40 rounded-xl overflow-hidden border-2 border-white shadow-lg">
                                <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover transform transition-transform group-hover:scale-105 duration-500" />
                              </div>
                            </div>
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-bold outfit text-gray-900">{instructor.name}</h3>
                                <MdVerified className="text-blue-500 text-xl" />
                              </div>
                              <p className="text-[#300000] font-semibold poppins text-base">{instructor.designation} • {instructor.subject}</p>
                              <p className="text-gray-600 poppins text-sm leading-relaxed">
                                {instructor.details?.substring(0, 300)}...
                              </p>
                              <div className="flex gap-3 pt-2">
                                <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md hover:bg-[#300000]/5 hover:border-[#300000]/30 transition-colors text-gray-700 text-xs font-bold poppins">VIEW PROFILE</button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-10 bg-gray-50 rounded-md border border-dashed border-gray-200">
                            <LuUsers className="mx-auto text-2xl text-gray-300 mb-2" />
                            <p className="text-gray-400 text-sm poppins">Instructor details coming soon</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "reviews" && (
                      <motion.div
                        key="reviews"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ReviewsSection productId={currentCourse._id} productType="course" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Sidebar - 100% Mirror of Website Details */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-24 -mt-[28rem] space-y-5">
                {/* Pricing Card */}
                <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                  {/* Image mirroring Website Gallery/Preview */}
                  <div className="relative aspect-video group cursor-pointer overflow-hidden bg-gray-100"
                    onClick={() => { if (courseVideoUrl) setShowVideoModal(true); }}
                  >
                    <img
                      src={currentCourse.thumbnail || currentCourse.image || "/images/placeholder.png"}
                      alt={currentCourse.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {courseVideoUrl && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-[#300000] rounded-full flex items-center justify-center shadow-lg shadow-[#300000]/30 group-hover:scale-110 transition-transform">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1">
                            <polygon points="5,3 19,12 5,21" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-5">
                    {/* Price */}
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900 outfit">৳{price.toLocaleString()}</span>
                        {discountPrice && (
                          <span className="text-gray-400 line-through text-sm">৳{(price + 2000).toLocaleString()}</span>
                        )}
                      </div>
                      <p className="text-[#300000] text-xs font-semibold uppercase tracking-wide mt-1 poppins">Full Lifetime Access</p>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-2.5">
                      <button
                        onClick={handleBuyNow}
                        className="w-full py-3 bg-[#300000] hover:bg-[#300000]/90 text-white font-semibold rounded-md transition-colors flex items-center justify-center gap-2 poppins"
                      >
                        Enroll Now <FaArrowRight size={12} />
                      </button>
                      <button
                        onClick={handleAddToCart}
                        className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-md hover:border-[#300000] hover:text-[#300000] transition-colors poppins"
                      >
                        Add to Cart
                      </button>

                    </div>

                    {/* What's Included mirroring Website style */}
                    <div className="pt-4 border-t border-gray-100">
                      <h5 className="text-sm font-bold text-gray-900 mb-3 outfit">Course Includes</h5>
                      <ul className="space-y-2.5">
                        {[
                          { icon: LuMonitor, text: `${currentCourse.totalLessons || 0}+ Video Lessons` },
                          { icon: LuClock, text: `${currentCourse.totalDuration || '12 Hours'} Duration` },
                          { icon: LuTrophy, text: 'Completion Certificate' },
                          { icon: LuShieldCheck, text: 'Lifetime Updates' },
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2.5 text-gray-600 text-sm poppins">
                            <item.icon className="text-[#300000]" size={15} />
                            <span>{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Batch Information Section - Shows if batches exist for this course */}
                {batches.length > 0 && (
                  <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-md border border-indigo-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3">
                      <h3 className="text-white font-bold outfit flex items-center gap-2">
                        <LuGraduationCap size={18} />
                        Available Batches
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {batches.slice(0, 3).map((batch, idx) => (
                        <div
                          key={batch._id}
                          className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${idx === 0
                            ? 'bg-white border-indigo-200 shadow-sm'
                            : 'bg-gray-50/50 border-gray-200 hover:border-indigo-200'
                            }`}
                        >
                          {/* Batch Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${batch.status === 'upcoming'
                                ? 'bg-amber-100 text-amber-700'
                                : batch.status === 'ongoing'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                                }`}>
                                {batch.status?.toUpperCase()}
                              </span>
                              {idx === 0 && (
                                <span className="px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold rounded">
                                  RECOMMENDED
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-medium text-gray-400 poppins">
                              {batch.enrolledStudents?.length || 0}/{batch.maxStudents} Seats
                            </span>
                          </div>

                          {/* Batch Name & Code */}
                          <h4 className="font-bold text-gray-900 outfit text-base mb-1">{batch.batchName}</h4>
                          <p className="text-xs text-indigo-600 font-semibold poppins mb-3">Code: {batch.batchCode}</p>

                          {/* Batch Details Grid */}
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100">
                              <div className="w-7 h-7 rounded bg-green-50 flex items-center justify-center">
                                <LuCalendar className="text-green-600" size={14} />
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Start Date</p>
                                <p className="text-xs font-semibold text-gray-800">
                                  {new Date(batch.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100">
                              <div className="w-7 h-7 rounded bg-[#300000]/10 flex items-center justify-center">
                                <LuTimer className="text-[#300000]" size={14} />
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Last Date</p>
                                <p className="text-xs font-semibold text-gray-800">
                                  {batch.enrollmentDeadline
                                    ? new Date(batch.enrollmentDeadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                                    : new Date(batch.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                                  }
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Schedule Preview */}
                          {batch.schedule?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {batch.schedule.slice(0, 3).map((sch, sIdx) => (
                                <span key={sIdx} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-medium rounded capitalize">
                                  {sch.day} {sch.startTime}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Progress Bar for Seats */}
                          <div className="mb-3">
                            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                              <span>Enrollment Progress</span>
                              <span>{Math.round(((batch.enrolledStudents?.length || 0) / batch.maxStudents) * 100)}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                                style={{ width: `${((batch.enrolledStudents?.length || 0) / batch.maxStudents) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Enroll Button */}
                          <button
                            onClick={() => {
                              handleAddToCart();
                              router.push('/cart');
                            }}
                            className={`w-full py-2.5 rounded-md font-semibold text-sm transition-all poppins ${idx === 0
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-200'
                              : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                              }`}
                          >
                            Enroll in {batch.batchName}
                          </button>
                        </div>
                      ))}

                      {batches.length > 3 && (
                        <button className="w-full py-2 text-indigo-600 font-medium text-sm border border-dashed border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors poppins">
                          View All {batches.length} Batches
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Recommended Courses Widget mirroring Website Popular Websites */}
                <div className="bg-white rounded-md p-5 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 outfit">Popular Courses</h3>
                  <div className="space-y-4">
                    {popularCourses.map(item => (
                      <Link href={`/courses/${item._id}`} key={item._id} className="flex gap-3 group">
                        <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                          <img
                            src={item.thumbnail || item.image || "/images/placeholder.png"}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#300000] transition-colors line-clamp-1 outfit">{item.title}</h4>
                          <div className="flex items-center gap-1 text-amber-400 mt-0.5">
                            <FaStar size={10} />
                            <span className="text-gray-600 text-xs font-medium poppins">{item.averageRating || '5.0'}</span>
                          </div>
                          <span className="text-[#300000] font-bold text-xs poppins">৳{item.price?.toLocaleString()}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/courses"
                    className="flex items-center justify-center w-full py-2.5 mt-4 text-[#300000] font-semibold text-sm border border-dashed border-[#300000]/20 rounded-md hover:bg-[#300000]/5 transition-colors poppins"
                  >
                    View All Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Video Preview Modal */}
      <AnimatePresence>
        {showVideoModal && courseVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-10 right-0 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors z-10"
              >
                <LuX size={18} />
              </button>
              {getYouTubeEmbedUrl(courseVideoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(courseVideoUrl)}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Course Preview Video"
                />
              ) : (
                <video
                  src={courseVideoUrl}
                  className="w-full h-full object-contain bg-black"
                  controls
                  autoPlay
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

export default SingleCourse;
