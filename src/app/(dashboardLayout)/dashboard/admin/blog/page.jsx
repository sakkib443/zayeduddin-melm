'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    FiEdit3, FiPlus, FiSearch, FiTrash2, FiEdit, FiEye,
    FiClock, FiUser, FiHeart, FiMessageCircle, FiChevronLeft,
    FiChevronRight, FiCalendar, FiRefreshCw
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';

export default function AdminBlogPage() {
    const { isDark } = useTheme();
    const router = useRouter();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [deleteModal, setDeleteModal] = useState({ show: false, blogId: null, title: '' });

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            let url = `${API_BASE_URL}/blogs?page=${currentPage}&limit=10`;
            if (searchTerm) url += `&searchTerm=${searchTerm}`;
            if (statusFilter) url += `&status=${statusFilter}`;

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setBlogs(data.data || []);
                setTotalPages(data.meta?.totalPages || 1);
                setTotalBlogs(data.meta?.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [currentPage, searchTerm, statusFilter]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/blogs/${deleteModal.blogId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setDeleteModal({ show: false, blogId: null, title: '' });
                fetchBlogs();
            }
        } catch (error) {
            console.error('Failed to delete blog:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-emerald-100 text-emerald-700';
            case 'draft': return 'bg-amber-100 text-amber-700';
            case 'archived': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-5 pb-8">
            {/* Header */}
            <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-indigo-600 flex items-center justify-center">
                        <FiEdit3 className="text-white" size={18} />
                    </div>
                    <div>
                        <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Blog Management</h1>
                        <p className={`text-sm font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{totalBlogs} total blogs</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchBlogs}
                        disabled={loading}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-normal border transition-all ${isDark
                            ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                            }`}
                    >
                        <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <Link
                        href="/dashboard/admin/blog/create"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-normal transition-all"
                    >
                        <FiPlus size={14} />
                        New Blog
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} size={16} />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-9 pr-4 py-2 rounded-md border text-sm font-normal transition-all ${isDark
                                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-indigo-500'
                                : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-500'
                                } focus:outline-none`}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`px-3 py-2 rounded-md border text-sm font-normal ${isDark
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-gray-200 text-gray-800'
                            } focus:outline-none`}
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            {/* Blog List */}
            <div className="space-y-3">
                {loading ? (
                    <div className={`flex items-center justify-center py-16 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className={`text-center py-16 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                        <FiEdit3 className={`mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} size={40} />
                        <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>No blogs found</h3>
                        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Start writing your first blog post!</p>
                        <Link
                            href="/dashboard/admin/blog/create"
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-normal"
                        >
                            <FiPlus size={14} />
                            Write New Blog
                        </Link>
                    </div>
                ) : (
                    blogs.map((blog) => (
                        <div
                            key={blog._id}
                            className={`p-4 rounded-md border transition-all ${isDark
                                ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Thumbnail */}
                                <div className="w-full md:w-40 h-28 relative rounded-md overflow-hidden flex-shrink-0">
                                    {blog.thumbnail ? (
                                        <Image src={blog.thumbnail} alt={blog.title} fill className="object-cover" />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                            <FiEdit3 className={`${isDark ? 'text-slate-500' : 'text-gray-300'}`} size={24} />
                                        </div>
                                    )}
                                    <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(blog.status)}`}>
                                        {blog.status}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-base font-semibold line-clamp-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                        {blog.title}
                                    </h3>
                                    <p className={`mt-1 text-sm line-clamp-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        {blog.excerpt}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex flex-wrap items-center gap-4 mt-3">
                                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                            <FiUser size={12} />
                                            <span>{blog.author?.firstName} {blog.author?.lastName}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                            <FiCalendar size={12} />
                                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                            <FiClock size={12} />
                                            <span>{blog.readingTime} min</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                            <FiEye size={12} />
                                            <span>{blog.totalViews || 0}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                            <FiHeart size={12} />
                                            <span>{blog.likeCount || 0}</span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {blog.tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {blog.tags.slice(0, 3).map((tag, idx) => (
                                                <span key={idx} className={`px-2 py-0.5 text-xs rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                                                    #{tag}
                                                </span>
                                            ))}
                                            {blog.tags.length > 3 && (
                                                <span className={`px-2 py-0.5 text-xs rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                                                    +{blog.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-col gap-2 justify-end">
                                    <Link
                                        href={`/blog/${blog.slug}`}
                                        target="_blank"
                                        className={`p-2 rounded-md transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
                                        title="Preview"
                                    >
                                        <FiEye size={16} />
                                    </Link>
                                    <Link
                                        href={`/dashboard/admin/blog/edit/${blog._id}`}
                                        className={`p-2 rounded-md transition-colors ${isDark ? 'hover:bg-blue-500/20 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                                        title="Edit"
                                    >
                                        <FiEdit size={16} />
                                    </Link>
                                    <button
                                        onClick={() => setDeleteModal({ show: true, blogId: blog._id, title: blog.title })}
                                        className={`p-2 rounded-md transition-colors ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                                        title="Delete"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md transition-colors disabled:opacity-50 border ${isDark
                            ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <FiChevronLeft size={16} />
                    </button>
                    <span className={`px-4 py-2 rounded-md text-sm border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md transition-colors disabled:opacity-50 border ${isDark
                            ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <FiChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className={`w-full max-w-md p-5 rounded-md ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Delete Blog?</h3>
                        <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Are you sure you want to delete &quot;{deleteModal.title}&quot;? This cannot be undone.
                        </p>
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => setDeleteModal({ show: false, blogId: null, title: '' })}
                                className={`flex-1 py-2 rounded-md text-sm font-normal transition-colors ${isDark
                                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2 rounded-md text-sm font-normal bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
