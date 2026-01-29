'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FiBarChart2, FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers,
    FiShoppingBag, FiBook, FiRefreshCw, FiGlobe, FiCode,
    FiCalendar, FiPackage, FiActivity, FiPieChart, FiLayers,
    FiArrowUpRight, FiArrowDownRight, FiMonitor
} from 'react-icons/fi';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';

// Animated counter component
const AnimatedCounter = ({ value, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const numValue = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, '')) || 0;
        const duration = 1500;
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
    }, [value]);

    return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Stats Card Component - Clean Classic Design
const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color, loading }) => {
    const { isDark } = useTheme();
    const isPositive = trend === "up";
    return (
        <div className={`rounded-md p-5 transition-all duration-300 border ${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>
            <div className="flex items-start justify-between">
                <div className="space-y-3">
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{title}</p>
                    <h3 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {loading ? (
                            <div className={`h-8 w-24 animate-pulse rounded-md ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                        ) : (
                            <AnimatedCounter value={value} prefix={title.includes('Revenue') ? '৳' : ''} />
                        )}
                    </h3>
                    {trendValue && (
                        <div className={`flex items-center gap-1.5 text-xs font-normal ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                            {isPositive ? <FiArrowUpRight className="w-3.5 h-3.5" /> : <FiArrowDownRight className="w-3.5 h-3.5" />}
                            <span>{trendValue} Growth</span>
                        </div>
                    )}
                </div>
                <div className={`w-11 h-11 rounded-md ${color} flex items-center justify-center text-white`}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
};

export default function AnalyticsPage() {
    const { isDark } = useTheme();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentPurchases, setRecentPurchases] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [categoryRevenue, setCategoryRevenue] = useState({
        labels: [],
        courses: [],
        websites: [],
        designTemplates: [],
    });

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const [dashboardRes, categoryRes, recentRes, topRes] = await Promise.all([
                fetch(`${API_BASE_URL}/analytics/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/analytics/category-revenue`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/analytics/recent-purchases?limit=10`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/analytics/top-products?limit=5`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const dashboardResult = await dashboardRes.json();
            const categoryResult = await categoryRes.json();
            const recentResult = await recentRes.json();
            const topResult = await topRes.json();

            if (dashboardResult.data) setData(dashboardResult.data);
            if (categoryResult.data) setCategoryRevenue(categoryResult.data);
            if (recentResult.data) setRecentPurchases(recentResult.data);
            if (topResult.data) setTopProducts(topResult.data);
        } catch (err) {
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const totalProducts = (data?.totalCourses || 0) + (data?.totalDesignTemplates || 0) + (data?.totalWebsites || 0);

    const mainStats = [
        {
            title: 'Global Revenue',
            value: data?.totalRevenue || 0,
            icon: FiDollarSign,
            trend: 'up',
            trendValue: '12%',
            color: 'bg-indigo-600'
        },
        {
            title: 'Successful Orders',
            value: data?.totalOrders || 0,
            icon: FiShoppingBag,
            trend: 'up',
            trendValue: '8%',
            color: 'bg-rose-500'
        },
        {
            title: 'Active Accounts',
            value: data?.totalUsers || 0,
            icon: FiUsers,
            trend: 'up',
            trendValue: '15%',
            color: 'bg-emerald-500'
        },
        {
            title: 'Inventory Scope',
            value: totalProducts,
            icon: FiPackage,
            trend: 'up',
            trendValue: '+5',
            color: 'bg-amber-500'
        },
    ];

    const chartData = (categoryRevenue?.labels || []).map((label, index) => ({
        name: label,
        courses: (categoryRevenue?.courses?.[index]) || 0,
        websites: (categoryRevenue?.websites?.[index]) || 0,
        designTemplates: (categoryRevenue?.designTemplates?.[index]) || 0,
    }));

    return (
        <div className="space-y-6 pb-8">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Analytics Dashboard</h1>
                    <p className={`text-sm font-normal mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Overview of your platform performance
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchAnalytics}
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-normal border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                        <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/admin/reports')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-normal hover:bg-indigo-700 transition-all"
                    >
                        Export Report
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mainStats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} loading={loading} />
                ))}
            </div>

            {/* Revenue & Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Revenue Breakdown */}
                <div className={`lg:col-span-8 rounded-md border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-5 gap-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}">
                        <div>
                            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Revenue Overview</h3>
                            <p className={`text-sm font-normal mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Category-wise performance</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Courses</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Websites</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Templates</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorWebsites" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorDesign" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e5e7eb'} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: isDark ? '#94a3b8' : '#6b7280', fontSize: 12, fontWeight: 400 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: isDark ? '#94a3b8' : '#6b7280', fontSize: 12, fontWeight: 400 }}
                                        tickFormatter={(value) => `৳${value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value}`}
                                        dx={-5}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? "#1e293b" : "#fff",
                                            border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
                                            borderRadius: "6px",
                                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                            padding: '12px',
                                        }}
                                        itemStyle={{ fontSize: '12px', fontWeight: '400' }}
                                        formatter={(value) => [`৳${value.toLocaleString()}`, '']}
                                    />
                                    <Area type="monotone" dataKey="courses" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorCourses)" />
                                    <Area type="monotone" dataKey="websites" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorWebsites)" />
                                    <Area type="monotone" dataKey="designTemplates" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorDesign)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-5 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                            <div>
                                <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Course Revenue</span>
                                <p className="text-lg font-semibold text-indigo-600 mt-1">৳{(categoryRevenue?.courses?.[categoryRevenue?.courses?.length - 1] || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Website Revenue</span>
                                <p className="text-lg font-semibold text-emerald-600 mt-1">৳{(categoryRevenue?.websites?.[categoryRevenue?.websites?.length - 1] || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Template Revenue</span>
                                <p className="text-lg font-semibold text-amber-600 mt-1">৳{(categoryRevenue?.designTemplates?.[categoryRevenue?.designTemplates?.length - 1] || 0).toLocaleString()}</p>
                            </div>
                            <div className="lg:text-right">
                                <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Revenue</span>
                                <p className={`text-xl font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>৳{(data?.totalRevenue || 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform Status */}
                <div className={`lg:col-span-4 rounded-md p-5 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <FiActivity size={18} />
                        </div>
                        <div>
                            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Platform Status</h3>
                            <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Real-time metrics</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                            <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Monthly Revenue</p>
                            <h4 className={`text-xl font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>৳{(data?.monthlyRevenue || 0).toLocaleString()}</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-indigo-600 text-white rounded-md">
                                <p className="text-xs font-normal opacity-80">Students</p>
                                <h4 className="text-lg font-semibold mt-1">{data?.totalStudents || 0}</h4>
                            </div>
                            <div className="p-4 bg-emerald-600 text-white rounded-md">
                                <p className="text-xs font-normal opacity-80">New Users</p>
                                <h4 className="text-lg font-semibold mt-1">+{data?.newUsersThisMonth || 0}</h4>
                            </div>
                        </div>

                        <div className={`p-4 rounded-md border flex items-center justify-between ${isDark ? 'border-slate-600' : 'border-gray-200'}`}>
                            <div>
                                <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Active Enrollments</p>
                                <h4 className={`text-lg font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{data?.activeEnrollments || 0}</h4>
                            </div>
                            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                        </div>

                        <div className={`p-4 rounded-md border ${isDark ? 'border-slate-600' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Pending Orders</span>
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">Action Required</span>
                            </div>
                            <p className="text-2xl font-semibold text-amber-600">{data?.pendingOrders || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { title: 'Websites', value: data?.totalWebsites || 0, icon: FiGlobe, color: 'bg-emerald-600' },
                    { title: 'Templates', value: data?.totalDesignTemplates || 0, icon: FiCode, color: 'bg-indigo-600' },
                    { title: 'Courses', value: data?.totalCourses || 0, icon: FiBook, color: 'bg-amber-600' },
                    { title: 'Users', value: data?.totalUsers || 0, icon: FiUsers, color: 'bg-blue-600' },
                    { title: 'Enrollments', value: data?.totalEnrollments || 0, icon: FiActivity, color: 'bg-rose-600' },
                    { title: 'Lessons', value: data?.totalLessons || 0, icon: FiLayers, color: 'bg-violet-600' },
                ].map((item) => (
                    <div key={item.title} className={`p-4 rounded-md border flex flex-col items-center justify-center text-center transition-all ${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>
                        <div className={`w-10 h-10 rounded-md ${item.color} flex items-center justify-center text-white mb-3`}>
                            <item.icon size={18} />
                        </div>
                        <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{item.title}</p>
                        <p className={`text-xl font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{loading ? '...' : item.value}</p>
                    </div>
                ))}
            </div>

            {/* Purchases & Top Products */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                {/* Recent Purchases */}
                <div className={`xl:col-span-8 rounded-md border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <div className={`flex flex-col md:flex-row md:items-center justify-between p-5 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        <div>
                            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Recent Purchases</h3>
                            <p className={`text-sm font-normal mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Latest transactions</p>
                        </div>
                        <button className={`text-sm font-normal text-indigo-600 hover:text-indigo-700 mt-2 md:mt-0`}>View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className={`border-b ${isDark ? 'border-slate-700 bg-slate-700/30' : 'border-gray-200 bg-gray-50'}`}>
                                    <th className={`px-5 py-3 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Customer</th>
                                    <th className={`px-5 py-3 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Amount</th>
                                    <th className={`px-5 py-3 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Status</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-200'}`}>
                                {recentPurchases.length > 0 ? (
                                    recentPurchases.map((purchase) => (
                                        <tr key={purchase._id} className={`transition-all ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'}`}>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-md flex items-center justify-center text-sm font-medium text-white bg-indigo-600`}>
                                                        {(purchase.user?.firstName || 'U')[0]}
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{purchase.user?.firstName} {purchase.user?.lastName}</p>
                                                        <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{purchase.items?.[0]?.title || 'Product'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-5 py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>৳{purchase.totalAmount?.toLocaleString()}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded text-xs font-medium ${purchase.paymentStatus === 'completed'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {purchase.paymentStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-5 py-12 text-center">
                                            <p className={`text-sm font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No recent purchases</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className={`xl:col-span-4 rounded-md border flex flex-col ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <div className={`p-5 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Top Products</h3>
                        <p className={`text-sm font-normal mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Best performing items</p>
                    </div>
                    <div className="p-5 space-y-4 flex-1">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, idx) => (
                                <div key={product._id} className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-md border overflow-hidden ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-100 border-gray-200'}`}>
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className={`w-full h-full flex items-center justify-center ${isDark ? 'text-slate-500' : 'text-gray-400'}`}><FiPackage size={20} /></div>
                                            )}
                                        </div>
                                        <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded bg-gray-800 text-white flex items-center justify-center text-[10px] font-medium">
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{product.title}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{product.salesCount || 0} sales</span>
                                            <span className="text-xs font-medium text-emerald-600">৳{((product.salesCount || 0) * (product.price || 0)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={`h-full flex flex-col items-center justify-center text-center py-12 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                <FiMonitor size={36} />
                                <p className="text-sm font-normal mt-3">No products found</p>
                            </div>
                        )}
                    </div>
                    <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        <button className={`w-full py-2.5 rounded-md text-sm font-normal transition-all ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            View All Products
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
