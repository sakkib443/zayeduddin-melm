'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useEffect, useState } from 'react';
import {
    FiPackage, FiDownload, FiClock, FiCheckCircle,
    FiXCircle, FiRefreshCw, FiShoppingBag, FiExternalLink,
    FiTrendingUp, FiCreditCard, FiArrowRight, FiCalendar,
    FiSearch, FiChevronDown, FiChevronUp, FiEye
} from 'react-icons/fi';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';

export default function UserPurchasesPage() {
    const { isDark } = useTheme();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        

        try {
            if (!isRefreshing) setLoading(true);
            const res = await fetch(`${BASE_URL}/orders/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(data.data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchOrders();
    };

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items?.some(item => item.title?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || order.paymentStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const completedOrders = orders.filter(o => o.paymentStatus === 'completed').length;
    const pendingOrders = orders.filter(o => o.paymentStatus === 'pending').length;

    const cardClass = `rounded-2xl border transition-all duration-300 ${isDark
        ? 'bg-slate-800/50 border-white/5 hover:border-[#E62D26]/20'
        : 'bg-white border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md'
        }`;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                        <FiCheckCircle size={10} /> Paid
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-bold">
                        <FiClock size={10} /> Pending
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 text-[10px] font-bold">
                        <FiXCircle size={10} /> Failed
                    </span>
                );
            default:
                return <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold">{status}</span>;
        }
    };

    if (loading && !isRefreshing) {
        return (
            <div className="space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 ${cardClass}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        <div className="space-y-2">
                            <div className={`h-4 w-32 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                            <div className={`h-3 w-48 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        </div>
                    </div>
                </div>
                <div className={cardClass}>
                    <div className="p-4 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={`h-14 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Professional Compact Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 ${cardClass}`}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E62D26] to-[#f79952] flex items-center justify-center text-white shadow-md shadow-[#E62D26]/10">
                        <FiShoppingBag size={24} />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Purchase History
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Track your orders and transaction history
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isDark
                            ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <FiRefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                        Sync
                    </button>
                    <Link
                        href="/courses"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white rounded-xl text-sm font-bold shadow-md shadow-[#E62D26]/10 hover:scale-105 transition-all"
                    >
                        <FiPackage size={16} />
                        Shop More
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Orders */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Total Orders
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {orders.length.toString().padStart(2, '0')}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiShoppingBag size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#E62D26] to-[#c41e18] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Completed */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Completed
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 text-emerald-500`}>
                                {completedOrders.toString().padStart(2, '0')}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-red-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiCheckCircle size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-red-500 transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Pending */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Pending
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 text-amber-500`}>
                                {pendingOrders.toString().padStart(2, '0')}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f79952] to-[#fb923c] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiClock size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#f79952] to-[#fb923c] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                {/* Total Spent */}
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Total Spent
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                ?{totalSpent.toLocaleString()}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E62D26] to-[#f79952] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FiCreditCard size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#E62D26] to-[#f79952] transition-all duration-300 group-hover:w-full w-0`} />
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className={`flex flex-col md:flex-row md:items-center gap-4 p-4 ${cardClass}`}>
                <div className="relative flex-1">
                    <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${isDark
                            ? 'bg-slate-800/50 border-white/5 text-slate-200 focus:ring-[#E62D26]/30'
                            : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-[#E62D26]/20'
                            }`}
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['all', 'completed', 'pending'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize ${statusFilter === status
                                ? status === 'completed'
                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    : status === 'pending'
                                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                        : isDark ? 'bg-[#E62D26]/20 text-[#E62D26] border border-[#E62D26]/30' : 'bg-[#E62D26]/10 text-[#E62D26] border border-[#E62D26]/20'
                                : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}>
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table/List */}
            {filteredOrders.length === 0 ? (
                <div className={`py-16 text-center ${cardClass}`}>
                    <FiShoppingBag size={40} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {searchTerm || statusFilter !== 'all' ? 'No Orders Found' : 'No Purchases Yet'}
                    </h2>
                    <p className={`text-sm mt-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {searchTerm || statusFilter !== 'all'
                            ? 'Try adjusting your search or filters.'
                            : 'Start shopping to see your orders here.'
                        }
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-all"
                        >
                            Browse Courses <FiArrowRight />
                        </Link>
                    )}
                </div>
            ) : (
                <div className={`overflow-hidden ${cardClass}`}>
                    {/* Table Header */}
                    <div className={`hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-[10px] font-bold uppercase tracking-widest ${isDark
                        ? 'bg-gradient-to-r from-slate-800/60 to-slate-800/40 text-slate-400 border-b border-white/5'
                        : 'bg-gradient-to-r from-slate-50 to-white text-slate-400 border-b border-slate-100'
                        }`}>
                        <div className="col-span-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E62D26]"></span>
                            Order ID
                        </div>
                        <div className="col-span-3">Products</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-2 text-right">Amount</div>
                        <div className="col-span-1 text-center">Details</div>
                    </div>

                    {/* Order Rows */}
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredOrders.map((order, idx) => (
                            <div key={order._id} className={`${expandedOrder === order._id ? isDark ? 'bg-slate-800/20' : 'bg-[#E62D26]/5' : ''}`}>
                                {/* Main Row */}
                                <div
                                    className={`grid grid-cols-12 gap-4 px-6 py-5 items-center cursor-pointer transition-all ${isDark
                                        ? 'hover:bg-slate-800/40'
                                        : 'hover:bg-slate-50'
                                        }`}
                                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                >
                                    {/* Order ID */}
                                    <div className="col-span-12 md:col-span-3 flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium shrink-0 ${isDark
                                            ? 'bg-slate-700/50 text-slate-400'
                                            : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                ORD-{order.orderNumber || order._id?.slice(-6).toUpperCase()}
                                            </p>
                                            <p className={`text-[10px] md:hidden ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="hidden md:flex col-span-3 items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {order.items?.slice(0, 3).map((item, i) => (
                                                <div key={i} className={`w-9 h-9 rounded-lg overflow-hidden border-2 shadow-sm ${isDark ? 'border-slate-800' : 'border-white'}`}>
                                                    <img
                                                        src={item.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=100'}
                                                        className="w-full h-full object-cover"
                                                        alt=""
                                                    />
                                                </div>
                                            ))}
                                            {order.items?.length > 3 && (
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold ${isDark
                                                    ? 'bg-slate-700 text-slate-300 border-2 border-slate-800'
                                                    : 'bg-slate-100 text-slate-500 border-2 border-white'
                                                    }`}>
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {order.items?.length || 0} item{order.items?.length !== 1 && 's'}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <div className={`hidden md:block col-span-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {new Date(order.orderDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>

                                    {/* Status */}
                                    <div className="hidden md:block col-span-1">
                                        {getStatusBadge(order.paymentStatus)}
                                    </div>

                                    {/* Amount */}
                                    <div className="hidden md:block col-span-2 text-right">
                                        <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                            ?{order.totalAmount?.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="hidden md:flex col-span-1 justify-center items-center">
                                        <button className={`p-2.5 rounded-xl transition-all ${expandedOrder === order._id
                                            ? isDark ? 'bg-[#E62D26]/10 text-[#E62D26]' : 'bg-[#E62D26]/10 text-[#E62D26]'
                                            : isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                                            }`}>
                                            {expandedOrder === order._id ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                                        </button>
                                    </div>

                                    {/* Mobile: Amount & Status */}
                                    <div className="col-span-12 md:hidden flex items-center justify-between mt-2">
                                        {getStatusBadge(order.paymentStatus)}
                                        <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                            ?{order.totalAmount?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedOrder === order._id && (
                                    <div className={`px-6 pb-6 ${isDark ? 'bg-slate-900/20' : 'bg-slate-50/30'}`}>
                                        <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                                            {/* Items List */}
                                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                                {order.items?.map((item, id) => (
                                                    <div key={id} className={`flex items-center gap-4 p-4 ${isDark ? 'bg-slate-800/30' : 'bg-white'}`}>
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                                            <img
                                                                src={item.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200'}
                                                                className="w-full h-full object-cover"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mb-1 ${item.productType === 'course'
                                                                ? 'bg-[#E62D26]/10 text-[#E62D26]'
                                                                : item.productType === 'software'
                                                                    ? 'bg-[#f79952]/10 text-[#f79952]'
                                                                    : 'bg-purple-500/10 text-purple-500'
                                                                }`}>
                                                                {item.productType}
                                                            </span>
                                                            <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                                {item.title}
                                                            </p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                                ?{item.price?.toLocaleString()}
                                                            </p>
                                                            {order.paymentStatus === 'completed' && (
                                                                <Link
                                                                    href={`/dashboard/user/${item.productType === 'course' ? 'courses' : 'assets/' + (item.productType === 'software' ? 'softwares' : 'websites')}`}
                                                                    className="text-[10px] font-bold text-[#E62D26] hover:underline"
                                                                >
                                                                    Access ?
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Footer */}
                                            <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <FiCreditCard size={10} />
                                                        {order.paymentMethod || 'Online'}
                                                    </span>
                                                    {order.transactionId && (
                                                        <span>TXN: {order.transactionId}</span>
                                                    )}
                                                </div>
                                                <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${isDark
                                                    ? 'bg-slate-700 text-slate-300 hover:text-[#E62D26]'
                                                    : 'bg-white text-slate-500 hover:text-[#E62D26] border border-slate-200'
                                                    }`}>
                                                    <FiDownload size={10} /> Invoice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Help Notice */}
            <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${isDark
                ? 'bg-slate-800/30 border-white/5'
                : 'bg-slate-50 border-slate-100'
                }`}>
                <div className="flex items-center gap-3">
                    <FiCreditCard size={18} className="text-[#E62D26] shrink-0" />
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Need help with a payment? <Link href="/dashboard/user/support" className="text-[#E62D26] font-bold hover:underline">Contact Support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

