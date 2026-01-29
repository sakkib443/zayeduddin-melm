'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';
import {
    FiLayers, FiBook, FiPlus, FiArrowRight, FiCheck, FiChevronDown, FiChevronUp
} from 'react-icons/fi';

export default function ModuleCreateTab({ onSuccess }) {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createdModules, setCreatedModules] = useState([]);
    const [showCreatedList, setShowCreatedList] = useState(false); // Collapsed by default
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

                alert('Module Created Successfully! ?');
            } else {
                const errorMsg = result.errorMessages
                    ? result.errorMessages.map(err => `${err.path}: ${err.message}`).join('\n')
                    : result.message;
                alert(`Error ?\n\n${errorMsg}`);
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

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E62D26] focus:ring-2 focus:ring-[#E62D26]/20 outline-none text-sm transition-all bg-white text-gray-700 placeholder:text-gray-400";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

    const lastCourseTitle = typeof window !== 'undefined' ? localStorage.getItem('lastCreatedCourseTitle') : null;

    return (
        <div className="max-w-4xl mx-auto space-y-5">

            {/* Compact Header with Course Info & Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Course Info */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center text-white">
                            <FiBook size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Selected Course</p>
                            <p className="font-semibold text-gray-800 text-sm">{lastCourseTitle || 'Not Selected'}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.title || !formData.course}
                            className="flex items-center gap-2 bg-[#E62D26] hover:bg-[#c41e18] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
                        >
                            <FiPlus size={16} />
                            {loading ? 'Creating...' : 'Add Module'}
                        </button>

                        <button
                            onClick={handleContinueToLessons}
                            disabled={createdModules.length === 0}
                            className="flex items-center gap-2 bg-[#F79952] hover:bg-[#f59e0b] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
                        >
                            Next: Lessons <FiArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Collapsible Created Modules - Compact */}
            {createdModules.length > 0 && (
                <div className="bg-[#E62D26]/10 border border-[#E62D26]/30 rounded-xl overflow-hidden">
                    <button
                        onClick={() => setShowCreatedList(!showCreatedList)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#E62D26]/5 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <FiCheck className="text-[#E62D26]" size={16} />
                            <span className="font-semibold text-[#E62D26] text-sm">
                                {createdModules.length} Module{createdModules.length > 1 ? 's' : ''} Created
                            </span>
                            <div className="flex items-center gap-1 ml-2">
                                {createdModules.slice(0, 3).map((mod, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-white rounded text-xs text-gray-600 font-medium">
                                        {mod.order}. {mod.title.length > 12 ? mod.title.slice(0, 12) + '...' : mod.title}
                                    </span>
                                ))}
                                {createdModules.length > 3 && (
                                    <span className="text-xs text-gray-500">+{createdModules.length - 3} more</span>
                                )}
                            </div>
                        </div>
                        {showCreatedList ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                    </button>

                    {showCreatedList && (
                        <div className="px-4 pb-3 border-t border-[#E62D26]/20 pt-2">
                            <div className="flex flex-wrap gap-2">
                                {createdModules.map((mod, idx) => (
                                    <div key={mod._id || idx} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200">
                                        <span className="w-5 h-5 rounded bg-[#E62D26] text-white flex items-center justify-center font-bold text-xs">
                                            {mod.order}
                                        </span>
                                        <span className="text-sm text-gray-700">{mod.title}</span>
                                        <FiCheck className="text-[#E62D26]" size={12} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center">
                        <FiLayers className="text-white" size={16} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-800">Add New Module</h2>
                        <p className="text-xs text-gray-500">Modules group related lessons together</p>
                    </div>
                </div>

                {/* Course Selection */}
                <div>
                    <label className={labelClass}>Select Course *</label>
                    <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        required
                        className={inputClass}
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
                        <label className={labelClass}>Module Title (English) *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Getting Started"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Module Title (Bengali)</label>
                        <input
                            type="text"
                            name="titleBn"
                            value={formData.titleBn}
                            onChange={handleChange}
                            placeholder="Optional"
                            className={inputClass}
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
                        className={`${inputClass} resize-none`}
                    />
                </div>

                {/* Order & Status */}
                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100">
                    {/* Order */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Order:</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            required
                            min="1"
                            className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-center focus:border-[#E62D26] outline-none"
                        />
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">Status:</label>
                        <div className="flex bg-gray-100 rounded-lg p-0.5">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, isPublished: true }))}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${formData.isPublished
                                    ? 'bg-[#E62D26] text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Active
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, isPublished: false }))}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!formData.isPublished
                                    ? 'bg-[#F79952] text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Draft
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
