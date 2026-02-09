'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyDownloads } from '@/redux/downloadSlice';
import { fetchMyEnrollments, fetchMyStats } from '@/redux/enrollmentSlice';
import { fetchMyBatches } from '@/redux/batchSlice';
import {
    FiBook, FiAward, FiClock, FiTrendingUp, FiArrowRight,
    FiUser, FiMail, FiPhone, FiCalendar, FiLoader,
    FiShield, FiPlay, FiStar, FiRefreshCw, FiGrid, FiExternalLink,
    FiCheck, FiChevronRight, FiDownload, FiCode, FiGlobe, FiZap, FiTarget,
    FiUsers, FiVideo
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function UserDashboard() {
    const { isDark } = useTheme();
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    const { enrollments, stats: enrollmentStats, loading: enrollLoading } = useSelector((state) => state.enrollment);
    const { downloads, loading: downloadLoading } = useSelector((state) => state.download);
    const { myBatches, loading: batchLoading } = useSelector((state) => state.batch);

    useEffect(() => {
        setHasMounted(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) { }
        }

        dispatch(fetchMyEnrollments());
        dispatch(fetchMyStats());
        dispatch(fetchMyDownloads());
        dispatch(fetchMyBatches());
    }, [dispatch]);

    const handleSync = () => {
        setIsSyncing(true);
        dispatch(fetchMyEnrollments());
        dispatch(fetchMyStats());
        dispatch(fetchMyDownloads());
        dispatch(fetchMyBatches());
        setTimeout(() => setIsSyncing(false), 1000);
    };


    const cardClass = `rounded-2xl border transition-all duration-300 ${isDark
        ? 'bg-slate-800/50 border-white/5 hover:border-[#E62D26]/20'
        : 'bg-white border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md'
        }`;

    if (enrollLoading || downloadLoading) {
        return (
            <div className="space-y-6">
                {/* Loading Header */}
                <div className={`p-5 ${cardClass}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        <div className="space-y-2">
                            <div className={`h-4 w-32 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                            <div className={`h-3 w-48 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        </div>
                    </div>
                </div>
                {/* Loading Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`${cardClass} p-5`}>
                            <div className={`h-20 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const softwareCount = downloads.filter(d => d.productType === 'software').length;
    const websiteCount = downloads.filter(d => d.productType === 'website').length;

    return (
        <div className="space-y-6">
            {/* Professional Compact Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 ${cardClass}`}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E62D26] to-[#f79952] flex items-center justify-center text-white shadow-md shadow-[#E62D26]/10">
                        <FiGrid size={24} />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Dashboard Overview
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {hasMounted ? new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'Loading...'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSync}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isDark
                            ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <FiRefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                        Sync
                    </button>
                    <Link
                        href="/courses"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white rounded-xl text-sm font-bold shadow-md shadow-[#E62D26]/10 hover:scale-105 transition-all"
                    >
                        <FiBook size={16} />
                        Browse
                    </Link>
                </div>
            </div>

            {/* Welcome Banner */}
            <div className={`relative overflow-hidden rounded-2xl p-6 ${isDark
                ? 'bg-gradient-to-r from-slate-800 to-slate-800/50 border border-white/5'
                : 'bg-gradient-to-r from-slate-50 to-white border border-slate-100'
                }`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#E62D26]/10 blur-[60px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#f79952]/10 blur-[50px] rounded-full" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${isDark
                                ? 'bg-[#E62D26]/10 text-[#E62D26]'
                                : 'bg-[#E62D26]/10 text-[#E62D26]'
                                }`}>
                                <FiZap size={10} className="inline mr-1" />
                                Active Learner
                            </span>
                        </div>
                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Welcome back, <span className="text-[#E62D26]">{user?.firstName || 'Learner'}</span>! ??
                        </h2>
                        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {enrollments.length > 0
                                ? `Continue your learning journey. You have ${enrollments.length} active course${enrollments.length > 1 ? 's' : ''}.`
                                : 'Start your learning journey today. Explore our courses and digital assets.'
                            }
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/user/courses"
                            className="px-4 py-2.5 bg-gradient-to-r from-[#E62D26] to-[#c41e18] text-white rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-all"
                        >
                            My Courses
                        </Link>
                        <Link
                            href="/dashboard/user/downloads"
                            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${isDark
                                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            My Assets
                        </Link>
                    </div>
                </div>
            </div>

            {/* Upcoming Live Classes Notification */}
            {myBatches && myBatches.length > 0 && myBatches.some(b => b.status === 'ongoing' || b.status === 'upcoming') && (
                <div className={`relative overflow-hidden rounded-2xl border ${isDark
                    ? 'bg-gradient-to-r from-emerald-900/20 to-emerald-800/10 border-emerald-500/20'
                    : 'bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-emerald-200'
                    }`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full" />
                    <div className="relative z-10 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
                                <FiVideo size={20} />
                            </div>
                            <div>
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    Upcoming Live Classes
                                </h3>
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Your scheduled classes from enrolled batches
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {myBatches.filter(b => b.status === 'ongoing' || b.status === 'upcoming').slice(0, 3).map((batch) => (
                                <div key={batch._id} className={`flex-1 min-w-[250px] p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-white'} border ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 ${batch.status === 'ongoing' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {batch.status === 'ongoing' ? '🟢 Live Now' : '🔵 Upcoming'}
                                            </span>
                                            <h4 className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                {batch.batchName}
                                            </h4>
                                            <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {batch.course?.title || 'Course'}
                                            </p>
                                            {batch.schedule && batch.schedule.length > 0 && (
                                                <p className={`text-xs mt-1 flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    <FiClock size={10} />
                                                    {batch.schedule[0]?.startTime} - {batch.schedule[0]?.endTime}
                                                </p>
                                            )}
                                        </div>
                                        {batch.meetingLink && batch.status === 'ongoing' && (
                                            <a
                                                href={batch.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="shrink-0 px-3 py-2 bg-gradient-to-r from-[#E62D26] to-[#c41e18] text-white rounded-lg text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1"
                                            >
                                                <FiVideo size={12} />
                                                Join
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {myBatches.filter(b => b.status === 'ongoing' || b.status === 'upcoming').length > 3 && (
                            <Link href="/dashboard/user/batches" className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-emerald-500 hover:text-emerald-400">
                                View all batches <FiArrowRight size={12} />
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Stats Cards */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Enrolled Courses */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Enrolled Courses
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {enrollments.length.toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {enrollmentStats?.completedCourses || 0} completed
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiBook size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#E62D26] to-[#c41e18] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Digital Assets */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Digital Assets
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {downloads.length.toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {softwareCount} software, {websiteCount} web
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f79952] to-[#fb923c] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiDownload size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#f79952] to-[#fb923c] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Certificates */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Certificates
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {(enrollmentStats?.certificatesEarned || 0).toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Earned achievements
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-red-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiAward size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-red-500 transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Reward Points */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Reward Points
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                1,250
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Top 10% learner
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E62D26] to-[#f79952] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiStar size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#E62D26] to-[#f79952] transition-all duration-300 group-hover:w-full w-0`} />
                </div>
            </div>

            {/* My Batches Section */}
            {myBatches && myBatches.length > 0 && (
                <div className={`${cardClass} overflow-hidden`}>
                    <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                        <h2 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            <FiUsers size={18} className="text-[#E62D26]" />
                            My Batches
                        </h2>
                        <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-[#E62D26]/10 text-[#E62D26]' : 'bg-[#E62D26]/10 text-[#E62D26]'}`}>
                            {myBatches.length} Batch
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {myBatches.map((batch) => (
                            <div key={batch._id} className={`p-5 transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                                <div className="flex flex-col md:flex-row md:items-start gap-4">
                                    {/* Batch Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${batch.status === 'ongoing' ? 'bg-emerald-500/10 text-emerald-500' :
                                                batch.status === 'upcoming' ? 'bg-blue-500/10 text-blue-500' :
                                                    batch.status === 'completed' ? 'bg-slate-500/10 text-slate-500' :
                                                        'bg-red-500/10 text-red-500'
                                                }`}>
                                                {batch.status === 'ongoing' ? '🟢 Ongoing' :
                                                    batch.status === 'upcoming' ? '🔵 Upcoming' :
                                                        batch.status === 'completed' ? '⚫ Completed' : '🔴 Cancelled'}
                                            </span>
                                        </div>
                                        <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                            {batch.batchName}
                                        </h3>
                                        <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            <span className="font-semibold">Course:</span> {batch.course?.title || 'N/A'}
                                        </p>

                                        {/* Schedule */}
                                        {batch.schedule && batch.schedule.length > 0 && (
                                            <div className={`mb-3 p-3 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                                <p className={`text-xs font-bold uppercase mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    <FiCalendar size={12} className="inline mr-1" /> Class Schedule
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {batch.schedule.map((sch, idx) => (
                                                        <span key={idx} className={`text-xs px-2 py-1 rounded-md ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-600 border border-slate-200'}`}>
                                                            {sch.day === 'saturday' && 'Saturday'}
                                                            {sch.day === 'sunday' && 'Sunday'}
                                                            {sch.day === 'monday' && 'Monday'}
                                                            {sch.day === 'tuesday' && 'Tuesday'}
                                                            {sch.day === 'wednesday' && 'Wednesday'}
                                                            {sch.day === 'thursday' && 'Thursday'}
                                                            {sch.day === 'friday' && 'Friday'}
                                                            {' '}{sch.startTime} - {sch.endTime}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Date Range */}
                                        <div className="flex flex-wrap gap-4 text-xs">
                                            <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                <FiClock size={12} /> Starts: {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'N/A'}
                                            </span>
                                            <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                <FiClock size={12} /> Ends: {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 shrink-0">
                                        {batch.meetingLink && batch.status === 'ongoing' && (
                                            <a
                                                href={batch.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#E62D26] to-[#c41e18] text-white rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-all"
                                            >
                                                <FiVideo size={16} />
                                                Join Live Class
                                            </a>
                                        )}
                                        <Link
                                            href={`/learn/${batch.course?._id}`}
                                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isDark
                                                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            <FiPlay size={14} />
                                            View Course
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Continue Learning Section */}
                <div className={`lg:col-span-2 ${cardClass} overflow-hidden`}>
                    <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                        <h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Continue Learning
                        </h2>
                        <Link href="/dashboard/user/courses" className="text-xs font-bold text-[#E62D26] hover:underline flex items-center gap-1">
                            View All <FiArrowRight size={12} />
                        </Link>
                    </div>

                    {enrollments.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                <FiBook size={28} className={isDark ? 'text-slate-500' : 'text-slate-300'} />
                            </div>
                            <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                No courses yet
                            </h3>
                            <p className={`text-sm mb-5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                Start your learning journey today.
                            </p>
                            <Link
                                href="/courses"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-all"
                            >
                                Browse Courses <FiArrowRight size={14} />
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {enrollments.slice(0, 4).map((enroll) => (
                                <div key={enroll._id} className={`flex items-center gap-4 p-4 transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                                        <img src={enroll.course?.thumbnail || '/placeholder-course.jpg'} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-bold text-sm truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                            {enroll.course?.title}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                                <div className="h-full bg-gradient-to-r from-[#E62D26] to-[#f79952] rounded-full" style={{ width: `${enroll.progress || 0}%` }}></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-[#E62D26] whitespace-nowrap">{enroll.progress || 0}%</span>
                                        </div>
                                    </div>
                                    <Link href={`/learn/${enroll.course?._id}`} className={`p-2.5 rounded-xl transition-all ${isDark
                                        ? 'bg-slate-700 text-slate-300 hover:bg-[#E62D26] hover:text-white'
                                        : 'bg-slate-100 text-slate-500 hover:bg-[#E62D26] hover:text-white'
                                        }`}>
                                        <FiPlay size={16} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Profile Card */}
                    <div className={`${cardClass} overflow-hidden`}>
                        <div className={`p-5 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                            <h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                My Profile
                            </h2>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#E62D26] to-[#f79952] flex items-center justify-center text-white text-xl font-bold shadow-md">
                                    {user?.firstName?.[0] || 'S'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                        {user?.firstName} {user?.lastName}
                                    </h4>
                                    <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {user?.email}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className={`flex items-center justify-between p-3 rounded-xl text-xs ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <span className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        <FiShield size={12} className="text-[#E62D26]" /> Status
                                    </span>
                                    <span className="font-bold text-[#E62D26]">Verified</span>
                                </div>
                                <div className={`flex items-center justify-between p-3 rounded-xl text-xs ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <span className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        <FiCalendar size={12} className="text-[#f79952]" /> Joined
                                    </span>
                                    <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Jan 2025</span>
                                </div>
                            </div>

                            <Link
                                href="/dashboard/user/profile"
                                className={`mt-4 w-full flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${isDark
                                    ? 'bg-slate-700 text-slate-200 hover:bg-[#E62D26] hover:text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-[#E62D26] hover:text-white'
                                    }`}
                            >
                                Edit Profile <FiChevronRight size={12} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className={`${cardClass} overflow-hidden`}>
                        <div className={`p-5 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                            <h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                Quick Actions
                            </h2>
                        </div>
                        <div className="p-3 space-y-2">
                            <Link href="/dashboard/user/downloads" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E62D26]/10 to-[#E62D26]/5 flex items-center justify-center">
                                    <FiDownload size={16} className="text-[#E62D26]" />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>My Downloads</p>
                                    <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Access digital assets</p>
                                </div>
                                <FiChevronRight size={14} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
                            </Link>

                            <Link href="/dashboard/user/certificates" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 flex items-center justify-center">
                                    <FiAward size={16} className="text-emerald-500" />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Certificates</p>
                                    <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>View achievements</p>
                                </div>
                                <FiChevronRight size={14} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
                            </Link>

                            <Link href="/dashboard/user/purchases" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#f79952]/10 to-[#f79952]/5 flex items-center justify-center">
                                    <FiClock size={16} className="text-[#f79952]" />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Purchase History</p>
                                    <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>View transactions</p>
                                </div>
                                <FiChevronRight size={14} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
