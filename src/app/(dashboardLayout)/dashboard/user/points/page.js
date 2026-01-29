'use client';

import React from 'react';
import Link from 'next/link';
import {
    FiStar, FiAward, FiTrendingUp, FiGift,
    FiZap, FiTarget, FiRefreshCw, FiBook, FiArrowRight
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function UserPointsBadgesPage() {
    const { isDark } = useTheme();

    // Points and badges data (empty for now)
    const stats = {
        totalPoints: 0,
        level: 'Beginner',
        badges: 0,
        rank: '-',
    };

    // Sample badge categories (locked)
    const badgeCategories = [
        {
            title: 'Learning Badges',
            description: 'Earn by completing courses',
            badges: [
                { name: 'First Step', icon: FiZap, description: 'Complete your first lesson', locked: true },
                { name: 'Quick Learner', icon: FiTrendingUp, description: 'Complete 5 lessons in a day', locked: true },
                { name: 'Course Master', icon: FiAward, description: 'Complete your first course', locked: true },
            ]
        },
        {
            title: 'Achievement Badges',
            description: 'Earn by reaching milestones',
            badges: [
                { name: 'Streak Starter', icon: FiTarget, description: '7 day learning streak', locked: true },
                { name: 'Point Collector', icon: FiStar, description: 'Earn 1000 points', locked: true },
                { name: 'Top Performer', icon: FiGift, description: 'Rank in top 10%', locked: true },
            ]
        },
    ];

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
                        <FiStar size={24} />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Points & Badges
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Track your achievements and rewards
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
                        Earn More
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Points */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Total Points
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.totalPoints.toLocaleString()}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Lifetime earned
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiStar size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#E62D26] to-[#c41e18] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Current Level */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Current Level
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.level}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Keep learning!
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f79952] to-[#fb923c] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiTrendingUp size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#f79952] to-[#fb923c] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Badges Earned */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Badges Earned
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.badges.toString().padStart(2, '0')}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Unlock more badges
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-red-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiAward size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-red-500 transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Leaderboard Rank */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Leaderboard
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.rank}
                            </h3>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Your ranking
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E62D26] to-[#f79952] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiTarget size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#E62D26] to-[#f79952] transition-all duration-300 group-hover:w-full w-0`} />
                </div>
            </div>

            {/* Badges Section */}
            {badgeCategories.map((category, idx) => (
                <div key={idx} className={`${cardClass} p-6`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark
                            ? 'bg-[#E62D26]/10 text-[#E62D26]'
                            : 'bg-[#E62D26]/10 text-[#E62D26]'
                            }`}>
                            <FiAward size={18} />
                        </div>
                        <div>
                            <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{category.title}</h2>
                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{category.description}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {category.badges.map((badge, badgeIdx) => {
                            const BadgeIcon = badge.icon;
                            return (
                                <div
                                    key={badgeIdx}
                                    className={`p-4 rounded-xl border text-center transition-all ${isDark
                                        ? 'bg-slate-800/50 border-white/5'
                                        : 'bg-slate-50 border-slate-100'
                                        } opacity-50`}
                                >
                                    <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 ${isDark
                                        ? 'bg-slate-700'
                                        : 'bg-slate-200'
                                        }`}>
                                        <BadgeIcon size={24} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                                    </div>
                                    <h3 className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{badge.name}</h3>
                                    <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{badge.description}</p>
                                    <span className={`inline-block mt-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${isDark
                                        ? 'bg-slate-700 text-slate-500'
                                        : 'bg-slate-200 text-slate-400'
                                        }`}>
                                        Locked
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Info Notice */}
            <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${isDark
                ? 'bg-slate-800/50 border-white/5'
                : 'bg-gradient-to-br from-slate-50 to-white border-slate-100'
                }`}>
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark
                        ? 'bg-slate-700 text-[#f79952]'
                        : 'bg-white text-[#f79952] shadow-md border border-slate-100'
                        }`}>
                        <FiGift size={22} />
                    </div>
                    <div>
                        <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>How to Earn Points</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Complete lessons, finish courses, and maintain learning streaks to earn points and badges!
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
                    Start Learning
                </Link>
            </div>
        </div>
    );
}
