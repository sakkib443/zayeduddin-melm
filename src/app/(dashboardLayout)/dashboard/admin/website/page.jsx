'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiGlobe, FiPlus, FiSearch, FiRefreshCw, FiEdit2, FiTrash2,
    FiEye, FiCheckCircle, FiClock, FiAlertCircle, FiFilter,
    FiChevronLeft, FiChevronRight, FiStar, FiUsers, FiDollarSign,
    FiExternalLink, FiLayout, FiBarChart2
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_URL } from '@/config/api';

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, loading }) => {
    const { isDark } = useTheme();
    return (
        <div className={`rounded-md p-4 border transition-all ${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{title}</p>
                    {loading ? (
                        <div className={`h-7 w-16 mt-1 animate-pulse rounded ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                    ) : (
                        <h3 className={`text-xl font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{value}</h3>
                    )}
                </div>
                <div className={`w-10 h-10 rounded-md ${color} flex items-center justify-center text-white`}>
                    <Icon size={18} />
                </div>
            </div>
        </div>
    );
};

export default function WebsiteAdminPage() {
    const { isDark } = useTheme();
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [platformFilter, setPlatformFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const fetchWebsites = async () => {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/websites/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setWebsites(data.data || []);
        } catch (err) {
            console.error('Error fetching websites:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebsites();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this website?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/websites/admin/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setWebsites(prev => prev.filter(w => w._id !== id));
            } else {
                alert('Failed to delete website.');
            }
        } catch (err) {
            alert('Network error during deletion');
        }
    };

    // Get unique platforms
    const platforms = Array.from(new Set(websites.map(w => w.platform))).filter(Boolean);

    // Filter websites
    const filtered = websites.filter(w => {
        const matchSearch = w.title?.toLowerCase().includes(search.toLowerCase()) ||
            w.platform?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || w.status === statusFilter;
        const matchPlatform = platformFilter === 'all' || w.platform === platformFilter;
        return matchSearch && matchStatus && matchPlatform;
    });

    // Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Stats
    const stats = {
        total: websites.length,
        live: websites.filter(w => w.status === 'approved').length,
        pending: websites.filter(w => w.status === 'pending').length,
        totalSales: websites.reduce((acc, curr) => acc + (curr.salesCount || 0), 0),
    };

    // Status badge
    const getStatusBadge = (status) => {
        const styles = {
            approved: { bg: 'bg-emerald-100 text-emerald-700', icon: FiCheckCircle, label: 'Active' },
            pending: { bg: 'bg-amber-100 text-amber-700', icon: FiClock, label: 'Pending' },
            draft: { bg: 'bg-gray-100 text-gray-600', icon: null, label: 'Draft' },
            rejected: { bg: 'bg-red-100 text-red-700', icon: FiAlertCircle, label: 'Rejected' },
        };
        const style = styles[status] || styles.draft;
        return (
            <span className={`px-2 py-1 ${style.bg} rounded text-xs font-medium flex items-center gap-1`}>
                {style.icon && <style.icon size={10} />}
                {style.label}
            </span>
        );
    };

    return (
        <div className="space-y-5 pb-8">
            {/* Page Header */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-emerald-600 flex items-center justify-center text-white">
                        <FiGlobe size={20} />
                    </div>
                    <div>
                        <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Website Templates</h1>
                        <p className={`text-sm font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Manage {stats.total} website assets
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchWebsites}
                        disabled={loading}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-normal border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <Link href="/dashboard/admin/website/create">
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition-all">
                            <FiPlus size={16} />
                            Add Website
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Total Websites" value={stats.total} icon={FiLayout} color="bg-slate-600" loading={loading} />
                <StatsCard title="Live Templates" value={stats.live} icon={FiCheckCircle} color="bg-emerald-600" loading={loading} />
                <StatsCard title="Pending Review" value={stats.pending} icon={FiClock} color="bg-amber-500" loading={loading} />
                <StatsCard title="Total Sales" value={stats.totalSales} icon={FiBarChart2} color="bg-indigo-600" loading={loading} />
            </div>

            {/* Search & Filters */}
            <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-col lg:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={16} />
                        <input
                            type="text"
                            placeholder="Search websites..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            className={`w-full pl-10 pr-4 py-2 rounded-md border text-sm font-normal outline-none transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-slate-500' : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-gray-300'}`}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <FiFilter size={14} className={isDark ? 'text-slate-400' : 'text-gray-400'} />
                        <div className={`flex items-center gap-1 p-1 rounded-md border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                            {['all', 'approved', 'pending', 'draft'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all capitalize ${statusFilter === status
                                        ? 'bg-emerald-600 text-white'
                                        : isDark ? 'text-slate-300 hover:bg-slate-600' : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Platform Filter */}
                    <select
                        value={platformFilter}
                        onChange={(e) => { setPlatformFilter(e.target.value); setCurrentPage(1); }}
                        className={`px-3 py-2 rounded-md border text-sm font-normal outline-none ${isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-white border-gray-200 text-gray-700'}`}
                    >
                        <option value="all">All Platforms</option>
                        {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>

            {/* Website Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className={`rounded-md border overflow-hidden animate-pulse ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <div className={`h-40 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`} />
                            <div className="p-4 space-y-3">
                                <div className={`h-4 rounded w-3/4 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                                <div className={`h-3 rounded w-1/2 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className={`flex flex-col items-center justify-center py-16 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                        <FiAlertCircle size={28} className={isDark ? 'text-slate-500' : 'text-gray-400'} />
                    </div>
                    <h3 className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>No Websites Found</h3>
                    <p className={`text-sm font-normal mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Try adjusting your search or filters
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paginatedData.map((website) => (
                        <div
                            key={website._id}
                            className={`group rounded-md border overflow-hidden transition-all hover:shadow-sm ${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                        >
                            {/* Image */}
                            <div className="relative h-40 overflow-hidden">
                                {website.images?.[0] ? (
                                    <img
                                        src={website.images[0]}
                                        alt={website.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                        <FiGlobe size={40} className={isDark ? 'text-slate-600' : 'text-gray-300'} />
                                    </div>
                                )}
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    {website.previewUrl && (
                                        <Link
                                            href={website.previewUrl}
                                            target="_blank"
                                            className="p-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
                                        >
                                            <FiExternalLink size={16} />
                                        </Link>
                                    )}
                                    <Link
                                        href={`/dashboard/admin/website/edit/${website._id}`}
                                        className="p-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
                                    >
                                        <FiEdit2 size={16} />
                                    </Link>
                                </div>
                                {/* Status Badge */}
                                <div className="absolute top-2 left-2">
                                    {getStatusBadge(website.status)}
                                </div>
                                {/* Featured Badge */}
                                {website.isFeatured && (
                                    <div className="absolute top-2 right-2">
                                        <span className="p-1.5 bg-amber-500 text-white rounded">
                                            <FiStar size={12} fill="currentColor" />
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                        {website.platform}
                                    </span>
                                    {website.category?.name && (
                                        <>
                                            <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-slate-600' : 'bg-gray-300'}`} />
                                            <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                                {website.category.name}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <h3 className={`text-sm font-medium line-clamp-2 mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                    {website.title}
                                </h3>

                                {/* Stats */}
                                <div className={`flex items-center justify-between py-2 border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`flex items-center gap-1 text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                            <FiUsers size={12} />
                                            {website.salesCount || 0}
                                        </span>
                                        <span className={`flex items-center gap-1 text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                            <FiStar size={12} />
                                            {website.rating || '0'}
                                        </span>
                                    </div>
                                    <div>
                                        {website.offerPrice ? (
                                            <div className="flex items-center gap-1">
                                                <span className={`text-xs line-through ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>৳{website.price}</span>
                                                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>৳{website.offerPrice}</span>
                                            </div>
                                        ) : (
                                            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                                {website.price ? `৳${website.price}` : 'Free'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className={`flex items-center gap-2 pt-3 border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                                    <Link
                                        href={`/dashboard/admin/website/edit/${website._id}`}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-colors ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        <FiEdit2 size={12} />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(website._id)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                    >
                                        <FiTrash2 size={12} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && filtered.length > 0 && totalPages > 1 && (
                <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} websites
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            <FiChevronLeft size={16} />
                        </button>
                        <div className="flex items-center gap-1">
                            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${currentPage === pageNum
                                            ? 'bg-emerald-600 text-white'
                                            : isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            <FiChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
