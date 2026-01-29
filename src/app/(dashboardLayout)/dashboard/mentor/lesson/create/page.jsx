'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FiPlay, FiArrowLeft, FiSave, FiClock, FiBook, FiLayers,
    FiFileText, FiHelpCircle, FiFile, FiType, FiSettings, FiCheck
} from 'react-icons/fi';

// Import custom components
import QuestionBuilder from '@/components/Admin/lesson/QuestionBuilder';
import DocumentManager from '@/components/Admin/lesson/DocumentManager';
import TextContentManager from '@/components/Admin/lesson/TextContentManager';

export default function CreateLessonPage() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('video'); // video, text, documents, questions, settings
    const [formData, setFormData] = useState({
        title: '',
        titleBn: '',
        description: '',
        descriptionBn: '',
        course: '',
        module: '',
        lessonType: 'video',
        // Video
        videoUrl: '',
        videoDuration: 0,
        videoProvider: 'youtube',
        videoThumbnail: '',
        // Text Content
        textContent: '',
        textContentBn: '',
        textBlocks: [],
        // Documents
        documents: [],
        // Questions
        questions: [],
        quizSettings: {
            passingScore: 70,
            maxAttempts: 0,
            showCorrectAnswers: true,
            shuffleQuestions: false,
            timeLimit: 0,
        },
        // Order & Access
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
                const res = await fetch(`${BASE_URL}/courses`, {
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
            const res = await fetch(`${BASE_URL}/modules/course/${courseId}?includeUnpublished=true`, {
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
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            // Prepare payload - remove empty optional fields
            const payload = { ...formData };
            if (!payload.videoUrl) delete payload.videoUrl;
            if (!payload.textContent) delete payload.textContent;
            if (payload.documents?.length === 0) delete payload.documents;
            if (payload.questions?.length === 0) delete payload.questions;
            if (payload.textBlocks?.length === 0) delete payload.textBlocks;

            const res = await fetch(`${BASE_URL}/lessons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok) {
                alert('Lesson Created Successfully! ?');
                router.push('/dashboard/mentor/lesson');
            } else {
                const errorMsg = result.errorMessages
                    ? result.errorMessages.map(err => `${err.path.split('.').pop()}: ${err.message}`).join('\n')
                    : result.message;
                alert(`Validation Error ?\n\n${errorMsg}`);
            }
        } catch (err) {
            console.error('Create error:', err);
            alert('Network error!');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm transition-all bg-white text-slate-700 placeholder:text-slate-400";
    const labelClass = "block text-sm font-medium text-slate-700 mb-2";

    const tabs = [
        { id: 'video', label: 'Video', icon: FiPlay, color: 'rose' },
        { id: 'text', label: 'Text Content', icon: FiType, color: 'amber' },
        { id: 'documents', label: 'Documents', icon: FiFile, color: 'emerald' },
        { id: 'questions', label: 'Questions', icon: FiHelpCircle, color: 'indigo', badge: formData.questions?.length },
        { id: 'settings', label: 'Settings', icon: FiSettings, color: 'slate' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/mentor/lesson" className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all">
                        <FiArrowLeft size={18} />
                    </Link>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/25">
                        <FiPlay className="text-white text-lg" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-slate-800">Create New Lesson</h1>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">Mentor</span>
                        </div>
                        <p className="text-sm text-slate-500">Add video, text, documents & quiz to your lesson</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50"
                >
                    <FiSave size={16} />
                    {loading ? 'Creating...' : 'Create Lesson'}
                </button>
            </div>

            {/* Basic Info */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Basic Information</h3>

                {/* Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Lesson Title (English) *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Introduction to React"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Lesson Title (?????)</label>
                        <input
                            type="text"
                            name="titleBn"
                            value={formData.titleBn}
                            onChange={handleChange}
                            placeholder="????? ????????? ???????"
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Course & Module Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>
                            <FiBook className="inline-block mr-2" size={14} />
                            Select Course *
                        </label>
                        <select
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        >
                            <option value="">Choose a course</option>
                            {courses.map(course => (
                                <option key={course._id} value={course._id}>{course.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>
                            <FiLayers className="inline-block mr-2" size={14} />
                            Select Module *
                        </label>
                        <select
                            name="module"
                            value={formData.module}
                            onChange={handleChange}
                            required
                            disabled={!formData.course || fetchingModules}
                            className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-400`}
                        >
                            <option value="">{fetchingModules ? 'Loading modules...' : (formData.course ? 'Choose a module' : 'Select a course first')}</option>
                            {modules.map(mod => (
                                <option key={mod._id} value={mod._id}>{mod.order}. {mod.title}</option>
                            ))}
                        </select>
                        {formData.course && modules.length === 0 && !fetchingModules && (
                            <p className="text-[10px] text-rose-500 mt-1 font-bold">No modules found for this course. Please create one first.</p>
                        )}
                    </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Description (English)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Describe the lesson content..."
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Description (?????)</label>
                        <textarea
                            name="descriptionBn"
                            value={formData.descriptionBn}
                            onChange={handleChange}
                            rows={3}
                            placeholder="?????? ?????? ?????..."
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                </div>

                {/* Lesson Type */}
                <div>
                    <label className={labelClass}>Lesson Type</label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { value: 'video', label: 'Video Lesson', icon: FiPlay, color: 'rose' },
                            { value: 'text', label: 'Text Only', icon: FiFileText, color: 'amber' },
                            { value: 'quiz', label: 'Quiz Only', icon: FiHelpCircle, color: 'indigo' },
                            { value: 'mixed', label: 'Mixed Content', icon: FiLayers, color: 'purple' },
                        ].map(type => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, lessonType: type.value }))}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${formData.lessonType === type.value
                                    ? `border-${type.color}-500 bg-${type.color}-500 text-white`
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <type.icon size={16} />
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-4 font-semibold text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                ? `border-${tab.color}-500 text-${tab.color}-600 bg-${tab.color}-50/50`
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {tab.badge > 0 && (
                                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-${tab.color}-100 text-${tab.color}-600`}>
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Video Tab */}
                    {activeTab === 'video' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Video URL</label>
                                    <div className="relative">
                                        <FiPlay className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="url"
                                            name="videoUrl"
                                            value={formData.videoUrl}
                                            onChange={handleChange}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className={`${inputClass} pl-11`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Video Provider</label>
                                    <select
                                        name="videoProvider"
                                        value={formData.videoProvider}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        <option value="youtube">YouTube</option>
                                        <option value="vimeo">Vimeo</option>
                                        <option value="bunny">Bunny</option>
                                        <option value="cloudinary">Cloudinary</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Duration (seconds)</label>
                                    <div className="relative">
                                        <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            name="videoDuration"
                                            value={formData.videoDuration}
                                            onChange={handleChange}
                                            placeholder="e.g. 900 for 15 minutes"
                                            className={`${inputClass} pl-11`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Order in Module</label>
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
                    )}

                    {/* Text Content Tab */}
                    {activeTab === 'text' && (
                        <TextContentManager
                            textBlocks={formData.textBlocks}
                            mainContent={formData.textContent}
                            mainContentBn={formData.textContentBn}
                            onChangeBlocks={(blocks) => handleNestedChange('textBlocks', blocks)}
                            onChangeMain={handleNestedChange}
                        />
                    )}

                    {/* Documents Tab */}
                    {activeTab === 'documents' && (
                        <DocumentManager
                            documents={formData.documents}
                            onChange={(docs) => handleNestedChange('documents', docs)}
                        />
                    )}

                    {/* Questions Tab */}
                    {activeTab === 'questions' && (
                        <div className="space-y-4">
                            <QuestionBuilder
                                questions={formData.questions}
                                onChange={(qs) => handleNestedChange('questions', qs)}
                            />

                            {/* Quiz Settings */}
                            {formData.questions?.length > 0 && (
                                <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4">
                                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                        <FiSettings className="text-indigo-600" />
                                        Quiz Settings
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Passing Score (%)</label>
                                            <input
                                                type="number"
                                                value={formData.quizSettings.passingScore}
                                                onChange={(e) => handleQuizSettingsChange('passingScore', Number(e.target.value))}
                                                min="0"
                                                max="100"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Max Attempts (0=8)</label>
                                            <input
                                                type="number"
                                                value={formData.quizSettings.maxAttempts}
                                                onChange={(e) => handleQuizSettingsChange('maxAttempts', Number(e.target.value))}
                                                min="0"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Time Limit (min)</label>
                                            <input
                                                type="number"
                                                value={formData.quizSettings.timeLimit}
                                                onChange={(e) => handleQuizSettingsChange('timeLimit', Number(e.target.value))}
                                                min="0"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.quizSettings.showCorrectAnswers}
                                                    onChange={(e) => handleQuizSettingsChange('showCorrectAnswers', e.target.checked)}
                                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                                                />
                                                <span className="text-xs font-medium text-slate-700">Show Answers</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.quizSettings.shuffleQuestions}
                                                    onChange={(e) => handleQuizSettingsChange('shuffleQuestions', e.target.checked)}
                                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                                                />
                                                <span className="text-xs font-medium text-slate-700">Shuffle Questions</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-200 flex-1">
                                    <input
                                        type="checkbox"
                                        name="isPublished"
                                        checked={formData.isPublished}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded-lg border-slate-300 text-rose-600 focus:ring-rose-500"
                                    />
                                    <div>
                                        <span className="text-sm font-bold text-slate-700 block">Publish Lesson</span>
                                        <span className="text-xs text-slate-500">Make this lesson visible to students</span>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-200 flex-1">
                                    <input
                                        type="checkbox"
                                        name="isFree"
                                        checked={formData.isFree}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div>
                                        <span className="text-sm font-bold text-slate-700 block">Free Preview</span>
                                        <span className="text-xs text-slate-500">Allow non-enrolled users to view</span>
                                    </div>
                                </label>
                            </div>

                            {/* Summary */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                <h4 className="font-bold text-slate-800 text-sm mb-3">Lesson Summary</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div className="p-3 bg-white rounded-xl">
                                        <p className="text-2xl font-bold text-rose-600">{formData.videoUrl ? '1' : '0'}</p>
                                        <p className="text-xs text-slate-500">Video</p>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl">
                                        <p className="text-2xl font-bold text-emerald-600">{formData.documents?.length || 0}</p>
                                        <p className="text-xs text-slate-500">Documents</p>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl">
                                        <p className="text-2xl font-bold text-indigo-600">{formData.questions?.length || 0}</p>
                                        <p className="text-xs text-slate-500">Questions</p>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl">
                                        <p className="text-2xl font-bold text-amber-600">{formData.textBlocks?.length || 0}</p>
                                        <p className="text-xs text-slate-500">Text Sections</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-rose-500/30 transition-all disabled:opacity-50"
                >
                    <FiSave size={18} />
                    {loading ? 'Creating...' : 'Create Lesson'}
                </button>
            </div>
        </div>
    );
}

