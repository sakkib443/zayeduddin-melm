"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';



const AboutFounderDesignPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        name: 'John Doe',
        nameBn: '?? ??',
        title: 'Founder & CEO',
        titleBn: '??????????? ? ????',
        quote: 'Our mission is to transform education...',
        quoteBn: '?????? ???? ??? ???????? ?????????? ???...',
        image: ''
    });

    useEffect(() => { fetchContent(); }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/design/aboutFounder`);
            const data = await res.json();
            if (data.success && data.data?.aboutFounderContent) {
                setContent(data.data.aboutFounderContent);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${API_URL}/design/aboutFounder`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aboutFounderContent: content })
            });
            const data = await res.json();
            alert(data.success ? 'Saved successfully!' : 'Failed to save');
        } catch (error) {
            alert('Error saving');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><FiRefreshCw className="w-12 h-12 text-red-500 animate-spin" /></div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Founder Section</h1>
                    <p className="text-gray-500 mt-1">Manage founder information</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchContent} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700"><FiRefreshCw size={18} /></button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-cyan-500 text-white disabled:opacity-50">
                        <FiSave size={18} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name (English)</label>
                        <input value={content.name || ''} onChange={(e) => setContent({ ...content, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name (Bengali)</label>
                        <input value={content.nameBn || ''} onChange={(e) => setContent({ ...content, nameBn: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title (English)</label>
                        <input value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title (Bengali)</label>
                        <input value={content.titleBn || ''} onChange={(e) => setContent({ ...content, titleBn: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quote (English)</label>
                        <textarea value={content.quote || ''} onChange={(e) => setContent({ ...content, quote: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quote (Bengali)</label>
                        <textarea value={content.quoteBn || ''} onChange={(e) => setContent({ ...content, quoteBn: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                        <input value={content.image || ''} onChange={(e) => setContent({ ...content, image: e.target.value })} placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutFounderDesignPage;

