'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiVideo } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_URL } from '@/config/api';

const PLATFORMS = [
    { value: 'zoom', label: 'Zoom' },
    { value: 'google_meet', label: 'Google Meet' },
    { value: 'microsoft_teams', label: 'Microsoft Teams' },
    { value: 'custom', label: 'Custom Link' },
];

export default function CreateLiveClassPage() {
    const { isDark } = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [batches, setBatches] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({
        batch: '',
        instructor: '',
        title: '',
        description: '',
        classNumber: '',
        classDate: '',
        startTime: '',
        endTime: '',
        meetingLink: '',
        meetingId: '',
        meetingPassword: '',
        platform: 'zoom',
        resources: [],
    });

    useEffect(() => {
        fetchBatches();
        fetchInstructors();
    }, []);

    const fetchBatches = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/batches?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setBatches(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
        }
    };

    const fetchInstructors = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/users?role=mentor&limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setInstructors(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching instructors:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addResource = () => {
        setFormData((prev) => ({
            ...prev,
            resources: [...prev.resources, { title: '', url: '', type: 'file' }],
        }));
    };

    const updateResource = (index, field, value) => {
        const newResources = [...formData.resources];
        newResources[index][field] = value;
        setFormData((prev) => ({ ...prev, resources: newResources }));
    };

    const removeResource = (index) => {
        setFormData((prev) => ({
            ...prev,
            resources: prev.resources.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                classNumber: formData.classNumber ? parseInt(formData.classNumber) : undefined,
            };

            // Remove empty strings for optional fields to avoid Zod URL validation errors if empty
            if (!payload.instructor) delete payload.instructor;
            if (!payload.meetingLink) delete payload.meetingLink;
            if (!payload.title) delete payload.title;
            if (!payload.classDate) delete payload.classDate;
            if (!payload.startTime) delete payload.startTime;
            if (!payload.endTime) delete payload.endTime;

            const res = await fetch(`${API_URL}/live-classes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                router.push('/dashboard/admin/live-class');
            } else {
                setError(data.message || 'Failed to create live class');
                if (data.errorMessages) {
                    const errors = {};
                    data.errorMessages.forEach(err => {
                        // Zod paths usually start with 'body.'
                        const fieldName = err.path.replace('body.', '');
                        errors[fieldName] = err.message;
                    });
                    setFieldErrors(errors);
                }
            }
        } catch (error) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/dashboard/admin/live-class"
                    className={`p-2 rounded-md border transition-colors ${isDark
                        ? 'border-slate-600 hover:bg-slate-700 text-gray-300'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                        }`}
                >
                    <FiArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Schedule Live Class
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Create a new live class for a batch
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className={`p-6 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Class Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Batch <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="batch"
                                value={formData.batch}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            >
                                <option value="">Select Batch</option>
                                {batches.map((batch) => (
                                    <option key={batch._id} value={batch._id}>
                                        {batch.batchName} - {batch.course?.title}
                                    </option>
                                ))}
                            </select>
                            {fieldErrors.batch && <p className="mt-1 text-xs text-red-500">{fieldErrors.batch}</p>}
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Instructor <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>(Optional)</span>
                            </label>
                            <select
                                name="instructor"
                                value={formData.instructor}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            >
                                <option value="">Select Instructor</option>
                                {instructors.map((inst) => (
                                    <option key={inst._id} value={inst._id}>
                                        {inst.name}
                                    </option>
                                ))}
                            </select>
                            {fieldErrors.instructor && <p className="mt-1 text-xs text-red-500">{fieldErrors.instructor}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Class Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Class 01 - JavaScript Basics"
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {fieldErrors.title && <p className="mt-1 text-xs text-red-500">{fieldErrors.title}</p>}
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Class Number
                            </label>
                            <input
                                type="number"
                                name="classNumber"
                                value={formData.classNumber}
                                onChange={handleChange}
                                min={1}
                                placeholder="Auto-generated if empty"
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Platform
                            </label>
                            <select
                                name="platform"
                                value={formData.platform}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            >
                                {PLATFORMS.map((p) => (
                                    <option key={p.value} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="What will be covered in this class..."
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                        </div>
                    </div>
                </div>

                {/* Schedule */}
                <div className={`p-6 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Schedule
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Class Date
                            </label>
                            <input
                                type="date"
                                name="classDate"
                                value={formData.classDate}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {fieldErrors.classDate && <p className="mt-1 text-xs text-red-500">{fieldErrors.classDate}</p>}
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Start Time
                            </label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {fieldErrors.startTime && <p className="mt-1 text-xs text-red-500">{fieldErrors.startTime}</p>}
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                End Time
                            </label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {fieldErrors.endTime && <p className="mt-1 text-xs text-red-500">{fieldErrors.endTime}</p>}
                        </div>
                    </div>
                </div>

                {/* Meeting Details */}
                <div className={`p-6 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Meeting Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Meeting Link
                            </label>
                            <input
                                type="url"
                                name="meetingLink"
                                value={formData.meetingLink}
                                onChange={handleChange}
                                placeholder="https://zoom.us/j/..."
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {fieldErrors.meetingLink && <p className="mt-1 text-xs text-red-500">{fieldErrors.meetingLink}</p>}
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Meeting ID (Optional)
                            </label>
                            <input
                                type="text"
                                name="meetingId"
                                value={formData.meetingId}
                                onChange={handleChange}
                                placeholder="123 456 7890"
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Meeting Password (Optional)
                            </label>
                            <input
                                type="text"
                                name="meetingPassword"
                                value={formData.meetingPassword}
                                onChange={handleChange}
                                placeholder="abc123"
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                        </div>
                    </div>
                </div>

                {/* Resources */}
                <div className={`p-6 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Class Resources
                        </h2>
                        <button
                            type="button"
                            onClick={addResource}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
                        >
                            <FiPlus size={14} />
                            Add Resource
                        </button>
                    </div>

                    {formData.resources.length === 0 ? (
                        <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            No resources added yet. Add PDF, video links or other materials.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {formData.resources.map((item, index) => (
                                <div key={index} className={`flex items-center gap-3 p-3 rounded-md border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => updateResource(index, 'title', e.target.value)}
                                        placeholder="Resource title"
                                        className={`flex-1 px-3 py-2 rounded-md border font-normal ${isDark
                                            ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    />
                                    <input
                                        type="url"
                                        value={item.url}
                                        onChange={(e) => updateResource(index, 'url', e.target.value)}
                                        placeholder="URL"
                                        className={`flex-1 px-3 py-2 rounded-md border font-normal ${isDark
                                            ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    />
                                    <select
                                        value={item.type}
                                        onChange={(e) => updateResource(index, 'type', e.target.value)}
                                        className={`px-3 py-2 rounded-md border font-normal ${isDark
                                            ? 'bg-slate-600 border-slate-500 text-white'
                                            : 'bg-white border-gray-200 text-gray-900'
                                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    >
                                        <option value="file">File</option>
                                        <option value="pdf">PDF</option>
                                        <option value="video">Video</option>
                                        <option value="link">Link</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => removeResource(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3">
                    <Link
                        href="/dashboard/admin/live-class"
                        className={`px-6 py-2.5 rounded-md border font-medium ${isDark
                            ? 'border-slate-600 text-gray-300 hover:bg-slate-700'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                    >
                        <FiVideo size={18} />
                        {loading ? 'Scheduling...' : 'Schedule Class'}
                    </button>
                </div>
            </form>
        </div>
    );
}
