'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyEnrollments } from '@/redux/enrollmentSlice';
import {
    FiSearch, FiBook, FiClock, FiStar, FiFilter,
    FiGrid, FiList, FiTrendingUp, FiArrowRight,
    FiPlay, FiLayers, FiRefreshCw, FiMinusCircle,
    FiCheckCircle, FiInfo, FiUsers
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import Link from 'next/link';

export default function UserCoursesPage() {
    const { isDark } = useTheme();
    const dispatch = useDispatch();
    const { enrollments, loading, error } = useSelector((state) => state.enrollment);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchMyEnrollments());
    }, [dispatch]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await dispatch(fetchMyEnrollments());
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const filteredEnrollments = enrollments.filter(enroll =>
        enroll.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats
    const stats = {
        total: enrollments.length,
        inProgress: enrollments.filter(e => (e.progress || 0) > 0 && (e.progress || 0) < 100).length,
        completed: enrollments.filter(e => (e.progress || 0) === 100).length,
        points: enrollments.reduce((acc, e) => acc + (e.progress || 0) * 10, 0),
    };

    // Card class based on theme
    const cardClass = `rounded-2xl border transition-all duration-300 ${isDark
        ? 'bg-slate-800/50 border-white/5 hover:border-[#E62D26]/20'
        : 'bg-white border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md'
        }`;

    // Loading Skeleton
    const CourseSkeleton = () => (
        <div className={cardClass}>
            <div className={`h-44 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
            <div className="p-5 space-y-3">
                <div className={`h-4 rounded animate-pulse w-3/4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
                <div className={`h-3 rounded animate-pulse w-1/2 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
                <div className="flex gap-2 pt-2">
                    <div className={`h-8 rounded-xl animate-pulse flex-1 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
                    <div className={`h-8 rounded-xl animate-pulse flex-1 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
                </div>
            </div>
        </div>
    );

    if (loading && !isRefreshing) {
        return (
            <div className="space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 ${cardClass}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        <div className="space-y-2">
                            <div className={`h-4 w-32 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                            <div className={`h-3 w-48 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => <CourseSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Professional Compact Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 ${cardClass}`}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E62D26] to-[#f79952] flex items-center justify-center text-white shadow-md shadow-[#E62D26]/10">
                        <FiBook size={24} />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            My Courses
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            All your enrolled courses and learning progress
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isDark
                            ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            } disabled:opacity-50`}
                    >
                        <FiRefreshCw className={isRefreshing ? 'animate-spin' : ''} size={16} />
                        Sync
                    </button>
                    <Link
                        href="/courses"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white rounded-xl text-sm font-bold shadow-md shadow-[#E62D26]/10 hover:scale-105 transition-all"
                    >
                        <FiArrowRight size={16} />
                        Explore More
                    </Link>
                </div>
            </div>

            {/* Stats Cards - Professional Admin Dashboard Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Courses */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Total Courses
                            </p>
                            <h3 className={`text-2xl font-black mt-1 outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.total.toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                All enrolled courses
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiBook size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#E62D26] to-[#c41e18] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* In Progress */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                In Progress
                            </p>
                            <h3 className={`text-2xl font-black mt-1 outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.inProgress.toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Active learning
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f79952] to-[#fb923c] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiTrendingUp size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#f79952] to-[#fb923c] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Completed */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Completed
                            </p>
                            <h3 className={`text-2xl font-black mt-1 outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.completed.toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Certificate eligible
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-red-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiCheckCircle size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-red-500 transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Points Earned */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Points Earned
                            </p>
                            <h3 className={`text-2xl font-black mt-1 outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.points.toLocaleString()}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Learning rewards
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E62D26] to-[#f79952] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiStar size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#E62D26] to-[#f79952] transition-all duration-300 group-hover:w-full w-0`} />
                </div>
            </div>

            {/* Filters Bar */}
            <div className={`flex flex-col md:flex-row md:items-center gap-4 p-4 ${cardClass}`}>
                <div className="relative flex-1">
                    <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input
                        placeholder="Search your courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${isDark
                            ? 'bg-slate-800/50 border-white/5 text-slate-200 focus:ring-[#E62D26]/30'
                            : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-[#E62D26]/20'
                            }`}
                    />
                </div>
                <div className={`flex items-center gap-1 p-1 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                            ? isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white shadow-sm text-slate-800'
                            : isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                    >
                        <FiGrid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list'
                            ? isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white shadow-sm text-slate-800'
                            : isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                    >
                        <FiList size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {filteredEnrollments.length === 0 ? (
                <div className={`py-20 text-center rounded-2xl border-2 border-dashed ${isDark
                    ? 'border-slate-700 bg-slate-900/20'
                    : 'border-slate-200 bg-slate-50/50'
                    }`}>
                    <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'
                        }`}>
                        <FiMinusCircle size={36} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
                    </div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        No Courses Found
                    </h2>
                    <p className={`text-sm mt-3 max-w-sm mx-auto ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {searchTerm
                            ? `We couldn't find any courses matching "${searchTerm}" in your shelf.`
                            : "Your learning shelf is currently empty. Start your learning journey today!"}
                    </p>
                    {!searchTerm && (
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white rounded-xl font-bold text-sm shadow-md shadow-[#E62D26]/10 hover:scale-105 transition-all"
                        >
                            Browse All Courses <FiArrowRight />
                        </Link>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredEnrollments.map((enroll) => (
                        <div
                            key={enroll._id}
                            className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 ${isDark
                                ? 'bg-slate-800/50 border-white/5 hover:border-[#E62D26]/20'
                                : 'bg-white border-slate-200 hover:shadow-lg'
                                }`}
                        >
                            {/* Thumbnail Area */}
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={enroll.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800'}
                                    alt={enroll.course?.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                {/* Progress Badge */}
                                <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black shadow-sm">
                                    <span className="text-[#E62D26]">{enroll.progress || 0}%</span>
                                </div>

                                <div className="absolute bottom-3 left-3 right-3">
                                    <span className={`inline-flex items-center gap-1 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest mb-1.5 ${isDark ? 'bg-white/10' : 'bg-black/20'} backdrop-blur-sm`}>
                                        {enroll.course?.category?.title || 'Course'}
                                    </span>
                                    <h3 className="text-white font-bold text-sm line-clamp-2 leading-snug">
                                        {enroll.course?.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-4 space-y-4">
                                {/* Progress Bar */}
                                <div className="space-y-1.5">
                                    <div className={`flex justify-between items-center text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        <span>Progress</span>
                                        <span>{enroll.progress || 0}%</span>
                                    </div>
                                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                        <div
                                            className="h-full bg-gradient-to-r from-[#E62D26] to-[#f79952] rounded-full transition-all duration-500"
                                            style={{ width: `${enroll.progress || 0}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className={`p-2 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <FiLayers className="text-[#E62D26] mx-auto mb-1" size={12} />
                                        <p className={`text-[10px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                            {enroll.completedLessons || 0} Lessons
                                        </p>
                                    </div>
                                    <div className={`p-2 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <FiClock className="text-[#f79952] mx-auto mb-1" size={12} />
                                        <p className={`text-[10px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                            {enroll.progress || 0}% Done
                                        </p>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <Link
                                    href={`/learn/${enroll.course?._id}`}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-[#E62D26] to-[#c41e18] text-white rounded-xl font-bold text-xs shadow-md shadow-[#E62D26]/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
                                >
                                    <FiPlay size={14} /> Continue Learning
                                </Link>
                            </div>

                            {/* New Course Badge */}
                            {(!enroll.progress || enroll.progress === 0) && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest shadow-md">
                                    New
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={`rounded-2xl border overflow-hidden divide-y ${isDark ? 'bg-slate-800/50 border-white/5 divide-white/5' : 'bg-white border-slate-200 divide-slate-100'}`}>
                    {filteredEnrollments.map((enroll) => (
                        <div key={enroll._id} className={`flex items-center gap-4 p-4 transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                            <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-white/5">
                                <img src={enroll.course?.thumbnail} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`text-sm font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{enroll.course?.title}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                        {enroll.course?.category?.title || 'Course'}
                                    </span>
                                    <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {enroll.completedLessons || 0} lessons completed
                                    </span>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-sm font-black text-[#E62D26]">{enroll.progress || 0}%</p>
                                <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Progress</p>
                            </div>
                            <Link
                                href={`/learn/${enroll.course?._id}`}
                                className={`p-2.5 rounded-xl transition-all ${isDark
                                    ? 'bg-slate-700 text-slate-300 hover:bg-[#E62D26] hover:text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-[#E62D26] hover:text-white'
                                    }`}
                            >
                                <FiPlay size={16} />
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Support Widget */}
            <div className={`mt-8 p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${isDark
                ? 'bg-slate-800/50 border-white/5'
                : 'bg-gradient-to-br from-slate-50 to-white border-slate-100'
                }`}>
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark
                        ? 'bg-slate-700 text-[#E62D26]'
                        : 'bg-white text-[#E62D26] shadow-md border border-slate-100'
                        }`}>
                        <FiInfo size={22} />
                    </div>
                    <div>
                        <h4 className={`text-base font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Having Issues?</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            If your course isn't appearing, use the sync button or contact support.
                        </p>
                    </div>
                </div>
                <Link
                    href="/dashboard/user/support"
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${isDark
                        ? 'bg-slate-700 text-white hover:bg-slate-600'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                >
                    Contact Support
                </Link>
            </div>
        </div>
    );
}
