'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FiSearch,
    FiBell,
    FiSettings,
    FiUser,
    FiLogOut,
    FiMoon,
    FiSun,
    FiChevronDown,
    FiBookOpen,
    FiAward,
    FiHeart,
    FiDownload,
    FiCreditCard,
    FiCheck
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

const UserHeader = () => {
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const { toggleTheme, isDark } = useTheme();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Student specific notifications
    const notifications = [
        { id: 1, title: 'New Lesson Available', message: 'Module 5: Advanced React Patterns is now live!', time: '2 min ago', read: false, type: 'course' },
        { id: 2, title: 'Certificate Ready', message: 'Your Web Development certificate is ready to download', time: '1 hour ago', read: false, type: 'certificate' },
        { id: 3, title: 'Course Completed', message: 'Congratulations on completing JavaScript Basics!', time: '2 hours ago', read: true, type: 'success' },
        { id: 4, title: 'New Resource', message: 'PDF study guide added to your enrolled course', time: '5 hours ago', read: true, type: 'resource' },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown-container')) {
                setShowNotifications(false);
                setShowProfile(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const handleMenuClick = () => {
        setShowProfile(false);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'course': return <FiBookOpen className="text-[#E62D26]" size={14} />;
            case 'certificate': return <FiAward className="text-[#F79952]" size={14} />;
            case 'success': return <FiCheck className="text-green-500" size={14} />;
            case 'resource': return <FiDownload className="text-blue-500" size={14} />;
            default: return <FiBell className="text-gray-500" size={14} />;
        }
    };

    return (
        <header className={`sticky top-0 z-30 backdrop-blur-xl border-b transition-colors duration-300 ${isDark
            ? 'bg-slate-900/80 border-slate-700/50'
            : 'bg-white/80 border-slate-200/50'
            }`}>
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left Section - Search */}
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative max-w-md w-full">
                        <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <input
                            type="text"
                            placeholder="Search courses, resources..."
                            className={`w-full pl-11 pr-4 py-2.5 border-0 rounded-xl text-sm transition-all ${isDark
                                ? 'bg-slate-800/80 text-slate-200 placeholder:text-slate-500 focus:ring-[#E62D26]/30 focus:bg-slate-800'
                                : 'bg-slate-100/80 text-slate-700 placeholder:text-slate-400 focus:ring-[#E62D26]/20 focus:bg-white'
                                } focus:outline-none focus:ring-2`}
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`relative p-2.5 rounded-xl transition-all duration-300 overflow-hidden group ${isDark
                            ? 'bg-gradient-to-br from-[#E62D26] to-[#c41e18] text-white shadow-lg shadow-[#E62D26]/30'
                            : 'bg-gradient-to-br from-[#F79952] to-orange-500 text-white shadow-lg shadow-[#F79952]/30'
                            }`}
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        <div className="relative w-5 h-5">
                            <FiSun size={20} className={`absolute inset-0 transition-all duration-300 transform ${isDark ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-50'}`} />
                            <FiMoon size={20} className={`absolute inset-0 transition-all duration-300 transform ${isDark ? '-rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`} />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>

                    {/* Notifications */}
                    <div className="relative dropdown-container">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowNotifications(!showNotifications);
                                setShowProfile(false);
                            }}
                            className={`relative p-2.5 rounded-xl transition-colors ${isDark
                                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <FiBell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#E62D26] to-[#c41e18] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${isDark
                                ? 'bg-slate-800 border-slate-700 shadow-slate-900/50'
                                : 'bg-white border-slate-100 shadow-slate-200/50'
                                }`}>
                                <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark
                                    ? 'bg-gradient-to-r from-[#E62D26]/10 to-[#c41e18]/10 border-slate-700'
                                    : 'bg-gradient-to-r from-[#E62D26]/5 to-[#c41e18]/5 border-slate-100'
                                    }`}>
                                    <h3 className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Notifications</h3>
                                    {unreadCount > 0 && (
                                        <span className="px-2 py-0.5 bg-[#E62D26] text-white text-xs font-bold rounded-full">{unreadCount} new</span>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer border-l-2 ${notif.read
                                            ? `border-transparent ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`
                                            : `border-[#E62D26] ${isDark ? 'bg-[#E62D26]/5 hover:bg-[#E62D26]/10' : 'bg-[#E62D26]/5 hover:bg-[#E62D26]/10'}`
                                            }`}>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                                {getNotificationIcon(notif.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{notif.title}</p>
                                                <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{notif.message}</p>
                                                <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{notif.time}</p>
                                            </div>
                                            {!notif.read && (
                                                <div className="w-2 h-2 rounded-full bg-[#E62D26] mt-2"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    href="/dashboard/user/notifications"
                                    onClick={() => setShowNotifications(false)}
                                    className={`block text-center py-3 text-sm font-medium border-t transition-colors ${isDark
                                        ? 'border-slate-700 text-[#E62D26] hover:bg-slate-700/50'
                                        : 'border-slate-100 text-[#E62D26] hover:bg-slate-50'
                                        }`}
                                >
                                    View All Notifications
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <div className="relative ml-2 dropdown-container">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowProfile(!showProfile);
                                setShowNotifications(false);
                            }}
                            className={`flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl transition-all ${isDark
                                ? 'bg-gradient-to-r from-[#E62D26]/20 to-[#c41e18]/20 hover:from-[#E62D26]/30 hover:to-[#c41e18]/30'
                                : 'bg-gradient-to-r from-[#E62D26]/10 to-[#c41e18]/10 hover:from-[#E62D26]/20 hover:to-[#c41e18]/20'
                                }`}
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#E62D26]/25">
                                {user?.firstName?.[0] || 'S'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                    {user?.firstName || 'Student'}
                                </p>
                                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Student
                                </p>
                            </div>
                            <FiChevronDown className={`transition-transform ${isDark ? 'text-slate-400' : 'text-slate-400'} ${showProfile ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Profile Dropdown */}
                        {showProfile && (
                            <div className={`absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${isDark
                                ? 'bg-slate-800 border-slate-700'
                                : 'bg-white border-slate-100'
                                }`}>
                                <div className={`p-4 border-b ${isDark
                                    ? 'bg-gradient-to-r from-[#E62D26]/10 to-[#c41e18]/10 border-slate-700'
                                    : 'bg-gradient-to-r from-[#E62D26]/5 to-[#c41e18]/5 border-slate-100'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center text-white font-bold shadow-lg">
                                            {user?.firstName?.[0] || 'S'}
                                        </div>
                                        <div>
                                            <p className={`font-semibold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                                {user?.firstName} {user?.lastName}
                                            </p>
                                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-2">
                                    <Link
                                        href="/dashboard/user/profile"
                                        onClick={handleMenuClick}
                                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isDark
                                            ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                            }`}
                                    >
                                        <FiUser size={16} />
                                        My Profile
                                    </Link>
                                    <Link
                                        href="/dashboard/user/courses"
                                        onClick={handleMenuClick}
                                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isDark
                                            ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                            }`}
                                    >
                                        <FiBookOpen size={16} />
                                        My Courses
                                    </Link>
                                    <Link
                                        href="/dashboard/user/certificates"
                                        onClick={handleMenuClick}
                                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isDark
                                            ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                            }`}
                                    >
                                        <FiAward size={16} />
                                        Certificates
                                    </Link>
                                    <Link
                                        href="/dashboard/user/favorites"
                                        onClick={handleMenuClick}
                                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isDark
                                            ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                            }`}
                                    >
                                        <FiHeart size={16} />
                                        Favorites
                                    </Link>
                                    <Link
                                        href="/dashboard/user/purchases"
                                        onClick={handleMenuClick}
                                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isDark
                                            ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                            }`}
                                    >
                                        <FiCreditCard size={16} />
                                        Purchases
                                    </Link>
                                </div>
                                <div className={`p-2 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <FiLogOut size={16} />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default UserHeader;
