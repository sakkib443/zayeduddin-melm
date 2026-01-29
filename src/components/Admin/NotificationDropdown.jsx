'use client';
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    FiBell, FiShoppingBag, FiUser, FiStar, FiBookOpen,
    FiCheck, FiCheckCircle, FiX, FiExternalLink, FiHeart
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';



const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/notifications?limit=10`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setNotifications(data.data || []);
                setUnreadCount(data.meta?.unreadCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch unread count periodically
    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/notifications/unread-count`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setUnreadCount(data.data?.count || 0);
            }
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    // Mark as read
    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/notifications/mark-all-read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    // Initial fetch and periodic polling
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get icon by notification type
    const getIcon = (type) => {
        switch (type) {
            case 'order': return <FiShoppingBag className="text-green-500" />;
            case 'enrollment': return <FiBookOpen className="text-blue-500" />;
            case 'user': return <FiUser className="text-purple-500" />;
            case 'review': return <FiStar className="text-yellow-500" />;
            case 'like': return <FiHeart className="text-rose-500 fill-current" />;
            default: return <FiBell className="text-gray-500" />;
        }
    };

    // Get background by type
    const getBgColor = (type) => {
        switch (type) {
            case 'order': return 'bg-green-50';
            case 'enrollment': return 'bg-blue-50';
            case 'user': return 'bg-purple-50';
            case 'review': return 'bg-yellow-50';
            case 'like': return 'bg-rose-50';
            default: return 'bg-gray-50';
        }
    };

    // Format time
    const formatTime = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
                <FiBell size={20} className="text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-[380px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <FiBell className="text-[#E62D26]" />
                                <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-[#E62D26] hover:text-[#38a89d] font-semibold flex items-center gap-1"
                                >
                                    <FiCheckCircle size={12} />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-10">
                                    <div className="w-6 h-6 border-2 border-[#E62D26] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FiBell size={24} className="text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {notifications.map((notification) => (
                                        <Link
                                            key={notification._id}
                                            href={notification.data?.link || '#'}
                                            onClick={() => {
                                                if (!notification.isRead) {
                                                    markAsRead(notification._id);
                                                }
                                                setIsOpen(false);
                                            }}
                                            className={`block px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notification.isRead ? 'bg-[#E62D26]/5' : ''
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                {/* Icon */}
                                                <div className={`w-10 h-10 rounded-xl ${getBgColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
                                                    {getIcon(notification.type)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                                            {notification.title}
                                                        </p>
                                                        {!notification.isRead && (
                                                            <span className="w-2 h-2 bg-[#E62D26] rounded-full flex-shrink-0 mt-1.5"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="text-[10px] text-slate-400">
                                                            {formatTime(notification.createdAt)}
                                                        </span>
                                                        {notification.data?.amount && (
                                                            <span className="text-[10px] text-green-600 font-semibold">
                                                                ?{notification.data.amount.toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Arrow */}
                                                <FiExternalLink size={14} className="text-slate-300 flex-shrink-0 mt-1" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                <Link
                                    href="/dashboard/admin/notifications"
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm text-[#E62D26] hover:text-[#38a89d] font-semibold flex items-center justify-center gap-1"
                                >
                                    View all notifications
                                    <FiExternalLink size={12} />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;

