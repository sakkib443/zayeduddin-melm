'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    FiEdit3,
    FiPlus,
    FiSearch,
    FiFilter,
    FiTrash2,
    FiEdit,
    FiEye,
    FiClock,
    FiUser,
    FiHeart,
    FiMessageCircle,
    FiChevronLeft,
    FiChevronRight,
    FiCalendar,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';
import { useSelector } from 'react-redux';

export default function MentorBlogPage() {
    const { isDark } = useTheme();
    const router = useRouter();
    const user = useSelector(state => state.auth?.user);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [deleteModal, setDeleteModal] = useState({ show: false, blogId: null, title: '' });

    // Fetch mentor's blogs
    const fetchBlogs = async () => {
        if (!user?._id) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            let url = `${API_BASE_URL}/blogs/author/${user._id}?page=${currentPage}&limit=10&all=true`;
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
    }, [currentPage, searchTerm, statusFilter, user?._id]);

    // Delete blog
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
            case 'published': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'draft': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'archived': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className={`text-2xl md:text-3xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        My Blogs
                    </h1>
                    <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Manage your blog posts � {totalBlogs} blogs written
                    </p>
                </div>
                <Link
                    href="/dashboard/mentor/blog/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-cyan-500 text-white font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                    <FiPlus size={18} />
                    Write New Blog
                </Link>
            </div>

            {/* Filters */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
                        <input
                            type="text"
                            placeholder="Search your blogs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all ${isDark
                                ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-red-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-red-500'
                                } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`px-4 py-2.5 rounded-xl border transition-all ${isDark
                            ? 'bg-slate-700/50 border-slate-600 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                            } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            {/* Blog List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className={`text-center py-20 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <FiEdit3 className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} size={48} />
                        <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>No blogs yet</h3>
                        <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Start writing your first blog post!</p>
                        <Link
                            href="/dashboard/mentor/blog/create"
                            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-cyan-500 text-white font-semibold"
                        >
                            <FiPlus size={18} />
                            Write New Blog
                        </Link>
                    </div>
                ) : (
                    blogs.map((blog) => (
                        <div
                            key={blog._id}
                            className={`p-4 md:p-6 rounded-2xl border transition-all hover:shadow-lg ${isDark
                                ? 'bg-slate-800/50 border-slate-700/50 hover:border-red-500/50'
                                : 'bg-white border-slate-200 hover:border-red-500/50'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Thumbnail */}
                                <div className="w-full md:w-48 h-32 md:h-28 relative rounded-xl overflow-hidden flex-shrink-0">
                                    {blog.thumbnail ? (
                                        <Image src={blog.thumbnail} alt={blog.title} fill className="object-cover" />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                            <FiEdit3 className={`${isDark ? 'text-slate-500' : 'text-slate-300'}`} size={32} />
                                        </div>
                                    )}
                                    <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(blog.status)}`}>
                                        {blog.status}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-lg font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {blog.title}
                                    </h3>
                                    <p className={`mt-1 text-sm line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {blog.excerpt}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex flex-wrap items-center gap-4 mt-3">
                                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            <FiCalendar size={12} />
                                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            <FiClock size={12} />
                                            <span>{blog.readingTime} min read</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            <FiEye size={12} />
                                            <span>{blog.totalViews || 0} views</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            <FiHeart size={12} />
                                            <span>{blog.likeCount || 0}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            <FiMessageCircle size={12} />
                                            <span>{blog.commentCount || 0}</span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {blog.tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {blog.tags.slice(0, 4).map((tag, idx) => (
                                                <span key={idx} className={`px-2 py-0.5 text-xs rounded-full ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-col gap-2 justify-end">
                                    <Link
                                        href={`/blog/${blog.slug}`}
                                        target="_blank"
                                        className={`p-2.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <FiEye size={18} />
                                    </Link>
                                    <Link
                                        href={`/dashboard/mentor/blog/edit/${blog._id}`}
                                        className={`p-2.5 rounded-lg transition-colors ${isDark ? 'hover:bg-blue-500/20 text-blue-400' : 'hover:bg-blue-50 text-blue-500'}`}
                                    >
                                        <FiEdit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => setDeleteModal({ show: true, blogId: blog._id, title: blog.title })}
                                        className={`p-2.5 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                                    >
                                        <FiTrash2 size={18} />
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
                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                    >
                        <FiChevronLeft size={18} />
                    </button>
                    <span className={`px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 border border-slate-200'}`}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                    >
                        <FiChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-md p-6 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Delete Blog?</h3>
                        <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Are you sure you want to delete &quot;{deleteModal.title}&quot;?
                        </p>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setDeleteModal({ show: false, blogId: null, title: '' })}
                                className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
