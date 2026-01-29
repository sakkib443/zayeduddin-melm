"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
    FiArrowLeft,
    FiSave,
    FiRefreshCw,
    FiEye,
    FiChevronDown,
    FiChevronUp,
    FiCheck,
    FiX,
    FiLoader,
    FiStar,
    FiGrid,
    FiBook,
    FiCode,
    FiList,
    FiUser,
    FiBarChart,
    FiTarget,
    FiArrowRight,
    FiPhone,
    FiGlobe,
    FiMessageCircle,
    FiMapPin,
    FiFilter,
    FiPlus,
    FiTrash2
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';



// Icon mapping for sections
const sectionIconMap = {
    FiStar: FiStar,
    FiGrid: FiGrid,
    FiBook: FiBook,
    FiCode: FiCode,
    FiList: FiList,
    FiCheck: FiCheck,
    FiUser: FiUser,
    FiBarChart: FiBarChart,
    FiTarget: FiTarget,
    FiArrowRight: FiArrowRight,
    FiPhone: FiPhone,
    FiGlobe: FiGlobe,
    FiMessageCircle: FiMessageCircle,
    FiMapPin: FiMapPin,
    FiFilter: FiFilter,
};

const PageContentEditor = ({ params }) => {
    const resolvedParams = use(params);
    const { pageKey } = resolvedParams;
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingSection, setSavingSection] = useState(null);
    const [pageData, setPageData] = useState(null);
    const [expandedSections, setExpandedSections] = useState([]);
    const [sectionContents, setSectionContents] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchPageData();
    }, [pageKey]);

    const fetchPageData = async () => {
        try {
            setLoading(true);
            console.log('Fetching page data for:', pageKey);
            console.log('API URL:', `${API_URL}/page-content/${pageKey}`);

            const res = await fetch(`${API_URL}/page-content/${pageKey}`);
            const data = await res.json();

            console.log('API Response:', data);

            if (data.success && data.data) {
                setPageData(data.data);
                // Initialize section contents from saved data
                const contents = {};
                data.data.sections.forEach(section => {
                    contents[section.sectionKey] = section.savedContent || {};
                });
                setSectionContents(contents);
                // Expand first section by default
                if (data.data.sections.length > 0) {
                    setExpandedSections([data.data.sections[0].sectionKey]);
                }
            } else {
                console.error('API returned unsuccessful:', data);
            }
        } catch (error) {
            console.error('Error fetching page data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (sectionKey) => {
        setExpandedSections(prev =>
            prev.includes(sectionKey)
                ? prev.filter(k => k !== sectionKey)
                : [...prev, sectionKey]
        );
    };

    // Get nested value from object using dot notation
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Set nested value in object using dot notation
    const setNestedValue = (obj, path, value) => {
        const parts = path.split('.');
        const newObj = { ...obj };
        let current = newObj;

        for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) {
                current[parts[i]] = {};
            } else {
                current[parts[i]] = { ...current[parts[i]] };
            }
            current = current[parts[i]];
        }

        current[parts[parts.length - 1]] = value;
        return newObj;
    };

    const handleFieldChange = (sectionKey, fieldKey, value) => {
        setSectionContents(prev => ({
            ...prev,
            [sectionKey]: setNestedValue(prev[sectionKey] || {}, fieldKey, value)
        }));
    };

    const handleArrayFieldChange = (sectionKey, fieldKey, index, value) => {
        const currentArray = getNestedValue(sectionContents[sectionKey] || {}, fieldKey) || [];
        const newArray = [...currentArray];
        newArray[index] = value;
        handleFieldChange(sectionKey, fieldKey, newArray);
    };

    const addArrayItem = (sectionKey, fieldKey) => {
        const currentArray = getNestedValue(sectionContents[sectionKey] || {}, fieldKey) || [];
        handleFieldChange(sectionKey, fieldKey, [...currentArray, '']);
    };

    const removeArrayItem = (sectionKey, fieldKey, index) => {
        const currentArray = getNestedValue(sectionContents[sectionKey] || {}, fieldKey) || [];
        handleFieldChange(sectionKey, fieldKey, currentArray.filter((_, i) => i !== index));
    };

    const saveSection = async (sectionKey) => {
        try {
            setSavingSection(sectionKey);
            const contentToSave = sectionContents[sectionKey] || {};

            console.log('Saving section:', sectionKey);
            console.log('Content to save:', contentToSave);
            console.log('API URL:', `${API_URL}/page-content/${pageKey}/${sectionKey}`);

            const res = await fetch(`${API_URL}/page-content/${pageKey}/${sectionKey}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: contentToSave })
            });
            const data = await res.json();

            console.log('Save response:', data);

            if (data.success) {
                setSuccessMessage(`${sectionKey} saved successfully!`);
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                console.error('Save failed:', data);
                alert('Failed to save: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error saving section:', error);
            alert('Error saving section: ' + error.message);
        } finally {
            setSavingSection(null);
        }
    };

    const saveAllSections = async () => {
        try {
            setSaving(true);
            const sections = Object.entries(sectionContents).map(([sectionKey, content]) => ({
                sectionKey,
                content
            }));

            console.log('Saving all sections:', sections);
            console.log('API URL:', `${API_URL}/page-content/${pageKey}`);

            const res = await fetch(`${API_URL}/page-content/${pageKey}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sections })
            });
            const data = await res.json();

            console.log('Save all response:', data);

            if (data.success) {
                setSuccessMessage('All sections saved successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                console.error('Save all failed:', data);
                alert('Failed to save: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error saving all sections:', error);
            alert('Error saving sections: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const renderField = (section, field) => {
        const value = getNestedValue(sectionContents[section.sectionKey] || {}, field.key);
        const inputClasses = `w-full mt-1.5 px-4 py-3 rounded-xl ${isDark
            ? 'bg-slate-700 text-white border-slate-600 placeholder:text-slate-500'
            : 'bg-gray-50 text-gray-900 border-gray-200 placeholder:text-gray-400'
            } border focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`;

        switch (field.type) {
            case 'textarea':
            case 'richtext':
                return (
                    <textarea
                        value={value || ''}
                        onChange={(e) => handleFieldChange(section.sectionKey, field.key, e.target.value)}
                        rows={3}
                        className={`${inputClasses} resize-none`}
                        placeholder={field.placeholder}
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={value ?? field.defaultValue ?? ''}
                        onChange={(e) => handleFieldChange(section.sectionKey, field.key, parseFloat(e.target.value) || 0)}
                        className={inputClasses}
                        placeholder={field.placeholder}
                    />
                );

            case 'boolean':
                return (
                    <label className="flex items-center gap-3 mt-2 cursor-pointer">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={value ?? field.defaultValue ?? false}
                                onChange={(e) => handleFieldChange(section.sectionKey, field.key, e.target.checked)}
                                className="sr-only"
                            />
                            <div className={`w-12 h-6 rounded-full transition-colors ${(value ?? field.defaultValue)
                                ? 'bg-red-500'
                                : isDark ? 'bg-slate-600' : 'bg-gray-300'
                                }`}>
                                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${(value ?? field.defaultValue) ? 'translate-x-6' : 'translate-x-0.5'
                                    } mt-0.5`} />
                            </div>
                        </div>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {(value ?? field.defaultValue) ? 'Enabled' : 'Disabled'}
                        </span>
                    </label>
                );

            case 'array':
                const arrayValue = value || [];
                return (
                    <div className="space-y-2 mt-2">
                        {arrayValue.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleArrayFieldChange(section.sectionKey, field.key, index, e.target.value)}
                                    className={`flex-1 px-4 py-2.5 rounded-xl ${isDark
                                        ? 'bg-slate-700 text-white border-slate-600'
                                        : 'bg-gray-50 text-gray-900 border-gray-200'
                                        } border focus:ring-2 focus:ring-red-500`}
                                    placeholder={`Item ${index + 1}`}
                                />
                                {arrayValue.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(section.sectionKey, field.key, index)}
                                        className="px-3 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem(section.sectionKey, field.key)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                            <FiPlus size={16} />
                            Add Item
                        </button>
                    </div>
                );

            case 'image':
            case 'link':
            case 'text':
            default:
                return (
                    <input
                        type={field.type === 'link' ? 'url' : 'text'}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(section.sectionKey, field.key, e.target.value)}
                        className={`${inputClasses} ${field.key.includes('Bn') || field.key.includes('bn') ? 'hind-siliguri' : ''}`}
                        placeholder={field.placeholder || field.placeholderBn}
                    />
                );
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <FiLoader className="w-12 h-12 text-red-500 animate-spin mx-auto" />
                    <p className="mt-4 text-gray-500">Loading page content...</p>
                </div>
            </div>
        );
    }

    if (!pageData) {
        return (
            <div className="text-center py-16">
                <FiX className="w-16 h-16 text-red-400 mx-auto" />
                <h3 className="mt-4 text-lg font-semibold text-gray-500">Page not found</h3>
                <Link
                    href="/dashboard/admin/page-content"
                    className="mt-4 inline-flex items-center gap-2 text-red-500 hover:text-red-600"
                >
                    <FiArrowLeft size={18} />
                    Back to all pages
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Success Toast */}
            {successMessage && (
                <div className="fixed top-4 right-4 z-50 animate-slideIn">
                    <div className="flex items-center gap-3 px-5 py-3 bg-emerald-500 text-white rounded-xl shadow-lg">
                        <FiCheck size={20} />
                        <span className="font-medium">{successMessage}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/admin/page-content"
                        className={`p-3 rounded-xl transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <FiArrowLeft size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                    </Link>
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {pageData.pageName}
                        </h1>
                        <p className={`text-sm hind-siliguri ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {pageData.pageNameBn} • {pageData.sections.length} sections
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchPageData}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } transition-colors`}
                    >
                        <FiRefreshCw size={18} />
                        Refresh
                    </button>
                    {pageData.route && (
                        <a
                            href={pageData.route}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } transition-colors`}
                        >
                            <FiEye size={18} />
                            Preview
                        </a>
                    )}
                    <button
                        onClick={saveAllSections}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all disabled:opacity-50"
                    >
                        {saving ? <FiLoader className="animate-spin" size={18} /> : <FiSave size={18} />}
                        {saving ? 'Saving...' : 'Save All'}
                    </button>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
                {pageData.sections.map((section, index) => {
                    const Icon = sectionIconMap[section.icon] || FiStar;
                    const isExpanded = expandedSections.includes(section.sectionKey);
                    const isSaving = savingSection === section.sectionKey;

                    return (
                        <div
                            key={section.sectionKey}
                            className={`rounded-2xl overflow-hidden transition-all ${isDark
                                ? 'bg-slate-800/80 border border-slate-700'
                                : 'bg-white border border-gray-200'
                                } ${isExpanded ? 'shadow-lg' : ''}`}
                        >
                            {/* Section Header */}
                            <button
                                onClick={() => toggleSection(section.sectionKey)}
                                className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-emerald-500 flex items-center justify-center shadow-lg`}>
                                        <Icon className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {section.sectionName}
                                        </h3>
                                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                            {section.sectionNameBn} • {section.fields.length} fields
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {section.updatedAt && (
                                        <span className={`text-xs px-3 py-1 rounded-full ${isDark ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            Updated
                                        </span>
                                    )}
                                    {isExpanded ? (
                                        <FiChevronUp className={isDark ? 'text-gray-400' : 'text-gray-500'} size={20} />
                                    ) : (
                                        <FiChevronDown className={isDark ? 'text-gray-400' : 'text-gray-500'} size={20} />
                                    )}
                                </div>
                            </button>

                            {/* Section Content */}
                            {isExpanded && (
                                <div className={`px-5 pb-5 border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                                    {section.description && (
                                        <p className={`py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {section.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                                        {section.fields.map((field) => (
                                            <div
                                                key={field.key}
                                                className={`${field.type === 'textarea' || field.type === 'array'
                                                    ? 'lg:col-span-2'
                                                    : ''
                                                    }`}
                                            >
                                                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    {field.label}
                                                    {field.labelBn && (
                                                        <span className="ml-2 text-xs text-gray-400 hind-siliguri">
                                                            ({field.labelBn})
                                                        </span>
                                                    )}
                                                    {field.required && (
                                                        <span className="text-red-400 ml-1">*</span>
                                                    )}
                                                </label>
                                                {renderField(section, field)}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Section Save Button */}
                                    <div className="flex justify-end mt-6 pt-4 border-t border-dashed border-gray-200 dark:border-slate-700">
                                        <button
                                            onClick={() => saveSection(section.sectionKey)}
                                            disabled={isSaving}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${isDark
                                                ? 'bg-slate-700 text-white hover:bg-slate-600'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                } disabled:opacity-50`}
                                        >
                                            {isSaving ? (
                                                <FiLoader className="animate-spin" size={16} />
                                            ) : (
                                                <FiSave size={16} />
                                            )}
                                            {isSaving ? 'Saving...' : `Save ${section.sectionName}`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PageContentEditor;
