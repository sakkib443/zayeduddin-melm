'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import {
    FiLayers, FiArrowLeft, FiSave, FiBook, FiPlus, FiCheck, FiChevronDown, FiChevronUp
} from 'react-icons/fi';

const inputBase = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all";
const selectBase = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function CreateModulePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingModule, setFetchingModule] = useState(false);
    const [createdModules, setCreatedModules] = useState([]);
    const [showCreatedList, setShowCreatedList] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        titleBn: '',
        description: '',
        course: '',
        order: 1,
        isPublished: true,
    });

    const BASE_URL = API_BASE_URL;

    // Fetch courses on mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${BASE_URL}/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setCourses(data.data || []);
            } catch (err) {
                console.error('Error fetching courses:', err);
            }
        };
        fetchCourses();
    }, []);

    // Fetch module data when in edit mode
    useEffect(() => {
        if (!editId) return;
        const fetchModule = async () => {
            setFetchingModule(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${BASE_URL}/modules/${editId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.data) {
                    const mod = data.data;
                    setFormData({
                        title: mod.title || '',
                        titleBn: mod.titleBn || '',
                        description: mod.description || '',
                        course: mod.course?._id || mod.course || '',
                        order: mod.order || 1,
                        isPublished: mod.isPublished !== false,
                    });
                }
            } catch (err) {
                console.error('Error fetching module:', err);
            } finally {
                setFetchingModule(false);
            }
        };
        fetchModule();
    }, [editId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'order' ? Number(value) : value)
        }));
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            const url = isEditMode ? `${BASE_URL}/modules/${editId}` : `${BASE_URL}/modules`;
            const method = isEditMode ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (res.ok) {
                if (isEditMode) {
                    alert('মডিউল সফলভাবে আপডেট হয়েছে! ✅');
                    router.push('/dashboard/admin/module');
                } else {
                    setCreatedModules(prev => [...prev, {
                        _id: result.data?._id,
                        title: result.data?.title || formData.title,
                        order: result.data?.order || formData.order
                    }]);

                    setFormData(prev => ({
                        ...prev,
                        title: '',
                        titleBn: '',
                        description: '',
                        order: prev.order + 1,
                    }));

                    alert('মডিউল সফলভাবে তৈরি হয়েছে! ✅');
                }
            } else {
                const errorMsg = result.errorMessages
                    ? result.errorMessages.map(err => `${err.path}: ${err.message}`).join('\n')
                    : result.message;
                alert(`ত্রুটি ❌\n\n${errorMsg}`);
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('নেটওয়ার্ক ত্রুটি!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-5">

                {/* Header */}
                <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard/admin/module" className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-all">
                                <FiArrowLeft size={16} />
                            </Link>
                            <div className="w-9 h-9 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <FiLayers size={16} />
                            </div>
                            <div>
                                <h1 className="text-base font-semibold text-slate-800">
                                    {isEditMode ? 'মডিউল এডিট করুন' : 'নতুন মডিউল তৈরি করুন'}
                                </h1>
                                <p className="text-xs text-slate-500">
                                    {isEditMode ? formData.title || 'মডিউল আপডেট করুন' : 'কোর্সে নতুন সেকশন যোগ করুন'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {isEditMode && (
                                <button
                                    onClick={() => router.push('/dashboard/admin/module/create')}
                                    className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-md font-medium text-sm transition-all"
                                >
                                    <FiPlus size={16} />
                                    নতুন তৈরি করুন
                                </button>
                            )}
                            <button
                                onClick={handleSubmit}
                                disabled={loading || fetchingModule || !formData.title || !formData.course}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-md font-medium text-sm transition-all disabled:opacity-50"
                            >
                                {isEditMode ? <FiSave size={16} /> : <FiPlus size={16} />}
                                {loading ? (isEditMode ? 'আপডেট হচ্ছে...' : 'তৈরি হচ্ছে...') : (isEditMode ? 'আপডেট করুন' : 'মডিউল যোগ করুন')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Collapsible Created Modules */}
                {createdModules.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-md overflow-hidden">
                        <button
                            onClick={() => setShowCreatedList(!showCreatedList)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-emerald-100/50 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <FiCheck className="text-emerald-600" size={16} />
                                <span className="font-medium text-emerald-700 text-sm">
                                    {createdModules.length} Module{createdModules.length > 1 ? 's' : ''} Created
                                </span>
                                <div className="flex items-center gap-1 ml-2">
                                    {createdModules.slice(0, 3).map((mod, idx) => (
                                        <span key={idx} className="px-2 py-0.5 bg-white rounded-md text-xs text-slate-600 font-medium border border-slate-200">
                                            {mod.order}. {mod.title.length > 12 ? mod.title.slice(0, 12) + '...' : mod.title}
                                        </span>
                                    ))}
                                    {createdModules.length > 3 && (
                                        <span className="text-xs text-slate-500">+{createdModules.length - 3} more</span>
                                    )}
                                </div>
                            </div>
                            {showCreatedList ? <FiChevronUp size={18} className="text-slate-500" /> : <FiChevronDown size={18} className="text-slate-500" />}
                        </button>

                        {showCreatedList && (
                            <div className="px-4 pb-3 border-t border-emerald-200 pt-2">
                                <div className="flex flex-wrap gap-2">
                                    {createdModules.map((mod, idx) => (
                                        <div key={mod._id || idx} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-slate-200">
                                            <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                                                {mod.order}
                                            </span>
                                            <span className="text-sm text-slate-700">{mod.title}</span>
                                            <FiCheck className="text-emerald-500" size={12} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                        <h2 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                            <FiLayers size={16} className="text-indigo-600" />
                            Module Details
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Modules group related lessons together</p>
                    </div>

                    <div className="p-5 space-y-4">
                        {/* Course Selection */}
                        <div>
                            <label className={labelClass}>Select Course <span className="text-red-500">*</span></label>
                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                                className={selectBase}
                            >
                                <option value="">Choose a course</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>{course.title}</option>
                                ))}
                            </select>
                        </div>

                        {/* Titles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Module Title (English) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Getting Started"
                                    className={inputBase}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Module Title (বাংলা) <span className="text-xs text-slate-400 font-normal">(Optional)</span></label>
                                <input
                                    type="text"
                                    name="titleBn"
                                    value={formData.titleBn}
                                    onChange={handleChange}
                                    placeholder="মড্যুলের বাংলা শিরোনাম"
                                    className={inputBase}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className={labelClass}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Brief description of this module..."
                                className={`${inputBase} resize-none`}
                            />
                        </div>

                        {/* Order & Status */}
                        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-slate-700">Order:</label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="w-16 px-2 py-1.5 rounded-md border border-slate-200 text-sm text-center focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-slate-700">Status:</label>
                                <div className="flex bg-slate-100 rounded-md p-0.5">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, isPublished: true }))}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${formData.isPublished
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        Active
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, isPublished: false }))}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!formData.isPublished
                                            ? 'bg-slate-600 text-white shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        Draft
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-5 py-2.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all disabled:opacity-50"
                            >
                                <FiSave size={16} />
                                {loading ? (isEditMode ? 'আপডেট হচ্ছে...' : 'তৈরি হচ্ছে...') : (isEditMode ? 'আপডেট করুন' : 'মডিউল তৈরি করুন')}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Info Card */}
                <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-md bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                            <FiLayers size={16} />
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-800 text-sm mb-1">What are Modules?</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Modules are sections within a course that group related lessons together.
                                For example, a "Web Development" course might have modules like "HTML Basics", "CSS Fundamentals", and "JavaScript Introduction".
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
