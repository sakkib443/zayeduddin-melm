'use client';
import { API_URL } from '@/config/api';
import React, { useEffect, useState } from 'react';
import {
  FiShoppingBag, FiSearch, FiRefreshCw, FiEye,
  FiChevronLeft, FiChevronRight, FiDollarSign, FiPackage, FiCheck, FiClock, FiX,
  FiMail, FiEdit3, FiSave, FiCreditCard, FiHash, FiAlertCircle, FiCalendar, FiPhone
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders/admin/all`, {
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

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Order set to ${newStatus}!`);
        setEditMode(false);
        setSelectedOrder(null);
        fetchOrders();
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || order.paymentStatus === statusFilter;
    let matchDate = true;
    if (dateFilter) {
      const orderDateStr = new Date(order.orderDate).toISOString().split('T')[0];
      matchDate = orderDateStr === dateFilter;
    }
    return matchSearch && matchStatus && matchDate;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs font-medium flex items-center gap-1"><FiCheck size={12} /> Completed</span>;
      case 'pending': return <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-xs font-medium flex items-center gap-1"><FiClock size={12} /> Pending</span>;
      case 'failed': return <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs font-medium flex items-center gap-1"><FiX size={12} /> Failed</span>;
      default: return <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">{status}</span>;
    }
  };

  const totalRevenue = orders.filter(o => o.paymentStatus === 'completed').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.paymentStatus === 'pending').length;
  const completedOrdersCount = orders.filter(o => o.paymentStatus === 'completed').length;

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setEditStatus(order.paymentStatus);
    setEditMode(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-blue-500 flex items-center justify-center">
            <FiShoppingBag className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Orders</h1>
            <p className="text-sm text-slate-500">{orders.length} total transactions</p>
          </div>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
        >
          <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-md flex items-center justify-center text-white">
            <FiDollarSign size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Revenue</p>
            <p className="text-xl font-semibold text-slate-800 dark:text-white">৳{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500 rounded-md flex items-center justify-center text-white">
            <FiClock size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Pending</p>
            <p className="text-xl font-semibold text-slate-800 dark:text-white">{pendingOrdersCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center text-white">
            <FiCheck size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Completed</p>
            <p className="text-xl font-semibold text-slate-800 dark:text-white">{completedOrdersCount}</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by ID, Name or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none text-sm transition-colors"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-900 rounded-md border border-gray-200 dark:border-slate-700">
            <FiCalendar className="text-slate-400" size={14} />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-sm text-slate-600 dark:text-slate-300 outline-none"
            />
            {dateFilter && (
              <button onClick={() => setDateFilter('')} className="text-slate-400 hover:text-red-500 transition-colors">
                <FiX size={14} />
              </button>
            )}
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 mx-1 hidden md:block" />
          {['all', 'completed', 'pending', 'failed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Order ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Items</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Date</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <FiRefreshCw className="animate-spin text-blue-500 mx-auto mb-2" size={24} />
                    <p className="text-sm text-slate-500">Loading orders...</p>
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <FiShoppingBag size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No matching orders found</p>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-900 px-2 py-1 rounded">
                        #{order.orderNumber || order._id?.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                          {order.user?.firstName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">{order.user?.firstName} {order.user?.lastName}</p>
                          <p className="text-xs text-slate-400">{order.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600 dark:text-slate-300">{order.items?.length || 0} items</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">৳{order.totalAmount?.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(order.paymentStatus)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500">
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        }) : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {order.paymentStatus === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'completed')}
                            disabled={saving}
                            className="p-1.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
                            title="Mark Complete"
                          >
                            <FiCheck size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <FiEye size={14} />
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
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-slate-700">
            <p className="text-xs text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-gray-200 dark:border-slate-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="px-3 text-sm text-slate-600">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-gray-200 dark:border-slate-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-md w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-lg">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-700 bg-blue-500 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Order Details</h3>
                <p className="text-blue-100 text-xs flex items-center gap-1 mt-0.5">
                  <FiHash size={12} /> {selectedOrder.orderNumber || selectedOrder._id?.slice(-6).toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <FiEdit3 size={14} /> Edit Status
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder._id, editStatus)}
                    disabled={saving}
                    className="px-3 py-1.5 bg-white text-blue-600 rounded-md text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <FiSave size={14} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                )}
                <button onClick={() => { setSelectedOrder(null); setEditMode(false); }} className="p-1.5 bg-black/20 hover:bg-black/30 rounded-md text-white transition-colors">
                  <FiX size={18} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-3">
                  <p className="text-xs text-slate-500 mb-1">Order Date</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">
                    {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString('en-GB') : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-3">
                  <p className="text-xs text-slate-500 mb-1">Payment Method</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-white capitalize flex items-center gap-1">
                    <FiCreditCard size={14} className="text-blue-500" />
                    {selectedOrder.paymentMethod || 'Manual'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-3 col-span-2">
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  {editMode ? (
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2 py-1 text-sm rounded-md focus:border-blue-400 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  ) : (
                    getStatusBadge(selectedOrder.paymentStatus)
                  )}
                </div>
              </div>

              {/* Customer Profile */}
              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-4">
                <h4 className="text-xs font-medium text-slate-500 mb-3">Customer Information</h4>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {selectedOrder.user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <FiMail size={12} /> {selectedOrder.user?.email}
                      </p>
                      {selectedOrder.user?.phone && (
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <FiPhone size={12} /> {selectedOrder.user?.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-medium text-slate-500 mb-2">Items ({selectedOrder.items?.length || 0})</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 dark:bg-slate-900 shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiPackage className="text-gray-400" size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{item.title}</p>
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          item.productType === 'course' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {item.productType}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">৳{item.price?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="p-4 bg-blue-500 rounded-md text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-100">Total Amount</p>
                    <p className="text-xs text-blue-200 mt-0.5">Including all fees</p>
                  </div>
                  <span className="text-2xl font-semibold">৳{selectedOrder.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Transaction Details */}
              {(selectedOrder.paymentMethod === 'manual' || selectedOrder.manualPaymentDetails) && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-md p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FiCheck className="text-emerald-500" size={16} />
                    <h4 className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Payment Verification</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-emerald-600/70 mb-0.5">Method</p>
                      <p className="font-medium text-slate-700 dark:text-white">{selectedOrder.manualPaymentDetails?.method || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600/70 mb-0.5">Sender</p>
                      <p className="font-medium text-slate-700 dark:text-white">{selectedOrder.manualPaymentDetails?.senderNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600/70 mb-0.5">Transaction ID</p>
                      <p className="font-mono text-slate-700 dark:text-white">{selectedOrder.manualPaymentDetails?.transactionId || selectedOrder.transactionId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600/70 mb-0.5">Time</p>
                      <p className="font-medium text-slate-700 dark:text-white">{selectedOrder.manualPaymentDetails?.date || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedOrder.paymentStatus === 'failed' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                  <FiAlertCircle className="text-red-500" size={16} />
                  <p className="text-xs text-red-600">This transaction was marked as failed. Please audit manually if necessary.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

