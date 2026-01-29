'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useEffect, useState } from 'react';
import {
    FiPlus, FiEdit3, FiLoader, FiCheck, FiX, FiSearch,
    FiRefreshCw, FiCode, FiStar, FiDollarSign, FiDownload, FiEye,
    FiExternalLink, FiTerminal, FiPackage, FiFilter, FiGrid, FiList, FiAlertCircle
} from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PLATFORM_OPTIONS = [
    'WordPress', 'PHP', 'JavaScript', 'Python', 'React', 'Next.js', 'Vue.js',
    'Angular', 'Node.js', 'Laravel', 'Django', 'Flutter', 'React Native',
    'Android', 'iOS', 'Unity', 'HTML/CSS', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'Other'
];

const MentorSoftwarePage = () => {
    const [software, setSoftware] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [platformFilter, setPlatformFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const router = useRouter();

    const fetchSoftware = async () => {
        
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/software/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            setSoftware(result.data || []);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSoftware(); }, []);

    const handleEdit = (id) => {
        router.push(`/dashboard/mentor/software/edit/${id}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            case 'pending': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'draft': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'rejected': return 'bg-rose-100 text-rose-600 border-rose-200';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const getPlatformColor = (platform) => {
        const colors = {
            'WordPress': 'bg-blue-100 text-blue-600',
            'PHP': 'bg-indigo-100 text-indigo-600',
            'JavaScript': 'bg-yellow-100 text-yellow-700',
            'React': 'bg-cyan-100 text-cyan-600',
            'Next.js': 'bg-slate-800 text-white',
            'Vue.js': 'bg-emerald-100 text-emerald-600',
            'Node.js': 'bg-green-100 text-green-600',
            'Laravel': 'bg-rose-100 text-rose-600',
            'Python': 'bg-blue-100 text-blue-700',
            'Flutter': 'bg-sky-100 text-sky-600',
        };
        return colors[platform] || 'bg-violet-100 text-violet-600';
    };

    const stats = {
        total: software.length,
        approved: software.filter(s => s.status === 'approved').length,
        pending: software.filter(s => s.status === 'pending').length,
        featured: software.filter(s => s.isFeatured).length,
    };

    const filtered = software.filter(s => {
        const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || s.status === statusFilter;
        const matchPlatform = platformFilter === 'all' || s.platform === platformFilter;
        return matchSearch && matchStatus && matchPlatform;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                        <FiCode className="text-white text-xl" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-800">Software Manager</h1>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">Mentor</span>
                        </div>
                        <p className="text-sm text-slate-500">Scripts, plugins & tools</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchSoftware} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Reload
                    </button>
                    <Link href="/dashboard/mentor/software/create">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/25 transition-all">
                            <FiPlus size={16} /> Add Software
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Software</p>
                            <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg">
                            <FiPackage className="text-2xl text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Approved</p>
                            <p className="text-3xl font-bold text-slate-800">{stats.approved}</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                            <FiCheck className="text-2xl text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Pending</p>
                            <p className="text-3xl font-bold text-slate-800">{stats.pending}</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                            <FiLoader className="text-2xl text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl transition-all">
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

            {/* Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input placeholder="Search software..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 outline-none text-sm transition-all" />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                    {['all', 'approved', 'pending', 'draft'].map(status => (
                        <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all whitespace-nowrap ${statusFilter === status ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                            {status === 'all' ? 'All' : status}
                        </button>
                    ))}
                </div>
                <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-100 border-none outline-none">
                    <option value="all">All Platforms</option>
                    {PLATFORM_OPTIONS.map(p => (<option key={p} value={p}>{p}</option>))}
                </select>
            </div>

            {/* Content - NO DELETE BUTTON */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <FiLoader className="animate-spin text-violet-600" size={40} />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Software...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-300">
                    <FiCode className="text-4xl text-slate-300 mx-auto mb-4" />
                    <p className="text-sm font-black text-slate-600">No Software Found</p>
                    <Link href="/dashboard/mentor/software/create">
                        <button className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-xl mx-auto">
                            <FiPlus size={14} /> Create Software
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((sw) => (
                        <div key={sw._id} className="group bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all overflow-hidden">
                            <div className="relative h-48 bg-gradient-to-br from-violet-100 to-purple-100 overflow-hidden">
                                {sw.images?.[0] ? (
                                    <img src={sw.images[0]} alt={sw.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FiCode className="text-violet-300" size={48} />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    {sw.isFeatured && (
                                        <span className="px-2 py-1 bg-amber-500 text-white rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                                            <FiStar size={10} /> Featured
                                        </span>
                                    )}
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${getPlatformColor(sw.platform)}`}>{sw.platform}</span>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border ${getStatusColor(sw.status)}`}>{sw.status}</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-center pb-4 gap-2">
                                    {sw.previewUrl && (
                                        <a href={sw.previewUrl} target="_blank" className="px-4 py-2 bg-white text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1">
                                            <FiExternalLink size={12} /> Preview
                                        </a>
                                    )}
                                    <button onClick={() => handleEdit(sw._id)} className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold flex items-center gap-1">
                                        <FiEdit3 size={12} /> Edit
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-sm font-black text-slate-800 line-clamp-1">{sw.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">v{sw.version}</span>
                                    <span className="text-[10px] font-bold text-violet-500">{sw.softwareType}</span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] text-slate-400 my-3">
                                    <span className="flex items-center gap-1"><FiStar className="text-amber-500" /> {sw.rating?.toFixed(1) || '0.0'}</span>
                                    <span className="flex items-center gap-1"><FiDownload /> {sw.salesCount || 0} sales</span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    {sw.accessType === 'free' ? (
                                        <span className="text-lg font-black text-emerald-600">FREE</span>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-black text-violet-600">?{sw.offerPrice || sw.price}</span>
                                            {sw.offerPrice && sw.offerPrice < sw.price && (
                                                <span className="text-xs text-slate-400 line-through">?{sw.price}</span>
                                            )}
                                        </div>
                                    )}
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
                    <span className="font-semibold">Note:</span> As a Mentor, you can create and edit software but cannot delete them. Contact an Administrator for deletion requests.
                </p>
            </div>
        </div>
    );
};

export default MentorSoftwarePage;

