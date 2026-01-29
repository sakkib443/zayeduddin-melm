'use client';
import { API_URL } from '@/config/api';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiBell, FiShoppingBag, FiUser, FiStar, FiBookOpen,
  FiCheck, FiCheckCircle, FiTrash2, FiExternalLink, FiRefreshCw,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, unreadCount: 0 });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/notifications?page=${page}&limit=15`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data || []);
        setMeta(data.meta || { total: 0, totalPages: 1, unreadCount: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, [page]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setMeta(prev => ({ ...prev, unreadCount: Math.max(0, prev.unreadCount - 1) }));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setMeta(prev => ({ ...prev, unreadCount: 0 }));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
      setMeta(prev => ({ ...prev, total: prev.total - 1 }));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <FiShoppingBag className="text-emerald-500" size={18} />;
      case 'enrollment': return <FiBookOpen className="text-blue-500" size={18} />;
      case 'user': return <FiUser className="text-violet-500" size={18} />;
      case 'review': return <FiStar className="text-amber-500" size={18} />;
      default: return <FiBell className="text-slate-500" size={18} />;
    }
  };

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
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-md border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
            <FiBell className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Notifications</h1>
            <p className="text-sm text-slate-500">{meta.total} total • {meta.unreadCount} unread</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotifications}
            className="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-md transition-colors"
          >
            <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          {meta.unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
            >
              <FiCheckCircle size={14} /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <FiRefreshCw className="animate-spin text-blue-500" size={24} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center">
            <FiBell size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/50 ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`}
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{notification.message}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-400">{formatTime(notification.createdAt)}</span>
                          {notification.data?.amount && (
                            <span className="text-xs text-emerald-500 font-medium">৳{notification.data.amount.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {notification.data?.link && (
                          <Link
                            href={notification.data.link}
                            onClick={() => !notification.isRead && markAsRead(notification._id)}
                            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <FiExternalLink size={14} />
                          </Link>
                        )}
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                          >
                            <FiCheck size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-slate-700">
            <p className="text-xs text-slate-500">Page {page} of {meta.totalPages}</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md border border-gray-200 dark:border-slate-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="p-1.5 rounded-md border border-gray-200 dark:border-slate-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

