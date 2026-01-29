'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    FiHome,
    FiBook,
    FiUsers,
    FiMessageSquare,
    FiImage,
    FiMenu,
    FiX,
    FiLogOut,
    FiChevronDown,
    FiChevronRight,
    FiArrowLeft,
    FiGlobe,
    FiShoppingBag,
    FiAward,
    FiSettings,
    FiLayers,
    FiCode,
    FiPlay,
    FiStar,
    FiCreditCard,
    FiUserCheck,
    FiDownload,
    FiGrid,
    FiFileText,
    FiClipboard,
    FiBell,
    FiLock,
    FiTag,
    FiUser,
    FiEdit3,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import Logo from '../sheard/Logo';

const MentorSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState([]);
    const pathname = usePathname();
    const router = useRouter();
    const { isDark } = useTheme();

    // Exact match for active state
    const isActive = (href) => pathname === href;

    // Check if any child of a submenu is active (for parent highlight and auto-expand)
    const hasActiveChild = (submenu) => submenu?.some((s) => pathname === s.href);

    // Auto-expand parent menu when a child route is active
    useEffect(() => {
        menuItems.forEach((item) => {
            if (item.submenu && hasActiveChild(item.submenu)) {
                setOpenMenus(prev => prev.includes(item.title) ? prev : [...prev, item.title]);
            }
        });
    }, [pathname]);

    const toggleMenu = (menu) => {
        setOpenMenus(prev =>
            prev.includes(menu)
                ? prev.filter(m => m !== menu)
                : [...prev, menu]
        );
    };

    const isMenuOpen = (menu) => openMenus.includes(menu);

    // Mentor Menu Items - Similar to Admin but NO Analytics, NO Reports, NO Delete options
    const menuItems = [
        {
            title: 'Dashboard',
            href: '/dashboard/mentor',
            icon: FiHome,
            gradient: 'from-indigo-500 to-purple-500'
        },
        // NO Analytics - Removed for Mentor
        {
            title: 'LMS',
            icon: FiBook,
            gradient: 'from-amber-500 to-orange-500',
            submenu: [
                { title: 'All Courses', href: '/dashboard/mentor/course', icon: FiBook },
                { title: 'Create Course', href: '/dashboard/mentor/course/create', icon: FiFileText },
                { title: 'All Modules', href: '/dashboard/mentor/module', icon: FiLayers },
                { title: 'Create Module', href: '/dashboard/mentor/module/create', icon: FiFileText },
                { title: 'All Lessons', href: '/dashboard/mentor/lesson', icon: FiPlay },
                { title: 'Create Lesson', href: '/dashboard/mentor/lesson/create', icon: FiFileText },
            ],
        },
        {
            title: 'Marketplace',
            icon: FiGlobe,
            gradient: 'from-emerald-500 to-red-500',
            submenu: [
                { title: 'All Websites', href: '/dashboard/mentor/website', icon: FiGlobe },
                { title: 'Create Website', href: '/dashboard/mentor/website/create', icon: FiFileText },
                { title: 'All Software', href: '/dashboard/mentor/software', icon: FiCode },
                { title: 'Create Software', href: '/dashboard/mentor/software/create', icon: FiFileText },
            ],
        },
        {
            title: 'Categories',
            icon: FiLayers,
            gradient: 'from-violet-500 to-purple-500',
            submenu: [
                { title: 'All Categories', href: '/dashboard/mentor/category', icon: FiLayers },
                { title: 'Create Category', href: '/dashboard/mentor/category/create', icon: FiFileText },
            ],
        },
        {
            title: 'Orders',
            href: '/dashboard/mentor/orders',
            icon: FiShoppingBag,
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            title: 'Coupons',
            href: '/dashboard/mentor/coupons',
            icon: FiTag,
            gradient: 'from-amber-500 to-orange-500'
        },
        {
            title: 'Blog',
            icon: FiEdit3,
            gradient: 'from-red-500 to-cyan-500',
            submenu: [
                { title: 'My Blogs', href: '/dashboard/mentor/blog', icon: FiEdit3 },
                { title: 'Write Blog', href: '/dashboard/mentor/blog/create', icon: FiFileText },
            ],
        },
        {
            title: 'Like & Rating',
            href: '/dashboard/mentor/favorites-ratings',
            icon: FiStar,
            gradient: 'from-rose-500 to-pink-500'
        },
        {
            title: 'My Profile',
            href: '/dashboard/mentor/profile',
            icon: FiUser,
            gradient: 'from-slate-500 to-slate-700'
        },
        // NO Reports, NO Design, NO Settings - Removed for Mentor
    ];

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white shadow-lg shadow-[#E62D26]/30 hover:shadow-xl hover:shadow-[#E62D26]/40 transition-all"
            >
                {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen transition-all duration-300 z-40
        ${isOpen ? 'w-72' : 'w-0 lg:w-72'} overflow-hidden
        ${isDark
                        ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950'
                        : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border-r border-slate-200'
                    }`}
            >
                {/* Decorative Elements */}
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-gradient-to-br from-[#E62D26]/10 to-transparent' : 'bg-gradient-to-br from-[#E62D26]/5 to-transparent'
                    }`} />
                <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-gradient-to-tr from-[#f79952]/10 to-transparent' : 'bg-gradient-to-tr from-[#f79952]/5 to-transparent'
                    }`} />

                {/* Logo with Mentor Badge */}
                <div className={`relative px-6 py-5 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                    <Logo size="small" align="left" color={isDark ? "#D4AF37" : "#300000"} />
                    <span className="absolute top-3 right-4 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                        Mentor
                    </span>
                </div>

                {/* Back to Website */}
                <div className={`px-4 py-3 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                    <Link
                        href="/"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isDark
                            ? 'text-slate-400 hover:text-white hover:bg-white/5'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
                        <span className="text-sm font-medium">Back to Website</span>
                    </Link>
                </div>

                {/* Menu */}
                <nav className="relative px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <p className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Mentor Menu</p>

                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        /* SUBMENU */
                        if (item.submenu) {
                            const activeSub = hasActiveChild(item.submenu);
                            const menuOpen = isMenuOpen(item.title);

                            return (
                                <div key={item.title}>
                                    <button
                                        onClick={() => toggleMenu(item.title)}
                                        className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all
                    ${activeSub
                                                ? isDark
                                                    ? 'bg-gradient-to-r from-[#E62D26]/20 to-[#f79952]/20 text-white'
                                                    : 'bg-gradient-to-r from-[#E62D26]/10 to-[#f79952]/10 text-slate-800'
                                                : isDark
                                                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                                                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                                            }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${activeSub
                                                ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                                                : isDark
                                                    ? 'bg-slate-800 group-hover:bg-slate-700'
                                                    : 'bg-slate-200 group-hover:bg-slate-300'
                                                } transition-all`}>
                                                <Icon size={18} className={activeSub ? 'text-white' : isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-700'} />
                                            </div>
                                            <span className="text-sm font-medium">{item.title}</span>
                                        </span>
                                        <FiChevronDown
                                            className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                                            size={16}
                                        />
                                    </button>

                                    {/* Submenu Items */}
                                    <div className={`overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 mt-1' : 'max-h-0'}`}>
                                        <div className={`ml-6 pl-4 border-l-2 space-y-1 ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                                            {item.submenu.map((sub) => {
                                                const SubIcon = sub.icon;
                                                const isSubActive = isActive(sub.href);
                                                return (
                                                    <Link
                                                        key={sub.href}
                                                        href={sub.href}
                                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all
                            ${isSubActive
                                                                ? 'bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white font-semibold shadow-lg shadow-[#E62D26]/30'
                                                                : isDark
                                                                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                                                                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                                                            }`}
                                                    >
                                                        <SubIcon size={15} className={isSubActive ? 'text-white' : ''} />
                                                        {sub.title}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        /* NORMAL MENU */
                        return (
                            <div key={item.title || item.href}>
                                <Link
                                    href={item.href}
                                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                  ${isActive(item.href)
                                            ? isDark
                                                ? 'bg-gradient-to-r from-[#E62D26]/20 to-[#f79952]/20 text-white'
                                                : 'bg-gradient-to-r from-[#E62D26]/10 to-[#f79952]/10 text-slate-800'
                                            : isDark
                                                ? 'text-slate-400 hover:text-white hover:bg-white/5'
                                                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                                        }`}
                                >
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive(item.href)
                                        ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                                        : isDark
                                            ? 'bg-slate-800 group-hover:bg-slate-700'
                                            : 'bg-slate-200 group-hover:bg-slate-300'
                                        } transition-all`}>
                                        <Icon size={18} className={isActive(item.href) ? 'text-white' : isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-700'} />
                                    </div>
                                    <span className="text-sm font-medium">{item.title}</span>
                                </Link>
                            </div>
                        );
                    })}
                </nav>

                {/* Bottom - Logout Only */}
                <div className={`absolute bottom-0 left-0 w-full p-3 border-t backdrop-blur-sm ${isDark ? 'border-white/5 bg-slate-900/95' : 'border-slate-200 bg-white/95'
                    }`}>
                    <button
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                        <FiLogOut size={16} />
                        <span className="text-xs font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default MentorSidebar;
