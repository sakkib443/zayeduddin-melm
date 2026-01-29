"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';



const AboutHeroDesignPage = () => {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        badge: { text: '', textBn: '' },
        heading: {
            line1: '', line1Bn: '',
            highlight: '', highlightBn: '',
            line2: '', line2Bn: '',
            line3: '', line3Bn: ''
        },
        description: { text: '', textBn: '' },
        cta: { buttonText: '', buttonTextBn: '' },
        stats: [
            { value: '', label: '', labelBn: '' },
            { value: '', label: '', labelBn: '' }
        ]
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/design/aboutHero`);
            const data = await res.json();
            if (data.success && data.data?.aboutHeroContent) {
                setContent(data.data.aboutHeroContent);
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
            const res = await fetch(`${API_URL}/design/aboutHero`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aboutHeroContent: content })
            });
            const data = await res.json();
            if (data.success) {
                alert('About Hero section saved successfully!');
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
            ) : (
                <input
                    type="text"
                    value={value || ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <FiRefreshCw className="w-12 h-12 text-red-500 animate-spin mx-auto" />
                    <p className="mt-4 text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About Hero Section</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage the about page hero section content</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchContent}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                        <FiRefreshCw size={18} />
                        Refresh
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        <FiSave size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Badge Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Badge</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Badge Text (English)"
                        value={content.badge?.text}
                        onChange={(e) => setContent({ ...content, badge: { ...content.badge, text: e.target.value } })}
                        placeholder="THE STANDARD OF EXCELLENCE"
                    />
                    <InputField
                        label="Badge Text (Bengali)"
                        value={content.badge?.textBn}
                        onChange={(e) => setContent({ ...content, badge: { ...content.badge, textBn: e.target.value } })}
                        placeholder="???? ???????????? ??????"
                    />
                </div>
            </div>

            {/* Heading Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Main Heading</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Line 1 (English)"
                        value={content.heading?.line1}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, line1: e.target.value } })}
                        placeholder="BEYOND"
                    />
                    <InputField
                        label="Line 1 (Bengali)"
                        value={content.heading?.line1Bn}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, line1Bn: e.target.value } })}
                        placeholder="???????"
                    />
                    <InputField
                        label="Highlighted Text (English)"
                        value={content.heading?.highlight}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, highlight: e.target.value } })}
                        placeholder="ORDINARY"
                    />
                    <InputField
                        label="Highlighted Text (Bengali)"
                        value={content.heading?.highlightBn}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, highlightBn: e.target.value } })}
                        placeholder="???????"
                    />
                    <InputField
                        label="Line 2 (English)"
                        value={content.heading?.line2}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, line2: e.target.value } })}
                        placeholder="EDUCATION"
                    />
                    <InputField
                        label="Line 2 (Bengali)"
                        value={content.heading?.line2Bn}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, line2Bn: e.target.value } })}
                        placeholder="???????"
                    />
                </div>
            </div>

            {/* Description Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Description</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Description (English)"
                        value={content.description?.text}
                        onChange={(e) => setContent({ ...content, description: { ...content.description, text: e.target.value } })}
                        placeholder="We don't just teach skills..."
                        textarea
                    />
                    <InputField
                        label="Description (Bengali)"
                        value={content.description?.textBn}
                        onChange={(e) => setContent({ ...content, description: { ...content.description, textBn: e.target.value } })}
                        placeholder="???? ???? ?????? ????? ??..."
                        textarea
                    />
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Call to Action Button</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Button Text (English)"
                        value={content.cta?.buttonText}
                        onChange={(e) => setContent({ ...content, cta: { ...content.cta, buttonText: e.target.value } })}
                        placeholder="EXPLORE COURSES"
                    />
                    <InputField
                        label="Button Text (Bengali)"
                        value={content.cta?.buttonTextBn}
                        onChange={(e) => setContent({ ...content, cta: { ...content.cta, buttonTextBn: e.target.value } })}
                        placeholder="????????? ?????"
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutHeroDesignPage;

