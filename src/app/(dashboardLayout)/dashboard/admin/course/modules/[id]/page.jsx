'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
    FiPlus, FiEdit2, FiTrash2, FiChevronLeft,
    FiLayers, FiCheck, FiX, FiRefreshCw,
    FiBook, FiEye, FiEyeOff, FiHash, FiArrowRight
} from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';

export default function CourseModulesPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const courseId = params.id;
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [modal, setModal] = useState({
        show: false,
        type: 'add',
        data: { title: '', titleBn: '', description: '', order: 1 }
    });

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const courseRes = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const courseData = await courseRes.json();
            setCourse(courseData.data);

            const modulesRes = await fetch(`${API_BASE_URL}/modules/course/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const modulesData = await modulesRes.json();
            setModules(modulesData.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const handleOpenModal = (type, data = null) => {
        if (type === 'edit' && data) {
            setModal({
                show: true,
                type: 'edit',
                data: {
                    _id: data._id,
                    title: data.title || '',
                    titleBn: data.titleBn || '',
                    description: data.description || '',
                    order: data.order || modules.length + 1,
                    isPublished: data.isPublished !== false
                }
            });
        } else {
            setModal({
                show: true,
                type: 'add',
                data: { title: '', titleBn: '', description: '', order: modules.length + 1, isPublished: true }
            });
        }
    };

    const handleCloseModal = () => {
        setModal({ ...modal, show: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            const url = modal.type === 'add'
                ? `${API_BASE_URL}/modules`
                : `${API_BASE_URL}/modules/${modal.data._id}`;

            const method = modal.type === 'add' ? 'POST' : 'PATCH';
            const body = modal.type === 'add'
                ? { ...modal.data, course: courseId }
                : modal.data;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const result = await res.json();

            if (res.ok) {
                handleCloseModal();
                fetchData();
            } else {
                alert(result.message || 'Operation failed');
            }
        } catch (error) {
            alert('Network error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this module? Lessons will lose their module reference.')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/modules/${id}`, {
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

    if (loading && !modules.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <FiRefreshCw className="animate-spin text-emerald-600" size={28} />
                <p className="text-sm text-slate-500">Loading modules...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Link href="/dashboard/admin/course" className="hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                    <FiChevronLeft size={14} />
                    All Courses
                </Link>
                <FiArrowRight size={12} className="text-slate-300" />
                <span className="text-slate-800 dark:text-white font-medium truncate max-w-[300px]">{course?.title || 'Course'}</span>
                <FiArrowRight size={12} className="text-slate-300" />
                <span className="text-emerald-600 font-medium">Modules</span>
            </div>

            {/* Page Header */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                            <FiLayers className="text-white" size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Course Modules</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                {course?.title || 'Loading...'} &bull; <span className="text-emerald-600 font-medium">{modules.length} module{modules.length !== 1 ? 's' : ''}</span>
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
                        <button
                            onClick={() => handleOpenModal('add')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#021E14] hover:bg-[#01140D] text-white font-medium text-sm rounded-lg shadow-md shadow-[#021E14]/15 transition-all active:scale-[0.97]"
                        >
                            <FiPlus size={16} />
                            Add Module
                        </button>
                    </div>
                </div>
            </div>

            {/* Modules List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                    <div className="col-span-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">#</div>
                    <div className="col-span-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Module Name</div>
                    <div className="col-span-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Description</div>
                    <div className="col-span-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</div>
                    <div className="col-span-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-right">Actions</div>
                </div>

                {/* Module Rows */}
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {modules.length === 0 ? (
                        <div className="py-20 text-center px-6">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FiLayers className="text-slate-300 dark:text-slate-500" size={28} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No Modules Yet</h3>
                            <p className="text-sm text-slate-400 mt-1 mb-5">Get started by adding the first module to this course.</p>
                            <button
                                onClick={() => handleOpenModal('add')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#021E14] hover:bg-[#01140D] text-white text-sm font-medium rounded-lg transition-all"
                            >
                                <FiPlus size={16} />
                                Add First Module
                            </button>
                        </div>
                    ) : (
                        modules.map((mod, index) => (
                            <div key={mod._id} className="group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center p-4 md:px-6 md:py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                {/* Order Number */}
                                <div className="col-span-1 hidden md:flex">
                                    <span className="w-9 h-9 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center justify-center font-bold text-sm">
                                        {mod.order}
                                    </span>
                                </div>

                                {/* Title */}
                                <div className="col-span-4">
                                    <div className="flex items-center gap-3">
                                        <span className="md:hidden w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                                            {mod.order}
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-semibold text-slate-800 dark:text-white truncate">{mod.title}</h3>
                                            {mod.titleBn && (
                                                <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{mod.titleBn}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="col-span-3 hidden md:block">
                                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                        {mod.description || <span className="italic text-slate-300">No description</span>}
                                    </p>
                                </div>

                                {/* Status */}
                                <div className="col-span-2 hidden md:flex">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${mod.isPublished !== false
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                                        }`}>
                                        {mod.isPublished !== false ? <FiEye size={12} /> : <FiEyeOff size={12} />}
                                        {mod.isPublished !== false ? 'Published' : 'Draft'}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-2 flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleOpenModal('edit', mod)}
                                        className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/10 text-slate-400 hover:text-emerald-600 transition-colors"
                                        title="Edit Module"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(mod._id)}
                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-slate-400 hover:text-red-500 transition-colors"
                                        title="Delete Module"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Stats */}
                {modules.length > 0 && (
                    <div className="px-6 py-3 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                            Showing <span className="font-semibold text-slate-600 dark:text-slate-300">{modules.length}</span> module{modules.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                {modules.filter(m => m.isPublished !== false).length} Published
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                {modules.filter(m => m.isPublished === false).length} Draft
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {modal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal}>
                    <div
                        className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-[#021E14] flex items-center justify-center text-white">
                                    {modal.type === 'add' ? <FiPlus size={18} /> : <FiEdit2 size={18} />}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-white text-base">
                                        {modal.type === 'add' ? 'Add New Module' : 'Edit Module'}
                                    </h3>
                                    <p className="text-xs text-slate-400">{course?.title}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Title EN */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Module Title (English) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    value={modal.data.title}
                                    onChange={(e) => setModal({ ...modal, data: { ...modal.data, title: e.target.value } })}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                                    placeholder="e.g. Getting Started with React"
                                />
                            </div>

                            {/* Title BN */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Module Title (বাংলা) <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    value={modal.data.titleBn}
                                    onChange={(e) => setModal({ ...modal, data: { ...modal.data, titleBn: e.target.value } })}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                                    placeholder="মডিউলের বাংলা নাম..."
                                />
                            </div>

                            {/* Order & Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Order <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={modal.data.order}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, order: Number(e.target.value) } })}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                                    <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5 h-[42px]">
                                        <button
                                            type="button"
                                            onClick={() => setModal({ ...modal, data: { ...modal.data, isPublished: true } })}
                                            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-all ${modal.data.isPublished !== false
                                                    ? 'bg-[#021E14] text-white shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-700'
                                                }`}
                                        >
                                            <FiEye size={13} />
                                            Published
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setModal({ ...modal, data: { ...modal.data, isPublished: false } })}
                                            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-all ${modal.data.isPublished === false
                                                    ? 'bg-slate-600 text-white shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-700'
                                                }`}
                                        >
                                            <FiEyeOff size={13} />
                                            Draft
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Description <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                                </label>
                                <textarea
                                    rows="3"
                                    value={modal.data.description}
                                    onChange={(e) => setModal({ ...modal, data: { ...modal.data, description: e.target.value } })}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all resize-none"
                                    placeholder="Brief description of this module..."
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-medium text-sm rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-[#021E14] hover:bg-[#01140D] disabled:opacity-50 text-white font-medium text-sm rounded-lg shadow-md shadow-[#021E14]/15 transition-all"
                                >
                                    {submitting ? <FiRefreshCw className="animate-spin" size={16} /> : <FiCheck size={16} />}
                                    {modal.type === 'add' ? 'Add Module' : 'Update Module'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
