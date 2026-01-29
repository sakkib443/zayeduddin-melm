'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiPlay, FiPlus, FiSearch, FiEdit2, FiTrash2,
    FiClock, FiBook, FiRefreshCw, FiChevronLeft, FiChevronRight,
    FiLayers, FiCheckCircle, FiX
} from 'react-icons/fi';
import { API_URL } from '@/config/api';

export default function LessonsPage() {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, title: '' });

    const fetchLessons = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/lessons`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setLessons(data.data || []);
        } catch (err) {
            console.error('Error fetching lessons:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLessons();
    }, []);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/lessons/${deleteModal.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDeleteModal({ show: false, id: null, title: '' });
            fetchLessons();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const filteredLessons = lessons.filter(lesson =>
        lesson.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
    const paginatedLessons = filteredLessons.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const stats = {
        total: lessons.length,
        published: lessons.filter(l => l.isPublished).length,
        draft: lessons.filter(l => !l.isPublished).length,
        totalDuration: lessons.reduce((sum, l) => sum + (l.videoDuration || 0), 0)
    };

    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m ${secs}s`;
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Lessons</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all course lessons</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchLessons}
                        disabled={loading}
                        className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <FiRefreshCw size={18} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <Link href="/dashboard/admin/lesson/create">
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors">
                            <FiPlus size={18} />
                            Add Lesson
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-md flex items-center justify-center">
                            <FiPlay className="text-indigo-600 dark:text-indigo-400" size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Lessons</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-md flex items-center justify-center">
                            <FiCheckCircle className="text-emerald-600 dark:text-emerald-400" size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Published</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.published}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-md flex items-center justify-center">
                            <FiClock className="text-amber-600 dark:text-amber-400" size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Duration</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDuration(stats.totalDuration)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-slate-700 rounded-md flex items-center justify-center">
                            <FiLayers className="text-gray-600 dark:text-gray-400" size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Drafts</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.draft}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search lessons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Lesson</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Course / Module</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Duration</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center">
                                        <FiRefreshCw className="animate-spin mx-auto mb-2 text-indigo-500" size={24} />
                                        <p className="text-sm text-gray-500">Loading lessons...</p>
                                    </td>
                                </tr>
                            ) : paginatedLessons.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                                        <FiPlay className="mx-auto mb-2 text-gray-300" size={32} />
                                        <p className="text-sm">No lessons found</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedLessons.map((lesson) => (
                                    <tr key={lesson._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                                                    <FiPlay size={16} className={lesson.isPublished ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'} />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{lesson.title}</h3>
                                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{lesson.description?.slice(0, 50) || 'No description'}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <FiBook className="text-indigo-500" size={12} />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">{lesson.course?.title || 'No course'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FiLayers className="text-gray-400" size={12} />
                                                    <span className="text-xs text-gray-500">{lesson.module?.title || 'No module'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <FiClock size={14} />
                                                <span className="text-sm">{lesson.videoDuration ? formatDuration(lesson.videoDuration) : '0m 0s'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${lesson.isPublished
                                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${lesson.isPublished ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                                {lesson.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/admin/lesson/edit/${lesson._id}`}
                                                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 hover:text-indigo-600 transition-colors"
                                                >
                                                    <FiEdit2 size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteModal({ show: true, id: lesson._id, title: lesson.title })}
                                                    className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-500 hover:text-red-600 transition-colors"
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
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-slate-700">
                        <p className="text-sm text-gray-500">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLessons.length)} of {filteredLessons.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                            >
                                <FiChevronLeft size={16} />
                            </button>
                            {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${currentPage === i + 1
                                        ? 'bg-indigo-600 text-white'
                                        : 'border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-md border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                            >
                                <FiChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-md p-6 w-full max-w-md border border-gray-200 dark:border-slate-700 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-md flex items-center justify-center">
                                <FiTrash2 className="text-red-600" size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Lesson</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Are you sure you want to delete <span className="font-medium text-gray-900 dark:text-white">"{deleteModal.title}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDeleteModal({ show: false, id: null, title: '' })}
                                className="flex-1 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
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
