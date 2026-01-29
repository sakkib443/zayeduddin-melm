"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiPlus, FiTrash2 } from 'react-icons/fi';



const AboutStatsDesignPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        stats: [
            { value: '10K+', label: 'Happy Students', labelBn: '??? ??????????' },
            { value: '50+', label: 'Expert Mentors', labelBn: '???????? ??????' },
            { value: '100+', label: 'Courses', labelBn: '?????' },
            { value: '95%', label: 'Success Rate', labelBn: '?????? ???' }
        ]
    });

    useEffect(() => { fetchContent(); }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/design/aboutStats`);
            const data = await res.json();
            if (data.success && data.data?.aboutStatsContent) {
                setContent(data.data.aboutStatsContent);
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
            const res = await fetch(`${API_URL}/design/aboutStats`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aboutStatsContent: content })
            });
            const data = await res.json();
            alert(data.success ? 'Saved successfully!' : 'Failed to save');
        } catch (error) {
            alert('Error saving');
        } finally {
            setSaving(false);
        }
    };

    const addStat = () => setContent({ ...content, stats: [...content.stats, { value: '', label: '', labelBn: '' }] });
    const removeStat = (i) => setContent({ ...content, stats: content.stats.filter((_, idx) => idx !== i) });
    const updateStat = (i, field, value) => {
        const updated = [...content.stats];
        updated[i] = { ...updated[i], [field]: value };
        setContent({ ...content, stats: updated });
    };

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><FiRefreshCw className="w-12 h-12 text-red-500 animate-spin" /></div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Statistics Section</h1>
                    <p className="text-gray-500 mt-1">Manage about page statistics</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchContent} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700"><FiRefreshCw size={18} /></button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-cyan-500 text-white disabled:opacity-50">
                        <FiSave size={18} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Stats</h2>
                    <button onClick={addStat} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl"><FiPlus /> Add Stat</button>
                </div>
                {content.stats?.map((stat, i) => (
                    <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl mb-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-500">Stat #{i + 1}</span>
                            {content.stats.length > 1 && <button onClick={() => removeStat(i)} className="text-red-500"><FiTrash2 /></button>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input value={stat.value || ''} onChange={(e) => updateStat(i, 'value', e.target.value)} placeholder="Value (e.g., 10K+)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                            <input value={stat.label || ''} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Label (English)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                            <input value={stat.labelBn || ''} onChange={(e) => updateStat(i, 'labelBn', e.target.value)} placeholder="Label (Bengali)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutStatsDesignPage;

