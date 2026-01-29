'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseContent } from '@/redux/CourseSlice';
import { updateLessonProgress } from '@/redux/enrollmentSlice';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import {
    FiPlay, FiCheck, FiChevronDown, FiChevronUp,
    FiArrowLeft, FiClock, FiBookOpen, FiMenu, FiX,
    FiChevronRight, FiPlayCircle, FiAward, FiFileText,
    FiFile, FiHelpCircle, FiHome, FiUser, FiMaximize2, FiMinimize2, FiMonitor
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Import new components
import LessonDocuments from '@/components/learn/LessonDocuments';
import LessonQuiz from '@/components/learn/LessonQuiz';
import LessonTextContent from '@/components/learn/LessonTextContent';
import Logo from '@/components/sheard/Logo';

export default function CourseLearnPage() {
    const { courseId } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const { currentCourse, contentLoading, error } = useSelector((state) => state.courses);
    const [activeLesson, setActiveLesson] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [activeTab, setActiveTab] = useState('video');
    const [videoMode, setVideoMode] = useState('normal'); // normal, wide, theater

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseContent(courseId));
        }
    }, [courseId, dispatch]);

    const groupedContent = useMemo(() => {
        if (!currentCourse || !currentCourse.modules || !currentCourse.lessons) return [];
        return (currentCourse.modules || []).map(module => {
            const moduleId = module._id?.toString() || module._id;
            const moduleLessons = (currentCourse.lessons || []).filter(lesson => {
                const lessonModuleId = lesson.module?._id?.toString() || lesson.module?.toString() || lesson.module;
                return lessonModuleId === moduleId;
            }).sort((a, b) => (a.order || 0) - (b.order || 0));
            return { ...module, lessons: moduleLessons };
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

    useEffect(() => {
        if (activeLesson) {
            if (activeLesson.videoUrl) {
                setActiveTab('video');
            } else if (activeLesson.textContent || activeLesson.textBlocks?.length > 0) {
                setActiveTab('text');
            } else if (activeLesson.documents?.length > 0) {
                setActiveTab('documents');
            } else if (activeLesson.questions?.length > 0) {
                setActiveTab('quiz');
            } else {
                setActiveTab('video');
            }
        }
    }, [activeLesson?._id]);

    const handleMarkAsDone = async () => {
        if (!activeLesson || !courseId) return;
        try {
            await dispatch(updateLessonProgress({ courseId, lessonId: activeLesson._id }).unwrap());
            setCompletedLessons(prev => [...prev, activeLesson._id]);
            toast.success('Lesson completed! 🎉');

            let foundActive = false;
            let nextLesson = null;
            for (const module of groupedContent) {
                for (const lesson of module.lessons) {
                    if (foundActive) { nextLesson = lesson; break; }
                    if (lesson._id === activeLesson._id) foundActive = true;
                }
                if (nextLesson) break;
            }

            if (nextLesson) {
                setActiveLesson(nextLesson);
                const activeModule = groupedContent.find(m => m.lessons.some(l => l._id === nextLesson._id));
                if (activeModule) setExpandedModules(prev => ({ ...prev, [activeModule._id]: true }));
            } else {
                toast('🎊 Congratulations! Course completed!');
            }
        } catch (err) {
            toast.error(err || 'Failed to update progress');
        }
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const getVideoEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch')) {
            const videoId = url.split('v=')[1]?.split('&')[0];
            return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
        }
        if (url.includes('youtu.be')) {
            const videoId = url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
        }
        return url;
    };

    const totalLessons = groupedContent.reduce((sum, m) => sum + m.lessons.length, 0);
    const totalDuration = groupedContent.reduce((sum, m) => sum + m.lessons.reduce((s, l) => s + (l.videoDuration || 0), 0), 0);
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

    const contentTabs = [
        { id: 'video', label: 'Video', icon: FiPlay, show: !!activeLesson?.videoUrl },
        { id: 'text', label: 'Notes', icon: FiFileText, show: !!(activeLesson?.textContent || activeLesson?.textBlocks?.length > 0) },
        { id: 'documents', label: 'Resources', icon: FiFile, show: activeLesson?.documents?.length > 0, badge: activeLesson?.documents?.length },
        { id: 'quiz', label: 'Quiz', icon: FiHelpCircle, show: activeLesson?.questions?.length > 0 || activeLesson?.hasQuiz, badge: activeLesson?.questions?.length },
    ];

    const visibleTabs = contentTabs.filter(tab => tab.show);

    // Loading
    if (contentLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#E62D26] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-500 text-sm mt-4 font-medium">Loading course...</p>
                </div>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-xl text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <FiX size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/dashboard/user/courses')}
                        className="w-full py-3 bg-[#E62D26] text-white rounded-xl font-bold hover:bg-[#c41e18] transition-all"
                    >
                        Back to My Courses
                    </button>
                </div>
            </div>
        );
    }

    if (!currentCourse) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ===== PROFESSIONAL HEADER ===== */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
                    <div className="h-16 flex items-center justify-between">
                        {/* Left: Logo & Nav */}
                        <div className="flex items-center gap-4">
                            {/* Logo */}
                            <div className="flex items-center gap-2 group">
                                <Logo size="small" align="left" color="#300000" />
                            </div>

                            {/* Divider */}
                            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                            {/* Back & Home */}
                            <div className="hidden sm:flex items-center gap-1">
                                <Link
                                    href="/"
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-500 hover:text-[#E62D26] hover:bg-[#E62D26]/5 transition-all text-sm font-medium"
                                >
                                    <FiHome size={14} />
                                    Home
                                </Link>
                                <button
                                    onClick={() => router.push('/dashboard/user/courses')}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-500 hover:text-[#E62D26] hover:bg-[#E62D26]/5 transition-all text-sm font-medium"
                                >
                                    <FiArrowLeft size={14} />
                                    My Courses
                                </button>
                            </div>
                        </div>

                        {/* Center: Course Title & Progress */}
                        <div className="hidden lg:flex items-center gap-5 flex-1 max-w-xl mx-6">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-[#E62D26] font-bold uppercase tracking-wider">Learning Now</p>
                                <h1 className="text-gray-800 font-semibold truncate text-sm">
                                    {currentCourse.title}
                                </h1>
                            </div>
                            {/* Progress */}
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-400">{completedLessons.length}/{totalLessons}</span>
                                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                                        <div className="h-full bg-gradient-to-r from-[#E62D26] to-[#F79952] rounded-full" style={{ width: `${progressPercent}%` }}></div>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-[#E62D26]">{progressPercent}%</span>
                            </div>
                        </div>

                        {/* Right: Stats & Actions */}
                        <div className="flex items-center gap-3">
                            {/* Stats */}
                            <div className="hidden md:flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E62D26]/10 text-[#E62D26] text-xs font-bold">
                                    <FiBookOpen size={13} />
                                    <span>{totalLessons}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F79952]/10 text-[#F79952] text-xs font-bold">
                                    <FiClock size={13} />
                                    <span>{Math.round(totalDuration / 60)}m</span>
                                </div>
                            </div>

                            {/* Dashboard Link */}
                            <Link
                                href="/dashboard/user"
                                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#E62D26] hover:text-white transition-all text-sm font-medium"
                            >
                                <FiUser size={14} />
                                Dashboard
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all"
                            >
                                {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ===== MAIN CONTENT ===== */}
            <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-5">
                <div className="flex gap-6">
                    {/* Video & Info Section */}
                    <main className="flex-1 min-w-0">
                        {/* Content Tabs */}
                        {visibleTabs.length > 1 && (
                            <div className="flex gap-1 mb-4 p-1 bg-white rounded-xl border border-gray-200 overflow-x-auto">
                                {visibleTabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? 'bg-[#E62D26] text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <tab.icon size={15} />
                                        {tab.label}
                                        {tab.badge > 0 && (
                                            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab.id ? 'bg-white/20' : 'bg-[#E62D26]/10 text-[#E62D26]'}`}>
                                                {tab.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Video Tab */}
                        {activeTab === 'video' && (
                            <>
                                {/* Video Player */}
                                <div className={`bg-gray-900 rounded-xl overflow-hidden shadow-lg mb-4 ${videoMode === 'theater' ? 'fixed inset-0 z-50 rounded-none' : ''
                                    }`}>
                                    <div className="relative w-full" style={{ paddingTop: videoMode === 'theater' ? '0' : '56.25%', height: videoMode === 'theater' ? '100vh' : 'auto' }}>
                                        {activeLesson?.videoUrl ? (
                                            <iframe
                                                src={getVideoEmbedUrl(activeLesson.videoUrl)}
                                                title={activeLesson.title}
                                                className="absolute inset-0 w-full h-full"
                                                allowFullScreen
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            ></iframe>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                                <div className="text-center">
                                                    <FiPlayCircle size={48} className="text-white/30 mx-auto mb-3" />
                                                    <p className="text-white/40 text-sm">No video for this lesson</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Video Control Bar */}
                                <div className="flex items-center justify-end gap-2 mb-5">
                                    <button
                                        onClick={() => setVideoMode(videoMode === 'theater' ? 'normal' : 'theater')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${videoMode === 'theater'
                                            ? 'bg-[#F79952] text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <FiMaximize2 size={12} />
                                        {videoMode === 'theater' ? 'Exit Fullscreen' : 'Fullscreen'}
                                    </button>
                                </div>

                                {/* Theater mode - ESC hint & backdrop */}
                                {videoMode === 'theater' && (
                                    <>
                                        <div className="fixed inset-0 bg-black z-40" onClick={() => setVideoMode('normal')} />
                                        <button
                                            onClick={() => setVideoMode('normal')}
                                            className="fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-all"
                                        >
                                            <FiX size={16} />
                                            ESC to exit
                                        </button>
                                    </>
                                )}
                            </>
                        )}

                        {/* Text Content Tab */}
                        {activeTab === 'text' && (
                            <div className="mb-5">
                                <LessonTextContent
                                    textContent={activeLesson?.textContent}
                                    textContentBn={activeLesson?.textContentBn}
                                    textBlocks={activeLesson?.textBlocks}
                                />
                            </div>
                        )}

                        {/* Documents Tab */}
                        {activeTab === 'documents' && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
                                <LessonDocuments documents={activeLesson?.documents} />
                            </div>
                        )}

                        {/* Quiz Tab */}
                        {activeTab === 'quiz' && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
                                <LessonQuiz
                                    lessonId={activeLesson?._id}
                                    questions={activeLesson?.questions}
                                    quizSettings={activeLesson?.quizSettings}
                                    onComplete={(result) => {
                                        if (result.passed) {
                                            // Auto-complete on quiz pass
                                        }
                                    }}
                                />
                            </div>
                        )}

                        {/* Lesson Info Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 lg:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                                <div className="flex-1">
                                    {/* Breadcrumb Tags */}
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E62D26]/10 text-[#E62D26] text-xs font-bold">
                                            <FiBookOpen size={12} />
                                            Module {groupedContent.findIndex(m => m.lessons.some(l => l._id === activeLesson?._id)) + 1}
                                        </span>
                                        <FiChevronRight size={14} className="text-gray-300" />
                                        <span className="px-3 py-1.5 rounded-lg bg-[#F79952]/10 text-[#F79952] text-xs font-bold">
                                            Lesson {activeLesson?.order || 1}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
                                        {activeLesson?.title || 'Course Overview'}
                                    </h2>

                                    {/* Description */}
                                    {activeLesson?.description && (
                                        <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                            {activeLesson.description}
                                        </p>
                                    )}

                                    {/* Stats */}
                                    <div className="flex flex-wrap gap-2">
                                        {activeLesson?.videoDuration > 0 && (
                                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                                                <FiClock size={12} />
                                                {Math.round(activeLesson.videoDuration / 60)} min
                                            </span>
                                        )}
                                        {activeLesson?.documents?.length > 0 && (
                                            <span className="inline-flex items-center gap-1.5 text-xs text-[#E62D26] bg-[#E62D26]/10 px-3 py-1.5 rounded-lg">
                                                <FiFile size={12} />
                                                {activeLesson.documents.length} resources
                                            </span>
                                        )}
                                        {activeLesson?.questions?.length > 0 && (
                                            <span className="inline-flex items-center gap-1.5 text-xs text-[#F79952] bg-[#F79952]/10 px-3 py-1.5 rounded-lg">
                                                <FiHelpCircle size={12} />
                                                {activeLesson.questions.length} questions
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="flex-shrink-0">
                                    {completedLessons.includes(activeLesson?._id) ? (
                                        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#E62D26]/10 border border-[#E62D26]/20">
                                            <div className="w-9 h-9 rounded-full bg-[#E62D26] flex items-center justify-center">
                                                <FiCheck size={16} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[#E62D26] font-bold text-sm">Completed!</p>
                                                <p className="text-[#E62D26]/60 text-xs">Great job!</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleMarkAsDone}
                                            className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E62D26] to-[#c41e18] text-white font-bold text-sm shadow-lg shadow-[#E62D26]/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <FiCheck size={14} />
                                            </div>
                                            Mark Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* ===== CURRICULUM SIDEBAR (Desktop) ===== */}
                    <aside className={`hidden lg:block w-[340px] flex-shrink-0 ${!sidebarOpen ? 'lg:hidden' : ''}`}>
                        <div className="sticky top-[80px] bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-[#E62D26]/5 to-[#F79952]/5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center shadow-md">
                                        <FiBookOpen size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Course Content</h3>
                                        <p className="text-xs text-gray-500">{groupedContent.length} modules • {totalLessons} lessons</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">{completedLessons.length} of {totalLessons}</span>
                                        <span className="text-[#E62D26] font-bold">{progressPercent}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#E62D26] to-[#F79952] rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Module List */}
                            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                                {groupedContent.map((module, mIdx) => (
                                    <div key={module._id} className="border-b border-gray-50 last:border-0">
                                        <button
                                            onClick={() => toggleModule(module._id)}
                                            className={`w-full p-4 flex items-start gap-3 text-left transition-all ${expandedModules[module._id] ? 'bg-[#E62D26]/5' : 'hover:bg-gray-50'}`}
                                        >
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${expandedModules[module._id]
                                                ? 'bg-[#E62D26] text-white shadow-md'
                                                : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {mIdx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-700 line-clamp-2 leading-snug">
                                                    {module.title}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {module.lessons.length} lessons
                                                </p>
                                            </div>
                                            <div className={`text-gray-400 transition-transform ${expandedModules[module._id] ? 'rotate-180' : ''}`}>
                                                <FiChevronDown size={16} />
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {expandedModules[module._id] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pb-3 px-3 space-y-1">
                                                        {module.lessons.map((lesson) => {
                                                            const isActive = activeLesson?._id === lesson._id;
                                                            const isCompleted = completedLessons.includes(lesson._id);

                                                            return (
                                                                <button
                                                                    key={lesson._id}
                                                                    onClick={() => setActiveLesson(lesson)}
                                                                    className={`w-full ml-8 px-3 py-2.5 rounded-lg flex items-center gap-3 text-left transition-all ${isActive
                                                                        ? 'bg-gradient-to-r from-[#E62D26] to-[#c41e18] text-white shadow-md'
                                                                        : 'hover:bg-gray-50'
                                                                        }`}
                                                                >
                                                                    <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${isActive
                                                                        ? 'bg-white/20'
                                                                        : isCompleted
                                                                            ? 'bg-[#E62D26]/10 text-[#E62D26]'
                                                                            : 'bg-gray-100 text-gray-400'
                                                                        }`}>
                                                                        {isCompleted && !isActive ? <FiCheck size={11} /> : <FiPlay size={9} />}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className={`text-xs font-medium truncate ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                                                            {lesson.title}
                                                                        </p>
                                                                        <p className={`text-[10px] ${isActive ? 'text-white/60' : 'text-gray-400'}`}>
                                                                            {Math.round((lesson.videoDuration || 0) / 60)} min
                                                                        </p>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* ===== MOBILE SIDEBAR ===== */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden shadow-2xl overflow-y-auto"
                        >
                            <div className="sticky top-0 p-4 bg-white border-b border-gray-200 flex items-center justify-between z-10">
                                <h3 className="font-bold text-gray-800">Course Content</h3>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <FiX size={18} className="text-gray-500" />
                                </button>
                            </div>
                            <div className="p-4 space-y-2">
                                {groupedContent.map((module, mIdx) => (
                                    <div key={module._id}>
                                        <button
                                            onClick={() => toggleModule(module._id)}
                                            className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all ${expandedModules[module._id] ? 'bg-[#E62D26]/10' : 'bg-gray-50 hover:bg-gray-100'}`}
                                        >
                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${expandedModules[module._id] ? 'bg-[#E62D26] text-white' : 'bg-white text-gray-500'}`}>
                                                {mIdx + 1}
                                            </div>
                                            <span className="flex-1 text-sm font-semibold text-gray-700 truncate">{module.title}</span>
                                            <FiChevronDown className={`text-gray-400 transition-transform ${expandedModules[module._id] ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {expandedModules[module._id] && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: 'auto' }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="ml-10 mt-1 space-y-1 pb-2">
                                                        {module.lessons.map((lesson) => {
                                                            const isActive = activeLesson?._id === lesson._id;
                                                            return (
                                                                <button
                                                                    key={lesson._id}
                                                                    onClick={() => { setActiveLesson(lesson); setSidebarOpen(false); }}
                                                                    className={`w-full p-2.5 rounded-lg text-left text-sm font-medium transition-all ${isActive
                                                                        ? 'bg-[#E62D26] text-white'
                                                                        : 'text-gray-600 hover:bg-gray-100'
                                                                        }`}
                                                                >
                                                                    {lesson.title}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
