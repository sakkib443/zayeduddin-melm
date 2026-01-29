"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';



const AboutMissionDesignPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        badge: { text: 'Our Mission', textBn: '?????? ????' },
        mission: { title: '', titleBn: '', text: '', textBn: '' },
        vision: { title: '', titleBn: '', text: '', textBn: '' }
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/design/aboutMission`);
            const data = await res.json();
            if (data.success && data.data?.aboutMissionContent) {
                setContent(data.data.aboutMissionContent);
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${API_URL}/design/aboutMission`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aboutMissionContent: content })
            });
            const data = await res.json();
            if (data.success) {
                alert('About Mission section saved successfully!');
            } else {
                alert('Failed to save: ' + data.message);
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving content');
        } finally {
            setSaving(false);
        }
    };

    const InputField = ({ label, value, onChange, placeholder, textarea = false }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
            {textarea ? (
                <textarea
                    value={value || ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
                />
            ) : (
                <input
                    type="text"
                    value={value || ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
                />
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiRefreshCw className="w-12 h-12 text-red-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mission & Vision Section</h1>
                    <p className="text-gray-500 mt-1">Manage the mission and vision content</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchContent} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <FiRefreshCw size={18} /> Refresh
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-cyan-500 text-white disabled:opacity-50">
                        <FiSave size={18} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Mission</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Title (English)" value={content.mission?.title} onChange={(e) => setContent({ ...content, mission: { ...content.mission, title: e.target.value } })} placeholder="Our Mission" />
                    <InputField label="Title (Bengali)" value={content.mission?.titleBn} onChange={(e) => setContent({ ...content, mission: { ...content.mission, titleBn: e.target.value } })} placeholder="?????? ????" />
                    <InputField label="Description (English)" value={content.mission?.text} onChange={(e) => setContent({ ...content, mission: { ...content.mission, text: e.target.value } })} textarea placeholder="Mission description..." />
                    <InputField label="Description (Bengali)" value={content.mission?.textBn} onChange={(e) => setContent({ ...content, mission: { ...content.mission, textBn: e.target.value } })} textarea placeholder="???? ?????..." />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Vision</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Title (English)" value={content.vision?.title} onChange={(e) => setContent({ ...content, vision: { ...content.vision, title: e.target.value } })} placeholder="Our Vision" />
                    <InputField label="Title (Bengali)" value={content.vision?.titleBn} onChange={(e) => setContent({ ...content, vision: { ...content.vision, titleBn: e.target.value } })} placeholder="?????? ????" />
                    <InputField label="Description (English)" value={content.vision?.text} onChange={(e) => setContent({ ...content, vision: { ...content.vision, text: e.target.value } })} textarea placeholder="Vision description..." />
                    <InputField label="Description (Bengali)" value={content.vision?.textBn} onChange={(e) => setContent({ ...content, vision: { ...content.vision, textBn: e.target.value } })} textarea placeholder="???? ?????..." />
                </div>
            </div>
        </div>
    );
};

export default AboutMissionDesignPage;

