'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter,
    FiUsers, FiCalendar, FiClock, FiBook, FiMoreVertical,
    FiChevronLeft, FiChevronRight, FiEye, FiUserPlus
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_URL } from '@/config/api';

export default function BatchPage() {
    const { isDark } = useTheme();
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);

    useEffect(() => {
        fetchBatches();
    }, [currentPage, statusFilter, searchTerm]);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                ...(searchTerm && { searchTerm }),
                ...(statusFilter && { status: statusFilter }),
            });

            const res = await fetch(`${API_URL}/batches?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success) {
                setBatches(data.data || []);
                setTotalPages(Math.ceil((data.meta?.total || 0) / 10));
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedBatch) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/batches/${selectedBatch._id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                fetchBatches();
                setShowDeleteModal(false);
                setSelectedBatch(null);
            }
        } catch (error) {
            console.error('Error deleting batch:', error);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            ongoing: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            completed: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
            cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        };
        return styles[status] || styles.upcoming;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Batch Management
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Manage course batches and student enrollments
                    </p>
                </div>
                <Link
                    href="/dashboard/admin/batch/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
                >
                    <FiPlus size={18} />
                    Create Batch
                </Link>
            </div>

            {/* Filters */}
            <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                            type="text"
                            placeholder="Search batches..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-md border font-normal ${isDark
                                ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`px-4 py-2.5 rounded-md border font-normal ${isDark
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                        <option value="">All Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className={`rounded-md border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={isDark ? 'bg-slate-700' : 'bg-gray-50'}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Batch Info
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Course
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Schedule
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Students
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Status
                                </th>
                                <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-200'}`}>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="px-6 py-4">
                                            <div className={`h-12 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                                        </td>
                                    </tr>
                                ))
                            ) : batches.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <FiBook className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                                        <p className={`mt-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            No batches found
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                batches.map((batch) => (
                                    <tr key={batch._id} className={`${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} transition-colors`}>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {batch.batchName}
                                                </p>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    Code: {batch.batchCode}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className={`font-normal ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {batch.course?.title || 'N/A'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <FiCalendar className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                                <span className={`text-sm font-normal ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <FiUsers className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                                <span className={`text-sm font-normal ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {batch.enrolledCount || 0} / {batch.maxStudents}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(batch.status)}`}>
                                                {batch.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/admin/batch/${batch._id}`}
                                                    className={`p-2 rounded-md transition-colors ${isDark ? 'hover:bg-slate-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                                                    title="View Details"
                                                >
                                                    <FiEye size={16} />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/admin/batch/${batch._id}/edit`}
                                                    className={`p-2 rounded-md transition-colors ${isDark ? 'hover:bg-slate-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setSelectedBatch(batch);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className={`p-2 rounded-md transition-colors text-red-500 ${isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={16} />
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
                    <div className={`px-6 py-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <p className={`text-sm font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Page {currentPage} of {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-md border transition-colors disabled:opacity-50 ${isDark
                                        ? 'border-slate-600 hover:bg-slate-700 text-gray-300'
                                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <FiChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-md border transition-colors disabled:opacity-50 ${isDark
                                        ? 'border-slate-600 hover:bg-slate-700 text-gray-300'
                                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <FiChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className={`w-full max-w-md p-6 rounded-md ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Delete Batch
                        </h3>
                        <p className={`mb-6 font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Are you sure you want to delete "{selectedBatch?.batchName}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className={`px-4 py-2 rounded-md border font-medium ${isDark
                                    ? 'border-slate-600 text-gray-300 hover:bg-slate-700'
                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
