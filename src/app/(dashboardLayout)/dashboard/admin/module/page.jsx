'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiLayers, FiSearch, FiEdit2, FiTrash2,
    FiRefreshCw, FiChevronLeft, FiChevronRight, FiBook, FiExternalLink
} from 'react-icons/fi';
import { API_URL } from '@/config/api';

export default function AllModulesPage() {
    const [modules, setModules] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const coursesRes = await fetch(`${API_URL}/courses`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const coursesData = await coursesRes.json();
            setCourses(coursesData.data || []);

            const allModules = [];
            for (const course of (coursesData.data || [])) {
                const modulesRes = await fetch(`${API_URL}/modules/course/${course._id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const modulesData = await modulesRes.json();
                const modulesWithCourse = (modulesData.data || []).map(mod => ({
                    ...mod,
                    courseName: course.title,
                    courseId: course._id
                }));
                allModules.push(...modulesWithCourse);
            }
            setModules(allModules);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this module?')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/modules/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                fetchData();
            } else {
                const result = await res.json();
                alert(result.message || 'Delete failed');
            }
        } catch (error) {
            alert('Network error');
        }
    };

    const filteredModules = modules.filter(mod => {
        const matchesSearch = mod.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mod.courseName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = !selectedCourse || mod.courseId === selectedCourse;
        return matchesSearch && matchesCourse;
    });

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredModules.length / itemsPerPage);
    const paginatedModules = filteredModules.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">All Modules</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage course modules across your platform</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md text-sm font-medium">
                        {modules.length} Total
                    </span>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <FiRefreshCw size={18} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search modules..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                        />
                    </div>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors min-w-[180px]"
                    >
                        <option value="">All Courses</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>{course.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Module</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Course</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Order</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center">
                                        <FiRefreshCw className="animate-spin mx-auto mb-2 text-indigo-500" size={24} />
                                        <p className="text-sm text-gray-500">Loading modules...</p>
                                    </td>
                                </tr>
                            ) : paginatedModules.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                                        <FiLayers className="mx-auto mb-2 text-gray-300" size={32} />
                                        <p className="text-sm">No modules found</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedModules.map((mod) => (
                                    <tr key={mod._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                                    {mod.order}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{mod.title}</h3>
                                                    <p className="text-xs text-gray-500">{mod.titleBn || 'No Bengali title'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/dashboard/admin/course/modules/${mod.courseId}`}
                                                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 text-sm font-medium"
                                            >
                                                <FiBook size={14} />
                                                {mod.courseName}
                                                <FiExternalLink size={12} />
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium">
                                                #{mod.order}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${mod.isPublished !== false
                                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${mod.isPublished !== false ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                {mod.isPublished !== false ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/admin/module/edit/${mod._id}`}
                                                    className="p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-500 hover:text-indigo-600 transition-colors"
                                                >
                                                    <FiEdit2 size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(mod._id)}
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
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredModules.length)} of {filteredModules.length}
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

            {/* Info Card */}
            <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-md border border-indigo-100 dark:border-indigo-500/20 p-4">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md bg-indigo-500 flex items-center justify-center text-white shrink-0">
                        <FiLayers size={20} />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">Managing Modules</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Modules are sections within a course. To create or edit modules, go to the specific course's
                            <strong className="text-indigo-600 dark:text-indigo-400"> Modules </strong> page by clicking on the course name in the table above,
                            or navigate to <strong>All Courses → Modules</strong> button.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
