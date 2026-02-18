'use client';
import { API_URL } from '@/config/api';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FiSearch, FiUsers, FiTrash2, FiPlus, FiCalendar, FiLoader, FiCheck, FiRefreshCw, FiEdit3, FiX, FiAward
} from 'react-icons/fi';
import { User } from 'react-icons/fi';

const InstructorManagement = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const router = useRouter();

    const fetchInstructors = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/instructors`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setInstructors(Array.isArray(data.data) ? data.data : []);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstructors();
    }, []);

    const handleEdit = (id) => {
        router.push(`/dashboard/admin/instructor/create?edit=${id}`);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this instructor? This will also disable their user account.')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/instructors/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) fetchInstructors();
        } catch (err) {
            alert('Error deleting');
        }
    };

    const filtered = instructors.filter(ins => {
        const fullName = ins.userId ? `${ins.userId.firstName} ${ins.userId.lastName}` : '';
        const email = ins.userId ? ins.userId.email : '';
        return (
            email.toLowerCase().includes(search.toLowerCase()) ||
            fullName.toLowerCase().includes(search.toLowerCase()) ||
            ins.title.toLowerCase().includes(search.toLowerCase())
        );
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 dark:bg-[#021E14]/20 text-[#021E14] dark:text-emerald-400';
            case 'inactive': return 'bg-[#021E14] dark:bg-[#021E14]/20 text-[#021E14] dark:text-[#021E14]';
            default: return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
        }
    };

    const stats = {
        total: instructors.length,
        active: instructors.filter(ins => ins.status === 'active').length,
        published: instructors.filter(ins => ins.isPublished).length,
    };

    return (
        <div className="p-4 md:p-6 space-y-5 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-[#021E14] flex items-center justify-center">
                        <FiAward className="text-white" size={18} />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Instructors</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage course instructors and their profiles</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchInstructors}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-md text-sm font-medium transition-all disabled:opacity-50"
                    >
                        <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <Link href="/dashboard/admin/instructor/create">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#021E14] hover:bg-[#01140D] text-white rounded-md text-sm font-medium transition-all shadow-md">
                            <FiPlus size={14} />
                            Add Instructor
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-[#021E14] rounded-md flex items-center justify-center">
                            <FiUsers className="text-white" size={14} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.total}</span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Instructors</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-[#021E14] rounded-md flex items-center justify-center">
                            <FiCheck className="text-white" size={14} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.active}</span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-[#D4AF37] rounded-md flex items-center justify-center">
                            <FiCheck className="text-white" size={14} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.published}</span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Published on Website</p>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                    <div className="relative max-w-sm">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            placeholder="Search by name, title or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-md bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-[#021E14] outline-none text-xs transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <FiLoader className="animate-spin text-[#021E14]" size={28} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <FiUsers size={40} className="mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No instructors found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase italic">Instructor</th>
                                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase italic">Title / Designation</th>
                                    <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase italic">Courses</th>
                                    <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase italic">Status</th>
                                    <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase italic">Public</th>
                                    <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase italic">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filtered.map((ins) => (
                                    <tr key={ins._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {ins.userId?.avatar ? (
                                                    <img src={ins.userId.avatar} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-[#021E14] flex items-center justify-center text-white text-xs font-bold">
                                                        {ins.userId?.firstName?.[0]}{ins.userId?.lastName?.[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">
                                                        {ins.userId?.firstName} {ins.userId?.lastName}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{ins.userId?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="max-w-[200px]">
                                                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">{ins.title}</p>
                                                <p className="text-[10px] text-slate-400 italic truncate">{ins.expertise?.join(', ')}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-600">
                                                {ins.assignedCourses?.length || 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(ins.status)}`}>
                                                {ins.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center">
                                                {ins.isPublished ? (
                                                    <span className="w-2 h-2 rounded-full bg-[#021E14] shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Published"></span>
                                                ) : (
                                                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" title="Draft"></span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => handleEdit(ins._id)}
                                                    className="p-1.5 bg-[#021E14] dark:bg-[#021E14]/10 text-[#021E14] dark:text-[#021E14] rounded-md hover:bg-[#021E14] hover:text-white transition-all shadow-sm"
                                                    title="Edit Profile"
                                                >
                                                    <FiEdit3 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ins._id)}
                                                    className="p-1.5 bg-[#021E14] dark:bg-[#021E14]/10 text-[#021E14] hover:bg-[#021E14] hover:text-white rounded-md transition-all"
                                                    title="Delete Instructor"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorManagement;
