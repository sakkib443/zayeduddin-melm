/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchCoursesData, fetchSingleCourse, toggleCourseLike } from "@/redux/CourseSlice";
import { fetchMyEnrollments } from "@/redux/enrollmentSlice";
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
  const { courses = [], currentCourse, loading } = useSelector((state) => state.courses || {});
  const { enrollments = [] } = useSelector((state) => state.enrollment || {});

  const [activeTab, setActiveTab] = useState("overview");
  const [instructor, setInstructor] = useState(null);
  const [popularCourses, setPopularCourses] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [expandedModules, setExpandedModules] = useState([0]); // First module expanded by default
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [initialId, setInitialId] = useState(id);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
    dispatch(fetchMyEnrollments());
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
    if (currentCourse) {
      setIsInitialLoad(false);
      // Set instructor from course data if available
      if (currentCourse.instructor) {
        setInstructor(currentCourse.instructor);
      }
    } else if (!loading && !isInitialLoad) {
      // if loading is finished but we still don't have currentCourse
      // this could be the case where course actually not found
    }
  }, [currentCourse, loading, isInitialLoad]);

  useEffect(() => {
    if (courses && courses.length > 0) {
      setPopularCourses(courses.filter((c) => (c._id !== id && c.id !== id)).slice(0, 3));
    }
  }, [courses, id]);

  const handleAddToCart = () => {
    if (!currentCourse) return;
    const finalPrice = currentCourse.discountPrice || currentCourse.price;
    dispatch(addToCart({
      id: currentCourse._id,
      title: currentCourse.title,
      price: finalPrice,
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
  if (loading || (isInitialLoad && !currentCourse)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-200 dark:border-slate-700 border-t-[#021E14] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400 dark:text-gray-500 text-sm font-medium tracking-wide poppins">Loading course...</p>
        </div>
      </div>
    );
  }

  // Error State - use Redux state directly
  if (!currentCourse && !loading && !isInitialLoad) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-slate-950 dark:to-slate-900 px-4">
        <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-md flex items-center justify-center mb-6">
          <LuBookOpen className="text-gray-300 dark:text-slate-600 text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white outfit mb-2">Course Not Found</h3>
        <p className="text-gray-500 dark:text-gray-400 poppins text-sm mb-6 text-center max-w-sm">The course you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => router.push('/courses')}
          className="px-6 py-2.5 bg-[#021E14] text-white text-sm font-semibold rounded-md hover:bg-[#021E14]/90 transition-colors"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  const price = currentCourse.price || 0;
  const discountPrice = currentCourse.discountPrice;
  const isPurchased = enrollments.some(e => (e.course?._id || e.course) === currentCourse._id);

  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950">
      {/* Hero Section - Clean Green Background */}
      <section className="relative overflow-hidden bg-emerald-50/70 dark:bg-slate-900/40 pt-12 pb-28 lg:pt-16 lg:pb-36">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#021E14]/10 dark:from-[#021E14]/5 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#D4AF37]/8 dark:bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Animated Shapes */}
        <div className="absolute top-20 right-[15%] w-20 h-20 border-2 border-[#021E14]/20 rounded-2xl rotate-12 animate-float"></div>
        <div className="absolute bottom-32 left-[10%] w-16 h-16 border-2 border-[#D4AF37]/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-[8%] w-12 h-12 bg-[#021E14]/10 rounded-xl rotate-45 animate-float" style={{ animationDelay: '2s' }}></div>

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
              <Link href="/" className="hover:text-[#021E14] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/courses" className="hover:text-[#021E14] transition-colors">Courses</Link>
              <span>/</span>
              <span className="text-gray-700 dark:text-white font-medium truncate max-w-[200px]">{currentCourse.title}</span>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2 mb-5"
            >
              <span className="px-3 py-1 bg-[#021E14] rounded text-white text-[11px] font-bold uppercase tracking-wider poppins">
                {currentCourse.courseType || 'Recorded'}
              </span>
              <span className="px-3 py-1 bg-white/90 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-600 dark:text-gray-300 text-[11px] font-bold uppercase tracking-wider poppins">
                {currentCourse.level || 'Beginner'}
              </span>
              {currentCourse.isFeatured && (
                <span className="px-3 py-1 bg-emerald-600 rounded text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <LuSparkles size={10} /> Featured
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold outfit leading-[1.2] tracking-tight text-gray-900 dark:text-white mb-4 ${bengaliClass}`}
            >
              {language === 'bn' && currentCourse.titleBn ? currentCourse.titleBn : currentCourse.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`text-[15px] lg:text-base text-gray-600 dark:text-gray-400 poppins leading-relaxed mb-6 max-w-2xl ${bengaliClass}`}
            >
              {language === 'bn' && currentCourse.shortDescriptionBn
                ? currentCourse.shortDescriptionBn
                : (currentCourse.shortDescription || currentCourse.description?.substring(0, 160))}...
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
                <div className="flex text-[#D4AF37] gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => <FaStar key={s} size={12} />)}
                </div>
                <span className="font-bold outfit text-gray-900">{currentCourse.averageRating || '5.0'}</span>
                <span className="text-gray-400 text-xs poppins">({currentCourse.reviewCount || 0})</span>
              </div>

              {/* Students */}
              <div className="flex items-center gap-3 bg-white px-8 py-2.5 rounded-md border border-gray-200">
                <div className="w-7 h-7 rounded bg-emerald-50 flex items-center justify-center">
                  <LuUsers className="text-[#021E14]" size={14} />
                </div>
                <span className="text-gray-700 font-medium text-sm poppins">
                  <AnimatedCounter value={currentCourse.totalEnrollments || 0} />
                  <span className="text-gray-400 ml-1">students</span>
                </span>
              </div>

              {/* Lessons */}
              <div className="flex items-center gap-3 bg-white px-8 py-2.5 rounded-md border border-gray-200">
                <div className="w-7 h-7 rounded bg-emerald-50 flex items-center justify-center">
                  <LuMonitor className="text-[#021E14]" size={14} />
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
                <span className="text-[#021E14] font-semibold text-sm outfit underline underline-offset-4">{instructor?.name || 'Industry Expert'}</span>
                <MdVerified className="text-[#021E14]" size={16} />
              </div>

              <button
                onClick={handleToggleLike}
                disabled={isLiking}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all ${currentCourse.isLiked
                  ? 'bg-[#021E14] border-[#021E14] text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-[#021E14] hover:text-[#021E14]'
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
                      <div className="w-14 h-14 bg-[#021E14] rounded-full flex items-center justify-center shadow-lg">
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
                  <button onClick={handleBuyNow} className="w-full py-3 bg-[#021E14] text-white font-semibold rounded-md active:scale-[0.98] transition-transform poppins">
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
                        ? "text-[#021E14] border-[#021E14] bg-white"
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
                          <h2 className={`text-lg font-bold outfit text-gray-900 mb-4 flex items-center gap-2 ${bengaliClass}`}>
                            <span className="w-1 h-5 bg-[#021E14] rounded-full"></span>
                            {language === 'bn' ? 'কোর্স বিবরণ' : 'Course Description'}
                          </h2>
                          <div className={`text-gray-600 poppins text-[15px] leading-7 whitespace-pre-line ${bengaliClass}`}>
                            {language === 'bn' && currentCourse.descriptionBn
                              ? currentCourse.descriptionBn
                              : (currentCourse.description || currentCourse.details)}
                          </div>
                        </div>

                        {/* Course Features mirroring Tech Stack */}
                        {currentCourse.features?.length > 0 && (
                          <div>
                            <h3 className={`text-base font-bold outfit text-gray-900 mb-4 flex items-center gap-2 ${bengaliClass}`}>
                              <span className="w-1 h-5 bg-[#D4AF37] rounded-full"></span>
                              {language === 'bn' ? 'বিশেষ ফিচারসমূহ' : 'Key Features'}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {(language === 'bn' && currentCourse.featuresBn?.length > 0
                                ? currentCourse.featuresBn
                                : currentCourse.features
                              ).map((feature, idx) => (
                                <span
                                  key={idx}
                                  className={`px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-gray-700 font-medium text-sm hover:border-[#021E14]/30 hover:bg-[#021E14]/5 transition-colors cursor-default poppins ${bengaliClass}`}
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
                          <h2 className={`text-lg font-bold outfit text-gray-900 dark:text-white flex items-center gap-2 ${bengaliClass}`}>
                            <span className="w-1 h-5 bg-[#021E14] rounded-full"></span>
                            {t("courseDetails.curriculum")}
                          </h2>
                          {currentCourse.curriculum?.length > 0 && (
                            <div className={`flex items-center gap-3 text-xs text-gray-500 poppins ${bengaliClass}`}>
                              <span className="flex items-center gap-1.5">
                                <LuLayoutGrid size={13} />
                                {currentCourse.curriculum.length} {language === 'bn' ? 'মডিউল' : 'Modules'}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MdPlayCircleOutline size={14} />
                                {currentCourse.curriculum.reduce((sum, m) => sum + (m.totalLessons || 0), 0)} {language === 'bn' ? 'লেসন' : 'Lessons'}
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
                                    <span className="w-8 h-8 rounded-md bg-[#021E14]/10 dark:bg-[#021E14]/10 text-[#021E14] flex items-center justify-center font-bold text-xs outfit shrink-0">
                                      {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <div className="min-w-0">
                                      <h3 className="font-semibold text-gray-900 dark:text-white outfit text-sm truncate">{language === 'bn' && module.moduleTitleBn ? module.moduleTitleBn : module.moduleTitle}</h3>
                                      <p className="text-[11px] text-gray-400 poppins mt-0.5">
                                        {module.totalLessons || 0} {language === 'bn' ? 'লেসন' : 'Lessons'} {durationMinutes > 0 && `• ${durationText}`}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-all shrink-0 ${isExpanded ? 'bg-[#021E14]/10 dark:bg-[#021E14]/10 text-[#021E14] rotate-180' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
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
                                            <MdPlayCircleOutline className="text-gray-300 dark:text-slate-600 group-hover:text-[#021E14] transition-colors shrink-0" size={18} />
                                            <span className="text-sm text-gray-600 dark:text-gray-400 poppins group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate">
                                              {language === 'bn' && lesson.titleBn ? lesson.titleBn : lesson.title}
                                            </span>
                                            {lesson.isFree && (
                                              <span className={`text-[10px] font-semibold text-[#021E14] bg-emerald-50 dark:bg-[#021E14]/10 px-2 py-0.5 rounded border border-emerald-100 dark:border-[#021E14]/20 shrink-0 ${bengaliClass}`}>
                                                {language === 'bn' ? 'ফ্রি' : 'FREE'}
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
                                    <p className={`text-xs text-gray-400 poppins ${bengaliClass}`}>{language === 'bn' ? 'এই মডিউলে কোনো লেসন নেই।' : 'No lessons available in this module yet.'}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Empty State */}
                          {!currentCourse.curriculum?.length && (
                            <div className="text-center py-12 border border-dashed border-gray-200 dark:border-slate-700 rounded-md">
                              <MdOutlineMenuBook className="mx-auto text-3xl text-gray-300 dark:text-slate-600 mb-3" />
                              <p className={`text-gray-400 text-sm poppins ${bengaliClass}`}>{language === 'bn' ? 'কারিকুলাম শীঘ্রই আসছে।' : 'Curriculum details coming soon.'}</p>
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
                        <h2 className={`text-lg font-bold outfit text-gray-900 mb-5 flex items-center gap-2 ${bengaliClass}`}>
                          <span className="w-1 h-5 bg-[#021E14] rounded-full"></span>
                          {language === 'bn' ? 'যা যা শিখবেন' : 'What You Will Learn'}
                        </h2>

                        {currentCourse.whatYouWillLearn?.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(language === 'bn' && currentCourse.whatYouWillLearnBn?.length > 0
                              ? currentCourse.whatYouWillLearnBn
                              : currentCourse.whatYouWillLearn
                            ).map((topic, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-md hover:border-[#021E14]/30 hover:bg-[#021E14]/5 transition-colors"
                              >
                                <div className="w-8 h-8 rounded bg-[#021E14]/10 flex items-center justify-center flex-shrink-0">
                                  <LuCheck className="text-[#021E14]" size={16} strokeWidth={3} />
                                </div>
                                <span className={`text-gray-700 font-medium text-sm leading-relaxed pt-1 poppins ${bengaliClass}`}>{topic}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-gray-50 rounded-md border border-dashed border-gray-200">
                            <LuZap className="mx-auto text-2xl text-gray-300 mb-2" />
                            <p className="text-gray-400 text-sm poppins">{language === 'bn' ? 'শেখার বিষয়বস্তু শীঘ্রই আসছে' : 'Learning topics not listed yet'}</p>
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
                        className="space-y-0"
                      >
                        {instructor ? (() => {
                          const instructorName = instructor.userId
                            ? `${instructor.userId.firstName || ''} ${instructor.userId.lastName || ''}`.trim()
                            : instructor.name || 'Instructor';
                          const instructorImage = instructor.avatar || instructor.userId?.avatar || instructor.image || '/images/placeholder.png';
                          const instructorCover = instructor.coverImage || '';
                          const instructorTitle = (language === 'bn' && instructor.titleBn) ? instructor.titleBn : (instructor.title || instructor.designation || '');
                          const instructorBio = (language === 'bn' && instructor.bioBn) ? instructor.bioBn : (instructor.bio || '');
                          const instructorLongBio = (language === 'bn' && instructor.longBioBn) ? instructor.longBioBn : (instructor.longBio || '');
                          const instructorEmail = instructor.userId?.email || '';
                          const social = instructor.socialLinks || {};

                          return (
                            <div className="space-y-6">
                              {/* Hero Banner */}
                              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 shadow-lg">
                                {instructorCover ? (
                                  <div className="absolute inset-0">
                                    <img src={instructorCover} alt="Cover" className="w-full h-full object-cover opacity-30" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
                                  </div>
                                ) : (
                                  <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400/20 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />
                                  </div>
                                )}
                                <div className="relative p-6 md:p-8">
                                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                    <div className="relative group flex-shrink-0">
                                      <div className="absolute -inset-1.5 bg-gradient-to-tr from-emerald-400 to-yellow-400 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                                      <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-xl overflow-hidden border-3 border-white/20 shadow-2xl">
                                        <img src={instructorImage} alt={instructorName} className="w-full h-full object-cover" />
                                      </div>
                                      {instructor.rating > 0 && (
                                        <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                                          <FaStar size={10} /> {instructor.rating.toFixed(1)}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                      <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                        <h3 className={`text-2xl md:text-3xl font-bold text-white outfit ${bengaliClass}`}>{instructorName}</h3>
                                        <MdVerified className="text-emerald-400 text-xl" />
                                      </div>
                                      {instructorTitle && (
                                        <p className={`text-emerald-200 font-medium text-base poppins mb-3 ${bengaliClass}`}>{instructorTitle}</p>
                                      )}
                                      {instructorBio && (
                                        <p className={`text-emerald-100/80 text-sm leading-relaxed poppins max-w-2xl ${bengaliClass}`}>{instructorBio}</p>
                                      )}
                                      {Object.values(social).some(v => v) && (
                                        <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                                          {social.facebook && (<a href={social.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-blue-500 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg></a>)}
                                          {social.linkedin && (<a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-blue-600 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" /></svg></a>)}
                                          {social.youtube && (<a href={social.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-red-600 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" /><polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="#fff" /></svg></a>)}
                                          {social.github && (<a href={social.github} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gray-800 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg></a>)}
                                          {social.website && (<a href={social.website} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-emerald-600 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"><LuGlobe size={16} /></a>)}
                                          {instructor.whatsAppNumber && (<a href={`https://wa.me/${instructor.whatsAppNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-green-600 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg></a>)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Stats Cards */}
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {[
                                  { icon: LuClock, label: language === 'bn' ? 'অভিজ্ঞতা' : 'Experience', value: instructor.experience ? `${instructor.experience}+` : null, suffix: language === 'bn' ? 'বছর' : 'Years', color: 'from-emerald-500 to-emerald-600' },
                                  { icon: LuUsers, label: language === 'bn' ? 'শিক্ষার্থী' : 'Students', value: instructor.totalStudents ? instructor.totalStudents.toLocaleString() : null, suffix: '', color: 'from-blue-500 to-blue-600' },
                                  { icon: LuBookOpen, label: language === 'bn' ? 'কোর্স' : 'Courses', value: instructor.totalCourses || null, suffix: '', color: 'from-purple-500 to-purple-600' },
                                  { icon: LuGraduationCap, label: language === 'bn' ? 'বিশেষত্ব' : 'Specializations', value: instructor.specializations || null, suffix: '', color: 'from-amber-500 to-amber-600' },
                                  { icon: FaStar, label: language === 'bn' ? 'রেটিং' : 'Rating', value: instructor.rating ? instructor.rating.toFixed(1) : null, suffix: `(${instructor.reviewCount || 0})`, color: 'from-yellow-500 to-orange-500' },
                                ].filter(s => s.value).map((stat, idx) => (
                                  <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                                    <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                                      <stat.icon size={18} className="text-white" />
                                    </div>
                                    <p className={`text-xl font-bold text-gray-900 outfit ${bengaliClass}`}>{stat.value}</p>
                                    {stat.suffix && <p className={`text-[11px] text-gray-500 font-medium ${bengaliClass}`}>{stat.suffix}</p>}
                                    <p className={`text-[10px] text-gray-400 uppercase tracking-wider mt-0.5 ${bengaliClass}`}>{stat.label}</p>
                                  </div>
                                ))}
                              </div>

                              {/* Expertise */}
                              {instructor.expertise?.length > 0 && (
                                <div className="bg-white border border-gray-100 rounded-xl p-5">
                                  <h4 className={`text-sm font-bold text-gray-900 outfit mb-3 flex items-center gap-2 ${bengaliClass}`}>
                                    <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                                    {language === 'bn' ? 'দক্ষতার ক্ষেত্র' : 'Areas of Expertise'}
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {instructor.expertise.map((skill, idx) => (
                                      <span key={idx} className={`px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100 ${bengaliClass}`}>{skill}</span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Long Bio */}
                              {instructorLongBio && (
                                <div className="bg-white border border-gray-100 rounded-xl p-5">
                                  <h4 className={`text-sm font-bold text-gray-900 outfit mb-3 flex items-center gap-2 ${bengaliClass}`}>
                                    <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
                                    {language === 'bn' ? 'জীবন যাত্রা' : 'Life Journey'}
                                  </h4>
                                  <p className={`text-gray-600 text-sm leading-7 poppins whitespace-pre-line ${bengaliClass}`}>{instructorLongBio}</p>
                                </div>
                              )}

                              {/* Education & Work Experience */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {instructor.education?.length > 0 && (
                                  <div className="bg-white border border-gray-100 rounded-xl p-5">
                                    <h4 className={`text-sm font-bold text-gray-900 outfit mb-3 flex items-center gap-2 ${bengaliClass}`}>
                                      <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                                      {language === 'bn' ? 'শিক্ষাগত যোগ্যতা' : 'Education'}
                                    </h4>
                                    <div className="space-y-2.5">
                                      {instructor.education.map((edu, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <LuGraduationCap size={14} className="text-blue-600" />
                                          </div>
                                          <p className={`text-sm text-gray-700 font-medium leading-relaxed poppins pt-1 ${bengaliClass}`}>{edu}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {instructor.workExperience?.length > 0 && (
                                  <div className="bg-white border border-gray-100 rounded-xl p-5">
                                    <h4 className={`text-sm font-bold text-gray-900 outfit mb-3 flex items-center gap-2 ${bengaliClass}`}>
                                      <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                                      {language === 'bn' ? 'কর্ম অভিজ্ঞতা' : 'Work Experience'}
                                    </h4>
                                    <div className="space-y-2.5">
                                      {instructor.workExperience.map((work, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <LuSettings size={14} className="text-purple-600" />
                                          </div>
                                          <p className={`text-sm text-gray-700 font-medium leading-relaxed poppins pt-1 ${bengaliClass}`}>{work}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Certifications */}
                              {instructor.certifications?.length > 0 && (
                                <div className="bg-white border border-gray-100 rounded-xl p-5">
                                  <h4 className={`text-sm font-bold text-gray-900 outfit mb-3 flex items-center gap-2 ${bengaliClass}`}>
                                    <span className="w-1 h-4 bg-yellow-500 rounded-full"></span>
                                    {language === 'bn' ? 'সার্টিফিকেট ও পুরস্কার' : 'Certifications & Awards'}
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {instructor.certifications.map((cert, idx) => (
                                      <div key={idx} className="flex items-center gap-3 px-3 py-2.5 bg-yellow-50/50 rounded-lg border border-yellow-100/50">
                                        <LuTrophy size={14} className="text-yellow-600 flex-shrink-0" />
                                        <span className={`text-sm text-gray-700 font-medium poppins ${bengaliClass}`}>{cert}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Contact */}
                              {(instructorEmail || instructor.whatsAppNumber) && (
                                <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 border border-emerald-100 rounded-xl p-5">
                                  <h4 className={`text-sm font-bold text-gray-900 outfit mb-3 flex items-center gap-2 ${bengaliClass}`}>
                                    <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                                    {language === 'bn' ? 'যোগাযোগ' : 'Get in Touch'}
                                  </h4>
                                  <div className="flex flex-wrap gap-3">
                                    {instructor.whatsAppNumber && (
                                      <a href={`https://wa.me/${instructor.whatsAppNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                                        WhatsApp
                                      </a>
                                    )}
                                    {instructorEmail && (
                                      <a href={`mailto:${instructorEmail}`}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition-colors shadow-sm border border-gray-200">
                                        <LuExternalLink size={14} />
                                        {instructorEmail}
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })() : (
                          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                              <LuUsers className="text-gray-300 text-2xl" />
                            </div>
                            <p className={`text-gray-400 text-sm poppins ${bengaliClass}`}>{language === 'bn' ? 'ইন্সট্রাক্টরের তথ্য শীঘ্রই আসছে' : 'Instructor details coming soon'}</p>
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
                        <div className="w-16 h-16 bg-[#021E14] rounded-full flex items-center justify-center shadow-lg shadow-[#021E14]/30 group-hover:scale-110 transition-transform">
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
                        <span className="text-2xl font-bold text-gray-900 outfit">
                          ৳{(discountPrice || price).toLocaleString()}
                        </span>
                        {discountPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            ৳{price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className={`text-[#021E14] text-xs font-semibold uppercase tracking-wide mt-1 poppins ${bengaliClass}`}>{t("courseDetails.fullLifetimeAccess")}</p>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-2.5">
                      {isPurchased ? (
                        <div className="space-y-3">
                          <button
                            disabled
                            className={`w-full py-3 bg-gray-100 dark:bg-slate-800 text-gray-500 font-semibold rounded-md flex items-center justify-center gap-2 poppins cursor-not-allowed ${bengaliClass}`}
                          >
                            <LuCheck size={16} /> {t("courseDetails.alreadyPurchased")}
                          </button>
                          <Link
                            href="/dashboard/user"
                            className={`w-full py-2.5 bg-white border border-[#021E14] text-[#021E14] font-semibold rounded-md hover:bg-[#021E14] hover:text-white transition-all text-center flex items-center justify-center gap-2 poppins ${bengaliClass}`}
                          >
                            {t("courseDetails.goToDashboard")}
                          </Link>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={handleBuyNow}
                            className={`w-full py-3 bg-[#021E14] hover:bg-[#021E14]/90 text-white font-semibold rounded-md transition-colors flex items-center justify-center gap-2 poppins ${bengaliClass}`}
                          >
                            {t("courseDetails.enrollNow")} <FaArrowRight size={12} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* What's Included mirroring Website style */}
                    <div className="pt-4 border-t border-gray-100">
                      <h5 className={`text-sm font-bold text-gray-900 mb-3 outfit ${bengaliClass}`}>{t("courseDetails.courseIncludes")}</h5>
                      <ul className="space-y-2.5">
                        {[
                          { icon: LuMonitor, text: `${currentCourse.totalLessons || 0}+ ${t("courseDetails.videoLessons")}` },
                          { icon: LuClock, text: `${currentCourse.totalDuration || (language === 'bn' ? '১২ ঘণ্টা' : '12 Hours')} ${language === 'bn' ? 'সময়কাল' : 'Duration'}` },
                          { icon: LuTrophy, text: t("courseDetails.certificate") },
                          { icon: LuShieldCheck, text: t("courseDetails.lifetimeUpdates") },
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2.5 text-gray-600 text-sm poppins">
                            <item.icon className="text-[#021E14]" size={15} />
                            <span>{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Batch Information Section - Shows if batches exist for this course */}
                {batches.length > 0 && (
                  <div className="bg-gradient-to-br from-[#021E14] via-white to-[#01140D] rounded-md border border-[#021E14] shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-[#021E14] to-[#01140D] px-5 py-3">
                      <h3 className={`text-white font-bold outfit flex items-center gap-2 ${bengaliClass}`}>
                        <LuGraduationCap size={18} />
                        {t("courseDetails.availableBatches")}
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {batches.slice(0, 3).map((batch, idx) => (
                        <div
                          key={batch._id}
                          className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${idx === 0
                            ? 'bg-white border-[#021E14] shadow-sm'
                            : 'bg-gray-50/50 border-gray-200 hover:border-[#021E14]'
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
                                {batch.status === 'upcoming'
                                  ? (language === 'bn' ? 'আসন্ন' : 'UPCOMING')
                                  : batch.status === 'ongoing'
                                    ? (language === 'bn' ? 'চলমান' : 'ONGOING')
                                    : (language === 'bn' ? 'শেষ' : 'COMPLETED')
                                }
                              </span>
                              {idx === 0 && (
                                <span className={`px-2 py-0.5 bg-gradient-to-r from-[#021E14] to-[#01140D] text-white text-[10px] font-bold rounded ${bengaliClass}`}>
                                  {t("courseDetails.recommended")}
                                </span>
                              )}
                            </div>
                            <span className={`text-xs font-medium text-gray-400 poppins ${bengaliClass}`}>
                              {batch.enrolledStudents?.length || 0}/{batch.maxStudents} {t("courseDetails.seats")}
                            </span>
                          </div>

                          {/* Batch Name & Code */}
                          <h4 className={`font-bold text-gray-900 outfit text-base mb-1 ${bengaliClass}`}>{language === 'bn' && batch.batchNameBn ? batch.batchNameBn : batch.batchName}</h4>
                          <p className={`text-xs text-[#021E14] font-semibold poppins mb-3 ${bengaliClass}`}>
                            {language === 'bn' ? 'কোড' : 'Code'}: {batch.batchCode}
                          </p>

                          {/* Batch Details Grid */}
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100">
                              <div className="w-7 h-7 rounded bg-green-50 flex items-center justify-center">
                                <LuCalendar className="text-green-600" size={14} />
                              </div>
                              <div>
                                <p className={`text-[10px] text-gray-400 uppercase tracking-wider ${bengaliClass}`}>{t("courseDetails.startDate")}</p>
                                <p className={`text-xs font-semibold text-gray-800 ${bengaliClass}`}>
                                  {new Date(batch.startDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100">
                              <div className="w-7 h-7 rounded bg-[#021E14]/10 flex items-center justify-center">
                                <LuTimer className="text-[#021E14]" size={14} />
                              </div>
                              <div>
                                <p className={`text-[10px] text-gray-400 uppercase tracking-wider ${bengaliClass}`}>{t("courseDetails.lastDate")}</p>
                                <p className={`text-xs font-semibold text-gray-800 ${bengaliClass}`}>
                                  {batch.enrollmentDeadline
                                    ? new Date(batch.enrollmentDeadline).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short' })
                                    : new Date(batch.startDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short' })
                                  }
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Schedule Preview */}
                          {batch.schedule?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {batch.schedule.slice(0, 3).map((sch, sIdx) => (
                                <span key={sIdx} className="px-2 py-1 bg-[#021E14] text-white text-[10px] font-medium rounded capitalize">
                                  {sch.day} {sch.startTime}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Progress Bar for Seats */}
                          <div className="mb-3">
                            <div className={`flex justify-between text-[10px] text-gray-500 mb-1 ${bengaliClass}`}>
                              <span>{t("courseDetails.enrollmentProgress")}</span>
                              <span>{Math.round(((batch.enrolledStudents?.length || 0) / batch.maxStudents) * 100)}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#021E14] to-[#01140D] rounded-full transition-all"
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
                            className={`w-full py-2.5 rounded-md font-semibold text-sm transition-all poppins ${bengaliClass} ${idx === 0
                              ? 'bg-gradient-to-r from-[#021E14] to-[#01140D] text-white hover:shadow-lg hover:shadow-indigo-200'
                              : 'bg-white border border-[#021E14] text-[#021E14] hover:bg-[#021E14]'
                              }`}
                          >
                            {t("courseDetails.enrollIn")} {language === 'bn' && batch.batchNameBn ? batch.batchNameBn : batch.batchName}
                          </button>
                        </div>
                      ))}

                      {batches.length > 3 && (
                        <button className={`w-full py-2 text-[#021E14] font-medium text-sm border border-dashed border-[#021E14] rounded-md hover:bg-[#021E14] transition-colors poppins ${bengaliClass}`}>
                          {language === 'bn' ? 'সব ব্যাচ দেখুন' : `View All ${batches.length} Batches`}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Recommended Courses Widget mirroring Website Popular Websites */}
                <div className="bg-white rounded-md p-5 border border-gray-200 shadow-sm">
                  <h3 className={`text-sm font-bold text-gray-900 mb-4 outfit ${bengaliClass}`}>{t("courseDetails.popularCourses")}</h3>
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
                          <h4 className={`text-sm font-semibold text-gray-900 group-hover:text-[#021E14] transition-colors line-clamp-1 outfit ${bengaliClass}`}>{language === 'bn' && item.titleBn ? item.titleBn : item.title}</h4>
                          <div className="flex items-center gap-1 text-[#D4AF37] mt-0.5">
                            <FaStar size={10} />
                            <span className="text-gray-600 text-xs font-medium poppins">{item.averageRating || '5.0'}</span>
                          </div>
                          <span className="text-[#021E14] font-bold text-xs poppins">৳{item.price?.toLocaleString()}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/courses"
                    className={`flex items-center justify-center w-full py-2.5 mt-4 text-[#021E14] font-semibold text-sm border border-dashed border-[#021E14]/20 rounded-md hover:bg-[#021E14]/5 transition-colors poppins ${bengaliClass}`}
                  >
                    {t("courseDetails.viewAllCourses")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Video Preview Modal */}
      < AnimatePresence >
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
      </AnimatePresence >
    </div >
  );
};

export default SingleCourse;
