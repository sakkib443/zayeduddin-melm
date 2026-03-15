'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyDownloads } from '@/redux/downloadSlice';
import { fetchMyEnrollments, fetchMyStats } from '@/redux/enrollmentSlice';
import { fetchMyBatches } from '@/redux/batchSlice';
import {
    FiBook, FiAward, FiClock, FiArrowRight,
    FiLoader, FiPlay, FiRefreshCw, FiGrid,
    FiCheck, FiChevronRight, FiDownload, FiZap,
    FiUsers, FiVideo, FiCalendar, FiExternalLink
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { useLanguage } from '@/context/LanguageContext';

export default function UserDashboard() {
    const { isDark } = useTheme();
    const { t } = useLanguage();
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
            try { setUser(JSON.parse(storedUser)); } catch (e) { }
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

    // Find batch for a course (for online courses)
    const getBatchForCourse = (courseId) => {
        if (!myBatches || !courseId) return null;
        return myBatches.find(b =>
            (b.course?._id === courseId || b.course === courseId) &&
            (b.status === 'ongoing' || b.status === 'upcoming')
        );
    };

    const cardClass = `rounded-xl border transition-all duration-300 ${isDark
        ? 'bg-slate-800/50 border-white/5 hover:border-[#021E14]/20'
        : 'bg-white border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md'
        }`;

    if (enrollLoading || downloadLoading) {
        return (
            <div className="space-y-5">
                <div className={`p-5 ${cardClass}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        <div className="space-y-2">
                            <div className={`h-4 w-32 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                            <div className={`h-3 w-48 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`${cardClass} p-5`}>
                            <div className={`h-20 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Header Bar */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 ${cardClass}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#021E14] flex items-center justify-center text-white shadow-sm">
                        <FiGrid size={20} />
                    </div>
                    <div>
                        <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {t('userDashboard.main.dashboard')}
                        </h1>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {hasMounted ? new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : '...'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSync}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isDark
                            ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <FiRefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                        {t('userDashboard.main.sync')}
                    </button>
                    <Link
                        href="/courses"
                        className="flex items-center gap-2 px-3 py-2 bg-[#021E14] text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-[#021E14]/90 transition-all"
                    >
                        <FiBook size={14} />
                        {t('userDashboard.main.browseCourses')}
                    </Link>
                </div>
            </div>

            {/* Welcome */}
            <div className={`relative overflow-hidden rounded-xl p-5 ${isDark
                ? 'bg-slate-800/50 border border-white/5'
                : 'bg-gradient-to-r from-slate-50 to-white border border-slate-100'
                }`}>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {t('userDashboard.main.welcome')} <span className="text-[#021E14]">{user?.firstName || t('userDashboard.main.learner')}</span>! 👋
                        </h2>
                        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {enrollments.length > 0
                                ? `${t('userDashboard.main.youHave')} ${enrollments.length} ${t('userDashboard.main.activeCourses')}.`
                                : t('userDashboard.main.startJourney')
                            }
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard/user/courses" className="px-4 py-2 bg-[#021E14] text-white rounded-lg font-semibold text-sm hover:bg-[#021E14]/90 transition-all">
                            {t('userDashboard.sidebar.myCourses')}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Cards - 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Enrolled Courses */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t('userDashboard.main.enrolledCourses')}
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {enrollments.length.toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {enrollmentStats?.completedCourses || 0} {t('userDashboard.main.completed')}
                            </p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-[#021E14] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                            <FiBook size={18} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-[#021E14] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Digital Assets */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t('userDashboard.main.digitalAssets')}
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {downloads.length.toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t('userDashboard.main.templatesWebsites')}
                            </p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-[#021E14] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                            <FiDownload size={18} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-[#021E14] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Certificates */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t('userDashboard.main.certificates')}
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {(enrollmentStats?.certificatesEarned || 0).toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t('userDashboard.main.earnedAchievements')}
                            </p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-[#021E14] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                            <FiAward size={18} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-[#021E14] transition-all duration-300 group-hover:w-full w-0`} />
                </div>
            </div>

            {/* Upcoming Live Classes Alert */}
            {myBatches && myBatches.length > 0 && myBatches.some(b => b.status === 'ongoing' || b.status === 'upcoming') && (
                <div className={`rounded-xl border overflow-hidden ${isDark
                    ? 'bg-emerald-900/10 border-[#021E14]/20'
                    : 'bg-emerald-50/50 border-emerald-200'
                    }`}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-[#021E14] flex items-center justify-center text-white">
                                <FiVideo size={16} />
                            </div>
                            <div>
                                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('userDashboard.main.upcomingClasses')}</h3>
                                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('userDashboard.main.scheduledLive')}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {myBatches.filter(b => b.status === 'ongoing' || b.status === 'upcoming').slice(0, 3).map((batch) => (
                                <div key={batch._id} className={`flex-1 min-w-[220px] p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-white'} border ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mb-1 ${batch.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {batch.status === 'ongoing' ? `🟢 ${t('userDashboard.main.live')}` : `🔵 ${t('userDashboard.main.upcoming')}`}
                                            </span>
                                            <h4 className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{batch.batchName}</h4>
                                            <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{batch.course?.title}</p>
                                            {batch.schedule?.[0] && (
                                                <p className={`text-[10px] mt-1 flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    <FiClock size={9} /> {batch.schedule[0].startTime} - {batch.schedule[0].endTime}
                                                </p>
                                            )}
                                        </div>
                                        {batch.meetingLink && batch.status === 'ongoing' && (
                                            <a href={batch.meetingLink} target="_blank" rel="noopener noreferrer"
                                                className="shrink-0 px-2.5 py-1.5 bg-[#021E14] text-white rounded-md text-[10px] font-bold hover:bg-[#021E14]/90 transition-all flex items-center gap-1">
                                                <FiVideo size={10} /> {t('userDashboard.main.join')}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href="/dashboard/user/live-classes" className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-[#021E14] hover:underline">
                            {t('userDashboard.main.viewAllClasses')} <FiArrowRight size={11} />
                        </Link>
                    </div>
                </div>
            )}

            {/* My Courses - with course type badges */}
            <div className={`${cardClass} overflow-hidden`}>
                <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <h2 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {t('userDashboard.sidebar.myCourses')}
                    </h2>
                    <Link href="/dashboard/user/courses" className="text-[10px] font-bold text-[#021E14] hover:underline flex items-center gap-1">
                        View All <FiArrowRight size={10} />
                    </Link>
                </div>

                {enrollments.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                            <FiBook size={24} className={isDark ? 'text-slate-500' : 'text-slate-300'} />
                        </div>
                        <h3 className={`font-bold mb-1 text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('userDashboard.main.noCourses')}</h3>
                        <p className={`text-xs mb-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{t('userDashboard.main.startJourneyToday')}</p>
                        <Link href="/courses" className="inline-flex items-center gap-2 px-4 py-2 bg-[#021E14] text-white rounded-lg font-semibold text-xs hover:bg-[#021E14]/90 transition-all">
                            {t('userDashboard.main.browseCourses')} <FiArrowRight size={12} />
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {enrollments.slice(0, 5).map((enroll) => {
                            const courseType = enroll.course?.courseType || 'recorded';
                            const isOnline = courseType.toLowerCase() === 'online' || courseType.toLowerCase() === 'live';
                            const batch = isOnline ? getBatchForCourse(enroll.course?._id) : null;

                            return (
                                <div key={enroll._id} className={`p-4 transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                                    <div className="flex items-center gap-3">
                                        {/* Thumbnail */}
                                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                            <img src={enroll.course?.thumbnail || '/placeholder-course.jpg'} alt="" className="w-full h-full object-cover" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className={`font-bold text-sm truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    {enroll.course?.title}
                                                </h4>
                                                <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${isOnline
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-emerald-100 text-emerald-700'
                                                    }`}>
                                                    {isOnline ? t('userDashboard.main.online') : t('userDashboard.main.recorded')}
                                                </span>
                                            </div>
                                            {/* Progress */}
                                            <div className="flex items-center gap-2">
                                                <div className={`flex-1 h-1 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                                    <div className="h-full bg-[#021E14] rounded-full" style={{ width: `${enroll.progress || 0}%` }}></div>
                                                </div>
                                                <span className="text-[9px] font-bold text-[#021E14] whitespace-nowrap">{enroll.progress || 0}%</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {/* Continue Learning - always */}
                                            <Link href={`/learn/${enroll.course?._id}`}
                                                className={`p-2 rounded-lg transition-all ${isDark
                                                    ? 'bg-slate-700 text-slate-300 hover:bg-[#021E14] hover:text-white'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-[#021E14] hover:text-white'
                                                    }`}
                                                title={t('userDashboard.main.continueLearning')}
                                            >
                                                <FiPlay size={14} />
                                            </Link>

                                            {/* Schedule - online only */}
                                            {isOnline && (
                                                <Link href="/dashboard/user/schedule"
                                                    className={`p-2 rounded-lg transition-all ${isDark
                                                        ? 'bg-slate-700 text-slate-300 hover:bg-blue-600 hover:text-white'
                                                        : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                                                        }`}
                                                    title={t('userDashboard.main.classSchedule')}
                                                >
                                                    <FiCalendar size={14} />
                                                </Link>
                                            )}

                                            {/* Live Class Link - online only */}
                                            {isOnline && batch?.meetingLink && (
                                                <a href={batch.meetingLink} target="_blank" rel="noopener noreferrer"
                                                    className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                                                    title={t('userDashboard.main.joinLiveClass')}
                                                >
                                                    <FiVideo size={14} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Bottom Grid: Profile + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Profile Card */}
                <div className={`${cardClass} overflow-hidden`}>
                    <div className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                        <h2 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('userDashboard.main.myProfile')}</h2>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-[#021E14] flex items-center justify-center text-white text-lg font-bold shadow-sm">
                                {user?.firstName?.[0] || 'S'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{user?.firstName} {user?.lastName}</h4>
                                <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{user?.email}</p>
                            </div>
                        </div>
                        <Link href="/dashboard/user/profile"
                            className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-all ${isDark
                                ? 'bg-slate-700 text-slate-200 hover:bg-[#021E14] hover:text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-[#021E14] hover:text-white'
                                }`}
                        >
                            {t('userDashboard.main.editProfile')} <FiChevronRight size={12} />
                        </Link>
                    </div>
                </div>

                {/* Quick Links */}
                <div className={`${cardClass} overflow-hidden`}>
                    <div className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                        <h2 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('userDashboard.main.quickLinks')}</h2>
                    </div>
                    <div className="p-3 space-y-1">
                        {[
                            { href: '/dashboard/user/schedule', icon: FiCalendar, title: t('userDashboard.sidebar.schedule'), desc: t('userDashboard.main.viewSchedule') },
                            { href: '/dashboard/user/live-classes', icon: FiVideo, title: t('userDashboard.main.liveClasses'), desc: t('userDashboard.main.joinViewLive') },
                            { href: '/dashboard/user/downloads', icon: FiDownload, title: t('userDashboard.main.downloads'), desc: t('userDashboard.main.accessDigital') },
                            { href: '/dashboard/user/purchases', icon: FiClock, title: t('userDashboard.sidebar.purchaseHistory'), desc: t('userDashboard.main.viewTransactions') },
                        ].map((item) => (
                            <Link key={item.href} href={item.href}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                                <div className="w-8 h-8 rounded-lg bg-[#021E14]/10 flex items-center justify-center">
                                    <item.icon size={14} className="text-[#021E14]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.title}</p>
                                    <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.desc}</p>
                                </div>
                                <FiChevronRight size={12} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
