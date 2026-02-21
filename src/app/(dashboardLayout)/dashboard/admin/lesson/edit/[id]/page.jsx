'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import {
    FiPlay, FiArrowLeft, FiSave, FiBook, FiLayers,
    FiFileText, FiHelpCircle, FiFile, FiType, FiSettings, FiCheck,
    FiTrash2, FiRefreshCw, FiClock
} from 'react-icons/fi';

import QuestionBuilder from '@/components/Admin/lesson/QuestionBuilder';
import DocumentManager from '@/components/Admin/lesson/DocumentManager';
import TextContentManager from '@/components/Admin/lesson/TextContentManager';

const inputBase = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/10 outline-none transition-all";
const selectBase = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/10 outline-none transition-all appearance-none cursor-pointer";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function EditLessonPage() {
    const router = useRouter();
    const params = useParams();
    const lessonId = params.id;

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                const lessonRes = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const lessonData = await lessonRes.json();

                if (lessonData.data) {
                    const l = lessonData.data;
                    const courseId = l.course?._id || l.course || '';
                    setFormData({
                        title: l.title || '',
                        titleBn: l.titleBn || '',
                        description: l.description || '',
                        descriptionBn: l.descriptionBn || '',
                        course: courseId,
                        module: l.module?._id || l.module || '',
                        lessonType: l.lessonType || 'video',
                        videoUrl: l.videoUrl || '',
                        videoDuration: l.videoDuration || 0,
                        videoProvider: l.videoProvider || 'youtube',
                        videoThumbnail: l.videoThumbnail || '',
                        textContent: l.textContent || '',
                        textContentBn: l.textContentBn || '',
                        textBlocks: l.textBlocks || [],
                        documents: l.documents || [],
                        questions: l.questions || [],
                        quizSettings: l.quizSettings || {
                            passingScore: 70,
                            maxAttempts: 0,
                            showCorrectAnswers: true,
                            shuffleQuestions: false,
                            timeLimit: 0,
                        },
                        order: l.order || 1,
                        isPublished: l.isPublished || false,
                        isFree: l.isFree || false,
                    });

                    if (courseId) fetchModules(courseId);
                }

                const coursesRes = await fetch(`${API_BASE_URL}/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const coursesData = await coursesRes.json();
                setCourses(coursesData.data || []);

            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) fetchData();
    }, [lessonId]);

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
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (res.ok) {
                alert('লেসন সফলভাবে আপডেট হয়েছে! ✅');
                router.push('/dashboard/admin/lesson');
            } else {
                const errorMsg = result.errorMessages
                    ? result.errorMessages.map(err => `${err.path.split('.').pop()}: ${err.message}`).join('\n')
                    : result.message;
                alert(`আপডেট ব্যর্থ ❌\n\n${errorMsg}`);
            }
        } catch (err) {
            console.error('Update error:', err);
            alert('নেটওয়ার্ক ত্রুটি!');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('আপনি কি নিশ্চিত এই লেসনটি মুছে ফেলতে চান? এটি পূর্বাবস্থায় ফেরানো যাবে না।')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                router.push('/dashboard/admin/lesson');
            } else {
                alert('লেসন মুছতে ব্যর্থ হয়েছে');
            }
        } catch (err) {
            alert('মুছে ফেলার সময় ত্রুটি');
        }
    };

    const tabs = [
        { id: 'video', label: 'ভিডিও', icon: FiPlay },
        { id: 'text', label: 'টেক্সট', icon: FiType },
        { id: 'documents', label: 'ডকুমেন্ট', icon: FiFile, badge: formData.documents?.length || 0 },
        { id: 'questions', label: 'কুইজ', icon: FiHelpCircle, badge: formData.questions?.length || 0 },
        { id: 'settings', label: 'সেটিংস', icon: FiSettings },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <FiRefreshCw className="animate-spin text-[#021E14]" size={28} />
                <p className="text-sm text-slate-500">লেসন ডেটা লোড হচ্ছে...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-6 space-y-6 bg-slate-50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/admin/lesson" className="w-9 h-9 bg-white border border-slate-200 rounded-md flex items-center justify-center text-slate-500 hover:text-[#021E14] hover:border-[#021E14] transition-all">
                        <FiArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">লেসন এডিট করুন</h1>
                        <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{formData.title || 'Untitled Lesson'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDelete}
                        className="px-3 py-2 rounded-md border border-[#021E14] bg-[#021E14] text-white hover:bg-[#01140D] text-sm font-medium transition-all flex items-center gap-1.5"
                    >
                        <FiTrash2 size={14} />
                        মুছুন
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-5 py-2 rounded-md bg-[#021E14] hover:bg-[#01140D] text-white text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <FiRefreshCw className="animate-spin" size={14} /> : <FiSave size={14} />}
                        আপডেট করুন
                    </button>
                </div>
            </div>

            {/* Basic Info Section */}
            <div className="bg-white rounded-md border border-slate-200 p-5 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-md bg-[#021E14] text-white flex items-center justify-center">
                        <FiLayers size={14} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-700">মৌলিক তথ্য</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>লেসন শিরোনাম (EN) *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter lesson title"
                            className={inputBase}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>লেসন শিরোনাম (BN)</label>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={labelClass}>কোর্স নির্বাচন করুন *</label>
                        <select
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            required
                            className={selectBase}
                        >
                            <option value="">কোর্স নির্বাচন করুন</option>
                            {courses.map(course => (
                                <option key={course._id} value={course._id}>{course.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>মডিউল নির্বাচন করুন *</label>
                        <select
                            name="module"
                            value={formData.module}
                            onChange={handleChange}
                            required
                            disabled={!formData.course || fetchingModules}
                            className={`${selectBase} disabled:opacity-50 disabled:bg-slate-50`}
                        >
                            <option value="">{fetchingModules ? 'লোড হচ্ছে...' : 'মডিউল বাছুন'}</option>
                            {modules.map(mod => (
                                <option key={mod._id} value={mod._id}>{mod.order}. {mod.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>লেসনের ধরন</label>
                        <select
                            name="lessonType"
                            value={formData.lessonType}
                            onChange={handleChange}
                            className={selectBase}
                        >
                            <option value="video">ভিডিও</option>
                            <option value="text">টেক্সট</option>
                            <option value="quiz">কুইজ</option>
                            <option value="mixed">মিক্সড</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>বর্ণনা (EN)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Lesson description..."
                            className={`${inputBase} resize-none`}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>বর্ণনা (BN)</label>
                        <textarea
                            name="descriptionBn"
                            value={formData.descriptionBn}
                            onChange={handleChange}
                            rows={3}
                            placeholder="লেসনের বিস্তারিত বর্ণনা..."
                            className={`${inputBase} resize-none`}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>ক্রম (Order)</label>
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

            {/* Content Tabs */}
            <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
                {/* Tab Headers */}
                <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-[1px] ${activeTab === tab.id
                                    ? 'text-[#021E14] border-[#021E14] bg-white'
                                    : 'text-slate-500 border-transparent hover:text-slate-700'
                                }`}
                        >
                            <tab.icon size={15} />
                            {tab.label}
                            {tab.badge > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#021E14] text-white text-[10px] font-bold">
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
                                    <label className={labelClass}>ভিডিও URL</label>
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
                                    <label className={labelClass}>ভিডিও প্রোভাইডার</label>
                                    <select
                                        name="videoProvider"
                                        value={formData.videoProvider}
                                        onChange={handleChange}
                                        className={selectBase}
                                    >
                                        <option value="youtube">YouTube</option>
                                        <option value="vimeo">Vimeo</option>
                                        <option value="bunny">Bunny Stream</option>
                                        <option value="cloudinary">Cloudinary</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>ভিডিও Duration (সেকেন্ড)</label>
                                    <input
                                        type="number"
                                        name="videoDuration"
                                        value={formData.videoDuration}
                                        onChange={handleChange}
                                        placeholder="1800"
                                        className={inputBase}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>ভিডিও থাম্বনেইল URL</label>
                                    <input
                                        type="url"
                                        name="videoThumbnail"
                                        value={formData.videoThumbnail}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className={inputBase}
                                    />
                                </div>
                            </div>

                            {formData.videoUrl && (
                                <div className="mt-3 p-3 bg-slate-50 rounded-md border border-slate-100">
                                    <p className="text-xs text-slate-500">
                                        <FiPlay className="inline mr-1" size={12} />
                                        ভিডিও লিংক সেট করা হয়েছে
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Text Tab */}
                    {activeTab === 'text' && (
                        <div>
                            <TextContentManager
                                textBlocks={formData.textBlocks}
                                mainContent={formData.textContent}
                                mainContentBn={formData.textContentBn}
                                onChangeBlocks={(blocks) => handleNestedChange('textBlocks', blocks)}
                                onChangeMain={handleNestedChange}
                            />
                        </div>
                    )}

                    {/* Documents Tab */}
                    {activeTab === 'documents' && (
                        <div>
                            <DocumentManager
                                documents={formData.documents}
                                onChange={(docs) => handleNestedChange('documents', docs)}
                            />
                        </div>
                    )}

                    {/* Quiz Tab */}
                    {activeTab === 'questions' && (
                        <div className="space-y-5">
                            <QuestionBuilder
                                questions={formData.questions}
                                onChange={(qs) => handleNestedChange('questions', qs)}
                            />

                            {formData.questions?.length > 0 && (
                                <div className="bg-slate-50 rounded-md border border-slate-200 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiSettings size={14} className="text-[#021E14]" />
                                        <h4 className="text-sm font-semibold text-slate-700">কুইজ সেটিংস</h4>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">পাস মার্ক (%)</label>
                                            <input
                                                type="number"
                                                value={formData.quizSettings.passingScore}
                                                onChange={(e) => handleQuizSettingsChange('passingScore', Number(e.target.value))}
                                                className={inputBase}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">সর্বোচ্চ চেষ্টা</label>
                                            <input
                                                type="number"
                                                value={formData.quizSettings.maxAttempts}
                                                onChange={(e) => handleQuizSettingsChange('maxAttempts', Number(e.target.value))}
                                                className={inputBase}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">সময়সীমা (মিনিট)</label>
                                            <input
                                                type="number"
                                                value={formData.quizSettings.timeLimit}
                                                onChange={(e) => handleQuizSettingsChange('timeLimit', Number(e.target.value))}
                                                className={inputBase}
                                            />
                                        </div>
                                        <div className="flex items-end pb-1">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.quizSettings.showCorrectAnswers}
                                                    onChange={(e) => handleQuizSettingsChange('showCorrectAnswers', e.target.checked)}
                                                    className="w-4 h-4 rounded border-slate-300 text-[#021E14] focus:ring-[#021E14]"
                                                />
                                                <span className="text-xs text-slate-600">উত্তর দেখান</span>
                                            </label>
                                        </div>
                                        <div className="flex items-end pb-1">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.quizSettings.shuffleQuestions}
                                                    onChange={(e) => handleQuizSettingsChange('shuffleQuestions', e.target.checked)}
                                                    className="w-4 h-4 rounded border-slate-300 text-[#021E14] focus:ring-[#021E14]"
                                                />
                                                <span className="text-xs text-slate-600">শাফল করুন</span>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Published Toggle */}
                                <div
                                    onClick={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                                    className={`p-4 rounded-md border-2 cursor-pointer transition-all flex items-center gap-3 ${formData.isPublished
                                            ? 'bg-emerald-50 border-emerald-300'
                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${formData.isPublished ? 'bg-[#021E14] text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        <FiCheck size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">
                                            {formData.isPublished ? 'পাবলিশড ✅' : 'ড্রাফট'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {formData.isPublished ? 'লেসনটি সবার কাছে দৃশ্যমান' : 'শুধু অ্যাডমিন দেখতে পারবে'}
                                        </p>
                                    </div>
                                </div>

                                {/* Free Preview Toggle */}
                                <div
                                    onClick={() => setFormData(prev => ({ ...prev, isFree: !prev.isFree }))}
                                    className={`p-4 rounded-md border-2 cursor-pointer transition-all flex items-center gap-3 ${formData.isFree
                                            ? 'bg-[#021E14] border-[#021E14]'
                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${formData.isFree ? 'bg-[#021E14] text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        <FiPlay size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">
                                            {formData.isFree ? 'ফ্রি প্রিভিউ ✅' : 'প্রিমিয়াম'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {formData.isFree ? 'সবাই বিনামূল্যে দেখতে পারবে' : 'শুধু এনরোলড শিক্ষার্থীদের জন্য'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-slate-50 rounded-md border border-slate-200 p-4">
                                <h4 className="text-sm font-semibold text-slate-700 mb-3">লেসন সারাংশ</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="text-center p-2 bg-white rounded-md border border-slate-100">
                                        <p className="text-lg font-bold text-[#021E14]">{formData.videoUrl ? '1' : '0'}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">ভিডিও</p>
                                    </div>
                                    <div className="text-center p-2 bg-white rounded-md border border-slate-100">
                                        <p className="text-lg font-bold text-[#021E14]">{formData.documents?.length || 0}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">ডকুমেন্ট</p>
                                    </div>
                                    <div className="text-center p-2 bg-white rounded-md border border-slate-100">
                                        <p className="text-lg font-bold text-amber-600">{formData.questions?.length || 0}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">কুইজ প্রশ্ন</p>
                                    </div>
                                    <div className="text-center p-2 bg-white rounded-md border border-slate-100">
                                        <p className="text-lg font-bold text-[#021E14]">{formData.textBlocks?.length || 0}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">টেক্সট ব্লক</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between pt-2 pb-6">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all"
                >
                    বাতিল করুন
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-6 py-2 rounded-md bg-[#021E14] hover:bg-[#01140D] text-white text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <FiRefreshCw className="animate-spin" size={14} /> : <FiSave size={14} />}
                    লেসন আপডেট করুন
                </button>
            </div>
        </div>
    );
}
