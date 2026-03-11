"use client";
import { API_URL, API_BASE_URL } from '@/config/api';
import { authFetch } from '@/config/authFetch';


import React, { useState, useEffect } from 'react';
import { LuSave, LuPlus, LuTrash2, LuRefreshCw, LuEye, LuImage, LuType, LuList, LuChartBar, LuUsers, LuDownload, LuStar, LuLayers } from 'react-icons/lu';
import { useTheme } from '@/providers/ThemeProvider';
import Hero from '@/components/Home/Hero';



const HeroDesignPage = () => {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [heroContent, setHeroContent] = useState({
        badge: { text: '', textBn: '', showNew: true },
        heading: { line1: '', line1Bn: '', line2: '', line2Bn: '' },
        dynamicTexts: [''],
        dynamicTextsBn: [''],
        description: { text: '', textBn: '', brandName: '' },
        features: [{ text: '', textBn: '' }],
        searchPlaceholder: { text: '', textBn: '' },
        stats: { activeUsers: 0, downloads: 0, avgRating: 0, totalProducts: 0 },
        backgroundImage: '',
        backgroundOverlayColor: '#021E14',
        backgroundOverlayOpacity: 0.12,
        backgroundBlur: 0.5,
        backgroundGrayscale: true,
        textColors: {
            heading: '#021E14',
            subtitle: '#021E14',
            bio: '#021E14',
            seeMore: '#D4AF37'
        },
        textShadow: {
            enabled: false,
            color: 'rgba(0,0,0,0.3)',
            blur: 4,
            offsetX: 0,
            offsetY: 2
        }
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
            const res = await authFetch(`${API_URL}/design/hero`, {
                method: 'PATCH',
                body: JSON.stringify({ heroContent })
            });
            const data = await res.json();
            if (data.success) {
                alert('Hero section saved successfully!');
                fetchHeroDesign(); // Refresh to get latest from DB
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

    // Background image upload handler
    const handleBackgroundImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setUploading(true);
            const res = await authFetch(`${API_BASE_URL}/upload/single`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success && data.data?.url) {
                setHeroContent(prev => ({ ...prev, backgroundImage: data.data.url }));
            } else {
                alert('Image upload failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveBackgroundImage = () => {
        setHeroContent(prev => ({ ...prev, backgroundImage: '' }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#021E14]/30 border-t-red-500 rounded-full animate-spin mx-auto"></div>
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
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#021E14] to-[#021E14] text-white rounded-xl font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all disabled:opacity-50"
                    >
                        <LuSave size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start relative pb-20">
                {/* Left Side: Controls (Scrollable) */}
                <div className="flex-1 space-y-8 w-full order-2 lg:order-1 max-w-4xl">

                    {/* Background Customization */}
                    <div className={`p-8 rounded-[2rem] ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#021E14] to-emerald-900 rounded-2xl flex items-center justify-center shadow-lg">
                                <LuImage className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Visual Identity</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Configure background scenery and atmospheric filters</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Image Part */}
                            <div className="space-y-6">
                                <div className={`group relative w-full h-56 rounded-3xl overflow-hidden border-2 border-dashed transition-all duration-500 ${isDark ? 'border-slate-600 bg-slate-700/30' : 'border-gray-200 bg-gray-50 hover:bg-gray-100/50'}`}>
                                    {heroContent.backgroundImage ? (
                                        <div className="relative w-full h-full">
                                            <img src={heroContent.backgroundImage} alt="Hero BG" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                <LuImage className="text-white animate-pulse" size={32} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center p-8 text-gray-400">
                                            <LuImage size={48} className="mx-auto mb-3 opacity-20" />
                                            <p className="text-xs font-medium">Drop your background here</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl cursor-pointer font-bold text-sm transition-all active:scale-95 shadow-lg ${uploading ? 'opacity-50' : ''} ${isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-[#021E14] text-white hover:bg-[#021E14]/90'}`}>
                                        <LuPlus size={20} />
                                        {uploading ? 'Uploading Atmosphere...' : 'Upload New Texture'}
                                        <input type="file" accept="image/*" onChange={handleBackgroundImageUpload} disabled={uploading} className="hidden" />
                                    </label>
                                    {heroContent.backgroundImage && (
                                        <button onClick={handleRemoveBackgroundImage} className="p-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm active:scale-95">
                                            <LuTrash2 size={24} />
                                        </button>
                                    )}
                                </div>
                                <div className={`p-5 rounded-2xl border border-dashed ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-[#021E14]/5 border-[#021E14]/10'}`}>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-emerald-600">Optimum Resolution</h4>
                                    <p className="text-lg font-bold font-mono tracking-tighter text-gray-800 dark:text-gray-200">1920 × 1080 <span className="text-xs font-normal opacity-50 ml-1">PX</span></p>
                                </div>
                            </div>

                            {/* Filters Part */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-black uppercase tracking-widest opacity-50">Atmospheric Tint</label>
                                        <div className="px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-700 font-mono text-[10px] uppercase font-bold">{heroContent.backgroundOverlayColor}</div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <input type="color" value={heroContent.backgroundOverlayColor || '#021E14'} onChange={(e) => setHeroContent(prev => ({ ...prev, backgroundOverlayColor: e.target.value }))} className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-white shadow-xl hover:scale-105 transition-transform appearance-none bg-transparent" />
                                        <input type="text" value={heroContent.backgroundOverlayColor || '#021E14'} onChange={(e) => setHeroContent(prev => ({ ...prev, backgroundOverlayColor: e.target.value }))} className={`flex-1 px-5 py-3.5 rounded-2xl border font-mono text-sm tracking-widest ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`} />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-black uppercase tracking-widest opacity-50">Tint Density</label>
                                            <span className="text-xs font-black">{Math.round((heroContent.backgroundOverlayOpacity || 0) * 100)}%</span>
                                        </div>
                                        <input type="range" min="0" max="1" step="0.01" value={heroContent.backgroundOverlayOpacity || 0.12} onChange={(e) => setHeroContent(prev => ({ ...prev, backgroundOverlayOpacity: parseFloat(e.target.value) }))} className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-[#021E14]" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-black uppercase tracking-widest opacity-50">Blur</label>
                                                <span className="text-[10px] font-black">{heroContent.backgroundBlur}px</span>
                                            </div>
                                            <input type="range" min="0" max="10" step="0.5" value={heroContent.backgroundBlur || 0} onChange={(e) => setHeroContent(prev => ({ ...prev, backgroundBlur: parseFloat(e.target.value) }))} className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-[#D4AF37]" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest opacity-50 block">Grayscale</label>
                                            <button onClick={() => setHeroContent(prev => ({ ...prev, backgroundGrayscale: !prev.backgroundGrayscale }))} className={`w-full group flex items-center justify-between px-5 py-2.5 rounded-2xl border transition-all duration-300 ${heroContent.backgroundGrayscale ? 'bg-[#021E14] border-[#021E14] text-white shadow-lg' : isDark ? 'bg-slate-700 border-slate-600 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                                                <div className={`w-3 h-3 rounded-full shadow-inner transition-all duration-500 ${heroContent.backgroundGrayscale ? 'bg-emerald-400' : 'bg-current opacity-20'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Typography Colors */}
                    <div className={`p-8 rounded-[2rem] ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-900 rounded-2xl flex items-center justify-center shadow-lg">
                                <LuType className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Typography Colors</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Customize the color of each text element to match your background</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Heading Color */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black uppercase tracking-widest opacity-50">Name / Heading</label>
                                    <div className="px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-700 font-mono text-[10px] uppercase font-bold">{heroContent.textColors?.heading || '#021E14'}</div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <input type="color" value={heroContent.textColors?.heading || '#021E14'} onChange={(e) => setHeroContent(prev => ({ ...prev, textColors: { ...prev.textColors, heading: e.target.value } }))} className="w-14 h-14 rounded-2xl cursor-pointer border-4 border-white shadow-xl hover:scale-105 transition-transform appearance-none bg-transparent" />
                                    <input type="text" value={heroContent.textColors?.heading || '#021E14'} onChange={(e) => setHeroContent(prev => ({ ...prev, textColors: { ...prev.textColors, heading: e.target.value } }))} className={`flex-1 px-5 py-3.5 rounded-2xl border font-mono text-sm tracking-widest ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`} />
                                </div>
                            </div>

                            {/* Subtitle Color */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black uppercase tracking-widest opacity-50">Subtitle / Title</label>
                                    <div className="px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-700 font-mono text-[10px] uppercase font-bold">{heroContent.textColors?.subtitle || '#021E14'}</div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <input type="color" value={heroContent.textColors?.subtitle || '#021E14'} onChange={(e) => setHeroContent(prev => ({ ...prev, textColors: { ...prev.textColors, subtitle: e.target.value } }))} className="w-14 h-14 rounded-2xl cursor-pointer border-4 border-white shadow-xl hover:scale-105 transition-transform appearance-none bg-transparent" />
                                    <input type="text" value={heroContent.textColors?.subtitle || '#021E14'} onChange={(e) => setHeroContent(prev => ({ ...prev, textColors: { ...prev.textColors, subtitle: e.target.value } }))} className={`flex-1 px-5 py-3.5 rounded-2xl border font-mono text-sm tracking-widest ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`} />
                                </div>
                            </div>

                            {/* Bio / Description Color */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black uppercase tracking-widest opacity-50">Bio / Description</label>
                                    <div className="px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-700 font-mono text-[10px] uppercase font-bold">{heroContent.textColors?.bio || '#021E14'}</div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <input type="color" value={heroContent.textColors?.bio || '#021E14'} onChange={(e) => setHeroContent(prev => ({ ...prev, textColors: { ...prev.textColors, bio: e.target.value } }))} className="w-14 h-14 rounded-2xl cursor-pointer border-4 border-white shadow-xl hover:scale-105 transition-transform appearance-none bg-transparent" />
                                    <input type="text" value={heroContent.textColors?.bio || '#021E14'} onChange={(e) => setHeroContent(prev => ({ ...prev, textColors: { ...prev.textColors, bio: e.target.value } }))} className={`flex-1 px-5 py-3.5 rounded-2xl border font-mono text-sm tracking-widest ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`} />
                                </div>
                            </div>

                            {/* See More Link Color */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black uppercase tracking-widest opacity-50">"See More" Link</label>
                                    <div className="px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-700 font-mono text-[10px] uppercase font-bold">{heroContent.textColors?.seeMore || '#D4AF37'}</div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <input type="color" value={heroContent.textColors?.seeMore || '#D4AF37'} onChange={(e) => setHeroContent(prev => ({ ...prev, textColors: { ...prev.textColors, seeMore: e.target.value } }))} className="w-14 h-14 rounded-2xl cursor-pointer border-4 border-white shadow-xl hover:scale-105 transition-transform appearance-none bg-transparent" />
                                    <input type="text" value={heroContent.textColors?.seeMore || '#D4AF37'} onChange={(e) => setHeroContent(prev => ({ ...prev, textColors: { ...prev.textColors, seeMore: e.target.value } }))} className={`flex-1 px-5 py-3.5 rounded-2xl border font-mono text-sm tracking-widest ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`} />
                                </div>
                            </div>
                        </div>

                        {/* Reset to defaults */}
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
                            <button
                                onClick={() => setHeroContent(prev => ({ ...prev, textColors: { heading: '#021E14', subtitle: '#021E14', bio: '#021E14', seeMore: '#D4AF37' } }))}
                                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${isDark ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                <LuRefreshCw size={16} />
                                Reset to Default Colors
                            </button>
                        </div>
                    </div>

                    {/* Text Shadow Controls */}
                    <div className={`p-8 rounded-[2rem] ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-900 rounded-2xl flex items-center justify-center shadow-lg">
                                    <LuLayers className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Text Shadow</h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Add depth to your text with shadow effects</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setHeroContent(prev => ({ ...prev, textShadow: { ...prev.textShadow, enabled: !prev.textShadow?.enabled } }))}
                                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${heroContent.textShadow?.enabled ? 'bg-violet-600 border-violet-600 text-white shadow-lg' : isDark ? 'bg-slate-700 border-slate-600 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 transition-all ${heroContent.textShadow?.enabled ? 'bg-white border-white' : 'border-current opacity-30'}`} />
                                <span className="text-xs font-black uppercase tracking-widest">{heroContent.textShadow?.enabled ? 'Enabled' : 'Disabled'}</span>
                            </button>
                        </div>

                        {heroContent.textShadow?.enabled && (
                            <div className="space-y-8">
                                {/* Shadow Color */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-black uppercase tracking-widest opacity-50">Shadow Color</label>
                                        <div className="px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-700 font-mono text-[10px] uppercase font-bold">{heroContent.textShadow?.color || 'rgba(0,0,0,0.3)'}</div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <input type="color" value={heroContent.textShadow?.color?.startsWith('rgba') ? '#000000' : (heroContent.textShadow?.color || '#000000')} onChange={(e) => setHeroContent(prev => ({ ...prev, textShadow: { ...prev.textShadow, color: e.target.value } }))} className="w-14 h-14 rounded-2xl cursor-pointer border-4 border-white shadow-xl hover:scale-105 transition-transform appearance-none bg-transparent" />
                                        <input type="text" value={heroContent.textShadow?.color || 'rgba(0,0,0,0.3)'} onChange={(e) => setHeroContent(prev => ({ ...prev, textShadow: { ...prev.textShadow, color: e.target.value } }))} className={`flex-1 px-5 py-3.5 rounded-2xl border font-mono text-sm tracking-widest ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`} placeholder="e.g. rgba(0,0,0,0.3) or #000000" />
                                    </div>
                                </div>

                                {/* Blur, OffsetX, OffsetY */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-black uppercase tracking-widest opacity-50">Blur</label>
                                            <span className="text-xs font-black">{heroContent.textShadow?.blur || 0}px</span>
                                        </div>
                                        <input type="range" min="0" max="20" step="1" value={heroContent.textShadow?.blur || 4} onChange={(e) => setHeroContent(prev => ({ ...prev, textShadow: { ...prev.textShadow, blur: parseFloat(e.target.value) } }))} className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-violet-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-black uppercase tracking-widest opacity-50">Offset X</label>
                                            <span className="text-xs font-black">{heroContent.textShadow?.offsetX || 0}px</span>
                                        </div>
                                        <input type="range" min="-10" max="10" step="1" value={heroContent.textShadow?.offsetX || 0} onChange={(e) => setHeroContent(prev => ({ ...prev, textShadow: { ...prev.textShadow, offsetX: parseFloat(e.target.value) } }))} className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-violet-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-black uppercase tracking-widest opacity-50">Offset Y</label>
                                            <span className="text-xs font-black">{heroContent.textShadow?.offsetY || 0}px</span>
                                        </div>
                                        <input type="range" min="-10" max="10" step="1" value={heroContent.textShadow?.offsetY || 2} onChange={(e) => setHeroContent(prev => ({ ...prev, textShadow: { ...prev.textShadow, offsetY: parseFloat(e.target.value) } }))} className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-violet-600" />
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-100'}`}>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Shadow Preview</p>
                                    <p
                                        className="text-3xl font-bold"
                                        style={{
                                            color: heroContent.textColors?.heading || '#021E14',
                                            textShadow: `${heroContent.textShadow?.offsetX || 0}px ${heroContent.textShadow?.offsetY || 2}px ${heroContent.textShadow?.blur || 4}px ${heroContent.textShadow?.color || 'rgba(0,0,0,0.3)'}`
                                        }}
                                    >
                                        Sample Text Preview
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Floating Intelligence - Badge */}
                    <div className={`p-8 rounded-[2rem] ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-900 rounded-2xl flex items-center justify-center shadow-lg">
                                <LuStar className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Accent Highlights</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Control the promotional badge displayed above the main heading</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">Badge Text (EN)</label>
                                <input type="text" value={heroContent.badge?.text || ''} onChange={(e) => setHeroContent(prev => ({ ...prev, badge: { ...prev.badge, text: e.target.value } }))} className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'}`} placeholder="e.g. #1 Platform" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">Badge Text (BN)</label>
                                <input type="text" value={heroContent.badge?.textBn || ''} onChange={(e) => setHeroContent(prev => ({ ...prev, badge: { ...prev.badge, textBn: e.target.value } }))} className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold hind-siliguri ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'}`} placeholder="????:... " />
                            </div>
                            <div className="md:col-span-2">
                                <button onClick={() => setHeroContent(prev => ({ ...prev, badge: { ...prev.badge, showNew: !prev.badge.showNew } }))} className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${heroContent.badge?.showNew ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : isDark ? 'bg-slate-700 border-slate-600 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                    <div className={`w-4 h-4 rounded-full border-2 transition-all ${heroContent.badge?.showNew ? 'bg-white border-white' : 'border-current opacity-30'}`} />
                                    <span className="text-xs font-black uppercase tracking-widest">Show Promotional "NEW" Indicator</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Architecture - Heading & Description */}
                    <div className={`p-8 rounded-[2rem] ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-900 to-[#021E14] rounded-2xl flex items-center justify-center shadow-lg">
                                <LuType className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Core Messaging</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Define the primary headline and narrative biography</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Headline Group */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6 bg-gray-50/50 dark:bg-slate-700/20 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/50">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500">English Headline</h4>
                                    <div className="space-y-4">
                                        <input type="text" value={heroContent.heading?.line1 || ''} onChange={(e) => setHeroContent(prev => ({ ...prev, heading: { ...prev.heading, line1: e.target.value } }))} placeholder="Main Heading" className={`w-full px-5 py-4 rounded-2xl border text-lg font-bold ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-200'}`} />
                                        <input type="text" value={heroContent.heading?.line2 || ''} onChange={(e) => setHeroContent(prev => ({ ...prev, heading: { ...prev.heading, line2: e.target.value } }))} placeholder="Secondary Subtitle" className={`w-full px-5 py-3 rounded-2xl border uppercase tracking-widest font-bold text-sm ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-200'}`} />
                                    </div>
                                </div>
                                <div className="space-y-6 bg-emerald-50/50 dark:bg-emerald-900/5 p-6 rounded-3xl border border-emerald-100/50 dark:border-emerald-900/20">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Bengali Headline</h4>
                                    <div className="space-y-4">
                                        <input type="text" value={heroContent.heading?.line1Bn || ''} onChange={(e) => setHeroContent(prev => ({ ...prev, heading: { ...prev.heading, line1Bn: e.target.value } }))} placeholder="????? ??????" className={`w-full px-5 py-4 rounded-2xl border text-lg font-bold hind-siliguri ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-200'}`} />
                                        <input type="text" value={heroContent.heading?.line2Bn || ''} onChange={(e) => setHeroContent(prev => ({ ...prev, heading: { ...prev.heading, line2Bn: e.target.value } }))} placeholder="????????? ?????????" className={`w-full px-5 py-3 rounded-2xl border uppercase tracking-widest font-bold text-sm hind-siliguri ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-200'}`} />
                                    </div>
                                </div>
                            </div>

                            {/* Bio Narrative */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">Narrative (EN)</label>
                                    <textarea value={heroContent.description?.text || ''} onChange={(e) => setHeroContent(prev => ({ ...prev, description: { ...prev.description, text: e.target.value } }))} rows={5} className={`w-full px-5 py-4 rounded-3xl border resize-none transition-shadow focus:shadow-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'}`} placeholder="Draft your English story..." />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">Narrative (BN)</label>
                                    <textarea value={heroContent.description?.textBn || ''} onChange={(e) => setHeroContent(prev => ({ ...prev, description: { ...prev.description, textBn: e.target.value } }))} rows={5} className={`w-full px-5 py-4 rounded-3xl border resize-none transition-shadow focus:shadow-lg hind-siliguri ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'}`} placeholder="?????? ????? ?????..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistical Insights */}
                    <div className={`p-8 rounded-[2rem] ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-900 rounded-2xl flex items-center justify-center shadow-lg">
                                <LuChartBar className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Success Metrics</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Key quantitative data points to display credibility</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Active Learners', icon: <LuUsers size={20} />, key: 'activeUsers', color: 'indigo' },
                                { label: 'Library Size', icon: <LuDownload size={20} />, key: 'downloads', color: 'emerald' },
                                { label: 'Rating (0-5)', icon: <LuStar size={20} />, key: 'avgRating', step: '0.1', color: 'amber' },
                                { label: 'Curriculums', icon: <LuLayers size={20} />, key: 'totalProducts', color: 'rose' }
                            ].map((stat) => (
                                <div key={stat.key} className={`p-5 rounded-3xl border ${isDark ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50/50 border-gray-100 hover:shadow-md transition-shadow'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'} text-${stat.color}-500`}>
                                            {stat.icon}
                                        </div>
                                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{stat.label}</span>
                                    </div>
                                    <input
                                        type="number"
                                        step={stat.step || '1'}
                                        value={heroContent.stats?.[stat.key] || 0}
                                        onChange={(e) => setHeroContent(prev => ({ ...prev, stats: { ...prev.stats, [stat.key]: parseFloat(e.target.value) || 0 } }))}
                                        className={`w-full px-4 py-2 bg-transparent text-xl font-black text-center focus:outline-none ${isDark ? 'text-white' : 'text-[#021E14]'}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Animation - Typing Sequence */}
                    <div className={`p-8 rounded-[2rem] ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-amber-900 rounded-2xl flex items-center justify-center shadow-lg">
                                    <LuList className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Motion Sequence</h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Manage the sequence of words in the typing animation</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* English Dynamic */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">English Sequence</h4>
                                    <button onClick={() => addDynamicText('en')} className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all">
                                        <LuPlus size={16} />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {heroContent.dynamicTexts?.map((text, index) => (
                                        <div key={index} className="flex gap-2 group">
                                            <input type="text" value={text} onChange={(e) => updateDynamicText(index, e.target.value, 'en')} className={`flex-1 px-5 py-3 rounded-2xl border text-sm ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200 focus:bg-white'}`} placeholder={`Phrase ${index + 1}`} />
                                            {heroContent.dynamicTexts.length > 1 && (
                                                <button onClick={() => removeDynamicText(index, 'en')} className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                                                    <LuTrash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bengali Dynamic */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Bengali Sequence</h4>
                                    <button onClick={() => addDynamicText('bn')} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                                        <LuPlus size={16} />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {heroContent.dynamicTextsBn?.map((text, index) => (
                                        <div key={index} className="flex gap-2 group">
                                            <input type="text" value={text} onChange={(e) => updateDynamicText(index, e.target.value, 'bn')} className={`flex-1 px-5 py-3 rounded-2xl border text-sm hind-siliguri ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200 focus:bg-white'}`} placeholder={`????? ${index + 1}`} />
                                            {heroContent.dynamicTextsBn.length > 1 && (
                                                <button onClick={() => removeDynamicText(index, 'bn')} className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                                                    <LuTrash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interaction - Feature Pills */}
                    <div className={`p-8 rounded-[2rem] ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-[#021E14] rounded-2xl flex items-center justify-center shadow-lg">
                                    <LuLayers className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Trust Indicators</h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Highlight unique selling points and feature pills</p>
                                </div>
                            </div>
                            <button onClick={addFeature} className="flex items-center gap-2 px-6 py-3 bg-[#021E14] text-white rounded-2xl text-sm font-black transition-all hover:shadow-lg active:scale-95">
                                <LuPlus size={18} /> Add Pill
                            </button>
                        </div>

                        <div className="space-y-4">
                            {heroContent.features?.map((feature, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-4 p-5 rounded-3xl bg-gray-50/50 dark:bg-slate-700/20 border border-gray-100 dark:border-slate-700/50 group relative">
                                    <div className="flex-1">
                                        <input type="text" value={feature.text} onChange={(e) => updateFeature(index, 'text', e.target.value)} className={`w-full px-4 py-2 bg-transparent text-sm font-bold border-b border-gray-200 dark:border-slate-600 focus:border-[#021E14] outline-none transition-colors`} placeholder="English Feature Label" />
                                    </div>
                                    <div className="flex-1">
                                        <input type="text" value={feature.textBn} onChange={(e) => updateFeature(index, 'textBn', e.target.value)} className={`w-full px-4 py-2 bg-transparent text-sm font-bold border-b border-gray-200 dark:border-slate-600 focus:border-emerald-500 outline-none transition-colors hind-siliguri`} placeholder="????? ??????" />
                                    </div>
                                    {heroContent.features.length > 1 && (
                                        <button onClick={() => removeFeature(index)} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-all border border-red-50">
                                            <LuTrash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: STICKY LIVE PREVIEW (The Game Changer) */}
                <div className="lg:w-[450px] xl:w-[500px] lg:sticky lg:top-24 order-1 lg:order-2 w-full">
                    <div className={`p-6 rounded-[2.5rem] overflow-hidden ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100 shadow-2xl shadow-gray-200/80'}`}>
                        <div className="flex items-center justify-between mb-6 px-4">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ${isDark ? 'text-white' : 'text-gray-900'}`}>Visual Instance</span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                100% Accurate
                            </div>
                        </div>

                        {/* SCALE PREVIEW WRAPPER */}
                        <div className={`relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden border ${isDark ? 'border-slate-700' : 'border-gray-100'} bg-gray-50 flex items-center justify-center p-0`}>
                            <div className="absolute inset-0 z-0 origin-center" style={{ transform: 'scale(0.35)', width: '1920px', height: '1080px', left: '50%', top: '50%', marginLeft: '-960px', marginTop: '-540px' }}>
                                <div className="w-full h-full pointer-events-none">
                                    <Hero data={heroContent} />
                                </div>
                            </div>
                            <div className="absolute inset-0 z-10 pointer-events-none border-[12px] border-white dark:border-slate-800 rounded-[2rem]" />
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className={`p-5 rounded-3xl ${isDark ? 'bg-slate-700/30' : 'bg-indigo-50/50'} border border-dashed ${isDark ? 'border-slate-600' : 'border-indigo-100'}`}>
                                <div className="flex items-start gap-3">
                                    <LuEye className="text-indigo-600 mt-1 shrink-0" size={20} />
                                    <div>
                                        <h5 className="text-xs font-black uppercase mb-1 text-indigo-700">Prop-Driven Reflection</h5>
                                        <p className="text-[11px] leading-relaxed text-indigo-900/60 dark:text-gray-400">
                                            This preview utilizes the actual source code of the homepage Hero section. Every filter, font, and spacing precisely reflects the production environment.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 active:scale-95 disabled:opacity-50">
                                    <LuSave size={20} />
                                    {saving ? 'Publishing...' : 'Publish Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroDesignPage;

