'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
    FiPlus, FiEdit2, FiTrash2, FiChevronLeft,
    FiLayers, FiMove, FiCheck, FiX, FiRefreshCw,
    FiBook, FiMonitor, FiLayout
} from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';

export default function CourseModulesPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const courseId = params.id;
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Modal state for Add/Edit
    const [modal, setModal] = useState({
        show: false,
        type: 'add', // 'add' or 'edit'
        data: { title: '', titleBn: '', description: '', order: 1 }
    });

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            // Fetch Course
            const courseRes = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const courseData = await courseRes.json();
            setCourse(courseData.data);

            // Fetch Modules
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
                    order: data.order || modules.length + 1
                }
            });
        } else {
            setModal({
                show: true,
                type: 'add',
                data: { title: '', titleBn: '', description: '', order: modules.length + 1 }
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
        if (!confirm('Are you sure? This won\'t delete lessons but they will lose their module reference.')) return;

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
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <FiRefreshCw className="animate-spin text-indigo-500" size={40} />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Synchronizing curriculum...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10 min-h-screen bg-slate-50 dark:bg-slate-950">

            {/* Context Header */}
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/dashboard/admin/course" className="group flex items-center gap-3 text-slate-400 hover:text-indigo-500 transition-all text-[10px] font-black uppercase tracking-[0.2em]">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <FiChevronLeft />
                    </div>
                    Navigate back to academic inventory
                </Link>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-500/5">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-500/20">
                            <FiLayers className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2">Curriculum Architect</h1>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Series:</span>
                                <span className="text-sm font-black text-indigo-500 uppercase tracking-tight line-clamp-1">{course?.title}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal('add')}
                        className="flex items-center justify-center gap-4 px-10 py-5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-500/10 transition-all active:scale-95 group"
                    >
                        <FiPlus size={22} className="group-hover:rotate-90 transition-transform" />
                        Deploy New Module
                    </button>
                </div>
            </div>

            {/* Modules Visualization */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl shadow-indigo-500/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                            <FiBook size={18} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Knowledge Architecture</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active System</span>
                    </div>
                </div>

                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {modules.length === 0 ? (
                        <div className="py-32 text-center px-6">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-dashed border-slate-200 dark:border-slate-700">
                                <FiLayers className="text-slate-200 dark:text-slate-600 text-3xl" />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Structural Vacuum</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Initialize your curriculum by deploying the first module above.</p>
                        </div>
                    ) : (
                        modules.map((mod, index) => (
                            <div key={mod._id} className="group flex flex-col md:flex-row md:items-center gap-8 p-8 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all animate-in slide-in-from-left-4" style={{ animationDelay: `${index * 50}ms` }}>
                                <div className="flex items-center gap-6">
                                    <div className="relative shrink-0">
                                        <div className="w-16 h-16 bg-slate-900 dark:bg-indigo-600 rounded-[1.2rem] flex items-center justify-center text-white font-black text-xl shadow-xl transition-all group-hover:scale-110 group-hover:rotate-3">
                                            {mod.order}
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-black">
                                            #{index + 1}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight uppercase group-hover:text-indigo-500 transition-colors leading-none">{mod.title}</h3>
                                            {!mod.isPublished && (
                                                <span className="px-3 py-1 bg-amber-500 text-white text-[8px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-amber-500/20">Staging</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-xs font-black text-indigo-400 dark:text-indigo-500 opacity-60 uppercase tracking-widest italic">{mod.titleBn || 'UNTITLED_LANG_BN'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 md:px-10">
                                    {mod.description ? (
                                        <p className="text-xs text-slate-400 font-bold leading-relaxed line-clamp-2 italic uppercase tracking-tight mt-1">{mod.description}</p>
                                    ) : (
                                        <div className="h-px bg-slate-50 dark:bg-slate-800/50 w-full opacity-50"></div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 md:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                    <button
                                        onClick={() => handleOpenModal('edit', mod)}
                                        className="h-14 w-14 bg-white dark:bg-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-indigo-600 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center shadow-sm transition-all active:scale-90"
                                        title="Modify Configuration"
                                    >
                                        <FiEdit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(mod._id)}
                                        className="h-14 w-14 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 rounded-2xl flex items-center justify-center shadow-sm transition-all active:scale-90"
                                        title="Purge Component"
                                    >
                                        <FiTrash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Dynamic Configuration Space (Modal) */}
            {modal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 lg:p-10 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-slate-900 h-full w-full max-w-xl rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-right duration-500 flex flex-col relative border border-white/10">

                        {/* Modal Header */}
                        <div className="p-10 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                                    {modal.type === 'add' ? <FiPlus size={28} /> : <FiEdit2 size={28} />}
                                </div>
                                <button onClick={handleCloseModal} className="w-14 h-14 bg-white dark:bg-slate-800 hover:bg-rose-500 hover:text-white rounded-2xl flex items-center justify-center text-slate-400 transition-all shadow-xl active:scale-90"><FiX size={24} /></button>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{modal.type === 'add' ? 'Deploy Module' : 'Modify Component'}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Configure structural unit parameters</p>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <form onSubmit={handleSubmit} className="p-10 space-y-10 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Primary Identifier (EN)</label>
                                    <input
                                        required
                                        value={modal.data.title}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, title: e.target.value } })}
                                        className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-800 dark:text-white tracking-tight"
                                        placeholder="e.g. Advanced System Patterns"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Local Identifier (BN)</label>
                                    <input
                                        value={modal.data.titleBn}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, titleBn: e.target.value } })}
                                        className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 dark:text-white"
                                        placeholder="মডিউলের বাংলা নাম..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Index Order</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={modal.data.order}
                                            onChange={(e) => setModal({ ...modal, data: { ...modal.data, order: Number(e.target.value) } })}
                                            className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 group">Status Control</label>
                                        <div
                                            onClick={() => setModal({ ...modal, data: { ...modal.data, isPublished: modal.data.isPublished === false ? true : false } })}
                                            className={`h-[68px] flex items-center justify-between px-6 rounded-3xl border transition-all cursor-pointer group ${modal.data.isPublished !== false ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
                                        >
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${modal.data.isPublished !== false ? 'text-white' : 'text-slate-500'}`}>{modal.data.isPublished !== false ? 'Public' : 'Staged'}</span>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${modal.data.isPublished !== false ? 'bg-white text-emerald-500 scale-110' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                                                {modal.data.isPublished !== false ? <FiCheck /> : <FiMonitor />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Component Payload (Context)</label>
                                    <textarea
                                        rows="4"
                                        value={modal.data.description}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, description: e.target.value } })}
                                        className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-sm text-slate-700 dark:text-slate-300 resize-none leading-relaxed"
                                        placeholder="Define the scope and objectives of this module..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-8 py-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-[1.5rem] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] flex items-center justify-center gap-4 px-8 py-5 bg-slate-900 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-purple-600 hover:scale-[1.02] disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl transition-all active:scale-95"
                                >
                                    {submitting ? <FiRefreshCw className="animate-spin" size={20} /> : <FiCheck size={20} />}
                                    {modal.type === 'add' ? 'Commit Module' : 'Update Component'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
