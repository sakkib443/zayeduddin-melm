'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiVideo, FiCalendar, FiClock, FiExternalLink,
    FiPlay, FiBook, FiUsers, FiCheckCircle, FiRefreshCw
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_URL } from '@/config/api';

export default function MyLiveClassesPage() {
    const { isDark } = useTheme();
    const [myBatches, setMyBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const res = await fetch(`${API_URL}/batches/my-batches`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (data.success) {
                setMyBatches(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = () => {
        setIsSyncing(true);
        fetchData();
        setTimeout(() => setIsSyncing(false), 1000);
    };

    const getDayName = (day) => {
        const days = {
            saturday: 'Saturday', sunday: 'Sunday', monday: 'Monday',
            tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday'
        };
        return days[day?.toLowerCase()] || day;
    };

    const getCurrentDayIndex = () => {
        const dayMap = {
            0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday',
            4: 'thursday', 5: 'friday', 6: 'saturday'
        };
        return dayMap[new Date().getDay()];
    };

    const isTodayClass = (schedule) => {
        if (!schedule || schedule.length === 0) return false;
        const today = getCurrentDayIndex();
        return schedule.some(s => s.day?.toLowerCase() === today);
    };

    const getTodaySchedule = (schedule) => {
        if (!schedule || schedule.length === 0) return null;
        const today = getCurrentDayIndex();
        return schedule.find(s => s.day?.toLowerCase() === today);
    };

    const isClassLiveNow = (schedule) => {
        const todaySchedule = getTodaySchedule(schedule);
        if (!todaySchedule) return false;

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        return todaySchedule.startTime <= currentTime && currentTime <= todaySchedule.endTime;
    };

    const cardClass = `rounded-2xl border transition-all duration-300 ${isDark
        ? 'bg-slate-800/50 border-white/5 hover:border-[#021E14]/20'
        : 'bg-white border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md'
        }`;

    // Filter batches that have meeting links
    const batchesWithLinks = myBatches.filter(b => b.meetingLink && (b.status === 'ongoing' || b.status === 'upcoming'));

    // Separate today's classes and upcoming classes
    const todayClasses = batchesWithLinks.filter(b => isTodayClass(b.schedule));
    const upcomingClasses = batchesWithLinks.filter(b => !isTodayClass(b.schedule));

    if (loading) {
        return (
            <div className="space-y-6">
                <div className={`p-5 ${cardClass}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        <div className="space-y-2">
                            <div className={`h-4 w-32 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                            <div className={`h-3 w-48 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        </div>
                    </div>
                </div>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`${cardClass} p-6`}>
                        <div className={`h-24 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 ${cardClass}`}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#021E14] to-[#021E14] flex items-center justify-center text-white shadow-md shadow-[#021E14]/10">
                        <FiVideo size={24} />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            My Live Classes
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            View and join your scheduled live classes
                        </p>
                    </div>
                </div>
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
            </div>

            {/* Today's Classes */}
            {todayClasses.length > 0 && (
                <div>
                    <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        <span className="w-2 h-2 bg-[#021E14] rounded-full animate-pulse"></span>
                        Today's Classes
                    </h2>
                    <div className="space-y-4">
                        {todayClasses.map((batch) => {
                            const todaySchedule = getTodaySchedule(batch.schedule);
                            const isLive = isClassLiveNow(batch.schedule);

                            return (
                                <div
                                    key={batch._id}
                                    className={`${cardClass} p-6 ${isLive ? 'ring-2 ring-[#021E14]' : ''}`}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {isLive ? (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#021E14]/10 text-[#021E14] animate-pulse">
                                                        🔴 Live Now
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-600">
                                                        📅 Scheduled Today
                                                    </span>
                                                )}
                                                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    {batch.batchCode}
                                                </span>
                                            </div>

                                            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                {batch.batchName}
                                            </h3>
                                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                <FiBook size={14} className="inline mr-2" />
                                                {batch.course?.title || 'Course'}
                                            </p>

                                            {todaySchedule && (
                                                <div className={`mt-3 flex items-center gap-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    <span className="flex items-center gap-1">
                                                        <FiClock size={14} />
                                                        {todaySchedule.startTime} - {todaySchedule.endTime}
                                                    </span>
                                                    {batch.instructor && (
                                                        <span className="flex items-center gap-1">
                                                            <FiUsers size={14} />
                                                            {batch.instructor.name}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <a
                                                href={batch.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-105 ${isLive
                                                        ? 'bg-gradient-to-r from-[#021E14] to-[#01140D] text-white shadow-red-500/30'
                                                        : 'bg-gradient-to-r from-[#021E14] to-[#021E14] text-white shadow-[#021E14]/20'
                                                    }`}
                                            >
                                                <FiPlay size={16} />
                                                {isLive ? 'Join Now' : 'Join Class'}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Upcoming Classes / Other Batches */}
            {upcomingClasses.length > 0 && (
                <div>
                    <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Upcoming Classes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingClasses.map((batch) => (
                            <div key={batch._id} className={`${cardClass} p-5`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                            {batch.batchName}
                                        </h3>
                                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {batch.batchCode}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${batch.status === 'ongoing'
                                            ? 'bg-[#021E14]/10 text-[#021E14]'
                                            : 'bg-[#021E14]/10 text-[#021E14]'
                                        }`}>
                                        {batch.status}
                                    </span>
                                </div>

                                <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {batch.course?.title}
                                </p>

                                {batch.schedule && batch.schedule.length > 0 && (
                                    <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
                                        <p className={`text-xs font-bold uppercase mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            Weekly Schedule
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {batch.schedule.map((s, i) => (
                                                <span
                                                    key={i}
                                                    className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-600 border border-slate-200'}`}
                                                >
                                                    {getDayName(s.day)} {s.startTime}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <a
                                    href={batch.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${isDark
                                        ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    <FiExternalLink size={16} />
                                    View Meeting Link
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Classes */}
            {batchesWithLinks.length === 0 && (
                <div className={`${cardClass} p-12 text-center`}>
                    <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <FiVideo size={36} className={isDark ? 'text-slate-500' : 'text-slate-300'} />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        No Live Classes Available
                    </h3>
                    <p className={`text-sm mb-5 max-w-md mx-auto ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {myBatches.length === 0
                            ? "You haven't enrolled in any batch yet. Purchase an online course to join live classes."
                            : "Your enrolled batches don't have live class links set up yet. Check back later."
                        }
                    </p>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#021E14] to-[#021E14] text-white rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-all"
                    >
                        Browse Courses <FiExternalLink size={16} />
                    </Link>
                </div>
            )}
        </div>
    );
}

