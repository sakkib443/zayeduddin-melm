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
  FiMail,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import NotificationDropdown from './NotificationDropdown';

const DashboardHeader = () => {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setShowProfile(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Handle menu item click - close dropdown and navigate
  const handleMenuClick = () => {
    setShowProfile(false);
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
              placeholder="Search courses, students, orders..."
              className={`w-full pl-11 pr-4 py-2.5 border-0 rounded-xl text-sm transition-all ${isDark
                ? 'bg-slate-800/80 text-slate-200 placeholder:text-slate-500 focus:ring-[#E62D26]/30 focus:bg-slate-800'
                : 'bg-slate-100/80 text-slate-700 placeholder:text-slate-400 focus:ring-[#E62D26]/20 focus:bg-white'
                } focus:outline-none focus:ring-2`}
            />
            <kbd className={`absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200/80 text-slate-500'
              }`}>
              ?K
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`relative p-2.5 rounded-xl transition-all duration-300 overflow-hidden group ${isDark
              ? 'bg-gradient-to-br from-[#E62D26] to-[#c41e18] text-white shadow-lg shadow-[#E62D26]/30 hover:shadow-[#E62D26]/50'
              : 'bg-gradient-to-br from-[#F79952] to-orange-500 text-white shadow-lg shadow-[#F79952]/30 hover:shadow-[#F79952]/50'
              }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div className="relative w-5 h-5">
              <FiSun
                size={20}
                className={`absolute inset-0 transition-all duration-300 transform ${isDark ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-50'}`}
              />
              <FiMoon
                size={20}
                className={`absolute inset-0 transition-all duration-300 transform ${isDark ? '-rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>

          {/* Notifications */}
          <NotificationDropdown />

          {/* Settings */}
          <Link
            href="/dashboard/admin/settings"
            className={`p-2.5 rounded-xl transition-colors ${isDark
              ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            <FiSettings size={18} />
          </Link>

          {/* Profile */}
          <div className="relative ml-2 dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowProfile(!showProfile);
              }}
              className={`flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl transition-all ${isDark
                ? 'bg-gradient-to-r from-[#E62D26]/20 to-[#c41e18]/20 hover:from-[#E62D26]/30 hover:to-[#c41e18]/30'
                : 'bg-gradient-to-r from-[#E62D26]/10 to-[#c41e18]/10 hover:from-[#E62D26]/20 hover:to-[#c41e18]/20'
                }`}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#E62D26]/25">
                {user?.firstName?.[0] || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {user?.firstName || 'Admin'}
                </p>
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {user?.role || 'Super Admin'}
                </p>
              </div>
              <FiChevronDown className={`transition-transform ${isDark ? 'text-slate-400' : 'text-slate-400'} ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className={`absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${isDark
                ? 'bg-slate-800 border-slate-700 shadow-slate-900/50'
                : 'bg-white border-slate-100 shadow-slate-200/50'
                }`}>
                <div className={`p-4 border-b ${isDark
                  ? 'bg-gradient-to-r from-[#E62D26]/10 to-[#c41e18]/10 border-slate-700'
                  : 'bg-gradient-to-r from-[#E62D26]/5 to-[#c41e18]/5 border-slate-100'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#E62D26]/25">
                      {user?.firstName?.[0] || 'A'}
                    </div>
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {user?.email || 'admin@motionboss.com'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <Link
                    href="/dashboard/admin/profile"
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
                    href="/dashboard/admin/notifications"
                    onClick={handleMenuClick}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isDark
                      ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                  >
                    <FiBell size={16} />
                    All Notifications
                  </Link>
                  <Link
                    href="/dashboard/admin/settings"
                    onClick={handleMenuClick}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isDark
                      ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                  >
                    <FiSettings size={16} />
                    Settings
                  </Link>
                  <Link
                    href="/dashboard/admin/messages"
                    onClick={handleMenuClick}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isDark
                      ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                  >
                    <FiMail size={16} />
                    Messages
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

export default DashboardHeader;
