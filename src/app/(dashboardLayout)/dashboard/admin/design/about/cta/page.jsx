"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';



const AboutCTADesignPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        heading: { text: 'Ready to Start?', textBn: '???? ???? ?????????' },
        description: { text: 'Join thousands of learners...', textBn: '????? ????? ????????????? ???? ??? ???...' },
        button: { text: 'Get Started', textBn: '???? ????' },
        contactInfo: { phone: '', email: '' }
    });

    useEffect(() => { fetchContent(); }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/design/aboutCTA`);
            const data = await res.json();
            if (data.success && data.data?.aboutCTAContent) {
                setContent(data.data.aboutCTAContent);
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
            const res = await fetch(`${API_URL}/design/aboutCTA`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aboutCTAContent: content })
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CTA Section</h1>
                    <p className="text-gray-500 mt-1">Manage call to action section</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchContent} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700"><FiRefreshCw size={18} /></button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-cyan-500 text-white disabled:opacity-50">
                        <FiSave size={18} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Content</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={content.heading?.text || ''} onChange={(e) => setContent({ ...content, heading: { ...content.heading, text: e.target.value } })} placeholder="Heading (English)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    <input value={content.heading?.textBn || ''} onChange={(e) => setContent({ ...content, heading: { ...content.heading, textBn: e.target.value } })} placeholder="Heading (Bengali)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    <textarea value={content.description?.text || ''} onChange={(e) => setContent({ ...content, description: { ...content.description, text: e.target.value } })} placeholder="Description (English)" rows={3} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    <textarea value={content.description?.textBn || ''} onChange={(e) => setContent({ ...content, description: { ...content.description, textBn: e.target.value } })} placeholder="Description (Bengali)" rows={3} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    <input value={content.button?.text || ''} onChange={(e) => setContent({ ...content, button: { ...content.button, text: e.target.value } })} placeholder="Button (English)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    <input value={content.button?.textBn || ''} onChange={(e) => setContent({ ...content, button: { ...content.button, textBn: e.target.value } })} placeholder="Button (Bengali)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={content.contactInfo?.phone || ''} onChange={(e) => setContent({ ...content, contactInfo: { ...content.contactInfo, phone: e.target.value } })} placeholder="Phone" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    <input value={content.contactInfo?.email || ''} onChange={(e) => setContent({ ...content, contactInfo: { ...content.contactInfo, email: e.target.value } })} placeholder="Email" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
            </div>
        </div>
    );
};

export default AboutCTADesignPage;

