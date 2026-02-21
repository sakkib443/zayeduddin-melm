'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
    FiPlay, FiPlus, FiEdit2, FiTrash2,
    FiClock, FiLayers, FiRefreshCw, FiChevronLeft,
    FiArrowRight, FiCheckCircle, FiEye, FiEyeOff,
    FiFileText, FiHelpCircle, FiBook, FiX
} from 'react-icons/fi';
import { API_URL, API_BASE_URL } from '@/config/api';

export default function ModuleLessonsPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const moduleId = params.id;
    const [moduleData, setModuleData] = useState(null);
    const [courseData, setCourseData] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, title: '' });

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            // Fetch all lessons and filter by moduleId
            const lessonsRes = await fetch(`${API_URL}/lessons`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const lessonsData = await lessonsRes.json();
            const allLessons = lessonsData.data || [];

            // Filter lessons for this module
            const moduleLessons = allLessons.filter(lesson => {
                const lessonModuleId = typeof lesson.module === 'object' ? lesson.module?._id : lesson.module;
                return lessonModuleId === moduleId;
            });

            // Sort by order
            moduleLessons.sort((a, b) => (a.order || 0) - (b.order || 0));
            setLessons(moduleLessons);

            // Get module & course info from first lesson or fetch separately
            if (moduleLessons.length > 0) {
                const firstLesson = moduleLessons[0];
                if (typeof firstLesson.module === 'object') {
                    setModuleData(firstLesson.module);
                }
                if (typeof firstLesson.course === 'object') {
                    setCourseData(firstLesson.course);
                }
            }

            // If module data not available from lessons, try fetching it
            if (!moduleData) {
                try {
                    const moduleRes = await fetch(`${API_BASE_URL}/modules/${moduleId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const modData = await moduleRes.json();
                    if (modData.data) {
                        setModuleData(modData.data);
                        // Also fetch course data
                        if (modData.data.course) {
                            const courseId = typeof modData.data.course === 'object' ? modData.data.course._id : modData.data.course;
                            const courseRes = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            const cData = await courseRes.json();
                            if (cData.data) setCourseData(cData.data);
                        }
                    }
                } catch (e) {
                    console.error('Error fetching module:', e);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [moduleId]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/lessons/${deleteModal.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDeleteModal({ show: false, id: null, title: '' });
            fetchData();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0m';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m ${secs}s`;
    };

    const getLessonTypeIcon = (type) => {
        switch (type) {
            case 'video': return <FiPlay size={14} />;
            case 'text': return <FiFileText size={14} />;
            case 'quiz': return <FiHelpCircle size={14} />;
            case 'mixed': return <FiLayers size={14} />;
            default: return <FiPlay size={14} />;
        }
    };

    const getLessonTypeBadge = (type) => {
        const config = {
            video: { label: 'Video', bg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
            text: { label: 'Text', bg: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' },
            quiz: { label: 'Quiz', bg: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' },
            mixed: { label: 'Mixed', bg: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' },
        };
        const c = config[type] || config.video;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${c.bg}`}>
                {getLessonTypeIcon(type)}
                {c.label}
            </span>
        );
    };

    const stats = {
        total: lessons.length,
        published: lessons.filter(l => l.isPublished).length,
        draft: lessons.filter(l => !l.isPublished).length,
        totalDuration: lessons.reduce((sum, l) => sum + (l.videoDuration || 0), 0)
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <FiRefreshCw className="animate-spin text-emerald-600" size={28} />
                <p className="text-sm text-slate-500">Loading lessons...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                <Link href="/dashboard/admin/module" className="hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                    <FiChevronLeft size={14} />
                    All Modules
                </Link>
                <FiArrowRight size={12} className="text-slate-300" />
                {courseData && (
                    <>
                        <span className="text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{courseData.title}</span>
                        <FiArrowRight size={12} className="text-slate-300" />
                    </>
                )}
                <span className="text-slate-800 dark:text-white font-medium truncate max-w-[200px]">{moduleData?.title || 'Module'}</span>
                <FiArrowRight size={12} className="text-slate-300" />
                <span className="text-emerald-600 font-medium">Lessons</span>
            </div>

            {/* Page Header */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                            <FiPlay className="text-white" size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Module Lessons</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                <span className="text-emerald-600 font-medium">{moduleData?.title || 'Module'}</span>
                                {moduleData?.order && <span> &bull; Order #{moduleData.order}</span>}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                            title="Refresh"
                        >
                            <FiRefreshCw size={16} className={`text-slate-500 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <Link href="/dashboard/admin/lesson/create">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#021E14] hover:bg-[#01140D] text-white font-medium text-sm rounded-lg shadow-md shadow-[#021E14]/15 transition-all active:scale-[0.97]">
                                <FiPlus size={16} />
                                Add Lesson
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                            <FiPlay className="text-emerald-600" size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Total Lessons</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <FiCheckCircle className="text-blue-600" size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Published</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.published}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                            <FiClock className="text-amber-600" size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Total Duration</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatDuration(stats.totalDuration)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                            <FiEyeOff className="text-slate-500" size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Drafts</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.draft}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lessons Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">#</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Lesson</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Type</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Duration</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {lessons.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-16 text-center">
                                        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <FiPlay className="text-slate-300 dark:text-slate-500" size={24} />
                                        </div>
                                        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">No Lessons Found</h3>
                                        <p className="text-sm text-slate-400 mt-1 mb-4">This module doesn't have any lessons yet.</p>
                                        <Link href="/dashboard/admin/lesson/create">
                                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#021E14] hover:bg-[#01140D] text-white text-sm font-medium rounded-lg transition-all">
                                                <FiPlus size={14} />
                                                Add First Lesson
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ) : (
                                lessons.map((lesson) => (
                                    <tr key={lesson._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center justify-center font-bold text-xs">
                                                {lesson.order || '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-800 dark:text-white">{lesson.title}</h3>
                                                {lesson.titleBn && (
                                                    <p className="text-xs text-slate-400 mt-0.5">{lesson.titleBn}</p>
                                                )}
                                                {lesson.description && (
                                                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[300px]">{lesson.description.slice(0, 60)}...</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {getLessonTypeBadge(lesson.lessonType)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                                <FiClock size={13} />
                                                <span className="text-sm">{lesson.videoDuration ? formatDuration(lesson.videoDuration) : '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${lesson.isPublished
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                                }`}>
                                                {lesson.isPublished ? <FiEye size={12} /> : <FiEyeOff size={12} />}
                                                {lesson.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/admin/lesson/edit/${lesson._id}`}
                                                    className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/10 text-slate-400 hover:text-emerald-600 transition-colors"
                                                    title="Edit Lesson"
                                                >
                                                    <FiEdit2 size={15} />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteModal({ show: true, id: lesson._id, title: lesson.title })}
                                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Delete Lesson"
                                                >
                                                    <FiTrash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                {lessons.length > 0 && (
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">{lessons.length}</span> lesson{lessons.length !== 1 ? 's' : ''} in this module
                        </p>
                        <p className="text-xs text-slate-400">
                            Total duration: <span className="font-semibold text-slate-600 dark:text-slate-300">{formatDuration(stats.totalDuration)}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteModal({ show: false, id: null, title: '' })}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                                <FiTrash2 className="text-red-500" size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete Lesson</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                            Are you sure you want to delete <span className="font-medium text-slate-900 dark:text-white">"{deleteModal.title}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDeleteModal({ show: false, id: null, title: '' })}
                                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
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
