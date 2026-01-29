/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
    FiUsers, FiBook, FiDollarSign, FiShoppingCart,
    FiTrendingUp, FiTrendingDown, FiPlus, FiArrowRight,
    FiArrowUpRight, FiCalendar, FiActivity, FiEye, FiDownload,
    FiMonitor, FiPackage, FiAward, FiGrid,
    FiRefreshCw, FiMoreVertical, FiCheckCircle,
    FiClock, FiAlertCircle, FiBarChart2, FiPlay,
    FiTarget, FiZap, FiStar, FiHeart, FiCode, FiGlobe,
    FiLayers, FiCreditCard
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_URL } from '@/config/api';

// ==================== ANIMATED COUNTER ====================
const AnimatedCounter = ({ value, duration = 2000, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const numValue = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, '')) || 0;
        const increment = numValue / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numValue) {
                setCount(numValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// ==================== PREMIUM STATS CARD ====================
const StatsCard = ({ title, value, change, changeType, icon: Icon, gradient, loading, subtitle }) => {
    const { isDark } = useTheme();
    return (
        <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className={`relative rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border ${isDark
                ? 'bg-slate-800 border-slate-700 shadow-none'
                : 'bg-white/80 backdrop-blur-sm border-gray-100/50 shadow-lg shadow-gray-200/50'
                }`}>
                <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl`} />

                <div className="relative flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
                        <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {loading ? (
                                <span className={`inline-block w-24 h-9 animate-pulse rounded-lg ${isDark ? 'bg-slate-700' : 'bg-gradient-to-r from-slate-200 to-slate-100'}`} />
                            ) : (
                                <AnimatedCounter value={value} prefix={title.includes('Revenue') ? '?' : ''} />
                            )}
                        </p>
                        {subtitle && <p className="text-xs text-slate-400 mb-2">{subtitle}</p>}
                        {change && (
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${changeType === 'up'
                                ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                                : (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-500')
                                }`}>
                                {changeType === 'up' ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                                <span>{change}</span>
                            </div>
                        )}
                    </div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <Icon className="text-2xl text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== MAIN MENTOR DASHBOARD ====================
export default function MentorDashboard() {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        totalRevenue: 0,
        totalEnrollments: 0,
        totalCourses: 0,
        publishedCourses: 0,
        totalLessons: 0,
        totalStudents: 0,
        totalUsers: 0,
        totalWebsites: 0,
        totalSoftware: 0,
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        categories: 0,
        todayRevenue: 0,
        todayOrders: 0,
        monthlyRevenue: 0,
        newUsersThisMonth: 0,
        activeEnrollments: 0,
        completedEnrollments: 0,
        totalLikes: 0,
    });

    const fetchDashboardData = async () => {
        const token = localStorage.getItem('token');

        try {
            setRefreshing(true);

            const summaryRes = await fetch(`${API_URL}/analytics/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const { data: summary } = await summaryRes.json();

            setDashboardData({
                totalRevenue: summary?.totalRevenue || 0,
                totalEnrollments: summary?.totalEnrollments || 0,
                activeEnrollments: summary?.activeEnrollments || 0,
                completedEnrollments: summary?.completedEnrollments || 0,
                totalCourses: summary?.totalCourses || 0,
                publishedCourses: summary?.publishedCourses || 0,
                totalLessons: summary?.totalLessons || 0,
                totalStudents: summary?.totalStudents || 0,
                totalUsers: summary?.totalUsers || 0,
                totalWebsites: summary?.totalWebsites || 0,
                totalSoftware: summary?.totalSoftware || 0,
                totalOrders: summary?.totalOrders || 0,
                pendingOrders: summary?.pendingOrders || 0,
                completedOrders: summary?.completedOrders || 0,
                categories: summary?.totalCategories || 0,
                todayRevenue: summary?.todayRevenue || 0,
                todayOrders: summary?.todayOrders || 0,
                monthlyRevenue: summary?.monthlyRevenue || 0,
                newUsersThisMonth: summary?.newUsersThisMonth || 0,
                totalLikes: summary?.totalLikes || 0,
            });

            setLoading(false);
            setRefreshing(false);
        } catch (err) {
            console.error('Fetch error:', err);
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setHasMounted(true);
        fetchDashboardData();
    }, []);

    // Stats cards data
    const mainStats = [
        {
            title: 'Total Likes',
            value: dashboardData.totalLikes || 0,
            subtitle: 'Across all products',
            change: '+15.2%',
            changeType: 'up',
            icon: FiHeart,
            gradient: 'from-rose-500 to-pink-500',
        },
        {
            title: 'Today Revenue',
            value: dashboardData.todayRevenue,
            subtitle: "Today's earnings",
            change: '+8.5%',
            changeType: 'up',
            icon: FiDollarSign,
            gradient: 'from-emerald-500 to-red-500',
        },
        {
            title: 'This Month Revenue',
            value: dashboardData.monthlyRevenue,
            subtitle: 'Monthly earnings',
            change: '+18.2%',
            changeType: 'up',
            icon: FiTrendingUp,
            gradient: 'from-amber-500 to-orange-500',
        },
        {
            title: 'Total Orders',
            value: dashboardData.totalOrders,
            subtitle: `${dashboardData.completedOrders || 0} completed`,
            change: '+24.5%',
            changeType: 'up',
            icon: FiPackage,
            gradient: 'from-violet-500 to-purple-500',
        },
    ];

    // Product stats for cards - Updated to mentor links
    const productStats = [
        { title: 'All Courses', value: dashboardData.totalCourses, icon: FiBook, gradient: 'from-indigo-500 to-purple-500', href: '/dashboard/mentor/course' },
        { title: 'All Softwares', value: dashboardData.totalSoftware, icon: FiCode, gradient: 'from-cyan-500 to-red-500', href: '/dashboard/mentor/software' },
        { title: 'All Websites', value: dashboardData.totalWebsites, icon: FiGlobe, gradient: 'from-pink-500 to-rose-500', href: '/dashboard/mentor/website' },
        { title: 'All Categories', value: dashboardData.categories, icon: FiLayers, gradient: 'from-amber-500 to-orange-500', href: '/dashboard/mentor/category' },
    ];

    // Quick actions - Updated to mentor links
    const quickActions = [
        { title: 'Add Course', href: '/dashboard/mentor/course/create', icon: FiBook, gradient: 'from-amber-500 to-orange-500' },
        { title: 'Add Website', href: '/dashboard/mentor/website/create', icon: FiGlobe, gradient: 'from-pink-500 to-rose-500' },
        { title: 'Add Software', href: '/dashboard/mentor/software/create', icon: FiCode, gradient: 'from-cyan-500 to-red-500' },
        { title: 'Add Category', href: '/dashboard/mentor/category/create', icon: FiLayers, gradient: 'from-violet-500 to-purple-500' },
    ];

    return (
        <div className="space-y-6">
            {/* ==================== COMPACT HEADER BAR ==================== */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border p-5 ${isDark
                ? 'bg-slate-800 border-slate-700 shadow-none'
                : 'bg-white border-slate-200/60 shadow-sm'
                }`}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                        <FiGrid className="text-white text-xl" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Mentor Dashboard</h1>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                                Mentor
                            </span>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {hasMounted ? new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Loading date...'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchDashboardData}
                        disabled={refreshing}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${isDark
                            ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                    >
                        <FiRefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                        {refreshing ? 'Syncing...' : 'Reload'}
                    </button>
                </div>
            </div>

            {/* ==================== MAIN STATS ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {mainStats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} loading={loading} />
                ))}
            </div>

            {/* ==================== PRODUCT STATS ==================== */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {productStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.title}
                            href={stat.href}
                            className={`group rounded-2xl border p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative ${isDark
                                ? 'bg-slate-800 border-slate-700'
                                : 'bg-white/80 backdrop-blur-sm border-slate-200/60'
                                }`}
                        >
                            <div className={`absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-xl`} />
                            <div className="relative flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <Icon className="text-xl text-white" />
                                </div>
                                <div>
                                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                        {loading ? '...' : stat.value.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium">{stat.title}</p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* ==================== QUICK ACTIONS & LIVE STATS ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${isDark
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center">
                            <FiZap size={28} />
                        </div>
                        <div>
                            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Quick Actions</h2>
                            <p className="text-sm text-slate-500">Create new content</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={action.title}
                                    href={action.href}
                                    className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl border hover:border-transparent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${isDark
                                        ? 'border-slate-700 hover:bg-slate-700/50'
                                        : 'border-slate-200'
                                        }`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                                        <Icon className="text-xl text-white" />
                                    </div>
                                    <span className={`text-xs font-semibold text-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{action.title}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Live Stats */}
                <div className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${isDark
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-red-500/10 text-red-600 rounded-2xl flex items-center justify-center">
                            <FiActivity size={28} />
                        </div>
                        <div>
                            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Live Statistics</h2>
                            <p className="text-sm text-slate-500">Real-time platform data</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className={`flex justify-between items-center p-3 rounded-xl border ${isDark
                            ? 'bg-slate-900/50 border-slate-700'
                            : 'bg-slate-50 border-slate-100'
                            }`}>
                            <span className="text-sm text-slate-500">Today's Revenue</span>
                            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>?{dashboardData.todayRevenue.toLocaleString()}</span>
                        </div>
                        <div className={`flex justify-between items-center p-3 rounded-xl border ${isDark
                            ? 'bg-slate-900/50 border-slate-700'
                            : 'bg-slate-50 border-slate-100'
                            }`}>
                            <span className="text-sm text-slate-500">This Month</span>
                            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>?{dashboardData.monthlyRevenue.toLocaleString()}</span>
                        </div>
                        <div className={`flex justify-between items-center p-3 rounded-xl border ${isDark
                            ? 'bg-slate-900/50 border-slate-700'
                            : 'bg-slate-50 border-slate-100'
                            }`}>
                            <span className="text-sm text-slate-500">Active Enrollments</span>
                            <span className="text-lg font-bold text-indigo-600">{dashboardData.activeEnrollments}</span>
                        </div>
                        <div className={`flex justify-between items-center p-3 rounded-xl border ${isDark
                            ? 'bg-slate-900/50 border-slate-700'
                            : 'bg-slate-50 border-slate-100'
                            }`}>
                            <span className="text-sm text-slate-500">Total Enrollments</span>
                            <span className="text-lg font-bold text-emerald-600">{dashboardData.totalEnrollments}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== INFO NOTICE ==================== */}
            <div className={`p-6 rounded-2xl border ${isDark
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-amber-50 border-amber-200'
                }`}>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-500/20 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                        <FiAlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                            Mentor Access Notice
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-amber-300/80' : 'text-amber-700'}`}>
                            As a Mentor, you can create and update courses, websites, software, and categories.
                            However, you cannot delete any content or access analytics/reports.
                            For delete operations or advanced analytics, please contact an Administrator.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
