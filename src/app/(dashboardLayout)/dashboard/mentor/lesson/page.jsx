'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiPlay, FiPlus, FiSearch, FiEdit2,
    FiEye, FiClock, FiBook, FiFilter, FiMoreVertical,
    FiVideo, FiRefreshCw, FiChevronLeft, FiChevronRight, FiAlertCircle
} from 'react-icons/fi';

export default function LessonsPage() {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    

    const fetchLessons = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/lessons`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            // Backend returns { success: true, data: [...], meta: {...} }
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



    const filteredLessons = lessons.filter(lesson =>
        lesson.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
    const paginatedLessons = filteredLessons.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-slate-800">All Lessons</h1>
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">Mentor</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1">Manage all your course lessons</p>
                </div>
                <Link
                    href="/dashboard/mentor/lesson/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                >
                    <FiPlus size={18} />
                    Add New Lesson
                </Link>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search lessons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={fetchLessons}
                        className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors"
                    >
                        <FiRefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lesson Info</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Course / Module</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <FiRefreshCw className="animate-spin mx-auto mb-2 text-indigo-500" size={24} />
                                        <p className="text-slate-500">Loading lessons...</p>
                                    </td>
                                </tr>
                            ) : paginatedLessons.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No lessons found
                                    </td>
                                </tr>
                            ) : (
                                paginatedLessons.map((lesson) => (
                                    <tr key={lesson._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                                                    <FiPlay size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800">{lesson.title}</h3>
                                                    <p className="text-sm text-slate-500 line-clamp-1">{lesson.description?.slice(0, 50)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold text-slate-700">{lesson.course?.title || 'N/A'}</span>
                                                <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                                                    Module: {lesson.module?.title || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <FiClock size={14} />
                                                <span className="text-sm">{lesson.videoDuration || 0} sec</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${lesson.isPublished
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {lesson.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/mentor/lesson/edit/${lesson._id}`}
                                                    className="p-2 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors"
                                                >
                                                    <FiEdit2 size={16} />
                                                </Link>
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
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLessons.length)} of {filteredLessons.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                            >
                                <FiChevronLeft size={16} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
                                        ? 'bg-indigo-600 text-white'
                                        : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                            >
                                <FiChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>


            {/* Mentor Notice */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <FiAlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-amber-800">
                    <span className="font-semibold">Note:</span> As a Mentor, you can create and edit lessons but cannot delete them. Contact an Administrator for deletion requests.
                </p>
            </div>
        </div>
    );
}

