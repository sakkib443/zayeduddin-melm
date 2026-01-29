'use client';

// Mentor Create Blog - Same as Admin Create Blog
// Re-exports the same component with mentor routes

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    FiArrowLeft,
    FiSave,
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
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';
import toast from 'react-hot-toast';

export default function MentorCreateBlogPage() {
    const { isDark } = useTheme();
    const router = useRouter();
    const contentRef = useRef(null);
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/categories`);
                const data = await res.json();
                if (data.success) setCategories(data.data || []);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim().toLowerCase()] }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    };

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
                toast.success('Image uploaded!');
            }
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const formatText = (command, value = null) => {
        document.execCommand(command, false, value);
        if (contentRef.current) {
            setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
        }
    };

    const insertHeading = (level) => {
        document.execCommand('formatBlock', false, `h${level}`);
        if (contentRef.current) {
            setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
        }
    };

    const handleSubmit = async (publishStatus) => {
        if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.thumbnail) {
            toast.error('Please fill all required fields');
            return;
        }
        if (formData.tags.length === 0) {
            toast.error('Please add at least one tag');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/blogs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...formData, status: publishStatus }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(publishStatus === 'published' ? 'Blog published!' : 'Draft saved!');
                router.push('/dashboard/mentor/blog');
            } else {
                toast.error(data.message || 'Failed to create blog');
            }
        } catch (error) {
            toast.error('Failed to create blog');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/mentor/blog" className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                        <FiArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className={`text-2xl md:text-3xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>Write New Blog</h1>
                        <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Share your knowledge with readers</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setPreviewMode(!previewMode)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${previewMode ? 'bg-gradient-to-r from-red-500 to-cyan-500 text-white' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        {previewMode ? <FiEdit3 size={16} /> : <FiEye size={16} />}
                        {previewMode ? 'Edit' : 'Preview'}
                    </button>
                    <button onClick={() => handleSubmit('draft')} disabled={loading} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        <FiSave size={16} /> Save Draft
                    </button>
                    <button onClick={() => handleSubmit('published')} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-cyan-500 text-white font-semibold shadow-lg disabled:opacity-50">
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiCheck size={16} />}
                        Publish
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Blog Title *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter your blog title..."
                            className={`w-full px-4 py-3 rounded-xl border text-lg font-medium ${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-red-500/20`} />
                    </div>

                    {/* Excerpt */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Excerpt *</label>
                        <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Write a brief summary..." rows={3} maxLength={500}
                            className={`w-full px-4 py-3 rounded-xl border resize-none ${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} focus:outline-none`} />
                        <p className={`text-xs mt-1 text-right ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{formData.excerpt.length}/500</p>
                    </div>

                    {/* Content Editor */}
                    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <div className={`px-4 py-3 border-b flex flex-wrap gap-1 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                            <button onClick={() => formatText('bold')} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}><FiBold size={16} /></button>
                            <button onClick={() => formatText('italic')} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}><FiItalic size={16} /></button>
                            <div className={`w-px h-6 mx-1 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                            <button onClick={() => insertHeading(2)} className={`px-2 py-1 rounded-lg text-xs font-bold ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>H2</button>
                            <button onClick={() => insertHeading(3)} className={`px-2 py-1 rounded-lg text-xs font-bold ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>H3</button>
                            <div className={`w-px h-6 mx-1 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                            <button onClick={() => formatText('insertUnorderedList')} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}><FiList size={16} /></button>
                            <button onClick={() => formatText('justifyLeft')} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}><FiAlignLeft size={16} /></button>
                            <button onClick={() => formatText('justifyCenter')} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}><FiAlignCenter size={16} /></button>
                            <button onClick={() => { const url = prompt('Enter URL:'); if (url) formatText('createLink', url); }} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}><FiLink size={16} /></button>
                        </div>
                        {previewMode ? (
                            <div className={`p-6 min-h-[400px] prose max-w-none ${isDark ? 'prose-invert' : ''}`} dangerouslySetInnerHTML={{ __html: formData.content }} />
                        ) : (
                            <div ref={contentRef} contentEditable onInput={(e) => setFormData(prev => ({ ...prev, content: e.currentTarget.innerHTML }))}
                                className={`p-6 min-h-[400px] focus:outline-none ${isDark ? 'text-slate-200' : 'text-slate-800'}`} style={{ lineHeight: 1.8 }} data-placeholder="Start writing..." />
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Thumbnail */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Featured Image *</label>
                        {formData.thumbnail ? (
                            <div className="relative rounded-xl overflow-hidden">
                                <Image src={formData.thumbnail} alt="Thumbnail" width={400} height={225} className="w-full h-48 object-cover" />
                                <button onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))} className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white"><FiX size={14} /></button>
                            </div>
                        ) : (
                            <label className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer ${isDark ? 'border-slate-600 hover:border-red-500' : 'border-slate-300 hover:border-red-500'}`}>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                {uploading ? <div className="w-8 h-8 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /> : <><FiUpload className={isDark ? 'text-slate-500' : 'text-slate-400'} size={24} /><span className={`text-sm mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Upload</span></>}
                            </label>
                        )}
                    </div>

                    {/* Category */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Category *</label>
                        <select name="category" value={formData.category} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                            <option value="">Select category</option>
                            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                        </select>
                    </div>

                    {/* Tags */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tags *</label>
                        <div className="flex gap-2">
                            <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag..."
                                className={`flex-1 px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                            <button onClick={addTag} className="px-3 py-2 rounded-lg bg-red-500 text-white"><FiTag size={16} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.tags.map((tag, idx) => (
                                <span key={idx} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'}`}>
                                    #{tag}<button onClick={() => removeTag(tag)} className="hover:text-red-500"><FiX size={12} /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Options */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Options</h3>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="allowComments" checked={formData.allowComments} onChange={handleChange} className="w-4 h-4 rounded text-red-500" />
                            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Allow Comments</span>
                        </label>
                    </div>
                </div>
            </div>

            <style jsx>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: ${isDark ? '#64748b' : '#94a3b8'};
                }
            `}</style>
        </div>
    );
}
