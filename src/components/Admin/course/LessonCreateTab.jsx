'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';
import {
    FiPlay, FiClock, FiBook, FiLayers,
    FiFileText, FiHelpCircle, FiFile, FiType, FiSettings, FiCheck, FiPlus, FiArrowRight,
    FiChevronDown, FiChevronUp
} from 'react-icons/fi';

// Import custom components
import QuestionBuilder from '@/components/Admin/lesson/QuestionBuilder';
import DocumentManager from '@/components/Admin/lesson/DocumentManager';
import TextContentManager from '@/components/Admin/lesson/TextContentManager';

const inputBase = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all";
const selectBase = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function LessonCreateTab() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createdLessons, setCreatedLessons] = useState([]);
    const [showCreatedList, setShowCreatedList] = useState(false);
    const [activeTab, setActiveTab] = useState('video');
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

    const BASE_URL = API_BASE_URL;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${BASE_URL}/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setCourses(data.data || []);

                const lastCourseId = localStorage.getItem('lastCreatedCourseId');
                if (lastCourseId) {
                    setFormData(prev => ({ ...prev, course: lastCourseId }));
                    fetchModules(lastCourseId);
                }
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

            const lastModuleId = localStorage.getItem('lastCreatedModuleId');
            if (lastModuleId && data.data?.some(m => m._id === lastModuleId)) {
                setFormData(prev => ({ ...prev, module: lastModuleId }));
            }
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
        e?.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

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
                setCreatedLessons(prev => [...prev, {
                    _id: result.data?._id,
                    title: result.data?.title || formData.title,
                    order: result.data?.order || formData.order,
                    lessonType: formData.lessonType
                }]);

                setFormData(prev => ({
                    ...prev,
                    title: '',
                    titleBn: '',
                    description: '',
                    descriptionBn: '',
                    videoUrl: '',
                    videoDuration: 0,
                    textContent: '',
                    textContentBn: '',
                    textBlocks: [],
                    documents: [],
                    questions: [],
                    order: prev.order + 1,
                    isPublished: false,
                    isFree: false,
                }));

                alert('Lesson Created Successfully!');
            } else {
                const errorMsg = result.errorMessages
                    ? result.errorMessages.map(err => `${err.path.split('.').pop()}: ${err.message}`).join('\n')
                    : result.message;
                alert(`Validation Error:\n\n${errorMsg}`);
            }
        } catch (err) {
            console.error('Create error:', err);
            alert('Network error!');
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = () => {
        localStorage.removeItem('lastCreatedCourseId');
        localStorage.removeItem('lastCreatedCourseTitle');
        localStorage.removeItem('lastCreatedModuleId');
        localStorage.removeItem('lastCreatedModuleTitle');
        router.push('/dashboard/admin/course');
    };

    const tabs = [
        { id: 'video', label: 'Video', icon: FiPlay },
        { id: 'text', label: 'Text', icon: FiType },
        { id: 'documents', label: 'Docs', icon: FiFile },
        { id: 'questions', label: 'Quiz', icon: FiHelpCircle, badge: formData.questions?.length },
        { id: 'settings', label: 'Settings', icon: FiSettings },
    ];

    const lastCourseTitle = typeof window !== 'undefined' ? localStorage.getItem('lastCreatedCourseTitle') : null;
    const lastModuleTitle = typeof window !== 'undefined' ? localStorage.getItem('lastCreatedModuleTitle') : null;

    return (
        <div className="max-w-5xl mx-auto space-y-5">

            {/* Header with Course/Module Info & Actions */}
            <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <FiBook size={14} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase">Course</p>
                                <p className="font-medium text-slate-800 text-xs">{lastCourseTitle || 'Not Selected'}</p>
                            </div>
                        </div>
                        <FiArrowRight className="text-slate-300" size={14} />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center text-purple-600">
                                <FiLayers size={14} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase">Module</p>
                                <p className="font-medium text-slate-800 text-xs">{lastModuleTitle || 'Not Selected'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.title || !formData.course || !formData.module}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-md font-medium text-sm transition-all disabled:opacity-50"
                        >
                            <FiPlus size={16} />
                            {loading ? 'Creating...' : 'Add Lesson'}
                        </button>

                        <button
                            onClick={handleFinish}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-md font-medium text-sm transition-all"
                        >
                            <FiCheck size={16} />
                            Finish
                        </button>
                    </div>
                </div>
            </div>

            {/* Collapsible Created Lessons */}
            {createdLessons.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-md overflow-hidden">
                    <button
                        onClick={() => setShowCreatedList(!showCreatedList)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-emerald-100/50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <FiCheck className="text-emerald-600" size={16} />
                            <span className="font-medium text-emerald-700 text-sm">
                                {createdLessons.length} Lesson{createdLessons.length > 1 ? 's' : ''} Created
                            </span>
                            <div className="flex items-center gap-1 ml-2">
                                {createdLessons.slice(0, 2).map((lesson, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-white rounded-md text-xs text-slate-600 font-medium border border-slate-200">
                                        {lesson.order}. {lesson.title.length > 10 ? lesson.title.slice(0, 10) + '...' : lesson.title}
                                    </span>
                                ))}
                                {createdLessons.length > 2 && (
                                    <span className="text-xs text-slate-500">+{createdLessons.length - 2} more</span>
                                )}
                            </div>
                        </div>
                        {showCreatedList ? <FiChevronUp size={18} className="text-slate-500" /> : <FiChevronDown size={18} className="text-slate-500" />}
                    </button>

                    {showCreatedList && (
                        <div className="px-4 pb-3 border-t border-emerald-200 pt-2">
                            <div className="flex flex-wrap gap-2">
                                {createdLessons.map((lesson, idx) => (
                                    <div key={lesson._id || idx} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-slate-200">
                                        <span className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                                            {lesson.order}
                                        </span>
                                        <span className="text-sm text-slate-700">{lesson.title}</span>
                                        <span className="text-[10px] text-slate-400 capitalize">({lesson.lessonType})</span>
                                        <FiCheck className="text-emerald-500" size={12} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Form */}
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                    <h2 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                        <FiPlay size={16} className="text-indigo-600" />
                        Add New Lesson
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Add video, text, documents & quiz</p>
                </div>

                <div className="p-5 space-y-4">
                    {/* Titles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Lesson Title (English) <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Introduction to React"
                                className={inputBase}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Lesson Title (বাংলা) <span className="text-xs text-slate-400 font-normal">(Optional)</span></label>
                            <input
                                type="text"
                                name="titleBn"
                                value={formData.titleBn}
                                onChange={handleChange}
                                placeholder="লেসনের বাংলা শিরোনাম"
                                className={inputBase}
                            />
                        </div>
                    </div>

                    {/* Course & Module Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Select Course <span className="text-red-500">*</span></label>
                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                                className={selectBase}
                            >
                                <option value="">Choose a course</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Select Module <span className="text-red-500">*</span></label>
                            <select
                                name="module"
                                value={formData.module}
                                onChange={handleChange}
                                required
                                disabled={!formData.course || fetchingModules}
                                className={`${selectBase} disabled:bg-slate-50 disabled:text-slate-400`}
                            >
                                <option value="">{fetchingModules ? 'Loading...' : (formData.course ? 'Choose a module' : 'Select course first')}</option>
                                {modules.map(mod => (
                                    <option key={mod._id} value={mod._id}>{mod.order}. {mod.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Lesson Type */}
                    <div>
                        <label className={labelClass}>Lesson Type</label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: 'video', label: 'Video', icon: FiPlay },
                                { value: 'text', label: 'Text', icon: FiFileText },
                                { value: 'quiz', label: 'Quiz', icon: FiHelpCircle },
                                { value: 'mixed', label: 'Mixed', icon: FiLayers },
                            ].map(type => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, lessonType: type.value }))}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-sm font-medium transition-all ${formData.lessonType === type.value
                                        ? 'border-indigo-500 bg-indigo-600 text-white'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    <type.icon size={14} />
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status & Order Row */}
                    <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-slate-700">Status:</label>
                            <div className="flex bg-slate-100 rounded-md p-0.5">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, isPublished: true }))}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${formData.isPublished
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    Active
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, isPublished: false }))}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!formData.isPublished
                                        ? 'bg-slate-600 text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    Draft
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isFree"
                                name="isFree"
                                checked={formData.isFree}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="isFree" className="text-sm text-slate-600 cursor-pointer">Free Preview</label>
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                            <label className="text-sm font-medium text-slate-700">Order:</label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                min="1"
                                className="w-16 px-2 py-1.5 rounded-md border border-slate-200 text-sm text-center focus:border-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-3 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                            {tab.badge > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-600">
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-5">
                    {/* Video Tab */}
                    {activeTab === 'video' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Video URL</label>
                                    <input
                                        type="url"
                                        name="videoUrl"
                                        value={formData.videoUrl}
                                        onChange={handleChange}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className={inputBase}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Video Provider</label>
                                    <select
                                        name="videoProvider"
                                        value={formData.videoProvider}
                                        onChange={handleChange}
                                        className={selectBase}
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
                                    <input
                                        type="number"
                                        name="videoDuration"
                                        value={formData.videoDuration}
                                        onChange={handleChange}
                                        placeholder="e.g. 900"
                                        className={inputBase}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Order in Module</label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleChange}
                                        min="1"
                                        className={inputBase}
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

                            {formData.questions?.length > 0 && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-md border border-slate-200 space-y-3">
                                    <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                                        <FiSettings className="text-indigo-600" />
                                        Quiz Settings
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Passing %</label>
                                            <input
                                                type="number"
                                                value={formData.quizSettings.passingScore}
                                                onChange={(e) => handleQuizSettingsChange('passingScore', Number(e.target.value))}
                                                min="0"
                                                max="100"
                                                className={inputBase}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Max Attempts</label>
                                            <input
                                                type="number"
                                                value={formData.quizSettings.maxAttempts}
                                                onChange={(e) => handleQuizSettingsChange('maxAttempts', Number(e.target.value))}
                                                min="0"
                                                className={inputBase}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Time (min)</label>
                                            <input
                                                type="number"
                                                value={formData.quizSettings.timeLimit}
                                                onChange={(e) => handleQuizSettingsChange('timeLimit', Number(e.target.value))}
                                                min="0"
                                                className={inputBase}
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center gap-1.5">
                                            <label className="flex items-center gap-2 text-xs">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.quizSettings.showCorrectAnswers}
                                                    onChange={(e) => handleQuizSettingsChange('showCorrectAnswers', e.target.checked)}
                                                    className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600"
                                                />
                                                Show Answers
                                            </label>
                                            <label className="flex items-center gap-2 text-xs">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.quizSettings.shuffleQuestions}
                                                    onChange={(e) => handleQuizSettingsChange('shuffleQuestions', e.target.checked)}
                                                    className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600"
                                                />
                                                Shuffle
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
                            <div className="flex flex-wrap gap-3">
                                <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-md border border-slate-200 flex-1">
                                    <input
                                        type="checkbox"
                                        name="isPublished"
                                        checked={formData.isPublished}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-slate-700 block">Publish</span>
                                        <span className="text-xs text-slate-500">Make visible to students</span>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-md border border-slate-200 flex-1">
                                    <input
                                        type="checkbox"
                                        name="isFree"
                                        checked={formData.isFree}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-slate-700 block">Free Preview</span>
                                        <span className="text-xs text-slate-500">Allow free access</span>
                                    </div>
                                </label>
                            </div>

                            {/* Summary */}
                            <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
                                <h4 className="font-semibold text-slate-800 text-sm mb-3">Content Summary</h4>
                                <div className="grid grid-cols-4 gap-3 text-center">
                                    <div className="p-2 bg-white rounded-md border border-slate-100">
                                        <p className="text-xl font-bold text-indigo-600">{formData.videoUrl ? '1' : '0'}</p>
                                        <p className="text-xs text-slate-500">Video</p>
                                    </div>
                                    <div className="p-2 bg-white rounded-md border border-slate-100">
                                        <p className="text-xl font-bold text-purple-600">{formData.documents?.length || 0}</p>
                                        <p className="text-xs text-slate-500">Docs</p>
                                    </div>
                                    <div className="p-2 bg-white rounded-md border border-slate-100">
                                        <p className="text-xl font-bold text-emerald-600">{formData.questions?.length || 0}</p>
                                        <p className="text-xs text-slate-500">Quiz</p>
                                    </div>
                                    <div className="p-2 bg-white rounded-md border border-slate-100">
                                        <p className="text-xl font-bold text-amber-600">{formData.textBlocks?.length || 0}</p>
                                        <p className="text-xs text-slate-500">Text</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
