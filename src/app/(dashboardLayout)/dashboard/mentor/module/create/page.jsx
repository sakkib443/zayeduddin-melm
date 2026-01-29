'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FiLayers, FiArrowLeft, FiSave, FiBook, FiRefreshCw
} from 'react-icons/fi';

export default function CreateModulePage() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        titleBn: '',
        description: '',
        course: '',
        order: 1,
        isPublished: true,
    });

    

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'order' ? Number(value) : value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                alert('Module Created Successfully! ?');
                router.push('/dashboard/mentor/module');
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

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-all bg-white text-slate-700 placeholder:text-slate-400";
    const labelClass = "block text-sm font-medium text-slate-700 mb-2";

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/mentor/module" className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all">
                        <FiArrowLeft size={18} />
                    </Link>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <FiLayers className="text-white text-lg" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-slate-800">Create New Module</h1>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">Mentor</span>
                        </div>
                        <p className="text-sm text-slate-500">Add a new section to your course</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
                >
                    <FiSave size={16} />
                    {loading ? 'Creating...' : 'Create Module'}
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">

                {/* Course Selection */}
                <div>
                    <label className={labelClass}>
                        <FiBook className="inline-block mr-2" size={14} />
                        Select Course *
                    </label>
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
                        <label className={labelClass}>Module Title (?????)</label>
                        <input
                            type="text"
                            name="titleBn"
                            value={formData.titleBn}
                            onChange={handleChange}
                            placeholder="????? ???? ??? ???"
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
                        rows={3}
                        placeholder="Brief description of this module..."
                        className={`${inputClass} resize-none`}
                    />
                </div>

                {/* Order & Published */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Order *</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            required
                            min="1"
                            className={inputClass}
                        />
                        <p className="text-xs text-slate-400 mt-1">Position of this module in the course</p>
                    </div>
                    <div className="flex items-center pt-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={formData.isPublished}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-700">Publish immediately</span>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
                    >
                        <FiSave size={16} />
                        {loading ? 'Creating...' : 'Create Module'}
                    </button>
                </div>
            </form>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-100">
                <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/25">
                        <FiLayers size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-1">What are Modules?</h3>
                        <p className="text-sm text-slate-600">
                            Modules are sections within a course that group related lessons together.
                            For example, a "Web Development" course might have modules like "HTML Basics", "CSS Fundamentals", and "JavaScript Introduction".
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


