'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    FiArrowLeft,
    FiSave,
    FiImage,
    FiVideo,
    FiTag,
    FiEye,
    FiEdit3,
    FiBold,
    FiItalic,
    FiList,
    FiLink,
    FiCode,
    FiAlignLeft,
    FiAlignCenter,
    FiAlignRight,
    FiUpload,
    FiX,
    FiCheck,
    FiLoader,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';
import toast from 'react-hot-toast';

export default function EditBlogPage() {
    const { isDark } = useTheme();
    const router = useRouter();
    const params = useParams();
    const blogId = params.id;
    const contentRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [previewMode, setPreviewMode] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        titleBn: '',
        excerpt: '',
        excerptBn: '',
        content: '',
        contentBn: '',
        thumbnail: '',
        videoUrl: '',
        category: '',
        tags: [],
        status: 'draft',
        isFeatured: false,
        isPopular: false,
        allowComments: true,
        metaTitle: '',
        metaDescription: '',
    });

    const [tagInput, setTagInput] = useState('');

    // Fetch blog data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('accessToken');

                // Fetch blog
                const blogRes = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const blogData = await blogRes.json();

                if (blogData.success && blogData.data) {
                    const blog = blogData.data;
                    setFormData({
                        title: blog.title || '',
                        titleBn: blog.titleBn || '',
                        excerpt: blog.excerpt || '',
                        excerptBn: blog.excerptBn || '',
                        content: blog.content || '',
                        contentBn: blog.contentBn || '',
                        thumbnail: blog.thumbnail || '',
                        videoUrl: blog.videoUrl || '',
                        category: blog.category?._id || blog.category || '',
                        tags: blog.tags || [],
                        status: blog.status || 'draft',
                        isFeatured: blog.isFeatured || false,
                        isPopular: blog.isPopular || false,
                        allowComments: blog.allowComments !== false,
                        metaTitle: blog.metaTitle || '',
                        metaDescription: blog.metaDescription || '',
                    });

                    // Set content in contentEditable
                    setTimeout(() => {
                        if (contentRef.current) {
                            contentRef.current.innerHTML = blog.content || '';
                        }
                    }, 100);
                }

                // Fetch categories
                const catRes = await fetch(`${API_BASE_URL}/categories`);
                const catData = await catRes.json();
                if (catData.success) {
                    setCategories(catData.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Failed to load blog');
            } finally {
                setLoading(false);
            }
        };

        if (blogId) {
            fetchData();
        }
    }, [blogId]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Add tag
    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim().toLowerCase()]
            }));
            setTagInput('');
        }
    };

    // Remove tag
    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // Upload image
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/upload/image`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: uploadData,
            });
            const data = await res.json();
            if (data.success && data.data?.url) {
                setFormData(prev => ({ ...prev, thumbnail: data.data.url }));
                toast.success('Image uploaded successfully!');
            }
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    // Format text in content
    const formatText = (command, value = null) => {
        document.execCommand(command, false, value);
        if (contentRef.current) {
            setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
        }
    };

    // Insert heading
    const insertHeading = (level) => {
        document.execCommand('formatBlock', false, `h${level}`);
        if (contentRef.current) {
            setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
        }
    };

    // Submit form
    const handleSubmit = async (publishStatus) => {
        if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.thumbnail) {
            toast.error('Please fill all required fields');
            return;
        }

        if (formData.tags.length === 0) {
            toast.error('Please add at least one tag');
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...formData, status: publishStatus }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Blog updated successfully!');
                router.push('/dashboard/admin/blog');
            } else {
                toast.error(data.message || 'Failed to update blog');
            }
        } catch (error) {
            toast.error('Failed to update blog');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <FiLoader className="w-12 h-12 mx-auto animate-spin text-red-500" />
                    <p className={`mt-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading blog...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/admin/blog"
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                        <FiArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className={`text-2xl md:text-3xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Edit Blog
                        </h1>
                        <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Update your blog content
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${previewMode
                            ? 'bg-gradient-to-r from-red-500 to-cyan-500 text-white'
                            : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {previewMode ? <FiEdit3 size={16} /> : <FiEye size={16} />}
                        {previewMode ? 'Edit' : 'Preview'}
                    </button>
                    <button
                        onClick={() => handleSubmit('draft')}
                        disabled={saving}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <FiSave size={16} />
                        Save as Draft
                    </button>
                    <button
                        onClick={() => handleSubmit('published')}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-cyan-500 text-white font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <FiCheck size={16} />
                        )}
                        Update & Publish
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Blog Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter your blog title..."
                            className={`w-full px-4 py-3 rounded-xl border text-lg font-medium transition-all ${isDark
                                ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-red-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-red-500'
                                } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                        />
                        <input
                            type="text"
                            name="titleBn"
                            value={formData.titleBn}
                            onChange={handleChange}
                            placeholder="বাংলা শিরোনাম (ঐচ্ছিক)"
                            className={`w-full mt-3 px-4 py-2.5 rounded-xl border transition-all ${isDark
                                ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-red-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-red-500'
                                } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                        />
                    </div>

                    {/* Excerpt */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Excerpt / Short Summary <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            placeholder="Write a brief summary of your blog..."
                            rows={3}
                            maxLength={500}
                            className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${isDark
                                ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-red-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-red-500'
                                } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                        />
                        <p className={`text-xs mt-1 text-right ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {formData.excerpt.length}/500
                        </p>
                    </div>

                    {/* Content Editor */}
                    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <div className={`px-4 py-3 border-b flex flex-wrap gap-1 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                            <button onClick={() => formatText('bold')} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>
                                <FiBold size={16} />
                            </button>
                            <button onClick={() => formatText('italic')} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>
                                <FiItalic size={16} />
                            </button>
                            <div className={`w-px h-6 mx-1 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                            <button onClick={() => insertHeading(2)} className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>
                                H2
                            </button>
                            <button onClick={() => insertHeading(3)} className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>
                                H3
                            </button>
                            <button onClick={() => insertHeading(4)} className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>
                                H4
                            </button>
                            <div className={`w-px h-6 mx-1 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                            <button onClick={() => formatText('insertUnorderedList')} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>
                                <FiList size={16} />
                            </button>
                            <button onClick={() => formatText('justifyLeft')} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>
                                <FiAlignLeft size={16} />
                            </button>
                            <button onClick={() => formatText('justifyCenter')} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>
                                <FiAlignCenter size={16} />
                            </button>
                            <button onClick={() => formatText('justifyRight')} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>
                                <FiAlignRight size={16} />
                            </button>
                            <div className={`w-px h-6 mx-1 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                            <button
                                onClick={() => {
                                    const url = prompt('Enter link URL:');
                                    if (url) formatText('createLink', url);
                                }}
                                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}
                            >
                                <FiLink size={16} />
                            </button>
                            <button onClick={() => formatText('formatBlock', 'pre')} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>
                                <FiCode size={16} />
                            </button>
                        </div>

                        {previewMode ? (
                            <div
                                className={`p-6 min-h-[400px] prose prose-lg max-w-none ${isDark ? 'prose-invert' : ''}`}
                                dangerouslySetInnerHTML={{ __html: formData.content }}
                            />
                        ) : (
                            <div
                                ref={contentRef}
                                contentEditable
                                onInput={(e) => setFormData(prev => ({ ...prev, content: e.currentTarget.innerHTML }))}
                                className={`p-6 min-h-[400px] focus:outline-none ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                                style={{ lineHeight: 1.8 }}
                            />
                        )}
                    </div>
                </div>

                {/* Sidebar - Same as create page */}
                <div className="space-y-6">
                    {/* Featured Image */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Featured Image <span className="text-red-500">*</span>
                        </label>
                        {formData.thumbnail ? (
                            <div className="relative rounded-xl overflow-hidden">
                                <Image src={formData.thumbnail} alt="Thumbnail" width={400} height={225} className="w-full h-48 object-cover" />
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                >
                                    <FiX size={14} />
                                </button>
                            </div>
                        ) : (
                            <label className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isDark
                                ? 'border-slate-600 hover:border-red-500 hover:bg-slate-700/50'
                                : 'border-slate-300 hover:border-red-500 hover:bg-slate-50'
                                }`}>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                {uploading ? (
                                    <div className="w-8 h-8 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <FiUpload className={`mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={24} />
                                        <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Upload Image</span>
                                    </>
                                )}
                            </label>
                        )}
                    </div>

                    {/* Category */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-xl border transition-all ${isDark
                                ? 'bg-slate-700/50 border-slate-600 text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-900'
                                } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                        >
                            <option value="">Select category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Tags <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                placeholder="Add tag..."
                                className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-all ${isDark
                                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                    } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                            />
                            <button onClick={addTag} className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
                                <FiTag size={16} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.tags.map((tag, idx) => (
                                <span key={idx} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'}`}>
                                    #{tag}
                                    <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                                        <FiX size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-xl border transition-all ${isDark
                                ? 'bg-slate-700/50 border-slate-600 text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-900'
                                } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    {/* Options */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Blog Options</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-red-500 focus:ring-red-500" />
                                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Featured Blog</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="isPopular" checked={formData.isPopular} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-red-500 focus:ring-red-500" />
                                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Mark as Popular</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="allowComments" checked={formData.allowComments} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-red-500 focus:ring-red-500" />
                                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Allow Comments</span>
                            </label>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>SEO Settings</h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                name="metaTitle"
                                value={formData.metaTitle}
                                onChange={handleChange}
                                placeholder="Meta Title (max 70 chars)"
                                maxLength={70}
                                className={`w-full px-3 py-2 rounded-lg border text-sm transition-all ${isDark
                                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                    } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                            />
                            <textarea
                                name="metaDescription"
                                value={formData.metaDescription}
                                onChange={handleChange}
                                placeholder="Meta Description (max 160 chars)"
                                maxLength={160}
                                rows={2}
                                className={`w-full px-3 py-2 rounded-lg border text-sm resize-none transition-all ${isDark
                                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                    } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
