'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseContent } from '@/redux/CourseSlice';
import { updateLessonProgress } from '@/redux/enrollmentSlice';
import toast from 'react-hot-toast';
import {
    FiPlay, FiCheckCircle, FiChevronDown, FiChevronUp,
    FiArrowLeft, FiClock, FiBookOpen, FiList, FiCheck,
    FiFileText, FiLock, FiAward, FiTrendingUp
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseWatchPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { isDark } = useTheme();

    const { currentCourse, contentLoading, error } = useSelector((state) => state.courses);
    const [activeLesson, setActiveLesson] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (id) {
            dispatch(fetchCourseContent(id));
        }
    }, [id, dispatch]);

    const groupedContent = useMemo(() => {
        if (!currentCourse || !currentCourse.modules || !currentCourse.lessons) return [];

        return (currentCourse.modules || []).map(module => {
            const moduleId = module._id?.toString() || module._id;
            const moduleLessons = (currentCourse.lessons || []).filter(lesson => {
                const lessonModuleId = lesson.module?._id?.toString() || lesson.module?.toString() || lesson.module;
                return lessonModuleId === moduleId;
            }).sort((a, b) => (a.order || 0) - (b.order || 0));

            return {
                ...module,
                lessons: moduleLessons
            };
        }).sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [currentCourse]);

    useEffect(() => {
        if (groupedContent.length > 0 && !activeLesson) {
            for (const module of groupedContent) {
                if (module.lessons.length > 0) {
                    setActiveLesson(module.lessons[0]);
                    setExpandedModules(prev => ({ ...prev, [module._id]: true }));
                    break;
                }
            }
        }
    }, [groupedContent, activeLesson]);

    const handleMarkAsDone = async () => {
        if (!activeLesson || !id) return;

        try {
            await dispatch(updateLessonProgress({ courseId: id, lessonId: activeLesson._id })).unwrap();
            toast.success('Lesson completed! 🎉', {
                style: {
                    borderRadius: '12px',
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#fff' : '#1e293b',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    border: '1px solid #E62D26'
                }
            });

            let foundActive = false;
            let nextLesson = null;

            for (const module of groupedContent) {
                for (const lesson of module.lessons) {
                    if (foundActive) {
                        nextLesson = lesson;
                        break;
                    }
                    if (lesson._id === activeLesson._id) {
                        foundActive = true;
                    }
                }
                if (nextLesson) break;
            }

            if (nextLesson) {
                setActiveLesson(nextLesson);
                const activeModule = groupedContent.find(m => m.lessons.some(l => l._id === nextLesson._id));
                if (activeModule) {
                    setExpandedModules(prev => ({ ...prev, [activeModule._id]: true }));
                }
            } else {
                toast('🎊 Congratulations! Course completed!', { duration: 4000 });
            }
        } catch (err) {
            toast.error(err || 'Failed to update progress');
        }
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    // Calculate progress
    const totalLessons = currentCourse?.lessons?.length || 0;
    const completedLessons = 0; // Would come from enrollment data
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    if (contentLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-14 h-14 border-4 border-[#E62D26] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading Course...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className={`max-w-md w-full p-8 rounded-2xl text-center border ${isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200 shadow-xl'}`}>
                    <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <FiLock size={32} />
                    </div>
                    <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Access Error</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/dashboard/user/courses')}
                        className="w-full py-3 bg-[#E62D26] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#c41e18] transition-all"
                    >
                        <FiArrowLeft /> Back to My Courses
                    </button>
                </div>
            </div>
        );
    }

    if (!currentCourse) return null;

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Top Navigation */}
            <div className={`sticky top-0 z-50 border-b backdrop-blur-lg ${isDark ? 'bg-slate-900/90 border-white/5' : 'bg-white/90 border-gray-200'}`}>
                <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => router.push('/dashboard/user/courses')}
                            className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`}
                        >
                            <FiArrowLeft size={18} />
                        </button>
                        <div className="min-w-0">
                            <h1 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {currentCourse.title}
                            </h1>
                            <p className="text-xs text-[#E62D26] font-medium">
                                {groupedContent.length} Modules • {totalLessons} Lessons
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Progress Badge */}
                        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? 'bg-[#E62D26]/10' : 'bg-[#E62D26]/10'}`}>
                            <FiTrendingUp size={14} className="text-[#E62D26]" />
                            <span className="text-xs font-bold text-[#E62D26]">{progressPercent}% Complete</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`p-2 rounded-lg transition-all lg:hidden ${isDark ? 'bg-white/5 text-slate-300' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <FiList size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto">
                <div className="flex">
                    {/* Main Content Area */}
                    <div className={`flex-1 ${sidebarOpen ? 'lg:pr-80' : ''} transition-all duration-300`}>
                        <div className="p-4 lg:p-6 space-y-5">
                            {/* Video Player */}
                            <div className={`aspect-video rounded-2xl overflow-hidden shadow-lg relative ${isDark ? 'bg-black' : 'bg-gray-900'}`}>
                                {activeLesson?.videoUrl ? (
                                    <iframe
                                        src={activeLesson.videoUrl?.includes('youtube')
                                            ? `https://www.youtube.com/embed/${activeLesson.videoUrl.split('v=')[1]?.split('&')[0] || activeLesson.videoUrl.split('/').pop()}`
                                            : activeLesson.videoUrl}
                                        title={activeLesson.title}
                                        className="w-full h-full"
                                        allowFullScreen
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    ></iframe>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center flex-col gap-3 text-white/40">
                                        <FiPlay size={48} className="opacity-50" />
                                        <p className="font-medium text-sm">Select a lesson to start</p>
                                    </div>
                                )}
                            </div>

                            {/* Lesson Info Card */}
                            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-white/5' : 'bg-white border-gray-200'}`}>
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                    <div className="space-y-3 flex-1">
                                        {/* Badges */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-lg bg-[#E62D26]/10 text-[#E62D26] text-xs font-bold">
                                                Module {groupedContent.findIndex(m => m.lessons.some(l => l._id === activeLesson?._id)) + 1}
                                            </span>
                                            <span className="px-2.5 py-1 rounded-lg bg-[#F79952]/10 text-[#F79952] text-xs font-bold">
                                                Lesson {activeLesson?.order || 1}
                                            </span>
                                            {activeLesson?.videoDuration && (
                                                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                                                    <FiClock size={12} /> {activeLesson.videoDuration} min
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h1 className={`text-xl lg:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                            {activeLesson?.title || 'Course Overview'}
                                        </h1>

                                        {/* Description */}
                                        {activeLesson?.description && (
                                            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                                {activeLesson.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={handleMarkAsDone}
                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E62D26] to-[#c41e18] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#E62D26]/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap"
                                    >
                                        <FiCheckCircle size={18} />
                                        Mark Complete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Course Curriculum */}
                    <div className={`fixed lg:absolute right-0 top-14 lg:top-0 h-[calc(100vh-56px)] lg:h-auto w-80 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:hidden'}`}>
                        <div className={`h-full lg:sticky lg:top-20 overflow-hidden border-l ${isDark ? 'bg-slate-800/95 border-white/5 backdrop-blur-lg' : 'bg-white/95 border-gray-200 backdrop-blur-lg'}`}>
                            {/* Curriculum Header */}
                            <div className={`p-4 border-b ${isDark ? 'bg-slate-800 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                        <FiBookOpen className="text-[#E62D26]" size={16} />
                                        Course Content
                                    </h3>
                                    <button
                                        onClick={() => setSidebarOpen(false)}
                                        className={`p-1.5 rounded-lg lg:hidden ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
                                    >
                                        ✕
                                    </button>
                                </div>
                                {/* Progress Bar */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>{completedLessons}/{totalLessons} lessons</span>
                                        <span className="font-bold text-[#E62D26]">{progressPercent}%</span>
                                    </div>
                                    <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                                        <div className="h-full bg-gradient-to-r from-[#E62D26] to-[#F79952] rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Modules List */}
                            <div className="h-[calc(100%-120px)] overflow-y-auto">
                                {groupedContent.map((module, mIdx) => (
                                    <div key={module._id} className={`border-b last:border-0 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                        <button
                                            onClick={() => toggleModule(module._id)}
                                            className={`w-full p-4 flex items-center gap-3 text-left transition-all ${expandedModules[module._id]
                                                ? (isDark ? 'bg-[#E62D26]/5' : 'bg-[#E62D26]/5')
                                                : (isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50')
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${expandedModules[module._id]
                                                ? 'bg-[#E62D26] text-white'
                                                : (isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-200 text-gray-600')
                                                }`}>
                                                {mIdx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-semibold truncate ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                                                    {module.title}
                                                </h4>
                                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                                    {module.lessons.length} lessons
                                                </p>
                                            </div>
                                            {expandedModules[module._id] ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                                        </button>

                                        <AnimatePresence>
                                            {expandedModules[module._id] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-3 pb-3 space-y-1">
                                                        {module.lessons.map((lesson) => (
                                                            <button
                                                                key={lesson._id}
                                                                onClick={() => {
                                                                    setActiveLesson(lesson);
                                                                    if (window.innerWidth < 1024) setSidebarOpen(false);
                                                                }}
                                                                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${activeLesson?._id === lesson._id
                                                                    ? 'bg-gradient-to-r from-[#E62D26] to-[#c41e18] text-white shadow-md'
                                                                    : (isDark ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-gray-50 text-gray-600')
                                                                    }`}
                                                            >
                                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${activeLesson?._id === lesson._id
                                                                    ? 'bg-white/20'
                                                                    : (isDark ? 'bg-slate-700' : 'bg-gray-100')
                                                                    }`}>
                                                                    {activeLesson?._id === lesson._id
                                                                        ? <FiPlay fill="currentColor" size={12} />
                                                                        : <FiPlay size={12} />
                                                                    }
                                                                </div>
                                                                <div className="flex-1 text-left min-w-0">
                                                                    <p className={`text-xs font-medium truncate ${activeLesson?._id === lesson._id ? 'text-white' : ''}`}>
                                                                        {lesson.title}
                                                                    </p>
                                                                    <p className={`text-[10px] flex items-center gap-1 ${activeLesson?._id === lesson._id ? 'text-white/60' : 'text-slate-500'}`}>
                                                                        <FiClock size={10} /> {lesson.videoDuration || 0} min
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile overlay when sidebar is open */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
