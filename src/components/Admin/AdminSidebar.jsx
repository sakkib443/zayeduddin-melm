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
  FiBarChart2,
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
  FiEdit3,
  FiLink,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import Logo from '../sheard/Logo';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState([]);
  const [showAnalyticsConfirm, setShowAnalyticsConfirm] = useState(false);
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

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/admin',
      icon: FiHome,
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Analytics',
      icon: FiBarChart2,
      gradient: 'from-pink-500 to-rose-500',
      isProtected: true
    },
    {
      title: 'LMS',
      icon: FiBook,
      gradient: 'from-amber-500 to-orange-500',
      submenu: [
        { title: 'All Courses', href: '/dashboard/admin/course', icon: FiBook },
        { title: 'Create Course', href: '/dashboard/admin/course/create', icon: FiFileText },
        { title: 'All Modules', href: '/dashboard/admin/module', icon: FiLayers },
        { title: 'Create Module', href: '/dashboard/admin/module/create', icon: FiFileText },
        { title: 'All Lessons', href: '/dashboard/admin/lesson', icon: FiPlay },
        { title: 'Create Lesson', href: '/dashboard/admin/lesson/create', icon: FiFileText },
        { title: 'Enrollments', href: '/dashboard/admin/enrollment', icon: FiUserCheck },
      ],
    },
    {
      title: 'Batch Management',
      icon: FiGrid,
      gradient: 'from-orange-500 to-red-500',
      submenu: [
        { title: 'All Batches', href: '/dashboard/admin/batch', icon: FiUsers },
        { title: 'Create Batch', href: '/dashboard/admin/batch/create', icon: FiFileText },
        { title: 'Live Classes', href: '/dashboard/admin/live-class', icon: FiPlay },
        { title: 'Schedule Class', href: '/dashboard/admin/live-class/create', icon: FiFileText },
        { title: 'Class Links', href: '/dashboard/admin/batch/class-links', icon: FiLink },
      ],
    },
    {
      title: 'Marketplace',
      icon: FiGlobe,
      gradient: 'from-emerald-500 to-red-500',
      submenu: [
        { title: 'All Websites', href: '/dashboard/admin/website', icon: FiGlobe },
        { title: 'Create Website', href: '/dashboard/admin/website/create', icon: FiFileText },
        { title: 'All Design Templates', href: '/dashboard/admin/design-template', icon: FiLayers },
        { title: 'Create Design Template', href: '/dashboard/admin/design-template/create', icon: FiFileText },
      ],
    },
    {
      title: 'Categories',
      icon: FiLayers,
      gradient: 'from-violet-500 to-purple-500',
      submenu: [
        { title: 'All Categories', href: '/dashboard/admin/category', icon: FiLayers },
        { title: 'Create Category', href: '/dashboard/admin/category/create', icon: FiFileText },
      ],
    },
    {
      title: 'Users',
      icon: FiUsers,
      gradient: 'from-blue-500 to-cyan-500',
      submenu: [
        { title: 'All Users', href: '/dashboard/admin/user', icon: FiUsers },
        { title: 'Create User', href: '/dashboard/admin/user/create', icon: FiFileText },
      ],
    },
    {
      title: 'Orders',
      href: '/dashboard/admin/orders',
      icon: FiShoppingBag,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Coupons',
      href: '/dashboard/admin/coupons',
      icon: FiTag,
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Blog',
      icon: FiEdit3,
      gradient: 'from-red-500 to-cyan-500',
      submenu: [
        { title: 'All Blogs', href: '/dashboard/admin/blog', icon: FiEdit3 },
        { title: 'Create Blog', href: '/dashboard/admin/blog/create', icon: FiFileText },
      ],
    },
    {
      title: 'Like & Rating',
      href: '/dashboard/admin/favorites-ratings',
      icon: FiStar,
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      title: 'Reports',
      href: '/dashboard/admin/reports',
      icon: FiFileText,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Design',
      icon: FiImage,
      gradient: 'from-pink-500 to-purple-500',
      submenu: [
        { title: 'Home Page', href: '/dashboard/admin/design/home', icon: FiHome },
        { title: 'About Page', href: '/dashboard/admin/design/about', icon: FiGrid },
        { title: 'Contact Page', href: '/dashboard/admin/design/contact', icon: FiMessageSquare },
        { title: 'Top Header', href: '/dashboard/admin/design/topheader', icon: FiLayers },
      ],
    },
    {
      title: 'Settings',
      href: '/dashboard/admin/settings',
      icon: FiSettings,
      gradient: 'from-slate-500 to-slate-700'
    },
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

        {/* Logo */}
        <div className={`relative px-6 py-5 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
          <Logo size="small" align="left" color={isDark ? "#D4AF37" : "#300000"} />
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
          <p className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Main Menu</p>

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

            /* NORMAL MENU & PROTECTED MENU */
            const isProtected = item.isProtected;

            return (
              <div key={item.title || item.href}>
                {isProtected ? (
                  <button
                    onClick={() => setShowAnalyticsConfirm(true)}
                    className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                    ${isActive('/dashboard/admin/analytics')
                        ? isDark
                          ? 'bg-gradient-to-r from-[#E62D26]/20 to-[#f79952]/20 text-white'
                          : 'bg-gradient-to-r from-[#E62D26]/10 to-[#f79952]/10 text-slate-800'
                        : isDark
                          ? 'text-slate-400 hover:text-white hover:bg-white/5'
                          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive('/dashboard/admin/analytics')
                      ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                      : isDark
                        ? 'bg-slate-800 group-hover:bg-slate-700'
                        : 'bg-slate-200 group-hover:bg-slate-300'
                      } transition-all`}>
                      <Icon size={18} className={isActive('/dashboard/admin/analytics') ? 'text-white' : isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-700'} />
                    </div>
                    <span className="text-sm font-medium">{item.title}</span>
                  </button>
                ) : (
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
                )}
              </div>
            );
          })}
        </nav>

        {/* Analytics Confirmation Modal */}
        {showAnalyticsConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <style jsx>{`
              @keyframes modalEntry {
                from { opacity: 0; transform: scale(0.9) translateY(20px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
              }
              @keyframes backdropIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-modal { animation: modalEntry 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
              .animate-backdrop { animation: backdropIn 0.3s ease-out forwards; }
            `}</style>
            <div
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-backdrop"
              onClick={() => setShowAnalyticsConfirm(false)}
            />
            <div className={`relative w-full max-w-md transform animate-modal ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
              } backdrop-blur-xl rounded-3xl p-8 shadow-2xl border`}>
              {/* Modal Content */}
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 ring-4 ring-indigo-500/10 transition-transform hover:scale-110 duration-300">
                  <FiBarChart2 className="text-indigo-500 animate-bounce" size={40} />
                </div>
                <h3 className={`text-2xl font-bold font-outfit mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Secure Data Access
                </h3>
                <p className={`text-base font-poppins leading-relaxed mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  This section contains sensitive platform analytics and critical data. Are you sure you want to proceed?
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowAnalyticsConfirm(false)}
                    className={`px-6 py-3.5 rounded-2xl text-sm font-bold transition-all ${isDark
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                      }`}
                  >
                    No, Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowAnalyticsConfirm(false);
                      router.push('/dashboard/admin/analytics');
                    }}
                    className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Yes, Proceed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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

export default AdminSidebar;
