'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiPlus, FiSearch, FiGlobe, FiTag, FiCheckCircle, FiClock,
    FiEdit2, FiEye, FiRefreshCw, FiLayout, FiStar, FiAlertCircle
} from 'react-icons/fi';

export default function MentorWebsitePage() {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchWebsites = async () => {
        
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/websites/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setWebsites(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWebsites(); }, []);

    const filtered = websites.filter(w => {
        const matchSearch = w.title?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || w.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5"><FiCheckCircle size={11} /> Live</span>;
            case 'pending': return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5"><FiClock size={11} /> Pending</span>;
            case 'draft': return <span className="px-2.5 py-1 bg-slate-500/10 text-slate-500 rounded-lg text-[10px] font-semibold uppercase tracking-wide">Draft</span>;
            default: return <span className="px-2.5 py-1 bg-rose-500/10 text-rose-500 rounded-lg text-[10px] font-semibold uppercase tracking-wide">{status}</span>;
        }
    };

    const stats = {
        total: websites.length,
        live: websites.filter(w => w.status === 'approved').length,
        pending: websites.filter(w => w.status === 'pending').length,
        featured: websites.filter(w => w.isFeatured).length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-red-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <FiGlobe className="text-white text-xl" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-800">Website Templates</h1>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                                Mentor
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">Premium theme marketplace</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchWebsites}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Reload
                    </button>
                    <Link href="/dashboard/mentor/website/create">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-red-500 hover:from-emerald-600 hover:to-red-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all">
                            <FiPlus size={16} />
                            New Website
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="relative group">
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Templates</p>
                                <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg">
                                <FiLayout className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative group">
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Published</p>
                                <p className="text-3xl font-bold text-slate-800">{stats.live}</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-red-500 flex items-center justify-center shadow-lg">
                                <FiCheckCircle className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative group">
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Pending</p>
                                <p className="text-3xl font-bold text-slate-800">{stats.pending}</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                                <FiClock className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative group">
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Featured</p>
                                <p className="text-3xl font-bold text-slate-800">{stats.featured}</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg">
                                <FiStar className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        placeholder="Search templates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['all', 'approved', 'pending', 'draft'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all ${statusFilter === status
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            {status === 'all' ? 'All' : status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Content - NO DELETE BUTTON for Mentor */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden animate-pulse">
                            <div className="h-48 bg-slate-100"></div>
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-300">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center">
                            <FiGlobe className="text-4xl text-slate-300" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-600">No Websites Found</p>
                            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or add new template</p>
                        </div>
                        <Link href="/dashboard/mentor/website/create">
                            <button className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all">
                                <FiPlus size={14} /> Create Website
                            </button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map(w => (
                        <div key={w._id} className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            {/* Image */}
                            <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                                {w.images?.[0] ? (
                                    <img src={w.images[0]} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FiGlobe className="text-4xl text-slate-300" />
                                    </div>
                                )}
                                {/* Overlay Actions - NO DELETE for Mentor */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                                    <div className="flex gap-2 w-full">
                                        {w.previewUrl && (
                                            <Link href={w.previewUrl} target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-white/95 backdrop-blur text-slate-800 py-2 rounded-lg text-xs font-semibold hover:bg-white transition-all shadow-sm">
                                                <FiEye size={14} /> Preview
                                            </Link>
                                        )}
                                        <Link href={`/dashboard/mentor/website/edit/${w._id}`} className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-2 rounded-lg text-xs font-semibold hover:bg-emerald-600 transition-all shadow-sm">
                                            <FiEdit2 size={14} /> Edit
                                        </Link>
                                    </div>
                                </div>
                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    {w.isFeatured && (
                                        <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-semibold rounded-lg flex items-center gap-1 shadow-sm">
                                            <FiStar size={10} /> Featured
                                        </span>
                                    )}
                                </div>
                                <div className="absolute top-3 right-3">
                                    {getStatusBadge(w.status)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-sm font-bold text-slate-800 line-clamp-1 mb-2">{w.title}</h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">{w.category?.name || 'Uncategorized'}</span>
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-medium">{w.platform || 'HTML'}</span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <div>
                                        {w.offerPrice && w.offerPrice > 0 ? (
                                            <>
                                                <p className="text-lg font-bold text-emerald-600">?{w.offerPrice?.toLocaleString()}</p>
                                                <p className="text-xs text-slate-400 line-through">?{w.price?.toLocaleString()}</p>
                                            </>
                                        ) : (
                                            <p className="text-lg font-bold text-slate-800">?{w.price?.toLocaleString()}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Mentor Notice */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <FiAlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-amber-800">
                    <span className="font-semibold">Note:</span> As a Mentor, you can create and edit websites but cannot delete them. Contact an Administrator for deletion requests.
                </p>
            </div>
        </div>
    );
}

