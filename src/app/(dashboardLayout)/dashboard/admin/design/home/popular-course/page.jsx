"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiEye } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';



const PopularCourseDesignPage = () => {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        badge: { text: '', textBn: '' },
        heading: { text1: '', text1Bn: '', highlight: '', highlightBn: '', text2: '', text2Bn: '' },
        description: { text: '', textBn: '' },
        cta: { buttonText: '', buttonTextBn: '', footerText: '', footerTextBn: '' }
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/design/popularCourse`);
            const data = await res.json();
            if (data.success && data.data?.popularCourseContent) {
                setContent(data.data.popularCourseContent);
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
            const res = await fetch(`${API_URL}/design/popularCourse`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ popularCourseContent: content })
            });
            const data = await res.json();
            if (data.success) {
                alert('Popular Course section saved successfully!');
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Courses Section</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage the popular courses section content</p>
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
                        placeholder="Popular Courses"
                    />
                    <InputField
                        label="Badge Text (Bengali)"
                        value={content.badge?.textBn}
                        onChange={(e) => setContent({ ...content, badge: { ...content.badge, textBn: e.target.value } })}
                        placeholder="???????? ?????"
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
                        placeholder="Explore Our "
                    />
                    <InputField
                        label="Text Before Highlight (Bengali)"
                        value={content.heading?.text1Bn}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, text1Bn: e.target.value } })}
                        placeholder="?????? "
                    />
                    <InputField
                        label="Highlighted Text (English)"
                        value={content.heading?.highlight}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, highlight: e.target.value } })}
                        placeholder="Top Courses"
                    />
                    <InputField
                        label="Highlighted Text (Bengali)"
                        value={content.heading?.highlightBn}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, highlightBn: e.target.value } })}
                        placeholder="???? ?????"
                    />
                    <InputField
                        label="Text After Highlight (English)"
                        value={content.heading?.text2}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, text2: e.target.value } })}
                        placeholder=""
                    />
                    <InputField
                        label="Text After Highlight (Bengali)"
                        value={content.heading?.text2Bn}
                        onChange={(e) => setContent({ ...content, heading: { ...content.heading, text2Bn: e.target.value } })}
                        placeholder=" ????"
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
                        placeholder="Premium courses crafted by industry experts."
                    />
                    <InputField
                        label="Description (Bengali)"
                        value={content.description?.textBn}
                        onChange={(e) => setContent({ ...content, description: { ...content.description, textBn: e.target.value } })}
                        placeholder="???????? ????????? ?????? ???? ?????????? ??????"
                    />
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Call to Action</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Button Text (English)"
                        value={content.cta?.buttonText}
                        onChange={(e) => setContent({ ...content, cta: { ...content.cta, buttonText: e.target.value } })}
                        placeholder="View All Courses"
                    />
                    <InputField
                        label="Button Text (Bengali)"
                        value={content.cta?.buttonTextBn}
                        onChange={(e) => setContent({ ...content, cta: { ...content.cta, buttonTextBn: e.target.value } })}
                        placeholder="?? ????? ?????"
                    />
                    <InputField
                        label="Footer Text (English)"
                        value={content.cta?.footerText}
                        onChange={(e) => setContent({ ...content, cta: { ...content.cta, footerText: e.target.value } })}
                        placeholder="Thousands of learners joined"
                    />
                    <InputField
                        label="Footer Text (Bengali)"
                        value={content.cta?.footerTextBn}
                        onChange={(e) => setContent({ ...content, cta: { ...content.cta, footerTextBn: e.target.value } })}
                        placeholder="????? ????? ?????????? ??? ????????"
                    />
                </div>
            </div>
        </div>
    );
};

export default PopularCourseDesignPage;

