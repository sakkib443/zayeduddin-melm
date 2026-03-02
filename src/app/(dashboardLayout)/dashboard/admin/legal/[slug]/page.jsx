'use client';

import React, { useState, useEffect, use } from 'react';
import { API_URL, API_BASE_URL } from '@/config/api';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import dynamic from 'next/dynamic';
import {
    FiArrowLeft, FiSave, FiFileText, FiShield, FiRefreshCw,
    FiLoader, FiCheck, FiGlobe
} from 'react-icons/fi';
import Link from 'next/link';

const RichTextEditor = dynamic(() => import('@/components/Admin/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-lg animate-pulse" />,
});

const SLUG_META = {
    'terms': { title: 'Terms & Conditions', icon: FiFileText, color: 'from-blue-500 to-blue-700' },
    'privacy': { title: 'Privacy Policy', icon: FiShield, color: 'from-emerald-500 to-emerald-700' },
    'return-policy': { title: 'Return & Refund Policy', icon: FiRefreshCw, color: 'from-amber-500 to-amber-700' },
};

export default function EditLegalPage({ params }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;
    const { isDark } = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('en');

    const [formData, setFormData] = useState({
        title: '',
        titleBn: '',
        content: '',
        contentBn: '',
    });

    const meta = SLUG_META[slug] || SLUG_META['terms'];
    const Icon = meta.icon;

    useEffect(() => {
        fetchPage();
    }, [slug]);

    const fetchPage = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/legal-pages/${slug}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success && data.data) {
                setFormData({
                    title: data.data.title || '',
                    titleBn: data.data.titleBn || '',
                    content: data.data.content || '',
                    contentBn: data.data.contentBn || '',
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/legal-pages/${slug}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                alert('Failed to save');
            }
        } catch (err) {
            alert('Save failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <FiLoader className="animate-spin text-[#021E14] mx-auto mb-3" size={32} />
                    <p className="text-sm text-slate-500">Loading page content...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/design/home" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <FiArrowLeft size={18} className="text-slate-500" />
                    </Link>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-white">Edit: {meta.title}</h1>
                        <p className="text-xs text-slate-500">Edit content and save changes</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href={slug === 'terms' ? '/terms' : slug === 'privacy' ? '/privacy' : '/return-policy'}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm transition-colors"
                    >
                        <FiGlobe size={14} /> Preview
                    </a>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium text-sm transition-all shadow-lg disabled:opacity-50 ${saved ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-[#021E14] hover:bg-[#01140D] shadow-[#021E14]/30'
                            }`}
                    >
                        {saving ? (
                            <><FiLoader className="animate-spin" size={16} /> Saving...</>
                        ) : saved ? (
                            <><FiCheck size={16} /> Saved!</>
                        ) : (
                            <><FiSave size={16} /> Save Changes</>
                        )}
                    </button>
                </div>
            </div>

            {/* Title Fields */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Page Title</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-slate-500 mb-1.5">English Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:border-[#021E14] transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 mb-1.5">Bengali Title (বাংলা)</label>
                        <input
                            type="text"
                            value={formData.titleBn}
                            onChange={(e) => setFormData(prev => ({ ...prev, titleBn: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:border-[#021E14] transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Language Tabs + Content Editor */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setActiveTab('en')}
                        className={`flex-1 px-6 py-3.5 text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'en'
                                ? 'text-[#021E14] dark:text-white border-b-2 border-[#021E14] bg-slate-50 dark:bg-slate-700/50'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        🇬🇧 English Content
                    </button>
                    <button
                        onClick={() => setActiveTab('bn')}
                        className={`flex-1 px-6 py-3.5 text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'bn'
                                ? 'text-[#021E14] dark:text-white border-b-2 border-[#021E14] bg-slate-50 dark:bg-slate-700/50'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        🇧🇩 বাংলা কন্টেন্ট
                    </button>
                </div>

                {/* Editor */}
                <div className="p-6">
                    {activeTab === 'en' ? (
                        <RichTextEditor
                            value={formData.content}
                            onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                            placeholder="Write English content here..."
                            isDark={isDark}
                        />
                    ) : (
                        <RichTextEditor
                            value={formData.contentBn}
                            onChange={(val) => setFormData(prev => ({ ...prev, contentBn: val }))}
                            placeholder="বাংলা কন্টেন্ট লিখুন..."
                            isDark={isDark}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
