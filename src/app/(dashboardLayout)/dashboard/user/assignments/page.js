'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    FiLayout, FiClock, FiCheckCircle, FiAlertCircle,
    FiCalendar, FiRefreshCw, FiArrowRight, FiBook,
    FiFileText, FiUpload, FiSearch
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function UserAssignmentsPage() {
    const { isDark } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');

    // Currently no assignments - placeholder
    const assignments = [];

    // Stats
    const stats = {
        total: 0,
        pending: 0,
        submitted: 0,
        overdue: 0,
    };

    // Card class based on theme
    const cardClass = `rounded-2xl border transition-all duration-300 ${isDark
        ? 'bg-slate-800/50 border-white/5 hover:border-[#E62D26]/20'
        : 'bg-white border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md'
        }`;

    return (
        <div className="space-y-6">
            {/* Professional Compact Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 ${cardClass}`}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E62D26] to-[#f79952] flex items-center justify-center text-white shadow-md shadow-[#E62D26]/10">
                        <FiLayout size={24} />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            My Assignments
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Track and submit your course assignments
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isDark
                            ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <FiRefreshCw size={16} />
                        Refresh
                    </button>
                    <Link
                        href="/dashboard/user/courses"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white rounded-xl text-sm font-bold shadow-md shadow-[#E62D26]/10 hover:scale-105 transition-all"
                    >
                        <FiBook size={16} />
                        My Courses
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Total Assignments
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.total.toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                All time assignments
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiFileText size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#E62D26] to-[#c41e18] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Pending */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Pending
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.pending.toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Need submission
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f79952] to-[#fb923c] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiClock size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#f79952] to-[#fb923c] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Submitted */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Submitted
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.submitted.toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Completed work
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-red-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiCheckCircle size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-red-500 transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Overdue */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Overdue
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.overdue.toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Past deadline
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiAlertCircle size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-rose-500 to-red-500 transition-all duration-300 group-hover:w-full w-0`} />
                </div>
            </div>

            {/* Filter Bar */}
            <div className={`flex flex-col md:flex-row md:items-center gap-4 p-4 ${cardClass}`}>
                <div className="relative flex-1">
                    <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input
                        placeholder="Search assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${isDark
                            ? 'bg-slate-800/50 border-white/5 text-slate-200 focus:ring-[#E62D26]/30'
                            : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-[#E62D26]/20'
                            }`}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${isDark
                        ? 'bg-[#E62D26]/20 text-[#E62D26] border border-[#E62D26]/30'
                        : 'bg-[#E62D26]/10 text-[#E62D26] border border-[#E62D26]/20'
                        }`}>
                        All
                    </button>
                    <button className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${isDark
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}>
                        Pending
                    </button>
                    <button className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${isDark
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}>
                        Submitted
                    </button>
                </div>
            </div>

            {/* Empty State */}
            <div className={`py-20 text-center rounded-2xl border-2 border-dashed ${isDark
                ? 'border-slate-700 bg-slate-900/20'
                : 'border-slate-200 bg-slate-50/50'
                }`}>
                <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'
                    }`}>
                    <FiLayout size={36} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
                </div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    No Assignments Yet
                </h2>
                <p className={`text-sm mt-3 max-w-sm mx-auto ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    Once you enroll in courses with assignments, they will appear here. Start exploring courses to get your first assignment!
                </p>
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white rounded-xl font-bold text-sm shadow-md shadow-[#E62D26]/10 hover:scale-105 transition-all"
                >
                    Explore Courses <FiArrowRight />
                </Link>
            </div>

            {/* Info Notice */}
            <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${isDark
                ? 'bg-slate-800/50 border-white/5'
                : 'bg-gradient-to-br from-slate-50 to-white border-slate-100'
                }`}>
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark
                        ? 'bg-slate-700 text-[#E62D26]'
                        : 'bg-white text-[#E62D26] shadow-md border border-slate-100'
                        }`}>
                        <FiUpload size={22} />
                    </div>
                    <div>
                        <h4 className={`text-base font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>How Assignments Work</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Complete course lessons to unlock assignments. Submit before the deadline for evaluation.
                        </p>
                    </div>
                </div>
                <Link
                    href="/dashboard/user/courses"
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${isDark
                        ? 'bg-slate-700 text-white hover:bg-slate-600'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                >
                    View My Courses
                </Link>
            </div>
        </div>
    );
}
