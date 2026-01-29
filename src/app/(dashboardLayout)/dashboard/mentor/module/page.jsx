'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiLayers, FiPlus, FiSearch, FiEdit2,
    FiRefreshCw, FiChevronLeft, FiChevronRight, FiBook, FiExternalLink, FiAlertCircle
} from 'react-icons/fi';

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
            // Fetch all courses first
            const coursesRes = await fetch(`${BASE_URL}/courses`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const coursesData = await coursesRes.json();
            setCourses(coursesData.data || []);

            // Fetch modules for each course and combine
            const allModules = [];
            for (const course of (coursesData.data || [])) {
                const modulesRes = await fetch(`${BASE_URL}/modules/course/${course._id}`, {
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-slate-800">All Modules</h1>
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">Mentor</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1">Manage course modules across your platform</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold">
                        {modules.length} Total Modules
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search modules..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all min-w-[200px]"
                    >
                        <option value="">All Courses</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>{course.title}</option>
                        ))}
                    </select>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors"
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
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
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Module</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <FiRefreshCw className="animate-spin mx-auto mb-2 text-indigo-500" size={24} />
                                        <p className="text-slate-500">Loading modules...</p>
                                    </td>
                                </tr>
                            ) : paginatedModules.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No modules found
                                    </td>
                                </tr>
                            ) : (
                                paginatedModules.map((mod) => (
                                    <tr key={mod._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                                    {mod.order}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800">{mod.title}</h3>
                                                    <p className="text-sm text-slate-500">{mod.titleBn || 'No Bengali title'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/dashboard/mentor/course/modules/${mod.courseId}`}
                                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                                            >
                                                <FiBook size={14} />
                                                {mod.courseName}
                                                <FiExternalLink size={12} />
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">
                                                #{mod.order}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${mod.isPublished !== false
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {mod.isPublished !== false ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/mentor/module/edit/${mod._id}`}
                                                    className="p-2 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors"
                                                    title="Edit Module"
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
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredModules.length)} of {filteredModules.length}
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

            {/* Info Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shrink-0">
                        <FiLayers size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 mb-1">Managing Modules</h3>
                        <p className="text-sm text-slate-600">
                            Modules are sections within a course. To create or edit modules, go to the specific course's
                            <strong className="text-indigo-600"> Modules </strong> page by clicking on the course name in the table above,
                            or navigate to <strong>All Courses ? Modules</strong> button.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

