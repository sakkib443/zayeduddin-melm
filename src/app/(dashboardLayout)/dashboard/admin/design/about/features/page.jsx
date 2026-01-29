"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiPlus, FiTrash2 } from 'react-icons/fi';



const AboutFeaturesDesignPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        badge: { text: 'Why Choose Us', textBn: '??? ?????? ???? ?????' },
        heading: { text: 'Our Features', textBn: '?????? ?????????' },
        features: [
            { title: '', titleBn: '', description: '', descriptionBn: '', emoji: '??' }
        ]
    });

    useEffect(() => { fetchContent(); }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/design/aboutFeatures`);
            const data = await res.json();
            if (data.success && data.data?.aboutFeaturesContent) {
                setContent(data.data.aboutFeaturesContent);
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
            const res = await fetch(`${API_URL}/design/aboutFeatures`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aboutFeaturesContent: content })
            });
            const data = await res.json();
            alert(data.success ? 'Saved successfully!' : 'Failed to save');
        } catch (error) {
            alert('Error saving');
        } finally {
            setSaving(false);
        }
    };

    const addFeature = () => setContent({ ...content, features: [...content.features, { title: '', titleBn: '', description: '', descriptionBn: '', emoji: '??' }] });
    const removeFeature = (i) => setContent({ ...content, features: content.features.filter((_, idx) => idx !== i) });
    const updateFeature = (i, field, value) => {
        const updated = [...content.features];
        updated[i] = { ...updated[i], [field]: value };
        setContent({ ...content, features: updated });
    };

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><FiRefreshCw className="w-12 h-12 text-red-500 animate-spin" /></div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Features Section</h1>
                    <p className="text-gray-500 mt-1">Manage about page features</p>
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
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Features</h2>
                    <button onClick={addFeature} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl"><FiPlus /> Add Feature</button>
                </div>
                {content.features?.map((feature, i) => (
                    <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl mb-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-500">Feature #{i + 1}</span>
                            {content.features.length > 1 && <button onClick={() => removeFeature(i)} className="text-red-500"><FiTrash2 /></button>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input value={feature.emoji || ''} onChange={(e) => updateFeature(i, 'emoji', e.target.value)} placeholder="Emoji" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" />
                            <div></div>
                            <input value={feature.title || ''} onChange={(e) => updateFeature(i, 'title', e.target.value)} placeholder="Title (English)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                            <input value={feature.titleBn || ''} onChange={(e) => updateFeature(i, 'titleBn', e.target.value)} placeholder="Title (Bengali)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                            <textarea value={feature.description || ''} onChange={(e) => updateFeature(i, 'description', e.target.value)} placeholder="Description (English)" rows={2} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                            <textarea value={feature.descriptionBn || ''} onChange={(e) => updateFeature(i, 'descriptionBn', e.target.value)} placeholder="Description (Bengali)" rows={2} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutFeaturesDesignPage;

