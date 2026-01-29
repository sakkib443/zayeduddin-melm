'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiVideo, FiCalendar, FiClock, FiExternalLink,
    FiPlay, FiBook, FiUsers, FiCheckCircle
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_URL } from '@/config/api';

export default function MyLiveClassesPage() {
    const { isDark } = useTheme();
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [myBatches, setMyBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const [classesRes, batchesRes] = await Promise.all([
                fetch(`${API_URL}/live-classes/my-classes`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${API_URL}/batches/my-batches`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            const classesData = await classesRes.json();
            const batchesData = await batchesRes.json();

            if (classesData.success) {
                setUpcomingClasses(classesData.data || []);
            }
            if (batchesData.success) {
                setMyBatches(batchesData.data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const isToday = (date) => {
        const today = new Date();
        const classDate = new Date(date);
        return today.toDateString() === classDate.toDateString();
    };

    const getStatusBadge = (status) => {
        const styles = {
            scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            live: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse',
            completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        };
        return styles[status] || styles.scheduled;
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    My Live Classes
                </h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    View your upcoming live classes and enrolled batches
                </p>
            </div>

            {/* Tabs */}
            <div className={`border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'upcoming'
                            ? 'border-indigo-600 text-indigo-600'
                            : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                            }`}
                    >
                        Upcoming Classes
                    </button>
                    <button
                        onClick={() => setActiveTab('batches')}
                        className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'batches'
                            ? 'border-indigo-600 text-indigo-600'
                            : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                            }`}
                    >
                        My Batches
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`h-32 rounded-md animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`} />
                    ))}
                </div>
            ) : activeTab === 'upcoming' ? (
                // Upcoming Classes
                <div className="space-y-4">
                    {upcomingClasses.length === 0 ? (
                        <div className={`text-center py-16 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <FiVideo className={`mx-auto h-16 w-16 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                            <p className={`mt-4 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                No upcoming classes
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Enroll in a batch to see your live classes
                            </p>
                        </div>
                    ) : (
                        upcomingClasses.map((liveClass) => (
                            <div
                                key={liveClass._id}
                                className={`p-5 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                                    } ${isToday(liveClass.classDate) ? 'ring-2 ring-indigo-500' : ''}`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadge(liveClass.status)}`}>
                                                {liveClass.status === 'live' ? '🔴 Live Now' : liveClass.status}
                                            </span>
                                            {isToday(liveClass.classDate) && liveClass.status !== 'live' && (
                                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                    Today
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {liveClass.title}
                                        </h3>
                                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {liveClass.batch?.batchName} • {liveClass.batch?.course?.title}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 mt-3">
                                            <div className="flex items-center gap-2">
                                                <FiCalendar className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {formatDate(liveClass.classDate)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiClock className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {liveClass.startTime} - {liveClass.endTime}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiUsers className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {liveClass.instructor?.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {liveClass.status === 'live' ? (
                                            <a
                                                href={liveClass.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                                            >
                                                <FiPlay size={16} />
                                                Join Now
                                            </a>
                                        ) : (
                                            <a
                                                href={liveClass.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md border transition-colors font-medium ${isDark
                                                    ? 'border-slate-600 text-gray-300 hover:bg-slate-700'
                                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <FiExternalLink size={16} />
                                                View Link
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {liveClass.description && (
                                    <p className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {liveClass.description}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            ) : (
                // My Batches
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myBatches.length === 0 ? (
                        <div className={`col-span-2 text-center py-16 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <FiBook className={`mx-auto h-16 w-16 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                            <p className={`mt-4 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                No batches enrolled
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Enroll in an online course to join a batch
                            </p>
                        </div>
                    ) : (
                        myBatches.map((batch) => (
                            <div
                                key={batch._id}
                                className={`p-5 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {batch.batchName}
                                        </h3>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Code: {batch.batchCode}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${batch.status === 'ongoing'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                        {batch.status}
                                    </span>
                                </div>

                                <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {batch.course?.title}
                                </p>

                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <FiCalendar className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                                            {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {batch.schedule && batch.schedule.length > 0 && (
                                    <div className={`mt-3 pt-3 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                                        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Weekly Schedule:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {batch.schedule.map((s, i) => (
                                                <span
                                                    key={i}
                                                    className={`text-xs px-2 py-1 rounded capitalize ${isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                                                >
                                                    {s.day}: {s.startTime} - {s.endTime}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
