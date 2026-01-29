"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { LuSave, LuPlus, LuTrash2, LuRefreshCw, LuEye, LuImage, LuType, LuList, LuChartBar } from 'react-icons/lu';
import { useTheme } from '@/providers/ThemeProvider';



const HeroDesignPage = () => {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [heroContent, setHeroContent] = useState({
        badge: { text: '', textBn: '', showNew: true },
        heading: { line1: '', line1Bn: '', line2: '', line2Bn: '' },
        dynamicTexts: [''],
        dynamicTextsBn: [''],
        description: { text: '', textBn: '', brandName: '' },
        features: [{ text: '', textBn: '' }],
        searchPlaceholder: { text: '', textBn: '' },
        stats: { activeUsers: 0, downloads: 0, avgRating: 0, totalCourses: 0 }
    });

    // Fetch hero design data
    useEffect(() => {
        fetchHeroDesign();
    }, []);

    const fetchHeroDesign = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/design/hero`);
            const data = await res.json();
            if (data.success && data.data?.heroContent) {
                setHeroContent(data.data.heroContent);
            }
        } catch (error) {
            console.error('Error fetching hero design:', error);
        } finally {
            setLoading(false);
        }
    };

    // Save hero design
    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${API_URL}/design/hero`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ heroContent })
            });
            const data = await res.json();
            if (data.success) {
                alert('Hero section saved successfully!');
            } else {
                alert('Failed to save: ' + data.message);
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving hero section');
        } finally {
            setSaving(false);
        }
    };

    // Dynamic text handlers
    const addDynamicText = (lang) => {
        if (lang === 'en') {
            setHeroContent(prev => ({ ...prev, dynamicTexts: [...prev.dynamicTexts, ''] }));
        } else {
            setHeroContent(prev => ({ ...prev, dynamicTextsBn: [...prev.dynamicTextsBn, ''] }));
        }
    };

    const removeDynamicText = (index, lang) => {
        if (lang === 'en') {
            setHeroContent(prev => ({
                ...prev,
                dynamicTexts: prev.dynamicTexts.filter((_, i) => i !== index)
            }));
        } else {
            setHeroContent(prev => ({
                ...prev,
                dynamicTextsBn: prev.dynamicTextsBn.filter((_, i) => i !== index)
            }));
        }
    };

    const updateDynamicText = (index, value, lang) => {
        if (lang === 'en') {
            const updated = [...heroContent.dynamicTexts];
            updated[index] = value;
            setHeroContent(prev => ({ ...prev, dynamicTexts: updated }));
        } else {
            const updated = [...heroContent.dynamicTextsBn];
            updated[index] = value;
            setHeroContent(prev => ({ ...prev, dynamicTextsBn: updated }));
        }
    };

    // Feature handlers
    const addFeature = () => {
        setHeroContent(prev => ({
            ...prev,
            features: [...prev.features, { text: '', textBn: '' }]
        }));
    };

    const removeFeature = (index) => {
        setHeroContent(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const updateFeature = (index, field, value) => {
        const updated = [...heroContent.features];
        updated[index][field] = value;
        setHeroContent(prev => ({ ...prev, features: updated }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading hero design...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Hero Section Design
                    </h1>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Customize the hero section content and appearance
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchHeroDesign}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                    >
                        <LuRefreshCw size={18} />
                        Refresh
                    </button>
                    <a
                        href="/"
                        target="_blank"
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                    >
                        <LuEye size={18} />
                        Preview
                    </a>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all disabled:opacity-50"
                    >
                        <LuSave size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Badge Section */}
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-emerald-500 rounded-xl flex items-center justify-center">
                            <LuImage className="text-white" size={20} />
                        </div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Badge</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Badge Text (English)</label>
                            <input
                                type="text"
                                value={heroContent.badge?.text || ''}
                                onChange={(e) => setHeroContent(prev => ({ ...prev, badge: { ...prev.badge, text: e.target.value } }))}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                                placeholder="e.g., Premium Learning Platform"
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Badge Text (?????)</label>
                            <input
                                type="text"
                                value={heroContent.badge?.textBn || ''}
                                onChange={(e) => setHeroContent(prev => ({ ...prev, badge: { ...prev.badge, textBn: e.target.value } }))}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent hind-siliguri`}
                                placeholder="????: ?????????? ??????? ???????????"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={heroContent.badge?.showNew || false}
                                onChange={(e) => setHeroContent(prev => ({ ...prev, badge: { ...prev.badge, showNew: e.target.checked } }))}
                                className="w-5 h-5 rounded-lg text-red-500 focus:ring-red-500"
                            />
                            <label className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Show "NEW" badge</label>
                        </div>
                    </div>
                </div>

                {/* Heading Section */}
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <LuType className="text-white" size={20} />
                        </div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Main Heading</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Main Heading (English) - Big</label>
                            <input
                                type="text"
                                value={heroContent.heading?.line1 || ''}
                                onChange={(e) => setHeroContent(prev => ({ ...prev, heading: { ...prev.heading, line1: e.target.value } }))}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg font-semibold`}
                                placeholder="e.g., Elevate Your Digital Success"
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Main Heading (?????) - Big</label>
                            <input
                                type="text"
                                value={heroContent.heading?.line1Bn || ''}
                                onChange={(e) => setHeroContent(prev => ({ ...prev, heading: { ...prev.heading, line1Bn: e.target.value } }))}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg font-semibold hind-siliguri`}
                                placeholder="????: ????? ??????? ?????"
                            />
                        </div>
                        <hr className={`my-2 ${isDark ? 'border-slate-600' : 'border-gray-200'}`} />
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Text Before Typing (English) - Smaller</label>
                            <input
                                type="text"
                                value={heroContent.heading?.line2 || ''}
                                onChange={(e) => setHeroContent(prev => ({ ...prev, heading: { ...prev.heading, line2: e.target.value } }))}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                                placeholder="e.g., Learn"
                            />
                            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>This text appears before the typing animation</p>
                        </div>
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Text Before Typing (?????) - Smaller</label>
                            <input
                                type="text"
                                value={heroContent.heading?.line2Bn || ''}
                                onChange={(e) => setHeroContent(prev => ({ ...prev, heading: { ...prev.heading, line2Bn: e.target.value } }))}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent hind-siliguri`}
                                placeholder="????: ?????"
                            />
                        </div>
                    </div>
                </div>

                {/* Dynamic Texts (Typing Animation) */}
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                                <LuList className="text-white" size={20} />
                            </div>
                            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Typing Animation (English)</h3>
                        </div>
                        <button
                            onClick={() => addDynamicText('en')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-600 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                        >
                            <LuPlus size={16} /> Add
                        </button>
                    </div>
                    <div className="space-y-3">
                        {heroContent.dynamicTexts?.map((text, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => updateDynamicText(index, e.target.value, 'en')}
                                    className={`flex-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                                    placeholder={`Text ${index + 1}`}
                                />
                                {heroContent.dynamicTexts.length > 1 && (
                                    <button
                                        onClick={() => removeDynamicText(index, 'en')}
                                        className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                    >
                                        <LuTrash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dynamic Texts Bengali */}
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                                <LuList className="text-white" size={20} />
                            </div>
                            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Typing Animation (?????)</h3>
                        </div>
                        <button
                            onClick={() => addDynamicText('bn')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-600 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                        >
                            <LuPlus size={16} /> Add
                        </button>
                    </div>
                    <div className="space-y-3">
                        {heroContent.dynamicTextsBn?.map((text, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => updateDynamicText(index, e.target.value, 'bn')}
                                    className={`flex-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent hind-siliguri`}
                                    placeholder={`?????? ${index + 1}`}
                                />
                                {heroContent.dynamicTextsBn.length > 1 && (
                                    <button
                                        onClick={() => removeDynamicText(index, 'bn')}
                                        className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                    >
                                        <LuTrash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className={`p-6 rounded-2xl lg:col-span-2 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <LuType className="text-white" size={20} />
                        </div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Description</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description (English)</label>
                            <textarea
                                value={heroContent.description?.text || ''}
                                onChange={(e) => setHeroContent(prev => ({ ...prev, description: { ...prev.description, text: e.target.value } }))}
                                rows={3}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                                placeholder="Enter description..."
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description (?????)</label>
                            <textarea
                                value={heroContent.description?.textBn || ''}
                                onChange={(e) => setHeroContent(prev => ({ ...prev, description: { ...prev.description, textBn: e.target.value } }))}
                                rows={3}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent hind-siliguri`}
                                placeholder="?????? ?????..."
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Brand Name (highlighted)</label>
                            <input
                                type="text"
                                value={heroContent.description?.brandName || ''}
                                onChange={(e) => setHeroContent(prev => ({ ...prev, description: { ...prev.description, brandName: e.target.value } }))}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent font-bold text-red-600`}
                                placeholder="e.g., eJobsIT"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className={`p-6 rounded-2xl lg:col-span-2 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <LuChartBar className="text-white" size={20} />
                        </div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Statistics</h3>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Active Users</label>
                            <input
                                type="number"
                                value={heroContent.stats?.activeUsers || 0}
                                onChange={(e) => setHeroContent(prev => ({ ...prev, stats: { ...prev.stats, activeUsers: parseInt(e.target.value) || 0 } }))}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Downloads</label>
                            <input
                                type="number"
                                value={heroContent.stats?.downloads || 0}
                                onChange={(e) => setHeroContent(prev => ({ ...prev, stats: { ...prev.stats, downloads: parseInt(e.target.value) || 0 } }))}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Average Rating</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={heroContent.stats?.avgRating || 0}
                                onChange={(e) => setHeroContent(prev => ({ ...prev, stats: { ...prev.stats, avgRating: parseFloat(e.target.value) || 0 } }))}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Total Products</label>
                            <input
                                type="number"
                                value={heroContent.stats?.totalProducts || 0}
                                onChange={(e) => setHeroContent(prev => ({ ...prev, stats: { ...prev.stats, totalProducts: parseInt(e.target.value) || 0 } }))}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                            />
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className={`p-6 rounded-2xl lg:col-span-2 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <LuList className="text-white" size={20} />
                            </div>
                            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Feature Pills</h3>
                        </div>
                        <button
                            onClick={addFeature}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-600 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                        >
                            <LuPlus size={16} /> Add Feature
                        </button>
                    </div>
                    <div className="space-y-3">
                        {heroContent.features?.map((feature, index) => (
                            <div key={index} className="flex gap-3 items-center">
                                <input
                                    type="text"
                                    value={feature.text}
                                    onChange={(e) => updateFeature(index, 'text', e.target.value)}
                                    className={`flex-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                                    placeholder="English text"
                                />
                                <input
                                    type="text"
                                    value={feature.textBn}
                                    onChange={(e) => updateFeature(index, 'textBn', e.target.value)}
                                    className={`flex-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 focus:border-transparent hind-siliguri`}
                                    placeholder="????? ??????"
                                />
                                {heroContent.features.length > 1 && (
                                    <button
                                        onClick={() => removeFeature(index)}
                                        className="px-3 py-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                    >
                                        <LuTrash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroDesignPage;

