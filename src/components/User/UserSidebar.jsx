'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
    FiHome,
    FiBook,
    FiAward,
    FiUser,
    FiMenu,
    FiX,
    FiLogOut,
    FiArrowLeft,
    FiHelpCircle,
    FiCalendar,
    FiCreditCard,
    FiChevronDown,
    FiChevronRight,
    FiStar,
    FiDownload,
    FiLayout,
    FiLayers,
    FiClock,
    FiCode,
    FiGlobe,
    FiShoppingBag,
    FiSettings,
    FiHeart
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import Logo from '../sheard/Logo';
import { fetchMyStats } from '@/redux/enrollmentSlice';
import { fetchMyOrders } from '@/redux/orderSlice';
import { fetchMyDownloads } from '@/redux/downloadSlice';

const UserSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState([]);
    const [user, setUser] = useState(null);
    const pathname = usePathname();
    const { isDark } = useTheme();
    const dispatch = useDispatch();

    // Redux State
    const { stats } = useSelector((state) => state.enrollment);
    const { orders } = useSelector((state) => state.order);
    const { downloads } = useSelector((state) => state.download);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) { }
        }

        // Fetch dynamic data
        dispatch(fetchMyStats());
        dispatch(fetchMyOrders());
        dispatch(fetchMyDownloads());
    }, [dispatch]);

    // Exact match for active state (following Admin Dashboard style)
    const isActive = (href) => pathname === href;

    // Check if any child of a submenu is active
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

    const menuItems = [
        {
            title: 'Dashboard',
            href: '/dashboard/user',
            icon: FiHome,
            gradient: 'from-indigo-500 to-purple-500'
        },
        {
            title: 'Learning Area',
            icon: FiBook,
            gradient: 'from-[#E62D26] to-[#f79952]',
            submenu: [
                { title: 'My Courses', href: '/dashboard/user/courses', icon: FiBook, count: stats?.totalEnrolled },
                { title: 'Live Classes', href: '/dashboard/user/live-classes', icon: FiCalendar },
                { title: 'My Schedule', href: '/dashboard/user/schedule', icon: FiClock },
                { title: 'Assignments', href: '/dashboard/user/assignments', icon: FiLayout },
            ],
        },
        {
            title: 'Achievements',
            icon: FiAward,
            gradient: 'from-[#f79952] to-[#E62D26]',
            submenu: [
                { title: 'Certificates', href: '/dashboard/user/certificates', icon: FiAward, count: stats?.certificatesEarned },
                { title: 'Points & Badges', href: '/dashboard/user/points', icon: FiStar },
            ],
        },
        {
            title: 'Digital Assets',
            icon: FiDownload,
            gradient: 'from-[#E62D26] to-[#c41e18]',
            submenu: [
                { title: 'All Assets', href: '/dashboard/user/downloads', icon: FiDownload, count: downloads?.length },
                { title: 'Softwares', href: '/dashboard/user/assets/softwares', icon: FiCode },
                { title: 'Websites', href: '/dashboard/user/assets/websites', icon: FiGlobe },
            ],
        },
        {
            title: 'Purchase History',
            href: '/dashboard/user/purchases',
            icon: FiShoppingBag,
            gradient: 'from-[#f79952] to-[#fb923c]',
            count: orders?.length
        },
        {
            title: 'My Favorites',
            href: '/dashboard/user/favorites',
            icon: FiHeart,
            gradient: 'from-rose-500 to-pink-500'
        },
        {
            title: 'My Reviews',
            href: '/dashboard/user/reviews',
            icon: FiStar,
            gradient: 'from-yellow-400 to-amber-500'
        },
        {
            title: 'Profile Settings',
            href: '/dashboard/user/profile',
            icon: FiUser,
            gradient: 'from-slate-500 to-slate-700'
        },
        {
            title: 'Support',
            href: '/dashboard/user/support',
            icon: FiHelpCircle,
            gradient: 'from-[#E62D26] to-[#f79952]'
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white shadow-md shadow-[#E62D26]/10 hover:shadow-lg transition-all"
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

                {/* Logo */}
                <div className={`relative px-6 py-5 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                    <Logo size="small" align="left" color={isDark ? "#D4AF37" : "#300000"} />
                </div>

                {/* Return to Marketplace */}
                <div className={`px-4 py-3 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                    <Link
                        href="/"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isDark
                            ? 'text-slate-400 hover:text-white hover:bg-white/5'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
                        <span className="text-sm font-medium">Return to Marketplace</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="relative px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <p className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>User Dashboard</p>

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
                                                ? `bg-gradient-to-br ${item.gradient} shadow-md shadow-[#E62D26]/10`
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
                                                        className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all
                                                        ${isSubActive
                                                                ? 'bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white font-semibold shadow-md shadow-[#E62D26]/10'
                                                                : isDark
                                                                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                                                                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <SubIcon size={15} className={isSubActive ? 'text-white' : ''} />
                                                            {sub.title}
                                                        </div>
                                                        {sub.count !== undefined && (
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isSubActive ? 'bg-white/20 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                                                                }`}>
                                                                {sub.count}
                                                            </span>
                                                        )}
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
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all
                                ${isActive(item.href)
                                        ? isDark
                                            ? 'bg-gradient-to-r from-[#E62D26]/20 to-[#f79952]/20 text-white'
                                            : 'bg-gradient-to-r from-[#E62D26]/10 to-[#f79952]/10 text-slate-800'
                                        : isDark
                                            ? 'text-slate-400 hover:text-white hover:bg-white/5'
                                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive(item.href)
                                        ? `bg-gradient-to-br ${item.gradient} shadow-md shadow-[#E62D26]/10`
                                        : isDark
                                            ? 'bg-slate-800 group-hover:bg-slate-700'
                                            : 'bg-slate-200 group-hover:bg-slate-300'
                                        } transition-all`}>
                                        <Icon size={18} className={isActive(item.href) ? 'text-white' : isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-700'} />
                                    </div>
                                    <span className="text-sm font-medium">{item.title}</span>
                                </div>
                                {item.count !== undefined && (
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive(item.href) ? 'bg-white/30 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                                        }`}>
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom - Logout Only */}
                <div className={`absolute bottom-0 left-0 w-full p-4 border-t backdrop-blur-sm ${isDark ? 'border-white/5 bg-slate-900/95' : 'border-slate-200 bg-white/95'
                    }`}>
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E62D26] to-[#f79952] flex items-center justify-center text-white font-bold shadow-lg shadow-[#E62D26]/20">
                            {user?.firstName?.[0] || 'S'}
                        </div>
                        <div className="overflow-hidden">
                            <p className={`text-sm font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{user?.firstName || 'Student'}</p>
                            <p className="text-[10px] text-slate-500 truncate">{user?.email || 'student@motionboss.com'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-red-500/10"
                    >
                        <FiLogOut size={16} />
                        <span className="text-xs font-medium">Logout Account</span>
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

export default UserSidebar;
