'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FiPlay, FiArrowLeft, FiSave, FiClock, FiBook, FiLayers,
    FiFileText, FiHelpCircle, FiFile, FiType, FiSettings, FiCheck,
    FiMonitor, FiTrendingUp, FiCheckCircle
} from 'react-icons/fi';

import QuestionBuilder from '@/components/Admin/lesson/QuestionBuilder';
import DocumentManager from '@/components/Admin/lesson/DocumentManager';
import TextContentManager from '@/components/Admin/lesson/TextContentManager';
import { API_BASE_URL } from '@/config/api';

export default function CreateLessonPage() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('video');
    const [formData, setFormData] = useState({
        title: '',
        titleBn: '',
        description: '',
        descriptionBn: '',
        course: '',
        module: '',
        lessonType: 'video',
        videoUrl: '',
        videoDuration: 0,
        videoProvider: 'youtube',
        videoThumbnail: '',
        textContent: '',
        textContentBn: '',
        textBlocks: [],
        documents: [],
        questions: [],
        quizSettings: {
            passingScore: 70,
            maxAttempts: 0,
            showCorrectAnswers: true,
            shuffleQuestions: false,
            timeLimit: 0,
        },
        order: 1,
        isPublished: false,
        isFree: false,
    });
    const [modules, setModules] = useState([]);
    const [fetchingModules, setFetchingModules] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setCourses(data.data || []);
            } catch (err) {
                console.error('Error fetching courses:', err);
            }
        };
        fetchCourses();
    }, []);

    const fetchModules = async (courseId) => {
        if (!courseId) {
            setModules([]);
            return;
        }
        setFetchingModules(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/modules/course/${courseId}?includeUnpublished=true`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setModules(data.data || []);
        } catch (err) {
            console.error('Error fetching modules:', err);
        } finally {
            setFetchingModules(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'videoDuration' || name === 'order' ? Number(value) : value)
        }));

        if (name === 'course') {
            fetchModules(value);
            setFormData(prev => ({ ...prev, module: '' }));
        }
    };

    const handleNestedChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleQuizSettingsChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            quizSettings: { ...prev.quizSettings, [field]: value }
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const payload = { ...formData };
            if (!payload.videoUrl) delete payload.videoUrl;
            if (!payload.textContent) delete payload.textContent;
            if (payload.documents?.length === 0) delete payload.documents;
            if (payload.questions?.length === 0) delete payload.questions;
            if (payload.textBlocks?.length === 0) delete payload.textBlocks;

            const res = await fetch(`${API_BASE_URL}/lessons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok) {
                alert('Lesson Created Successfully! 🚀');
                router.push('/dashboard/admin/lesson');
            } else {
                const errorMsg = result.errorMessages
                    ? result.errorMessages.map(err => `${err.path.split('.').pop()}: ${err.message}`).join('\n')
                    : result.message;
                alert(`Validation Error ❌\n\n${errorMsg}`);
            }
        } catch (err) {
            console.error('Create error:', err);
            alert('Network error!');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white";
    const labelClass = "text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2";

    const tabs = [
        { id: 'video', label: 'Video', icon: FiPlay, color: 'rose' },
        { id: 'text', label: 'Payload', icon: FiType, color: 'amber' },
        { id: 'documents', label: 'Assets', icon: FiFile, color: 'emerald' },
        { id: 'questions', label: 'Quizzes', icon: FiHelpCircle, color: 'indigo', badge: formData.questions?.length || 0 },
        { id: 'settings', label: 'Config', icon: FiSettings, color: 'slate' },
    ];

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-10 bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard/admin/lesson" className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-500 transition-all shadow-xl active:scale-90">
                        <FiArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Content Deployer</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1 italic flex items-center gap-2">
                            <span className="w-8 h-px bg-slate-200"></span> Provisioning new knowledge unit
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center justify-center gap-4 px-10 py-5 bg-slate-900 dark:bg-indigo-600 hover:scale-[1.02] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group"
                >
                    {loading ? <FiRefreshCw className="animate-spin" size={20} /> : <FiSave size={20} />}
                    Commit Asset
                </button>
            </div>

            {/* Architecture Scope */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 space-y-10">
                <div className="flex items-center gap-4 border-b border-slate-50 dark:border-slate-800 pb-6 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <FiLayers size={18} />
                    </div>
                    <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Structural Placement</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label className={labelClass}>Operational Title (EN) *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Asynchronous Lifecycle Patterns"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Local Identifier (BN)</label>
                            <input
                                type="text"
                                name="titleBn"
                                value={formData.titleBn}
                                onChange={handleChange}
                                placeholder="বিষয়বস্তুর স্থানীয় নাম"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className={labelClass}>Target Series *</label>
                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            >
                                <option value="">Select Domain</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Architecture Node *</label>
                            <select
                                name="module"
                                value={formData.module}
                                onChange={handleChange}
                                required
                                disabled={!formData.course || fetchingModules}
                                className={`${inputClass} disabled:opacity-50`}
                            >
                                <option value="">{fetchingModules ? 'Syncing...' : 'Select Module'}</option>
                                {modules.map(mod => (
                                    <option key={mod._id} value={mod._id}>{mod.order}. {mod.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className={labelClass}>Asset Type</label>
                            <select
                                name="lessonType"
                                value={formData.lessonType}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="video">Stream Focus</option>
                                <option value="text">Document Focus</option>
                                <option value="quiz">Assessment Focus</option>
                                <option value="mixed">Hybrid Model</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Sequence ID</label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                min="1"
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 outline-none border-t border-slate-50 dark:border-slate-800 pt-10">
                    <div className="space-y-2">
                        <label className={labelClass}>Semantic Context (EN)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Define the core objectives and deliverables..."
                            className={`${inputClass} resize-none h-32 leading-relaxed`}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Context Translation (BN)</label>
                        <textarea
                            name="descriptionBn"
                            value={formData.descriptionBn}
                            onChange={handleChange}
                            rows={3}
                            placeholder="বিষয়বস্তুর সংক্ষিপ্ত ব্যাখ্যা..."
                            className={`${inputClass} resize-none h-32 leading-relaxed`}
                        />
                    </div>
                </div>
            </div>

            {/* Content Engineering Space */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 overflow-hidden animate-in slide-in-from-bottom-6 duration-700">
                {/* Navigation Bar */}
                <div className="flex border-b border-slate-50 dark:border-slate-800 overflow-x-auto custom-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-4 px-10 py-8 font-black text-[10px] uppercase tracking-[0.3em] transition-all whitespace-nowrap relative group ${activeTab === tab.id
                                ? `text-indigo-500 bg-indigo-500/5`
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                }`}
                        >
                            <tab.icon size={18} className={activeTab === tab.id ? 'transform scale-125 transition-transform' : ''} />
                            {tab.label}
                            {tab.badge > 0 && (
                                <span className="ml-2 w-5 h-5 rounded-full flex items-center justify-center bg-indigo-500 text-white text-[9px] font-black">
                                    {tab.badge}
                                </span>
                            )}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-indigo-500 animate-pulse"></div>}
                        </button>
                    ))}
                </div>

                {/* Engineering Canvas */}
                <div className="p-10 min-h-[400px]">
                    {activeTab === 'video' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
                            <div className="lg:col-span-8 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className={labelClass}>Source Link (Video URL)</label>
                                        <div className="relative">
                                            <FiPlay className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="url"
                                                name="videoUrl"
                                                value={formData.videoUrl}
                                                onChange={handleChange}
                                                placeholder="https://content.cdn.com/..."
                                                className={`${inputClass} pl-16`}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className={labelClass}>Infrastructural Provider</label>
                                        <select
                                            name="videoProvider"
                                            value={formData.videoProvider}
                                            onChange={handleChange}
                                            className={inputClass}
                                        >
                                            <option value="youtube">YouTube Engine</option>
                                            <option value="vimeo">Vimeo Enterprise</option>
                                            <option value="bunny">Bunny Stream</option>
                                            <option value="cloudinary">Cloudinary Media</option>
                                            <option value="custom">Custom Implementation</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className={labelClass}>Runtime Duration (Seconds)</label>
                                    <div className="relative w-full md:w-1/2">
                                        <FiClock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            name="videoDuration"
                                            value={formData.videoDuration}
                                            onChange={handleChange}
                                            placeholder="e.g. 1800 for 30m coverage"
                                            className={`${inputClass} pl-16`}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                    <FiMonitor size={32} />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Stream Analytics</h4>
                                <p className="text-xs font-bold text-slate-400 leading-relaxed px-4">Provide the exact timestamp in seconds for accurate student tracking and certification.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'text' && (
                        <div className="animate-in fade-in duration-500">
                            <TextContentManager
                                textBlocks={formData.textBlocks}
                                mainContent={formData.textContent}
                                mainContentBn={formData.textContentBn}
                                onChangeBlocks={(blocks) => handleNestedChange('textBlocks', blocks)}
                                onChangeMain={handleNestedChange}
                            />
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="animate-in fade-in duration-500">
                            <DocumentManager
                                documents={formData.documents}
                                onChange={(docs) => handleNestedChange('documents', docs)}
                            />
                        </div>
                    )}

                    {activeTab === 'questions' && (
                        <div className="space-y-10 animate-in fade-in duration-500">
                            <QuestionBuilder
                                questions={formData.questions}
                                onChange={(qs) => handleNestedChange('questions', qs)}
                            />

                            {formData.questions?.length > 0 && (
                                <div className="mt-10 p-10 bg-slate-900 dark:bg-indigo-600 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform">
                                        <FiSettings size={150} />
                                    </div>
                                    <div className="relative z-10 space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                                <FiCheckCircle className="text-white" />
                                            </div>
                                            <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Assessment Governance</h4>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-indigo-200 uppercase tracking-widest px-1">Pass Threshold (%)</label>
                                                <input
                                                    type="number"
                                                    value={formData.quizSettings.passingScore}
                                                    onChange={(e) => handleQuizSettingsChange('passingScore', Number(e.target.value))}
                                                    className="w-full h-14 px-6 bg-white/10 border border-white/20 rounded-2xl outline-none text-white font-black text-lg focus:bg-white/20"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-indigo-200 uppercase tracking-widest px-1">Attempt Quota</label>
                                                <input
                                                    type="number"
                                                    value={formData.quizSettings.maxAttempts}
                                                    onChange={(e) => handleQuizSettingsChange('maxAttempts', Number(e.target.value))}
                                                    className="w-full h-14 px-6 bg-white/10 border border-white/20 rounded-2xl outline-none text-white font-black text-lg focus:bg-white/20"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-indigo-200 uppercase tracking-widest px-1">Timer (Minutes)</label>
                                                <input
                                                    type="number"
                                                    value={formData.quizSettings.timeLimit}
                                                    onChange={(e) => handleQuizSettingsChange('timeLimit', Number(e.target.value))}
                                                    className="w-full h-14 px-6 bg-white/10 border border-white/20 rounded-2xl outline-none text-white font-black text-lg focus:bg-white/20"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-end pb-3 gap-3">
                                                <label className="flex items-center gap-3 cursor-pointer group/item">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.quizSettings.showCorrectAnswers}
                                                        onChange={(e) => handleQuizSettingsChange('showCorrectAnswers', e.target.checked)}
                                                        className="w-5 h-5 rounded-lg border-white/20 text-white bg-transparent accent-white"
                                                    />
                                                    <span className="text-[10px] font-black text-white/80 uppercase tracking-widest group-hover/item:text-white transition-colors">Reveal Keys</span>
                                                </label>
                                            </div>
                                            <div className="flex flex-col justify-end pb-3 gap-3">
                                                <label className="flex items-center gap-3 cursor-pointer group/item">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.quizSettings.shuffleQuestions}
                                                        onChange={(e) => handleQuizSettingsChange('shuffleQuestions', e.target.checked)}
                                                        className="w-5 h-5 rounded-lg border-white/20 text-white bg-transparent accent-white"
                                                    />
                                                    <span className="text-[10px] font-black text-white/80 uppercase tracking-widest group-hover/item:text-white transition-colors">Randomize Order</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-10 animate-in fade-in duration-500">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div
                                    onClick={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                                    className={`flex-1 p-8 rounded-[2rem] border-2 transition-all cursor-pointer group flex items-center gap-6 ${formData.isPublished ? 'bg-emerald-500 border-emerald-400 shadow-2xl shadow-emerald-500/20' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'}`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${formData.isPublished ? 'bg-white text-emerald-500' : 'bg-white dark:bg-slate-700 text-slate-400 group-hover:scale-110'}`}>
                                        <FiCheckCircle size={24} />
                                    </div>
                                    <div>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 block ${formData.isPublished ? 'text-emerald-100' : 'text-slate-400'}`}>Availability</span>
                                        <span className={`text-sm font-black uppercase tracking-tight ${formData.isPublished ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>{formData.isPublished ? 'Live & Operational' : 'Offline Staging'}</span>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setFormData(prev => ({ ...prev, isFree: !prev.isFree }))}
                                    className={`flex-1 p-8 rounded-[2rem] border-2 transition-all cursor-pointer group flex items-center gap-6 ${formData.isFree ? 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-600/20' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'}`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${formData.isFree ? 'bg-white text-indigo-600' : 'bg-white dark:bg-slate-700 text-slate-400 group-hover:scale-110'}`}>
                                        <FiTrendingUp size={24} />
                                    </div>
                                    <div>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 block ${formData.isFree ? 'text-indigo-200' : 'text-slate-400'}`}>Market Reach</span>
                                        <span className={`text-sm font-black uppercase tracking-tight ${formData.isFree ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>{formData.isFree ? 'Free Preview Active' : 'Restricted Access'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 p-10 opacity-5 transition-opacity group-hover:opacity-10">
                                    <FiTrendingUp size={180} />
                                </div>
                                <div className="relative z-10 flex flex-wrap gap-12">
                                    <div className="flex-1 min-w-[300px] space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 flex items-center gap-3">
                                            <span className="w-8 h-px bg-emerald-400"></span> Node Telemetry
                                        </h4>
                                        <p className="text-xs font-bold leading-relaxed text-slate-400">
                                            Reviewing system configuration... Each unit requires a verified <span className="text-white">Video Path</span>, <span className="text-white">Assessment Points</span>, and <span className="text-white">Doc Assets</span> to maximize learning conversion.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 flex-1 min-w-[300px]">
                                        <div className="space-y-2">
                                            <p className="text-[20px] font-black text-indigo-500">{formData.videoUrl ? '01' : '00'}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Video</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[20px] font-black text-emerald-500">{formData.documents?.length || '00'}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Docs</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[20px] font-black text-amber-500">{formData.questions?.length || '00'}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Quiz</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[20px] font-black text-rose-500">{formData.textBlocks?.length || '00'}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Blocks</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Strategic Actions */}
            <div className="flex items-center justify-end gap-6 pt-10 border-t border-slate-100 dark:border-slate-800">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-10 py-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all bg-white dark:bg-slate-900 active:scale-95"
                >
                    Discard Changes
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-14 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 flex items-center gap-3"
                >
                    {loading ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
                    Commit Knowledge Unit
                </button>
            </div>
        </div>
    );
}
