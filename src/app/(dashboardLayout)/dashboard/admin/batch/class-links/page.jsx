'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiArrowLeft, FiSave, FiLink, FiVideo, FiSearch, FiCheck, FiX, FiRefreshCw
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_URL } from '@/config/api';

const PLATFORMS = [
    { value: 'zoom', label: 'Zoom' },
    { value: 'google_meet', label: 'Google Meet' },
    { value: 'microsoft_teams', label: 'Microsoft Teams' },
    { value: 'custom', label: 'Custom' },
];

export default function BatchClassLinksPage() {
    const { isDark } = useTheme();
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            setLoading(true);
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
            setError('Failed to fetch batches');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (batchId, field, value) => {
        setBatches(prev => prev.map(batch =>
            batch._id === batchId ? { ...batch, [field]: value } : batch
        ));
    };

    const handleSaveLink = async (batchId) => {
        const batch = batches.find(b => b._id === batchId);
        if (!batch) return;

        setSavingId(batchId);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/batches/${batchId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    meetingLink: batch.meetingLink,
                    platform: batch.platform || 'zoom'
                }),
            });

            const data = await res.json();
            if (data.success) {
                setSuccess(`Successfully updated link for ${batch.batchName}`);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Failed to update link');
            }
        } catch (error) {
            setError('Something went wrong');
        } finally {
            setSavingId(null);
        }
    };

    const filteredBatches = batches.filter(batch =>
        batch.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
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
                            Batch Class Links
                        </h1>
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Set fixed meeting links for ongoing batches
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchBatches}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${isDark
                        ? 'border-slate-600 hover:bg-slate-700 text-gray-300'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                        }`}
                >
                    <FiRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Notifications */}
            {error && (
                <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
                    <FiX size={18} />
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-100 border border-green-200 text-green-700 rounded-md flex items-center gap-2">
                    <FiCheck size={18} />
                    {success}
                </div>
            )}

            {/* Search */}
            <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="relative">
                    <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                        type="text"
                        placeholder="Search by batch name, code or course title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-md border font-normal ${isDark
                            ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                </div>
            </div>

            {/* Batch List */}
            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className={`p-6 rounded-md border animate-pulse ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <div className="h-6 w-1/4 bg-gray-300 rounded mb-4" />
                            <div className="h-10 w-full bg-gray-200 rounded" />
                        </div>
                    ))
                ) : filteredBatches.length === 0 ? (
                    <div className={`p-12 text-center rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                        <FiVideo className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                        <p className={`mt-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            No ongoing batches found
                        </p>
                    </div>
                ) : (
                    filteredBatches.map((batch) => (
                        <div
                            key={batch._id}
                            className={`p-6 rounded-lg border shadow-sm transition-all ${isDark
                                ? 'bg-slate-800 border-slate-700'
                                : 'bg-white border-gray-200'}`}
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Batch Info */}
                                <div className="lg:w-1/3">
                                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {batch.batchName}
                                    </h3>
                                    <p className={`text-sm font-medium text-indigo-500 mb-2`}>
                                        {batch.batchCode}
                                    </p>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Course: <span className="font-semibold">{batch.course?.title || 'N/A'}</span>
                                    </p>
                                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Students: {batch.enrolledCount} / {batch.maxStudents}
                                    </p>
                                </div>

                                {/* Link Inputs */}
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-1">
                                            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                Platform
                                            </label>
                                            <select
                                                value={batch.platform || 'zoom'}
                                                onChange={(e) => handleInputChange(batch._id, 'platform', e.target.value)}
                                                className={`w-full px-3 py-2 rounded-md border text-sm ${isDark
                                                    ? 'bg-slate-700 border-slate-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                            >
                                                {PLATFORMS.map(p => (
                                                    <option key={p.value} value={p.value}>{p.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                Meeting Link
                                            </label>
                                            <div className="relative">
                                                <FiLink className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                                <input
                                                    type="url"
                                                    value={batch.meetingLink || ''}
                                                    onChange={(e) => handleInputChange(batch._id, 'meetingLink', e.target.value)}
                                                    placeholder="https://zoom.us/j/..."
                                                    className={`w-full pl-9 pr-4 py-2 rounded-md border text-sm ${isDark
                                                        ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                                                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 pt-2">
                                        <div className="flex items-center gap-2">
                                            {batch.meetingLink ? (
                                                <a
                                                    href={batch.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500 hover:text-emerald-600 transition-colors"
                                                >
                                                    <FiVideo size={14} />
                                                    Test Link
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-500 italic">No link set yet</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleSaveLink(batch._id)}
                                            disabled={savingId === batch._id}
                                            className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
                                        >
                                            {savingId === batch._id ? (
                                                <FiRefreshCw size={16} className="animate-spin" />
                                            ) : (
                                                <FiSave size={16} />
                                            )}
                                            {savingId === batch._id ? 'Saving...' : 'Save Link'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
