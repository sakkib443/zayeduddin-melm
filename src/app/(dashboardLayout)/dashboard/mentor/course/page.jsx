'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    FiEdit2,
    FiPlus,
    FiSearch,
    FiBook,
    FiStar,
    FiFilter,
    FiGrid,
    FiList,
    FiUsers,
    FiLayers,
    FiRefreshCw,
    FiCheckCircle,
    FiClock,
    FiDollarSign,
    FiAlertCircle,
} from 'react-icons/fi';

export default function MentorCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');

    const loadCourses = async () => {
        
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/courses`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setCourses(data.data || []);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    const filtered = courses.filter((c) =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.instructorName?.toLowerCase().includes(search.toLowerCase())
    );

    // Stats
    const stats = {
        total: courses.length,
        published: courses.filter(c => c.status === 'published').length,
        draft: courses.filter(c => c.status === 'draft').length,
        totalEnrollments: courses.reduce((sum, c) => sum + (c.totalEnrollments || 0), 0),
    };

    // Loading Skeleton
    const CourseSkeleton = () => (
        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
            <div className="h-44 bg-slate-100 animate-pulse"></div>
            <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2"></div>
                <div className="flex gap-2 pt-2">
                    <div className="h-8 bg-slate-100 rounded-xl animate-pulse flex-1"></div>
                    <div className="h-8 bg-slate-100 rounded-xl animate-pulse flex-1"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                        <FiBook className="text-white text-xl" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-800">Course Management</h1>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                                Mentor
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">Create and edit platform courses</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={loadCourses}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Reload
                    </button>
                    <Link href="/dashboard/mentor/course/create">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-amber-500/25 transition-all">
                            <FiPlus size={16} />
                            New Course
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Total Courses */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-500 opacity-10 rounded-full blur-2xl" />
                        <div className="relative flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Courses</p>
                                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.total}</p>
                                <p className="text-xs text-slate-400 mb-2">All registered courses</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <FiBook className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Published */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-emerald-500 to-red-500 opacity-10 rounded-full blur-2xl" />
                        <div className="relative flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Published</p>
                                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.published}</p>
                                <p className="text-xs text-slate-400 mb-2">Live courses</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-red-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <FiCheckCircle className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Draft */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-500/20 to-slate-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-slate-500 to-slate-600 opacity-10 rounded-full blur-2xl" />
                        <div className="relative flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Draft</p>
                                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.draft}</p>
                                <p className="text-xs text-slate-400 mb-2">Unpublished</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <FiClock className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Enrollments */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-10 rounded-full blur-2xl" />
                        <div className="relative flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Enrollments</p>
                                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.totalEnrollments}</p>
                                <p className="text-xs text-slate-400 mb-2">Active learners</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <FiUsers className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition-all"
                    />
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}><FiGrid size={18} /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}><FiList size={18} /></button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => <CourseSkeleton key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiBook className="text-2xl text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Catalogue Empty</h3>
                    <p className="text-slate-500 text-sm mt-1">Start by clicking &quot;New Course&quot;</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map((course) => (
                        <div key={course._id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="relative h-44 overflow-hidden bg-slate-100">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><FiBook size={40} /></div>
                                )}
                                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur text-slate-800 text-[10px] font-bold uppercase rounded-md shadow-sm">
                                    {course.courseType}
                                </div>
                                <div className="absolute bottom-3 right-3 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg">
                                    ?{(course.discountPrice || course.price).toLocaleString()}
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-3 min-h-[40px] leading-relaxed">{course.title}</h3>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg uppercase">{course.level}</span>
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase">{course.language}</span>
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                                        <FiUsers size={12} /> {course.totalEnrollments || 0} Students
                                    </div>
                                    <div className="flex items-center gap-1 font-bold text-amber-500">
                                        <FiStar size={12} fill="currentColor" /> {course.averageRating || 5.0}
                                    </div>
                                </div>
                            </div>

                            {/* Mentor Actions - NO DELETE BUTTON */}
                            <div className="flex border-t border-slate-100 bg-slate-50/50">
                                <Link
                                    href={`/dashboard/mentor/course/modules/${course._id}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 text-indigo-600 hover:text-indigo-900 hover:bg-white text-xs font-bold transition-all"
                                >
                                    <FiLayers size={13} /> Modules
                                </Link>
                                <div className="w-px bg-slate-100 h-10 self-center"></div>
                                <Link
                                    href={`/dashboard/mentor/course/edit/${course._id}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 text-slate-600 hover:text-slate-900 hover:bg-white text-xs font-bold transition-all"
                                >
                                    <FiEdit2 size={13} /> Edit
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {filtered.map((course) => (
                        <div key={course._id} className="flex items-center gap-5 p-4 hover:bg-slate-50 transition-colors">
                            <div className="w-24 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                                <img src={course.thumbnail} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[13px] font-bold text-slate-800 truncate">{course.title}</h3>
                                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                                    <span className="uppercase font-bold text-[9px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 tracking-wider font-work">{course.courseType}</span>
                                    <span>{course.level}</span>
                                    <span>{course.language}</span>
                                </p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-sm font-black text-slate-800">?{course.price.toLocaleString()}</p>
                                <p className="text-[11px] text-slate-400">{course.totalEnrollments || 0} enrolled</p>
                            </div>
                            {/* Mentor Actions - NO DELETE BUTTON */}
                            <div className="flex gap-2">
                                <Link href={`/dashboard/mentor/course/modules/${course._id}`} className="p-2.5 bg-indigo-50 text-indigo-500 hover:text-indigo-800 hover:bg-white border border-indigo-100 rounded-xl shadow-sm transition-all" title="Manage Modules"><FiLayers size={15} /></Link>
                                <Link href={`/dashboard/mentor/course/edit/${course._id}`} className="p-2.5 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-white border border-slate-100 rounded-xl shadow-sm transition-all"><FiEdit2 size={15} /></Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Notice for Mentor */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <FiAlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-amber-800">
                    <span className="font-semibold">Note:</span> As a Mentor, you can create and edit courses but cannot delete them. Contact an Administrator for deletion requests.
                </p>
            </div>
        </div>
    );
}

