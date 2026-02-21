'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';
import {
    FiLayers, FiBook, FiPlus, FiArrowRight, FiCheck, FiChevronDown, FiChevronUp
} from 'react-icons/fi';

const inputBase = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/10 outline-none transition-all";
const selectBase = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/10 outline-none transition-all appearance-none cursor-pointer";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function ModuleCreateTab({ onSuccess }) {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${BASE_URL}/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setCourses(data.data || []);

                const lastCourseId = localStorage.getItem('lastCreatedCourseId');
                if (lastCourseId) {
                    setFormData(prev => ({ ...prev, course: lastCourseId }));
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
            }
        };
        fetchCourses();
    }, []);

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
            const res = await fetch(`${BASE_URL}/modules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (res.ok) {
                setCreatedModules(prev => [...prev, {
                    _id: result.data?._id,
                    title: result.data?.title || formData.title,
                    order: result.data?.order || formData.order
                }]);

                if (result.data?._id) {
                    localStorage.setItem('lastCreatedModuleId', result.data._id);
                    localStorage.setItem('lastCreatedModuleTitle', result.data.title);
                }

                setFormData(prev => ({
                    ...prev,
                    title: '',
                    titleBn: '',
                    description: '',
                    order: prev.order + 1,
                }));

                alert('Module Created Successfully!');
            } else {
                const errorMsg = result.errorMessages
                    ? result.errorMessages.map(err => `${err.path}: ${err.message}`).join('\n')
                    : result.message;
                alert(`Error:\n\n${errorMsg}`);
            }
        } catch (err) {
            console.error('Create error:', err);
            alert('Network error!');
        } finally {
            setLoading(false);
        }
    };

    const handleContinueToLessons = () => {
        if (createdModules.length === 0) {
            alert('Please create at least one module first!');
            return;
        }
        if (onSuccess) onSuccess();
    };

    const lastCourseTitle = typeof window !== 'undefined' ? localStorage.getItem('lastCreatedCourseTitle') : null;

    return (
        <div className="max-w-4xl mx-auto space-y-5">

            {/* Header with Course Info & Actions */}
            <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-[#021E14] flex items-center justify-center text-white">
                            <FiBook size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Selected Course</p>
                            <p className="font-medium text-slate-800 text-sm">{lastCourseTitle || 'Not Selected'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.title || !formData.course}
                            className="flex items-center gap-2 bg-[#021E14] hover:bg-[#01140D] text-white px-5 py-2.5 rounded-md font-medium text-sm transition-all disabled:opacity-50"
                        >
                            <FiPlus size={16} />
                            {loading ? 'Creating...' : 'Add Module'}
                        </button>

                        <button
                            onClick={handleContinueToLessons}
                            disabled={createdModules.length === 0}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-md font-medium text-sm transition-all disabled:opacity-50"
                        >
                            Next: Lessons <FiArrowRight size={14} />
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
                                        <span className="w-5 h-5 rounded-md bg-[#021E14] text-white flex items-center justify-center font-bold text-xs">
                                            {mod.order}
                                        </span>
                                        <span className="text-sm text-slate-700">{mod.title}</span>
                                        <FiCheck className="text-emerald-600" size={12} />
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
                        <FiLayers size={16} className="text-emerald-600" />
                        Add New Module
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
                                className="w-16 px-2 py-1.5 rounded-md border border-slate-200 text-sm text-center focus:border-[#021E14] outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-slate-700">Status:</label>
                            <div className="flex bg-slate-100 rounded-md p-0.5">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, isPublished: true }))}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${formData.isPublished
                                        ? 'bg-[#021E14] text-white shadow-sm'
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
                </div>
            </form>
        </div>
    );
}
