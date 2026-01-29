'use client';

// Mentor Edit Blog - Same functionality as Admin Edit Blog
// Uses mentor routes for navigation

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    FiArrowLeft, FiSave, FiTag, FiEye, FiEdit3, FiBold, FiItalic,
    FiList, FiLink, FiAlignLeft, FiAlignCenter, FiUpload, FiX, FiCheck, FiLoader,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';
import toast from 'react-hot-toast';

export default function MentorEditBlogPage() {
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
        title: '', excerpt: '', content: '', thumbnail: '', category: '',
        tags: [], status: 'draft', allowComments: true, metaTitle: '', metaDescription: '',
    });

    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const blogRes = await fetch(`${API_BASE_URL}/blogs/${blogId}`, { headers: { Authorization: `Bearer ${token}` } });
                const blogData = await blogRes.json();

                if (blogData.success && blogData.data) {
                    const blog = blogData.data;
                    setFormData({
                        title: blog.title || '', excerpt: blog.excerpt || '', content: blog.content || '',
                        thumbnail: blog.thumbnail || '', category: blog.category?._id || blog.category || '',
                        tags: blog.tags || [], status: blog.status || 'draft', allowComments: blog.allowComments !== false,
                        metaTitle: blog.metaTitle || '', metaDescription: blog.metaDescription || '',
                    });
                    setTimeout(() => { if (contentRef.current) contentRef.current.innerHTML = blog.content || ''; }, 100);
                }

                const catRes = await fetch(`${API_BASE_URL}/categories`);
                const catData = await catRes.json();
                if (catData.success) setCategories(catData.data || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Failed to load blog');
            } finally {
                setLoading(false);
            }
        };
        if (blogId) fetchData();
    }, [blogId]);

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

    const removeTag = (tag) => setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('image', file);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/upload/image`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: uploadData });
            const data = await res.json();
            if (data.success && data.data?.url) { setFormData(prev => ({ ...prev, thumbnail: data.data.url })); toast.success('Uploaded!'); }
        } catch (error) { toast.error('Upload failed'); }
        finally { setUploading(false); }
    };

    const formatText = (cmd, val = null) => {
        document.execCommand(cmd, false, val);
        if (contentRef.current) setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
    };

    const insertHeading = (lvl) => {
        document.execCommand('formatBlock', false, `h${lvl}`);
        if (contentRef.current) setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
    };

    const handleSubmit = async (status) => {
        if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.thumbnail) {
            toast.error('Fill all required fields'); return;
        }
        if (formData.tags.length === 0) { toast.error('Add at least one tag'); return; }

        setSaving(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...formData, status }),
            });
            const data = await res.json();
            if (data.success) { toast.success('Blog updated!'); router.push('/dashboard/mentor/blog'); }
            else toast.error(data.message || 'Update failed');
        } catch (error) { toast.error('Update failed'); }
        finally { setSaving(false); }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <FiLoader className="w-12 h-12 animate-spin text-red-500" />
        </div>
    );

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/mentor/blog" className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                        <FiArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Edit Blog</h1>
                        <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Update your blog content</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setPreviewMode(!previewMode)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium ${previewMode ? 'bg-gradient-to-r from-red-500 to-cyan-500 text-white' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        {previewMode ? <FiEdit3 size={16} /> : <FiEye size={16} />} {previewMode ? 'Edit' : 'Preview'}
                    </button>
                    <button onClick={() => handleSubmit('draft')} disabled={saving} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        <FiSave size={16} /> Save Draft
                    </button>
                    <button onClick={() => handleSubmit('published')} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-cyan-500 text-white font-semibold shadow-lg disabled:opacity-50">
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiCheck size={16} />} Update
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main */}
                <div className="lg:col-span-2 space-y-6">
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Title *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border text-lg ${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                    </div>

                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Excerpt *</label>
                        <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} maxLength={500} className={`w-full px-4 py-3 rounded-xl border resize-none ${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                    </div>

                    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <div className={`px-4 py-3 border-b flex flex-wrap gap-1 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                            <button onClick={() => formatText('bold')} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}><FiBold size={16} /></button>
                            <button onClick={() => formatText('italic')} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}><FiItalic size={16} /></button>
                            <button onClick={() => insertHeading(2)} className={`px-2 py-1 rounded-lg text-xs font-bold ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>H2</button>
                            <button onClick={() => insertHeading(3)} className={`px-2 py-1 rounded-lg text-xs font-bold ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>H3</button>
                            <button onClick={() => formatText('insertUnorderedList')} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}><FiList size={16} /></button>
                            <button onClick={() => formatText('justifyLeft')} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}><FiAlignLeft size={16} /></button>
                            <button onClick={() => formatText('justifyCenter')} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}><FiAlignCenter size={16} /></button>
                            <button onClick={() => { const url = prompt('URL:'); if (url) formatText('createLink', url); }} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}><FiLink size={16} /></button>
                        </div>
                        {previewMode ? (
                            <div className={`p-6 min-h-[400px] prose max-w-none ${isDark ? 'prose-invert' : ''}`} dangerouslySetInnerHTML={{ __html: formData.content }} />
                        ) : (
                            <div ref={contentRef} contentEditable onInput={(e) => setFormData(prev => ({ ...prev, content: e.currentTarget.innerHTML }))} className={`p-6 min-h-[400px] focus:outline-none ${isDark ? 'text-slate-200' : 'text-slate-800'}`} style={{ lineHeight: 1.8 }} />
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Image *</label>
                        {formData.thumbnail ? (
                            <div className="relative rounded-xl overflow-hidden">
                                <Image src={formData.thumbnail} alt="Thumb" width={400} height={225} className="w-full h-48 object-cover" />
                                <button onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))} className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white"><FiX size={14} /></button>
                            </div>
                        ) : (
                            <label className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                {uploading ? <div className="w-8 h-8 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /> : <FiUpload size={24} className={isDark ? 'text-slate-500' : 'text-slate-400'} />}
                            </label>
                        )}
                    </div>

                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Category *</label>
                        <select name="category" value={formData.category} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}>
                            <option value="">Select</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tags *</label>
                        <div className="flex gap-2">
                            <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag" className={`flex-1 px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`} />
                            <button onClick={addTag} className="px-3 py-2 rounded-lg bg-red-500 text-white"><FiTag size={16} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.tags.map((tag, i) => (
                                <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'}`}>
                                    #{tag}<button onClick={() => removeTag(tag)}><FiX size={12} /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
