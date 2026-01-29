'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    FiLayers, FiArrowLeft, FiSave, FiBook, FiRefreshCw
} from 'react-icons/fi';

export default function EditModulePage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const moduleId = params.id;
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        titleBn: '',
        description: '',
        course: '',
        order: 1,
        isPublished: true,
    });

    

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFetching(true);
                const token = localStorage.getItem('token');

                // Fetch courses and module data in parallel
                const [coursesRes, moduleRes] = await Promise.all([
                    fetch(`${BASE_URL}/courses`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${BASE_URL}/modules/${moduleId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                const coursesData = await coursesRes.json();
                const moduleData = await moduleRes.json();

                setCourses(coursesData.data || []);

                if (moduleData.data) {
                    const mod = moduleData.data;
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
                console.error('Error fetching data:', err);
                alert('Failed to load module data');
            } finally {
                setFetching(false);
            }
        };

        if (moduleId) fetchData();
    }, [moduleId]);

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
            const res = await fetch(`${BASE_URL}/modules/${moduleId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (res.ok) {
                alert('Module Updated Successfully! ✅');
                router.push('/dashboard/admin/module');
            } else {
                const errorMsg = result.errorMessages
                    ? result.errorMessages.map(err => `${err.path}: ${err.message}`).join('\n')
                    : result.message;
                alert(`Error ❌\n\n${errorMsg}`);
            }
        } catch (err) {
            console.error('Update error:', err);
            alert('Network error!');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <FiRefreshCw className="animate-spin mx-auto mb-3 text-indigo-500" size={32} />
                    <p className="text-slate-500">Loading module data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                    <FiArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Edit Module</h1>
                    <p className="text-slate-500 text-sm mt-1">Update module information</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                {/* Course Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        <FiBook className="inline-block mr-2" size={16} />
                        Course *
                    </label>
                    <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none bg-white"
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">Module Title (English) *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Getting Started"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Module Title (বাংলা)</label>
                        <input
                            type="text"
                            name="titleBn"
                            value={formData.titleBn}
                            onChange={handleChange}
                            placeholder="যেমনঃ শুরু করা যাক"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Brief description of this module..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                    />
                </div>

                {/* Order & Published */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Order *</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            required
                            min="1"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                        <p className="text-xs text-slate-400 mt-1">Position of this module in the course</p>
                    </div>
                    <div className="flex items-center pt-8">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={formData.isPublished}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-700">Published</span>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
                    >
                        <FiSave size={18} />
                        {loading ? 'Updating...' : 'Update Module'}
                    </button>
                </div>
            </form>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shrink-0">
                        <FiLayers size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 mb-1">Editing Module</h3>
                        <p className="text-sm text-slate-600">
                            Changes will be reflected immediately. The module's lessons will remain attached.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
