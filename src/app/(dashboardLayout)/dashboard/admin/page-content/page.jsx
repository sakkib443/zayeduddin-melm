'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FiHome,
    FiInfo,
    FiPhone,
    FiBook,
    FiCode,
    FiAward,
    FiChevronRight,
    FiRefreshCw,
    FiSettings,
    FiLoader
} from 'react-icons/fi';
import { API_URL } from '@/config/api';

const iconMap = {
    FiHome: FiHome,
    FiInfo: FiInfo,
    FiMail: FiPhone,
    FiBook: FiBook,
    FiCode: FiCode,
    FiAward: FiAward,
};

const pageColors = {
    home: 'bg-emerald-500',
    about: 'bg-indigo-500',
    contact: 'bg-amber-500',
    training: 'bg-blue-500',
    software: 'bg-pink-500',
    successStory: 'bg-violet-500',
};

export default function PageContentDashboard() {
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState([]);

    useEffect(() => {
        fetchPagesOverview();
    }, []);

    const fetchPagesOverview = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/page-content/overview`);
            const data = await res.json();

            if (data.success && data.data) {
                setPages(data.data);
            }
        } catch (error) {
            console.error('Error fetching pages:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <FiLoader className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading page content...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Page Content Manager</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage dynamic content for all website pages</p>
                </div>
                <button
                    onClick={fetchPagesOverview}
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                    <FiRefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Info Card */}
            <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-md border border-indigo-100 dark:border-indigo-500/20 p-4">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-500 rounded-md flex items-center justify-center text-white shrink-0">
                        <FiSettings size={20} />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">How it works</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Click on any page below to edit its sections. Each section has editable fields for both English and Bengali content.
                            Changes are saved to the database and reflected on the live website.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.map((page) => {
                    const Icon = iconMap[page.icon] || FiHome;
                    const bgColor = pageColors[page.pageKey] || 'bg-gray-500';

                    return (
                        <Link
                            key={page.pageKey}
                            href={`/dashboard/admin/page-content/${page.pageKey}`}
                            className="group bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all hover:shadow-md"
                        >
                            <div className="p-5">
                                {/* Icon & Arrow */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-11 h-11 ${bgColor} rounded-md flex items-center justify-center text-white`}>
                                        <Icon size={22} />
                                    </div>
                                    <FiChevronRight
                                        className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"
                                        size={20}
                                    />
                                </div>

                                {/* Page Info */}
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                                    {page.pageName}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    {page.pageNameBn}
                                </p>

                                {/* Progress */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {page.completedSections} / {page.totalSections} sections
                                        </span>
                                        <span className={`font-medium ${page.progress >= 80
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : page.progress >= 50
                                                ? 'text-amber-600 dark:text-amber-400'
                                                : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {page.progress}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${page.progress >= 80
                                                ? 'bg-emerald-500'
                                                : page.progress >= 50
                                                    ? 'bg-amber-500'
                                                    : 'bg-gray-400'
                                                }`}
                                            style={{ width: `${page.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Route Badge */}
                                {page.route && (
                                    <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-slate-700 rounded-md text-xs font-medium text-gray-600 dark:text-gray-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        {page.route}
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Empty State */}
            {pages.length === 0 && !loading && (
                <div className="text-center py-16 bg-gray-50 dark:bg-slate-800/50 rounded-md">
                    <FiSettings className="mx-auto w-12 h-12 text-gray-300 dark:text-gray-600" />
                    <h3 className="mt-4 text-base font-medium text-gray-500 dark:text-gray-400">
                        No pages configured
                    </h3>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                        Page definitions will appear here once the backend is connected
                    </p>
                </div>
            )}
        </div>
    );
}
