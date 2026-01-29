'use client';

import React, { useEffect, useState } from 'react';
import {
    FiPlus, FiEdit3, FiTrash2, FiLoader, FiCheck, FiSearch,
    FiRefreshCw, FiImage, FiStar, FiDownload, FiEye,
    FiPackage, FiGrid, FiList
} from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config/api';

const PLATFORM_OPTIONS = [
    'Figma', 'Photoshop', 'Illustrator', 'Adobe XD', 'Sketch', 'Canva',
    'HTML/CSS', 'React', 'Next.js', 'Tailwind CSS', 'WordPress',
    'Elementor', 'Bootstrap', 'InDesign', 'After Effects', 'Premiere Pro', 'Other'
];

const DesignTemplatePage = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [platformFilter, setPlatformFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const router = useRouter();

    const fetchTemplates = async () => {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/design-templates/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            setTemplates(result.data || []);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this template?")) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/design-templates/admin/managed/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchTemplates();
            } else {
                const data = await res.json();
                alert(data.message || 'Delete failed');
            }
        } catch (err) {
            alert("Delete failed");
        }
    };

    const handleEdit = (id) => {
        router.push(`/dashboard/admin/design-template/create?edit=${id}`);
    };

    const getStatusBadge = (status) => {
        const styles = {
            approved: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
            pending: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
            draft: 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
        };
        const labels = {
            approved: 'Live',
            pending: 'Pending',
            draft: 'Draft'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-md ${styles[status] || styles.draft}`}>
                {status === 'approved' && <FiCheck className="inline mr-1" size={10} />}
                {labels[status] || status}
            </span>
        );
    };

    const getPlatformBadge = (platform) => {
        const colors = {
            'Figma': 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
            'Photoshop': 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
            'Illustrator': 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
            'WordPress': 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
            'React': 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
            'HTML/CSS': 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
        };
        return colors[platform] || 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300';
    };

    const stats = {
        total: templates.length,
        approved: templates.filter(t => t.status === 'approved').length,
        pending: templates.filter(t => t.status === 'pending').length,
        featured: templates.filter(t => t.isFeatured).length,
    };

    const filtered = templates.filter(t => {
        const matchSearch = t.title?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || t.status === statusFilter;
        const matchPlatform = platformFilter === 'all' || t.platform === platformFilter;
        return matchSearch && matchStatus && matchPlatform;
    });

    return (
        <div className="p-4 md:p-6 space-y-5 bg-gray-50 dark:bg-slate-900 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-indigo-500 flex items-center justify-center">
                        <FiImage className="text-white" size={18} />
                    </div>
                    <div>
                        <h1 className="text-base font-semibold text-gray-800 dark:text-white">Design Templates</h1>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Manage design templates & assets</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchTemplates}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-300 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Reload
                    </button>
                    <Link href="/dashboard/admin/design-template/create">
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md text-sm font-medium transition-colors">
                            <FiPlus size={14} />
                            Add Template
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 bg-gray-700 dark:bg-slate-600 rounded-md flex items-center justify-center">
                            <FiPackage className="text-white" size={16} />
                        </div>
                        <span className="text-xl font-semibold text-gray-800 dark:text-white">{stats.total}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Total Templates</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 bg-green-500 rounded-md flex items-center justify-center">
                            <FiCheck className="text-white" size={16} />
                        </div>
                        <span className="text-xl font-semibold text-gray-800 dark:text-white">{stats.approved}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Approved</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 bg-amber-500 rounded-md flex items-center justify-center">
                            <FiLoader className="text-white" size={16} />
                        </div>
                        <span className="text-xl font-semibold text-gray-800 dark:text-white">{stats.pending}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Pending</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 bg-yellow-500 rounded-md flex items-center justify-center">
                            <FiStar className="text-white" size={16} />
                        </div>
                        <span className="text-xl font-semibold text-gray-800 dark:text-white">{stats.featured}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Featured</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        placeholder="Search templates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none text-sm transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'approved', 'pending', 'draft'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                                statusFilter === status
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                            }`}
                        >
                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
                <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="px-3 py-2 rounded-md text-sm bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-700 outline-none text-gray-700 dark:text-slate-300"
                >
                    <option value="all">All Platforms</option>
                    {PLATFORM_OPTIONS.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
                <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-700 rounded-md">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500'}`}
                    >
                        <FiGrid size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500'}`}
                    >
                        <FiList size={16} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <FiLoader className="animate-spin text-indigo-500" size={28} />
                    <p className="text-sm text-gray-500 font-medium">Loading templates...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-md border border-dashed border-gray-300 dark:border-slate-600">
                    <div className="w-14 h-14 bg-gray-100 dark:bg-slate-700 rounded-md flex items-center justify-center mx-auto mb-3">
                        <FiImage className="text-xl text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white">No Templates Found</h3>
                    <p className="text-xs text-gray-500 mt-1">Add your first design template</p>
                    <Link href="/dashboard/admin/design-template/create">
                        <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-md mx-auto hover:bg-indigo-600 transition-colors">
                            <FiPlus size={14} /> Add Template
                        </button>
                    </Link>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((item) => (
                        <div key={item._id} className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Image */}
                            <div className="relative h-40 bg-gray-100 dark:bg-slate-700 overflow-hidden">
                                {item.images?.[0] ? (
                                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-slate-600">
                                        <FiImage size={40} />
                                    </div>
                                )}
                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                                    {item.isFeatured && (
                                        <span className="px-2 py-1 bg-yellow-400 text-yellow-900 rounded-md text-xs font-medium">
                                            Featured
                                        </span>
                                    )}
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPlatformBadge(item.platform)}`}>
                                        {item.platform}
                                    </span>
                                </div>
                                <div className="absolute top-2 right-2">
                                    {getStatusBadge(item.status)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-1 mb-2">{item.title}</h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">v{item.version}</span>
                                    <span className="text-xs text-indigo-500 font-medium">{item.templateType}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400 mb-3 py-2 border-t border-gray-100 dark:border-slate-700">
                                    <span className="flex items-center gap-1">
                                        <FiStar className="text-amber-500" size={12} /> {item.rating?.toFixed(1) || '0.0'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiDownload size={12} /> {item.salesCount || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
                                    <div>
                                        {item.accessType === 'free' ? (
                                            <span className="text-base font-semibold text-green-500">FREE</span>
                                        ) : (
                                            <div>
                                                {item.offerPrice && item.offerPrice < item.price && (
                                                    <span className="text-xs text-gray-400 line-through mr-1">৳{item.price}</span>
                                                )}
                                                <span className="text-base font-semibold text-indigo-600 dark:text-indigo-400">৳{item.offerPrice || item.price}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={() => handleEdit(item._id)} 
                                            className="p-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-indigo-500 hover:text-white rounded-md transition-colors" 
                                            title="Edit"
                                        >
                                            <FiEdit3 size={14} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id)} 
                                            className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors" 
                                            title="Delete"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    <div className="divide-y divide-gray-100 dark:divide-slate-700">
                        {filtered.map((item) => (
                            <div key={item._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                {/* Thumbnail */}
                                <div className="w-16 h-12 rounded-md bg-gray-100 dark:bg-slate-700 overflow-hidden shrink-0 border border-gray-200 dark:border-slate-600">
                                    {item.images?.[0] ? (
                                        <img src={item.images[0]} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-slate-600">
                                            <FiImage size={18} />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-gray-800 dark:text-white truncate">{item.title}</h3>
                                    <div className="text-xs text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-md font-medium ${getPlatformBadge(item.platform)}`}>{item.platform}</span>
                                        <span>{item.templateType}</span>
                                        <span>v{item.version}</span>
                                    </div>
                                </div>
                                
                                {/* Price */}
                                <div className="text-right shrink-0 px-4 border-l border-gray-100 dark:border-slate-700">
                                    {item.accessType === 'free' ? (
                                        <p className="text-sm font-semibold text-green-500">FREE</p>
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-800 dark:text-white">৳{item.offerPrice || item.price}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-0.5">{item.salesCount || 0} sold</p>
                                </div>
                                
                                {/* Status */}
                                <div className="shrink-0">{getStatusBadge(item.status)}</div>
                                
                                {/* Actions */}
                                <div className="flex gap-1 shrink-0">
                                    {item.previewUrl && (
                                        <a href={item.previewUrl} target="_blank" className="p-2 bg-gray-100 dark:bg-slate-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-md transition-colors" title="Preview">
                                            <FiEye size={14} />
                                        </a>
                                    )}
                                    <button onClick={() => handleEdit(item._id)} className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-md transition-colors" title="Edit">
                                        <FiEdit3 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors" title="Delete">
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DesignTemplatePage;
