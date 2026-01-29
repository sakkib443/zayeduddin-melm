"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';



const WhatWeProvideDesignPage = () => {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        badge: { text: '', textBn: '' },
        heading: { text1: '', text1Bn: '', highlight: '', highlightBn: '' },
        description: { text: '', textBn: '' },
        features: [],
        cta: { text: '', textBn: '' }
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/design/whatWeProvide`);
            const data = await res.json();
            if (data.success && data.data?.whatWeProvideContent) {
                setContent(data.data.whatWeProvideContent);
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
            const res = await fetch(`${API_URL}/design/whatWeProvide`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ whatWeProvideContent: content })
            });
            const data = await res.json();
            if (data.success) {
                alert('What We Provide section saved successfully!');
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

    const addFeature = () => {
        setContent({
            ...content,
            features: [...(content.features || []), { title: '', titleBn: '', description: '', descriptionBn: '', emoji: '??' }]
        });
    };

    const removeFeature = (index) => {
        setContent({
            ...content,
            features: content.features.filter((_, i) => i !== index)
        });
    };

    const updateFeature = (index, field, value) => {
        const updated = [...content.features];
        updated[index] = { ...updated[index], [field]: value };
        setContent({ ...content, features: updated });
    };

    const InputField = ({ label, value, onChange, placeholder }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
            <input
                type="text"
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">What We Provide Section</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage the what we provide section content</p>
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
                        placeholder="Why Choose Us"
                    />
                    <InputField
                        label="Badge Text (Bengali)"
                        value={content.badge?.textBn}
                        onChange={(e) => setContent({ ...content, badge: { ...content.badge, textBn: e.target.value } })}
                        placeholder="??? ?????? ???? ?????"
                    />
                </div>
            </div>

            {/* Heading Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Heading</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Text Before Highlight (English)"
                        value={content.heading?.text1}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, text1: e.target.value } })}
                        placeholder="What We "
                    />
                    <InputField
                        label="Text Before Highlight (Bengali)"
                        value={content.heading?.text1Bn}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, text1Bn: e.target.value } })}
                        placeholder="???? ?? "
                    />
                    <InputField
                        label="Highlighted Text (English)"
                        value={content.heading?.highlight}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, highlight: e.target.value } })}
                        placeholder="Provide"
                    />
                    <InputField
                        label="Highlighted Text (Bengali)"
                        value={content.heading?.highlightBn}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, highlightBn: e.target.value } })}
                        placeholder="?????? ???"
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
                        placeholder="We are committed to providing the best learning experience."
                    />
                    <InputField
                        label="Description (Bengali)"
                        value={content.description?.textBn}
                        onChange={(e) => setContent({ ...content, description: { ...content.description, textBn: e.target.value } })}
                        placeholder="???? ???? ????? ???????? ?????? ???? ????????????????"
                    />
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Features</h2>
                    <button
                        onClick={addFeature}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                    >
                        <FiPlus size={18} />
                        Add Feature
                    </button>
                </div>

                {content.features?.map((feature, index) => (
                    <div key={index} className="p-4 mb-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">Feature {index + 1}</span>
                            <button
                                onClick={() => removeFeature(index)}
                                className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                            >
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Title (English)"
                                value={feature.title}
                                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                placeholder="Lifetime Support"
                            />
                            <InputField
                                label="Title (Bengali)"
                                value={feature.titleBn}
                                onChange={(e) => updateFeature(index, 'titleBn', e.target.value)}
                                placeholder="???????? ???????"
                            />
                            <InputField
                                label="Description (English)"
                                value={feature.description}
                                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                placeholder="Get lifetime support for all your purchases."
                            />
                            <InputField
                                label="Description (Bengali)"
                                value={feature.descriptionBn}
                                onChange={(e) => updateFeature(index, 'descriptionBn', e.target.value)}
                                placeholder="????? ?? ??????? ???? ???????? ??????? ????"
                            />
                            <InputField
                                label="Emoji"
                                value={feature.emoji}
                                onChange={(e) => updateFeature(index, 'emoji', e.target.value)}
                                placeholder="??"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Call to Action</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Button Text (English)"
                        value={content.cta?.text}
                        onChange={(e) => setContent({ ...content, cta: { ...content.cta, text: e.target.value } })}
                        placeholder="Learn More About Us"
                    />
                    <InputField
                        label="Button Text (Bengali)"
                        value={content.cta?.textBn}
                        onChange={(e) => setContent({ ...content, cta: { ...content.cta, textBn: e.target.value } })}
                        placeholder="?????? ???????? ??? ?????"
                    />
                </div>
            </div>
        </div>
    );
};

export default WhatWeProvideDesignPage;

