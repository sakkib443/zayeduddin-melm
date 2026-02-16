'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useEffect, useState } from 'react';
import {
    FiShoppingBag, FiSearch, FiRefreshCw, FiEye,
    FiChevronLeft, FiChevronRight, FiUser,
    FiDollarSign, FiPackage, FiCheck, FiClock, FiX,
    FiCalendar, FiMail, FiPhone, FiEdit3, FiSave,
    FiCreditCard, FiHash, FiMapPin, FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MentorOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/orders/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(data.data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const matchSearch =
            order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'all' || order.paymentStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getPaymentStyle = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-700';
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'failed': return 'bg-red-100 text-red-700';
            case 'refunded': return 'bg-purple-100 text-purple-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <FiCheck className="text-emerald-500" />;
            case 'pending': return <FiClock className="text-amber-500" />;
            case 'failed': return <FiX className="text-red-500" />;
            default: return <FiAlertCircle className="text-slate-400" />;
        }
    };

    const totalRevenue = orders.filter(o => o.paymentStatus === 'completed').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.paymentStatus === 'pending').length;
    const completedOrders = orders.filter(o => o.paymentStatus === 'completed').length;

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <FiShoppingBag className="text-white text-xl" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-800">Orders Management</h1>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">Mentor</span>
                        </div>
                        <p className="text-sm text-slate-500">{orders.length} total orders (View Only)</p>
                    </div>
                </div>
                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                >
                    <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Mentor Notice */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <FiAlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-amber-800">
                    <span className="font-semibold">Note:</span> As a Mentor, you can view order details but cannot modify order statuses. Contact an Administrator for status changes.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-red-500 flex items-center justify-center text-white shadow-lg">
                                <FiDollarSign size={22} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">?{totalRevenue.toLocaleString()}</p>
                                <p className="text-sm text-slate-500">Total Revenue</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                                <FiClock size={22} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{pendingOrders}</p>
                                <p className="text-sm text-slate-500">Pending Orders</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                                <FiCheck size={22} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{completedOrders}</p>
                                <p className="text-sm text-slate-500">Completed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by order number, customer name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {['all', 'completed', 'pending', 'failed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all ${statusFilter === status
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                {status === 'all' ? 'All' : status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Products</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <FiRefreshCw className="animate-spin mx-auto mb-3 text-indigo-500" size={28} />
                                        <p className="text-slate-500">Loading orders...</p>
                                    </td>
                                </tr>
                            ) : paginatedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <FiShoppingBag className="mx-auto mb-3 text-slate-300" size={32} />
                                        <p className="text-slate-500">No orders found</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                #{order.orderNumber || order._id?.slice(-6).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                                    {order.user?.firstName?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800 text-sm">{order.user?.firstName} {order.user?.lastName}</p>
                                                    <p className="text-xs text-slate-500">{order.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-700">{order.items?.length || 0} item(s)</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-emerald-600 text-lg">?{order.totalAmount?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPaymentStyle(order.paymentStatus)}`}>
                                                {getStatusIcon(order.paymentStatus)}
                                                <span className="ml-1">{order.paymentStatus}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600">
                                                {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                }) : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openOrderDetails(order)}
                                                    className="p-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <FiEye size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                        <p className="text-sm text-slate-500">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all"
                            >
                                <FiChevronLeft size={16} />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium text-slate-600">{currentPage} / {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all"
                            >
                                <FiChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Detail Modal (View Only) */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-white">Order Details</h3>
                                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-white/20 text-white rounded-full">View Only</span>
                                    </div>
                                    <p className="text-indigo-100 text-sm flex items-center gap-2 mt-1">
                                        <FiHash size={14} /> {selectedOrder.orderNumber || selectedOrder._id?.slice(-6).toUpperCase()}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/20 rounded-lg text-white transition-all">
                                    <FiX size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Order Info Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-1">Order Date</p>
                                    <p className="font-semibold text-slate-800 text-sm">
                                        {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString('en-US', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        }) : 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-1">Order Time</p>
                                    <p className="font-semibold text-slate-800 text-sm">
                                        {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleTimeString('en-US', {
                                            hour: '2-digit', minute: '2-digit'
                                        }) : 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-1">Payment Method</p>
                                    <p className="font-semibold text-slate-800 text-sm capitalize flex items-center gap-2">
                                        <FiCreditCard size={14} className="text-indigo-500" />
                                        {selectedOrder.paymentMethod || 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-1">Payment Status</p>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPaymentStyle(selectedOrder.paymentStatus)}`}>
                                        {getStatusIcon(selectedOrder.paymentStatus)}
                                        <span className="ml-1">{selectedOrder.paymentStatus}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-slate-50 rounded-xl p-5">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Customer Information</h4>
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                                        {selectedOrder.user?.firstName?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-slate-500">Full Name</p>
                                            <p className="font-semibold text-slate-800">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Email Address</p>
                                            <p className="font-semibold text-slate-800 flex items-center gap-1">
                                                <FiMail size={12} className="text-slate-400" />
                                                {selectedOrder.user?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Order Items ({selectedOrder.items?.length || 0})</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                        <FiPackage className="text-slate-300" size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-800">{item.title}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded capitalize">{item.productType}</span>
                                                </div>
                                            </div>
                                            <span className="text-xl font-bold text-emerald-600">?{item.price?.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
                                    <span className="text-indigo-100">Subtotal</span>
                                    <span className="font-semibold">?{selectedOrder.totalAmount?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold">Total Amount</span>
                                    <span className="text-3xl font-bold">?{selectedOrder.totalAmount?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

