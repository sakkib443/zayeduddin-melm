'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBatches } from '@/redux/batchSlice';
import {
    FiUsers, FiCalendar, FiClock, FiPlay, FiVideo, FiArrowRight,
    FiRefreshCw, FiBook, FiExternalLink
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function MyBatchesPage() {
    const { isDark } = useTheme();
    const dispatch = useDispatch();
    const [isSyncing, setIsSyncing] = useState(false);

    const { myBatches, loading, error } = useSelector((state) => state.batch);

    useEffect(() => {
        dispatch(fetchMyBatches());
    }, [dispatch]);

    const handleSync = () => {
        setIsSyncing(true);
        dispatch(fetchMyBatches());
        setTimeout(() => setIsSyncing(false), 1000);
    };

    const cardClass = `rounded-2xl border transition-all duration-300 ${isDark
        ? 'bg-slate-800/50 border-white/5 hover:border-[#021E14]/20'
        : 'bg-white border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md'
        }`;

    const getDayName = (day) => {
        const days = {
            saturday: 'Saturday', sunday: 'Sunday', monday: 'Monday',
            tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday'
        };
        return days[day] || day;
    };

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
                        <FiUsers size={24} />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            My Batches
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            View your enrolled batches and class schedules
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
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#021E14] to-[#021E14] text-white rounded-xl text-sm font-bold shadow-md shadow-[#021E14]/10 hover:scale-105 transition-all"
                    >
                        <FiBook size={16} />
                        Browse Courses
                    </Link>
                </div>
            </div>

            {/* Batches List */}
            {!myBatches || myBatches.length === 0 ? (
                <div className={`${cardClass} p-10 text-center`}>
                    <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <FiUsers size={36} className={isDark ? 'text-slate-500' : 'text-slate-300'} />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        No Batches Enrolled
                    </h3>
                    <p className={`text-sm mb-5 max-w-md mx-auto ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        You haven't enrolled in any online batch yet. Purchase a course and join a batch to attend live classes.
                    </p>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#021E14] to-[#021E14] text-white rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-all"
                    >
                        Browse Courses <FiArrowRight size={16} />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {myBatches.map((batch) => (
                        <div key={batch._id} className={`${cardClass} overflow-hidden`}>
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                    {/* Batch Info */}
                                    <div className="flex-1 min-w-0">
                                        {/* Status Badge */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${batch.status === 'ongoing' ? 'bg-[#021E14]/10 text-[#021E14]' :
                                                    batch.status === 'upcoming' ? 'bg-[#021E14]/10 text-[#021E14]' :
                                                        batch.status === 'completed' ? 'bg-slate-500/10 text-slate-500' :
                                                            'bg-[#021E14]/10 text-[#021E14]'
                                                }`}>
                                                {batch.status === 'ongoing' ? '🟢 Ongoing' :
                                                    batch.status === 'upcoming' ? '🔵 Upcoming' :
                                                        batch.status === 'completed' ? '⚫ Completed' : '🔴 Cancelled'}
                                            </span>
                                            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                Code: {batch.batchCode}
                                            </span>
                                        </div>

                                        {/* Batch Name */}
                                        <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                            {batch.batchName}
                                        </h2>

                                        {/* Course Name */}
                                        <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            <FiBook size={14} className="inline mr-2" />
                                            <span className="font-semibold">Course:</span> {batch.course?.title || 'N/A'}
                                        </p>

                                        {/* Schedule */}
                                        {batch.schedule && batch.schedule.length > 0 && (
                                            <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
                                                <p className={`text-xs font-bold uppercase mb-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    <FiCalendar size={14} /> Class Schedule
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {batch.schedule.map((sch, idx) => (
                                                        <span key={idx} className={`text-sm px-3 py-1.5 rounded-lg ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-600 border border-slate-200'}`}>
                                                            {getDayName(sch.day)} {sch.startTime} - {sch.endTime}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Date Range */}
                                        <div className="flex flex-wrap gap-6 text-sm">
                                            <span className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                <FiClock size={14} className="text-[#021E14]" />
                                                <span className="font-semibold">Starts:</span> {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'N/A'}
                                            </span>
                                            <span className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                <FiClock size={14} className="text-[#021E14]" />
                                                <span className="font-semibold">Ends:</span> {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-3 lg:w-56 shrink-0">
                                        {batch.meetingLink && batch.status === 'ongoing' && (
                                            <a
                                                href={batch.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#021E14] to-[#021E14] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#021E14]/20 hover:scale-105 transition-all"
                                            >
                                                <FiVideo size={18} />
                                                Join Live Class
                                            </a>
                                        )}
                                        {batch.meetingLink && batch.status !== 'ongoing' && (
                                            <a
                                                href={batch.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${isDark
                                                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                            >
                                                <FiExternalLink size={16} />
                                                Meeting Link
                                            </a>
                                        )}
                                        <Link
                                            href={`/learn/${batch.course?._id}`}
                                            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${isDark
                                                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            <FiPlay size={16} />
                                            View Course
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
