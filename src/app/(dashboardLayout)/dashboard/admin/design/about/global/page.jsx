"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';



const AboutGlobalDesignPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        badge: { text: 'Global Reach', textBn: '??????????? ????????' },
        heading: { text: 'Worldwide Impact', textBn: '??????????? ??????' },
        description: { text: 'Our students are across the globe...', textBn: '?????? ????????????? ???? ??????...' },
        countries: '50+',
        students: '10K+'
    });

    useEffect(() => { fetchContent(); }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/design/aboutGlobal`);
            const data = await res.json();
            if (data.success && data.data?.aboutGlobalContent) {
                setContent(data.data.aboutGlobalContent);
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
            const res = await fetch(`${API_URL}/design/aboutGlobal`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aboutGlobalContent: content })
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Global Reach Section</h1>
                    <p className="text-gray-500 mt-1">Manage global presence information</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchContent} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700"><FiRefreshCw size={18} /></button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-cyan-500 text-white disabled:opacity-50">
                        <FiSave size={18} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Header</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={content.badge?.text || ''} onChange={(e) => setContent({ ...content, badge: { ...content.badge, text: e.target.value } })} placeholder="Badge (English)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    <input value={content.badge?.textBn || ''} onChange={(e) => setContent({ ...content, badge: { ...content.badge, textBn: e.target.value } })} placeholder="Badge (Bengali)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    <input value={content.heading?.text || ''} onChange={(e) => setContent({ ...content, heading: { ...content.heading, text: e.target.value } })} placeholder="Heading (English)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    <input value={content.heading?.textBn || ''} onChange={(e) => setContent({ ...content, heading: { ...content.heading, textBn: e.target.value } })} placeholder="Heading (Bengali)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Content</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea value={content.description?.text || ''} onChange={(e) => setContent({ ...content, description: { ...content.description, text: e.target.value } })} placeholder="Description (English)" rows={3} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    <textarea value={content.description?.textBn || ''} onChange={(e) => setContent({ ...content, description: { ...content.description, textBn: e.target.value } })} placeholder="Description (Bengali)" rows={3} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    <input value={content.countries || ''} onChange={(e) => setContent({ ...content, countries: e.target.value })} placeholder="Countries (e.g., 50+)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    <input value={content.students || ''} onChange={(e) => setContent({ ...content, students: e.target.value })} placeholder="Students (e.g., 10K+)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
            </div>
        </div>
    );
};

export default AboutGlobalDesignPage;

