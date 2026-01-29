'use client';

import React, { useState } from 'react';
import { FiBell, FiCheck, FiBookOpen, FiAward, FiDownload, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

const mockNotifications = [
    { id: 1, title: 'New Lesson Available', message: 'Module 5: Advanced React Patterns is now live in your Web Development course!', time: '2 min ago', read: false, type: 'course', date: '2026-01-10' },
    { id: 2, title: 'Certificate Ready', message: 'Your Web Development certificate is ready to download. Congratulations on completing the course!', time: '1 hour ago', read: false, type: 'certificate', date: '2026-01-10' },
    { id: 3, title: 'Course Completed', message: 'Amazing work! You have successfully completed JavaScript Basics course.', time: '2 hours ago', read: true, type: 'success', date: '2026-01-10' },
    { id: 4, title: 'New Resource Added', message: 'PDF study guide has been added to your enrolled React course.', time: '5 hours ago', read: true, type: 'resource', date: '2026-01-10' },
    { id: 5, title: 'Quiz Result', message: 'You scored 85% on the Node.js fundamentals quiz. Great job!', time: '1 day ago', read: true, type: 'success', date: '2026-01-09' },
    { id: 6, title: 'Enrollment Confirmed', message: 'You have been successfully enrolled in "Full Stack Development" course.', time: '2 days ago', read: true, type: 'course', date: '2026-01-08' },
];

export default function UserNotificationsPage() {
    const { isDark } = useTheme();
    const [notifications, setNotifications] = useState(mockNotifications);
    const [filter, setFilter] = useState('all');

    const cardClass = `rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-200'}`;

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.read;
        if (filter === 'read') return n.read;
        return true;
    });

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'course': return <FiBookOpen className="text-[#E62D26]" size={18} />;
            case 'certificate': return <FiAward className="text-[#F79952]" size={18} />;
            case 'success': return <FiCheckCircle className="text-green-500" size={18} />;
            case 'resource': return <FiDownload className="text-blue-500" size={18} />;
            default: return <FiBell className="text-gray-500" size={18} />;
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={`${cardClass} p-6`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center text-white shadow-lg">
                            <FiBell size={28} />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Notifications</h1>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                            </p>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 px-4 py-2 bg-[#E62D26]/10 text-[#E62D26] rounded-xl font-medium hover:bg-[#E62D26]/20 transition-all text-sm"
                        >
                            <FiCheck size={16} />
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {[
                    { id: 'all', label: 'All' },
                    { id: 'unread', label: 'Unread' },
                    { id: 'read', label: 'Read' },
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.id
                            ? 'bg-[#E62D26] text-white'
                            : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {f.label}
                        {f.id === 'unread' && unreadCount > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">{unreadCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className={`${cardClass} overflow-hidden divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                {filteredNotifications.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                            <FiBell size={28} className={isDark ? 'text-slate-500' : 'text-gray-400'} />
                        </div>
                        <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No notifications found</p>
                    </div>
                ) : (
                    filteredNotifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`flex items-start gap-4 p-5 transition-colors ${!notif.read
                                ? isDark ? 'bg-[#E62D26]/5' : 'bg-[#E62D26]/5'
                                : isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                            {notif.title}
                                            {!notif.read && (
                                                <span className="ml-2 w-2 h-2 bg-[#E62D26] rounded-full inline-block"></span>
                                            )}
                                        </p>
                                        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                                            {notif.message}
                                        </p>
                                        <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                            {notif.time}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {!notif.read && (
                                            <button
                                                onClick={() => markAsRead(notif.id)}
                                                className={`p-2 rounded-lg transition-colors ${isDark
                                                    ? 'bg-slate-700 text-slate-400 hover:text-[#E62D26]'
                                                    : 'bg-gray-100 text-gray-500 hover:text-[#E62D26]'
                                                    }`}
                                                title="Mark as read"
                                            >
                                                <FiCheck size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notif.id)}
                                            className={`p-2 rounded-lg transition-colors ${isDark
                                                ? 'bg-slate-700 text-slate-400 hover:text-red-500 hover:bg-red-500/10'
                                                : 'bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50'
                                                }`}
                                            title="Delete"
                                        >
                                            <FiTrash2 size={16} />
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
