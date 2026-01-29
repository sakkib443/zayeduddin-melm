'use client';

import React from 'react';
import Link from 'next/link';
import {
    FiAward, FiDownload, FiShare2, FiClock, FiLock,
    FiArrowRight, FiBook, FiRefreshCw, FiExternalLink
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function UserCertificatesPage() {
    const { isDark } = useTheme();

    // Empty certificates for now
    const certificates = [];

    // Stats
    const stats = {
        earned: 0,
        inProgress: 0,
        shared: 0,
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f79952] to-[#E62D26] flex items-center justify-center text-white shadow-md shadow-[#f79952]/10">
                        <FiAward size={24} />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            My Certificates
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            View and download your earned certificates
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
                        Sync
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Earned */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Earned
                            </p>
                            <h3 className={`text-2xl font-black mt-1 outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.earned.toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Completed certificates
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiAward size={20} />
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
                                Courses to complete
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f79952] to-[#fb923c] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiClock size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#f79952] to-[#fb923c] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Shared */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Shared
                            </p>
                            <h3 className={`text-2xl font-black mt-1 outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.shared.toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                On social platforms
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E62D26] to-[#f79952] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiShare2 size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#E62D26] to-[#f79952] transition-all duration-300 group-hover:w-full w-0`} />
                </div>
            </div>

            {/* Empty State - No Certificates */}
            <div className={`py-20 text-center rounded-2xl border-2 border-dashed ${isDark
                ? 'border-slate-700 bg-slate-900/20'
                : 'border-slate-200 bg-slate-50/50'
                }`}>
                <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'
                    }`}>
                    <FiAward size={36} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
                </div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    No Certificates Yet
                </h2>
                <p className={`text-sm mt-3 max-w-sm mx-auto ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    Complete a course to earn your certificate. Certificates can be downloaded and shared on professional networks like LinkedIn!
                </p>
                <Link
                    href="/dashboard/user/courses"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white rounded-xl font-bold text-sm shadow-md shadow-[#E62D26]/10 hover:scale-105 transition-all"
                >
                    Continue Learning <FiArrowRight />
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
                        <FiDownload size={22} />
                    </div>
                    <div>
                        <h4 className={`text-base font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Certificate Benefits</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Download as PDF, share on LinkedIn, and add to your professional portfolio.
                        </p>
                    </div>
                </div>
                <Link
                    href="/courses"
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${isDark
                        ? 'bg-slate-700 text-white hover:bg-slate-600'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                >
                    Explore Courses
                </Link>
            </div>
        </div>
    );
}
