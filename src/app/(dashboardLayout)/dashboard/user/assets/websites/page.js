'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyDownloads } from '@/redux/downloadSlice';
import Link from 'next/link';
import {
    FiGlobe, FiDownload, FiExternalLink, FiClock, FiShield,
    FiLayout, FiEye, FiRefreshCw, FiSearch, FiGrid, FiList,
    FiArrowRight, FiPackage, FiCode
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function MyWebsitesPage() {
    const { isDark } = useTheme();
    const dispatch = useDispatch();
    const { downloads, loading } = useSelector((state) => state.download);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        dispatch(fetchMyDownloads());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchMyDownloads());
    };

    const websites = downloads.filter(d => d.productType === 'website');

    // Filter by search
    const filteredWebsites = websites.filter(w =>
        w.productTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats
    const stats = {
        total: websites.length,
        templates: websites.filter(w => w.product?.projectType === 'template').length || websites.length,
        downloads: websites.reduce((acc, w) => acc + (w.downloadCount || 0), 0),
    };

    const cardClass = `rounded-2xl border transition-all duration-300 ${isDark
        ? 'bg-slate-800/50 border-white/5 hover:border-[#E62D26]/20'
        : 'bg-white border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md'
        }`;

    if (loading) {
        return (
            <div className="space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 ${cardClass}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        <div className="space-y-2">
                            <div className={`h-4 w-32 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                            <div className={`h-3 w-48 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={cardClass}>
                            <div className={`h-44 ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                            <div className="p-5 space-y-3">
                                <div className={`h-4 rounded w-3/4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                                <div className={`h-3 rounded w-1/2 ${isDark ? 'bg-slate-700' : 'bg-slate-100'} animate-pulse`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Professional Compact Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 ${cardClass}`}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center text-white shadow-md shadow-[#E62D26]/10">
                        <FiGlobe size={24} />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            My Website Templates
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Access and download your purchased website templates
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isDark
                            ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <FiRefreshCw size={16} />
                        Sync
                    </button>
                    <Link
                        href="/websites"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E62D26] to-[#c41e18] text-white rounded-xl text-sm font-bold shadow-md shadow-[#E62D26]/10 hover:scale-105 transition-all"
                    >
                        <FiPackage size={16} />
                        Browse More
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Total Websites
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.total.toString().padStart(2, '0')}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E62D26] to-[#c41e18] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                            <FiGlobe size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#E62D26] to-[#c41e18] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Premium Templates
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.templates.toString().padStart(2, '0')}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f79952] to-[#fb923c] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                            <FiLayout size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#f79952] to-[#fb923c] transition-all duration-300 group-hover:w-full w-0`} />
                </div>

                <div className={`${cardClass} p-5 relative group overflow-hidden`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Total Downloads
                            </p>
                            <h3 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {stats.downloads.toString().padStart(2, '0')}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-red-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                            <FiDownload size={20} />
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-red-500 transition-all duration-300 group-hover:w-full w-0`} />
                </div>
            </div>

            {/* Search Bar */}
            <div className={`flex flex-col md:flex-row md:items-center gap-4 p-4 ${cardClass}`}>
                <div className="relative flex-1">
                    <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${isDark
                            ? 'bg-slate-800/50 border-white/5 text-slate-200 focus:ring-[#E62D26]/30'
                            : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-[#E62D26]/20'
                            }`}
                    />
                </div>
                <div className={`flex items-center gap-1 p-1 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                            ? isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white shadow-sm text-slate-800'
                            : isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                    >
                        <FiGrid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list'
                            ? isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white shadow-sm text-slate-800'
                            : isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                    >
                        <FiList size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {filteredWebsites.length === 0 ? (
                <div className={`py-20 text-center rounded-2xl border-2 border-dashed ${isDark
                    ? 'border-slate-700 bg-slate-900/20'
                    : 'border-slate-200 bg-slate-50/50'
                    }`}>
                    <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'
                        }`}>
                        <FiGlobe size={36} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
                    </div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {searchTerm ? 'No Templates Found' : 'No Templates Purchased Yet'}
                    </h2>
                    <p className={`text-sm mt-3 max-w-sm mx-auto ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {searchTerm
                            ? `No templates matching "${searchTerm}".`
                            : 'Browse our template marketplace to find stunning website designs.'
                        }
                    </p>
                    {!searchTerm && (
                        <Link
                            href="/websites"
                            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-[#E62D26] to-[#c41e18] text-white rounded-xl font-bold text-sm shadow-md shadow-[#E62D26]/10 hover:scale-105 transition-all"
                        >
                            Browse Templates <FiArrowRight />
                        </Link>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredWebsites.map((item) => (
                        <div
                            key={item._id}
                            className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 ${isDark
                                ? 'bg-slate-800/50 border-white/5 hover:border-[#E62D26]/20'
                                : 'bg-white border-slate-200 hover:shadow-lg'
                                }`}
                        >
                            {/* Thumbnail */}
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400'}
                                    alt={item.productTitle}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                {/* Preview Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold text-xs hover:bg-white/30 transition-all">
                                        <FiEye size={14} /> Preview
                                    </button>
                                </div>

                                <div className="absolute bottom-3 left-3 right-3">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white bg-gradient-to-r from-[#E62D26] to-[#c41e18] mb-2">
                                        <FiGlobe size={10} /> Template
                                    </span>
                                    <h3 className="text-white font-bold text-sm line-clamp-2 leading-snug">
                                        {item.productTitle}
                                    </h3>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4 space-y-4">
                                <p className="text-xs font-bold text-[#E62D26]">{item.product?.projectType || 'Ready-made Template'}</p>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span className={`uppercase tracking-widest flex items-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            <FiClock size={10} /> Acquired
                                        </span>
                                        <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span className={`uppercase tracking-widest flex items-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            <FiShield size={10} /> License
                                        </span>
                                        <span className="text-emerald-500">Commercial</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => window.open(item.product?.downloadFile, '_blank')}
                                        disabled={!item.product?.downloadFile}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#E62D26] to-[#c41e18] text-white rounded-xl font-bold text-xs shadow-md shadow-[#E62D26]/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
                                    >
                                        <FiDownload size={14} /> Source Code
                                    </button>
                                    <button className={`p-2.5 rounded-xl transition-all ${isDark
                                        ? 'bg-slate-700 text-slate-300 hover:text-[#E62D26]'
                                        : 'bg-slate-100 text-slate-500 hover:text-[#E62D26]'
                                        }`}>
                                        <FiEye size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={`rounded-2xl border overflow-hidden divide-y ${isDark ? 'bg-slate-800/50 border-white/5 divide-white/5' : 'bg-white border-slate-200 divide-slate-100'}`}>
                    {filteredWebsites.map((item) => (
                        <div key={item._id} className={`flex items-center gap-4 p-4 transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                            <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-white/5">
                                <img src={item.product?.images?.[0]} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`text-sm font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.productTitle}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                        {item.product?.projectType || 'Template'}
                                    </span>
                                    <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className={`p-2.5 rounded-xl transition-all ${isDark
                                    ? 'bg-slate-700 text-slate-300 hover:text-[#E62D26]'
                                    : 'bg-slate-100 text-slate-500 hover:text-[#E62D26]'
                                    }`}>
                                    <FiEye size={16} />
                                </button>
                                <button
                                    onClick={() => window.open(item.product?.downloadFile, '_blank')}
                                    disabled={!item.product?.downloadFile}
                                    className={`p-2.5 rounded-xl transition-all ${isDark
                                        ? 'bg-slate-700 text-slate-300 hover:bg-[#E62D26] hover:text-white'
                                        : 'bg-slate-100 text-slate-500 hover:bg-[#E62D26] hover:text-white'
                                        } disabled:opacity-50`}
                                >
                                    <FiDownload size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Customization CTA */}
            <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${isDark
                ? 'bg-gradient-to-r from-slate-800 to-slate-800/50 border-white/5'
                : 'bg-gradient-to-r from-[#E62D26]/5 to-white border-slate-100'
                }`}>
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark
                        ? 'bg-[#E62D26]/10 text-[#E62D26]'
                        : 'bg-white text-[#E62D26] shadow-md border border-[#E62D26]/10'
                        }`}>
                        <FiCode size={22} />
                    </div>
                    <div>
                        <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Need Custom Development?</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Our developers can customize any template to match your brand perfectly.
                        </p>
                    </div>
                </div>
                <Link
                    href="/dashboard/user/support"
                    className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all bg-gradient-to-r from-[#E62D26] to-[#c41e18] text-white shadow-md shadow-[#E62D26]/10 hover:shadow-lg hover:scale-105"
                >
                    Request Customization
                </Link>
            </div>
        </div>
    );
}
