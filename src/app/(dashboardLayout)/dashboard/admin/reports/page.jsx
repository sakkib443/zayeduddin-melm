'use client';

import React, { useState, useEffect } from 'react';
import {
    FiDownload, FiFileText, FiPieChart, FiShoppingBag,
    FiUsers, FiCalendar, FiCheckCircle,
    FiDollarSign, FiBook,
    FiSettings, FiRefreshCw, FiX, FiCheck
} from 'react-icons/fi';
import { API_URL } from '@/config/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportsPage() {
    const [loading, setLoading] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);
    const [stats, setStats] = useState(null);
    const [showCustomModal, setShowCustomModal] = useState(false);

    const [customReport, setCustomReport] = useState({
        dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dateTo: new Date().toISOString().split('T')[0],
        includeRevenue: true,
        includeOrders: true,
        includeUsers: false,
        includeCourses: false,
        includeTopProducts: true,
        reportTitle: 'Custom Business Report'
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [dashboardRes, recentRes, topRes, coursesRes] = await Promise.all([
                fetch(`${API_URL}/analytics/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/analytics/recent-purchases?limit=100`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/analytics/top-products?limit=30`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/courses?limit=100`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const dashboardData = await dashboardRes.json();
            const recentData = await recentRes.json();
            const topData = await topRes.json();
            const coursesData = await coursesRes.json();

            setStats({
                summary: dashboardData.data,
                recent: recentData.data || [],
                top: topData.data || [],
                courses: coursesData.data || []
            });
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const reportTypes = [
        {
            id: 'revenue',
            title: 'Revenue Analysis',
            description: 'Complete financial overview with revenue breakdown and profit analysis.',
            icon: FiPieChart,
            color: 'bg-indigo-500'
        },
        {
            id: 'orders',
            title: 'Sales & Orders',
            description: 'Detailed transaction history with customer info and payment status.',
            icon: FiShoppingBag,
            color: 'bg-emerald-500'
        },
        {
            id: 'users',
            title: 'User Analytics',
            description: 'User growth metrics, enrollment statistics and engagement data.',
            icon: FiUsers,
            color: 'bg-blue-500'
        },
        {
            id: 'inventory',
            title: 'Product Portfolio',
            description: 'Complete inventory of courses and products with performance metrics.',
            icon: FiFileText,
            color: 'bg-amber-500'
        }
    ];

    const generatePDF = (type, customOptions = null) => {
        if (!stats) return;
        setDownloadingId(type);

        try {
            const doc = new jsPDF();
            const timestamp = new Date().toLocaleString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            const options = customOptions || customReport;
            const pageWidth = doc.internal.pageSize.getWidth();

            // Header
            doc.setFillColor(79, 70, 229);
            doc.rect(0, 0, pageWidth, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text(type === 'custom' ? options.reportTitle : `${type.toUpperCase()} REPORT`, 15, 22);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`Generated: ${timestamp}`, 15, 32);

            let currentY = 50;

            if (type === 'revenue' || (type === 'custom' && options.includeRevenue)) {
                doc.setFillColor(249, 250, 251);
                doc.roundedRect(10, currentY, pageWidth - 20, 30, 2, 2, 'F');

                doc.setTextColor(79, 70, 229);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text('FINANCIAL OVERVIEW', 15, currentY + 10);

                const statsData = [
                    { label: 'Total Revenue', value: `BDT ${stats.summary?.totalRevenue?.toLocaleString() || '0'}` },
                    { label: 'This Month', value: `BDT ${stats.summary?.monthlyRevenue?.toLocaleString() || '0'}` },
                    { label: 'Total Orders', value: stats.summary?.totalOrdersCount?.toString() || '0' }
                ];

                const statsBoxWidth = (pageWidth - 40) / 3;
                statsData.forEach((stat, i) => {
                    doc.setTextColor(100, 116, 139);
                    doc.setFontSize(8);
                    doc.text(stat.label, 15 + (i * statsBoxWidth), currentY + 18);
                    doc.setTextColor(15, 23, 42);
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'bold');
                    doc.text(stat.value, 15 + (i * statsBoxWidth), currentY + 25);
                });

                currentY += 40;
            }

            if (type === 'orders' || (type === 'custom' && options.includeOrders)) {
                doc.setTextColor(15, 23, 42);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('Recent Orders', 15, currentY);
                currentY += 5;

                const orderRows = (stats.recent || []).slice(0, 20).map((order, i) => [
                    (i + 1).toString(),
                    new Date(order.orderDate).toLocaleDateString('en-GB'),
                    `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'N/A',
                    `BDT ${order.totalAmount?.toLocaleString() || '0'}`,
                    order.paymentStatus?.toUpperCase() || 'PENDING'
                ]);

                autoTable(doc, {
                    startY: currentY,
                    head: [['#', 'Date', 'Customer', 'Amount', 'Status']],
                    body: orderRows.length ? orderRows : [['', 'No orders found', '', '', '']],
                    theme: 'striped',
                    headStyles: { fillColor: [16, 185, 129], fontSize: 9 },
                    bodyStyles: { fontSize: 8 },
                    didDrawPage: (data) => { currentY = data.cursor.y + 10; }
                });
            }

            if (type === 'inventory' || (type === 'custom' && options.includeTopProducts)) {
                if (currentY > 220) {
                    doc.addPage();
                    currentY = 20;
                }

                doc.setTextColor(15, 23, 42);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('Top Products', 15, currentY);
                currentY += 5;

                const productRows = (stats.top || []).slice(0, 15).map((p, i) => [
                    (i + 1).toString(),
                    (p.title || 'Product').substring(0, 30),
                    p.salesCount?.toString() || '0',
                    `BDT ${p.price?.toLocaleString() || '0'}`
                ]);

                autoTable(doc, {
                    startY: currentY,
                    head: [['#', 'Product', 'Sales', 'Price']],
                    body: productRows.length ? productRows : [['', 'No products found', '', '']],
                    theme: 'striped',
                    headStyles: { fillColor: [245, 158, 11], fontSize: 9 },
                    bodyStyles: { fontSize: 8 }
                });
            }

            if (type === 'users' || (type === 'custom' && options.includeUsers)) {
                if (currentY > 220) {
                    doc.addPage();
                    currentY = 20;
                }

                doc.setTextColor(15, 23, 42);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('User Statistics', 15, currentY);
                currentY += 5;

                const userData = [
                    ['Total Students', stats.summary?.totalStudents?.toString() || '0'],
                    ['Total Users', stats.summary?.totalUsers?.toString() || '0'],
                    ['Active Enrollments', stats.summary?.activeEnrollments?.toString() || '0']
                ];

                autoTable(doc, {
                    startY: currentY,
                    head: [['Metric', 'Count']],
                    body: userData,
                    theme: 'grid',
                    headStyles: { fillColor: [59, 130, 246], fontSize: 9 },
                    bodyStyles: { fontSize: 9 }
                });
            }

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setTextColor(100, 116, 139);
                doc.setFontSize(8);
                doc.text(`Page ${i} of ${pageCount}`, pageWidth - 15, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
            }

            const fileName = type === 'custom'
                ? `Custom_Report_${options.dateFrom}_to_${options.dateTo}.pdf`
                : `${type}_Report_${new Date().toISOString().split('T')[0]}.pdf`;

            doc.save(fileName);

            if (type === 'custom') {
                setShowCustomModal(false);
            }
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF.');
        } finally {
            setDownloadingId(null);
        }
    };

    const toggleOption = (key) => {
        setCustomReport(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Reports</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate and download business reports</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchStats}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                    <button
                        onClick={() => setShowCustomModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
                    >
                        <FiSettings size={16} />
                        Custom Report
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Revenue', value: `৳${stats?.summary?.totalRevenue?.toLocaleString() || '0'}`, icon: FiDollarSign, color: 'bg-emerald-500' },
                    { label: 'Total Orders', value: stats?.summary?.totalOrdersCount || '0', icon: FiShoppingBag, color: 'bg-blue-500' },
                    { label: 'Total Courses', value: stats?.summary?.totalCourses || '0', icon: FiBook, color: 'bg-purple-500' },
                    { label: 'Total Users', value: stats?.summary?.totalUsers || '0', icon: FiUsers, color: 'bg-amber-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${stat.color} rounded-md flex items-center justify-center`}>
                                <stat.icon className="text-white" size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((report) => (
                    <div key={report.id} className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2.5 rounded-md ${report.color} text-white`}>
                                <report.icon size={20} />
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-md">
                                PDF
                            </span>
                        </div>

                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{report.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{report.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <FiCheckCircle size={14} />
                                <span className="text-xs font-medium">Ready</span>
                            </div>
                            <button
                                onClick={() => generatePDF(report.id)}
                                disabled={downloadingId !== null || !stats}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${downloadingId === report.id
                                    ? 'bg-gray-100 dark:bg-slate-700 text-gray-400'
                                    : 'bg-gray-900 dark:bg-indigo-600 text-white hover:bg-gray-800 dark:hover:bg-indigo-700'
                                    }`}
                            >
                                {downloadingId === report.id ? (
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <FiDownload size={14} />
                                )}
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Report Modal */}
            {showCustomModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowCustomModal(false)} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Custom Report</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Select options for your report</p>
                            </div>
                            <button onClick={() => setShowCustomModal(false)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700">
                                <FiX size={18} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Report Title */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Title</label>
                            <input
                                type="text"
                                value={customReport.reportTitle}
                                onChange={(e) => setCustomReport(prev => ({ ...prev, reportTitle: e.target.value }))}
                                className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                placeholder="Enter report title"
                            />
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <FiCalendar className="inline mr-1" size={14} />
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={customReport.dateFrom}
                                    onChange={(e) => setCustomReport(prev => ({ ...prev, dateFrom: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <FiCalendar className="inline mr-1" size={14} />
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={customReport.dateTo}
                                    onChange={(e) => setCustomReport(prev => ({ ...prev, dateTo: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Options */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Include in Report</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { key: 'includeRevenue', label: 'Revenue Summary' },
                                    { key: 'includeOrders', label: 'Orders List' },
                                    { key: 'includeUsers', label: 'User Stats' },
                                    { key: 'includeTopProducts', label: 'Top Products' },
                                    { key: 'includeCourses', label: 'All Courses' }
                                ].map((option) => (
                                    <button
                                        key={option.key}
                                        onClick={() => toggleOption(option.key)}
                                        className={`flex items-center gap-2 p-3 rounded-md border text-left text-sm transition-colors ${customReport[option.key]
                                            ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                            : 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded flex items-center justify-center ${customReport[option.key] ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-slate-600'}`}>
                                            {customReport[option.key] && <FiCheck size={12} />}
                                        </div>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCustomModal(false)}
                                className="px-4 py-2 rounded-md border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => generatePDF('custom', customReport)}
                                disabled={downloadingId === 'custom'}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
                            >
                                {downloadingId === 'custom' ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <FiDownload size={16} />
                                )}
                                Generate PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
