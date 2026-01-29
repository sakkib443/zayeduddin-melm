/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect, useState } from 'react';
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

// ==================== CLEAN STATS CARD ====================
const StatsCard = ({ title, value, change, changeType, icon: Icon, color, loading, subtitle }) => {
  const { isDark } = useTheme();
  return (
    <div className={`rounded-md p-5 transition-all duration-300 border ${isDark
      ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-2xl font-semibold mt-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {loading ? (
              <span className={`inline-block w-20 h-7 animate-pulse rounded ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
            ) : (
              <AnimatedCounter value={value} prefix={title.includes('Revenue') ? '৳' : ''} />
            )}
          </p>
          {subtitle && <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{subtitle}</p>}
          {change && (
            <div className={`inline-flex items-center gap-1 mt-2 text-xs font-normal ${changeType === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
              {changeType === 'up' ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-md ${color} flex items-center justify-center text-white`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

// ==================== ACTIVITY ITEM ====================
const ActivityItem = ({ icon: Icon, title, description, time, color, isNew }) => {
  const { isDark } = useTheme();
  return (
    <div className={`flex items-start gap-3 p-3 transition-all ${isNew ? (isDark ? 'bg-indigo-500/10' : 'bg-indigo-50') : ''}`}>
      <div
        className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
        style={{ background: `${color}15` }}
      >
        <Icon className="text-sm" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{title}</p>
          {isNew && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
        </div>
        <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{description}</p>
      </div>
      <span className={`text-xs shrink-0 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{time}</span>
    </div>
  );
};

// ==================== HELPER FUNCTIONS ====================
const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// ==================== MAIN DASHBOARD ====================
export default function AdminDashboard() {
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
  const [recentOrders, setRecentOrders] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');

    try {
      setRefreshing(true);

      const [summaryRes, topProductsRes, recentPurchasesRes] = await Promise.all([
        fetch(`${API_URL}/analytics/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/analytics/top-products?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/analytics/recent-purchases?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      const { data: summary } = await summaryRes.json();
      const { data: topProducts } = await topProductsRes.json();
      const { data: recentPurchases } = await recentPurchasesRes.json();

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

      setTopCourses(topProducts || []);

      setRecentOrders((recentPurchases || []).map(p => ({
        id: p.orderNumber || p._id?.slice(-6).toUpperCase(),
        customer: `${p.user?.firstName || 'User'} ${p.user?.lastName || ''}`,
        product: p.items?.[0]?.title || 'Product',
        amount: p.totalAmount,
        status: p.paymentStatus,
        time: new Date(p.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })));

      // Fetch notifications for recent activities
      try {
        const notifRes = await fetch(`${BASE_URL}/notifications?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } });
        const notifData = await notifRes.json();
        if (notifData.data) {
          setRecentActivities(notifData.data.map(n => ({
            icon: n.type === 'order' ? FiCheckCircle : n.type === 'enrollment' ? FiUsers : n.type === 'review' ? FiStar : FiActivity,
            title: n.title,
            description: n.message,
            time: getTimeAgo(new Date(n.createdAt)),
            color: n.type === 'order' ? '#10B981' : n.type === 'enrollment' ? '#3B82F6' : n.type === 'review' ? '#F59E0B' : '#6366F1',
            isNew: !n.isRead
          })));
        }
      } catch (e) {
        console.log('Notifications fetch error:', e);
      }

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
      color: 'bg-rose-500',
    },
    {
      title: 'Today Revenue',
      value: dashboardData.todayRevenue,
      subtitle: "Today's earnings",
      change: '+8.5%',
      changeType: 'up',
      icon: FiDollarSign,
      color: 'bg-emerald-600',
    },
    {
      title: 'Monthly Revenue',
      value: dashboardData.monthlyRevenue,
      subtitle: 'This month',
      change: '+18.2%',
      changeType: 'up',
      icon: FiTrendingUp,
      color: 'bg-amber-500',
    },
    {
      title: 'Total Orders',
      value: dashboardData.totalOrders,
      subtitle: `${dashboardData.completedOrders || 0} completed`,
      change: '+24.5%',
      changeType: 'up',
      icon: FiPackage,
      color: 'bg-indigo-600',
    },
  ];

  // Product stats for cards
  const productStats = [
    { title: 'Courses', value: dashboardData.totalCourses, icon: FiBook, color: 'bg-indigo-600', href: '/dashboard/admin/course' },
    { title: 'Software', value: dashboardData.totalSoftware, icon: FiCode, color: 'bg-cyan-600', href: '/dashboard/admin/software' },
    { title: 'Websites', value: dashboardData.totalWebsites, icon: FiGlobe, color: 'bg-rose-500', href: '/dashboard/admin/website' },
    { title: 'Categories', value: dashboardData.categories, icon: FiLayers, color: 'bg-amber-500', href: '/dashboard/admin/category' },
  ];

  const quickActions = [
    { title: 'Add Course', href: '/dashboard/admin/course/create', icon: FiBook, color: 'bg-amber-500' },
    { title: 'Add Website', href: '/dashboard/admin/website/create', icon: FiGlobe, color: 'bg-rose-500' },
    { title: 'Add Software', href: '/dashboard/admin/software/create', icon: FiCode, color: 'bg-cyan-600' },
    { title: 'Add Category', href: '/dashboard/admin/category/create', icon: FiLayers, color: 'bg-indigo-600' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* ==================== HEADER ==================== */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-md border p-4 ${isDark
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-gray-200'
        }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-indigo-600 flex items-center justify-center">
            <FiGrid className="text-white" size={18} />
          </div>
          <div>
            <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Dashboard Overview</h1>
            <p className={`text-sm font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              {hasMounted ? new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'Loading...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-normal transition-all disabled:opacity-50 border ${isDark
              ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}
          >
            <FiRefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-normal transition-all">
            <FiDownload size={14} />
            Export
          </button>
        </div>
      </div>

      {/* ==================== MAIN STATS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              className={`rounded-md border p-4 transition-all ${isDark
                ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-md ${stat.color} flex items-center justify-center`}>
                  <Icon className="text-white" size={18} />
                </div>
                <div>
                  <p className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {loading ? '...' : stat.value.toLocaleString()}
                  </p>
                  <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{stat.title}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ==================== MIDDLE SECTION ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className={`p-5 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-amber-100 text-amber-600 rounded-md flex items-center justify-center">
              <FiZap size={18} />
            </div>
            <div>
              <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Quick Actions</h2>
              <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Manage your platform</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`flex flex-col items-center gap-2 p-3 rounded-md border transition-all ${isDark
                    ? 'border-slate-700 hover:border-slate-600 hover:bg-slate-700/50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <div className={`w-9 h-9 rounded-md ${action.color} flex items-center justify-center`}>
                    <Icon className="text-white" size={16} />
                  </div>
                  <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{action.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Top Content */}
        <div className={`p-5 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-md flex items-center justify-center">
                <FiAward size={18} />
              </div>
              <div>
                <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Top Content</h2>
                <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Best selling</p>
              </div>
            </div>
            <Link href="/dashboard/admin/course" className="text-xs font-normal text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All <FiArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {loading ? (
              <div className={`text-center py-6 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                <FiRefreshCw className="animate-spin mx-auto mb-2" size={20} />
                <p className="text-sm">Loading...</p>
              </div>
            ) : topCourses.length === 0 ? (
              <div className={`text-center py-6 text-sm ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>No content found</div>
            ) : (
              topCourses.slice(0, 4).map((course, idx) => (
                <div key={course._id || idx} className={`flex items-center gap-3 p-2 rounded-md transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`}>
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white font-medium text-sm ${['bg-indigo-600', 'bg-amber-500', 'bg-emerald-600', 'bg-rose-500'][idx % 4]}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{course.title}</h3>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{course.salesCount || 0} sales</p>
                  </div>
                  <span className="text-sm font-medium text-emerald-600">৳{course.price || 0}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Stats */}
        <div className={`p-5 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-rose-100 text-rose-600 rounded-md flex items-center justify-center">
              <FiActivity size={18} />
            </div>
            <div>
              <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Live Statistics</h2>
              <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Real-time data</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className={`flex justify-between items-center p-3 rounded-md ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
              <span className={`text-sm font-normal ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Today's Revenue</span>
              <span className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>৳{dashboardData.todayRevenue.toLocaleString()}</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-md ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
              <span className={`text-sm font-normal ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>This Month</span>
              <span className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>৳{dashboardData.monthlyRevenue.toLocaleString()}</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-md ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
              <span className={`text-sm font-normal ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>New Users</span>
              <span className="text-base font-semibold text-emerald-600">+{dashboardData.newUsersThisMonth}</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-md ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
              <span className={`text-sm font-normal ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Active Enrollments</span>
              <span className="text-base font-semibold text-indigo-600">{dashboardData.activeEnrollments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== BOTTOM SECTION ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className={`lg:col-span-2 rounded-md border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Recent Orders</h2>
            <Link href="/dashboard/admin/orders" className="text-sm font-normal text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`text-xs font-medium ${isDark ? 'bg-slate-700/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                <tr>
                  <th className="text-left p-3">Order ID</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Product</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-200'}`}>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={`p-6 text-center text-sm ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>No orders found</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className={`transition-colors ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'}`}>
                      <td className="p-3">
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>#{order.id}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-medium">
                            {order.customer?.charAt(0) || 'U'}
                          </div>
                          <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{order.customer}</span>
                        </div>
                      </td>
                      <td className={`p-3 text-sm max-w-[150px] truncate ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{order.product}</td>
                      <td className="p-3 text-sm font-medium text-emerald-600">৳{order.amount?.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`rounded-md border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Recent Activity</h2>
            <Link href="/dashboard/admin/notifications" className="text-sm font-normal text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className={`divide-y max-h-[350px] overflow-y-auto ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
            {recentActivities.length === 0 ? (
              <div className={`p-6 text-center ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                <FiActivity className="mx-auto mb-2" size={20} />
                <p className="text-sm">No recent activities</p>
              </div>
            ) : (
              recentActivities.map((activity, idx) => (
                <ActivityItem key={idx} {...activity} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
