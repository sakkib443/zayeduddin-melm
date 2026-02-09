'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiLoader } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_URL } from '@/config/api';

const DAYS = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const STATUSES = ['upcoming', 'ongoing', 'completed', 'cancelled'];

export default function EditBatchPage() {
    const { isDark } = useTheme();
    const router = useRouter();
    const params = useParams();
    const batchId = params.id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({
        course: '',
        instructor: '',
        batchName: '',
        batchCode: '',
        description: '',
        startDate: '',
        endDate: '',
        enrollmentDeadline: '',
        maxStudents: 50,
        status: 'upcoming',
        isActive: true,
        meetingLink: '',
        schedule: [],
    });

    useEffect(() => {
        fetchCourses();
        fetchInstructors();
        if (batchId) {
            fetchBatch();
        }
    }, [batchId]);

    const fetchBatch = async () => {
        try {
            setFetching(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/batches/${batchId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success && data.data) {
                const batch = data.data;
                setFormData({
                    course: batch.course?._id || batch.course || '',
                    instructor: batch.instructor?._id || batch.instructor || '',
                    batchName: batch.batchName || '',
                    batchCode: batch.batchCode || '',
                    description: batch.description || '',
                    startDate: batch.startDate ? batch.startDate.split('T')[0] : '',
                    endDate: batch.endDate ? batch.endDate.split('T')[0] : '',
                    enrollmentDeadline: batch.enrollmentDeadline ? batch.enrollmentDeadline.split('T')[0] : '',
                    maxStudents: batch.maxStudents || 50,
                    status: batch.status || 'upcoming',
                    isActive: batch.isActive !== false,
                    meetingLink: batch.meetingLink || '',
                    schedule: batch.schedule || [],
                });
            } else {
                setError('Batch not found');
            }
        } catch (error) {
            console.error('Error fetching batch:', error);
            setError('Failed to load batch data');
        } finally {
            setFetching(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/courses/admin/all?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setCourses(data.data || []);
            } else {
                const res2 = await fetch(`${API_URL}/courses?limit=100`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data2 = await res2.json();
                setCourses(data2.data || []);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
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
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const addSchedule = () => {
        setFormData((prev) => ({
            ...prev,
            schedule: [...prev.schedule, { day: 'saturday', startTime: '10:00', endTime: '12:00' }],
        }));
    };

    const updateSchedule = (index, field, value) => {
        const newSchedule = [...formData.schedule];
        newSchedule[index][field] = value;
        setFormData((prev) => ({ ...prev, schedule: newSchedule }));
    };

    const removeSchedule = (index) => {
        setFormData((prev) => ({
            ...prev,
            schedule: prev.schedule.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            const submitData = { ...formData };
            if (!submitData.instructor) {
                delete submitData.instructor;
            }
            if (!submitData.enrollmentDeadline) {
                delete submitData.enrollmentDeadline;
            }

            const res = await fetch(`${API_URL}/batches/${batchId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(submitData),
            });

            const data = await res.json();

            if (data.success) {
                router.push('/dashboard/admin/batch');
            } else {
                setError(data.message || 'Failed to update batch');
                if (data.errorMessages) {
                    const errors = {};
                    data.errorMessages.forEach(err => {
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

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <FiLoader className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/dashboard/admin/batch"
                    className={`p-2 rounded-md border transition-colors ${isDark
                        ? 'border-slate-600 hover:bg-slate-700 text-gray-300'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                        }`}
                >
                    <FiArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Edit Batch
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Update batch information and settings
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
                        Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Course <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            >
                                <option value="">Select Course</option>
                                {courses.map((course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                            {fieldErrors.course && <p className="mt-1 text-xs text-red-500">{fieldErrors.course}</p>}
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
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Batch Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="batchName"
                                value={formData.batchName}
                                onChange={handleChange}
                                placeholder="e.g., Batch-01, Morning Batch"
                                required
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {fieldErrors.batchName && <p className="mt-1 text-xs text-red-500">{fieldErrors.batchName}</p>}
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Batch Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="batchCode"
                                value={formData.batchCode}
                                onChange={handleChange}
                                placeholder="e.g., WEB-B01"
                                required
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {fieldErrors.batchCode && <p className="mt-1 text-xs text-red-500">{fieldErrors.batchCode}</p>}
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
                                placeholder="Batch description..."
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                        </div>
                    </div>
                </div>

                {/* Status & Meeting Link */}
                <div className={`p-6 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Status & Meeting
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-2.5 rounded-md border font-normal capitalize ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            >
                                {STATUSES.map((status) => (
                                    <option key={status} value={status} className="capitalize">
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Meeting Link (Zoom/Google Meet)
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
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="isActive"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <label htmlFor="isActive" className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Active Batch (visible to students)
                            </label>
                        </div>
                    </div>
                </div>

                {/* Dates & Capacity */}
                <div className={`p-6 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Schedule & Capacity
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {fieldErrors.startDate && <p className="mt-1 text-xs text-red-500">{fieldErrors.startDate}</p>}
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                End Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {fieldErrors.endDate && <p className="mt-1 text-xs text-red-500">{fieldErrors.endDate}</p>}
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Enrollment Deadline
                            </label>
                            <input
                                type="date"
                                name="enrollmentDeadline"
                                value={formData.enrollmentDeadline}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Max Students <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="maxStudents"
                                value={formData.maxStudents}
                                onChange={handleChange}
                                min={1}
                                required
                                className={`w-full px-4 py-2.5 rounded-md border font-normal ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {fieldErrors.maxStudents && <p className="mt-1 text-xs text-red-500">{fieldErrors.maxStudents}</p>}
                        </div>
                    </div>
                </div>

                {/* Weekly Schedule */}
                <div className={`p-6 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Weekly Class Schedule
                        </h2>
                        <button
                            type="button"
                            onClick={addSchedule}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
                        >
                            <FiPlus size={14} />
                            Add Day
                        </button>
                    </div>

                    {formData.schedule.length === 0 ? (
                        <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            No schedule added yet. Click "Add Day" to add class days.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {formData.schedule.map((item, index) => (
                                <div key={index} className={`flex items-center gap-3 p-3 rounded-md border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                    <select
                                        value={item.day}
                                        onChange={(e) => updateSchedule(index, 'day', e.target.value)}
                                        className={`px-3 py-2 rounded-md border font-normal capitalize ${isDark
                                            ? 'bg-slate-600 border-slate-500 text-white'
                                            : 'bg-white border-gray-200 text-gray-900'
                                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    >
                                        {DAYS.map((day) => (
                                            <option key={day} value={day} className="capitalize">
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="time"
                                        value={item.startTime}
                                        onChange={(e) => updateSchedule(index, 'startTime', e.target.value)}
                                        className={`px-3 py-2 rounded-md border font-normal ${isDark
                                            ? 'bg-slate-600 border-slate-500 text-white'
                                            : 'bg-white border-gray-200 text-gray-900'
                                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    />
                                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>to</span>
                                    <input
                                        type="time"
                                        value={item.endTime}
                                        onChange={(e) => updateSchedule(index, 'endTime', e.target.value)}
                                        className={`px-3 py-2 rounded-md border font-normal ${isDark
                                            ? 'bg-slate-600 border-slate-500 text-white'
                                            : 'bg-white border-gray-200 text-gray-900'
                                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSchedule(index)}
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
                        href="/dashboard/admin/batch"
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
                        <FiSave size={18} />
                        {loading ? 'Updating...' : 'Update Batch'}
                    </button>
                </div>
            </form>
        </div>
    );
}
