'use client';

import React, { useState } from 'react';
import { FiBookOpen, FiLayers, FiPlay, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

// Import the tab components (shared with Admin)
import CourseCreateTab from '@/components/Admin/course/CourseCreateTab';
import ModuleCreateTab from '@/components/Admin/course/ModuleCreateTab';
import LessonCreateTab from '@/components/Admin/course/LessonCreateTab';

export default function MentorCreateCoursePage() {
    const [activeTab, setActiveTab] = useState('course');

    const tabs = [
        { id: 'course', label: 'Create Course', labelBn: '????? ????', icon: FiBookOpen, color: 'indigo' },
        { id: 'module', label: 'Create Module', labelBn: '????? ????', icon: FiLayers, color: 'purple' },
        { id: 'lesson', label: 'Create Lesson', labelBn: '???? ????', icon: FiPlay, color: 'rose' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto p-6 pb-20">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/mentor/course" className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-sm transition-all">
                            <FiArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-slate-800">Course Management</h1>
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                                    Mentor
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm mt-1">Create and manage your courses, modules, and lessons</p>
                        </div>
                    </div>
                </div>

                {/* Main Tab Navigation */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
                    <div className="flex border-b border-slate-200">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold text-sm transition-all relative
                    ${isActive
                                            ? `text-${tab.color}-600 bg-${tab.color}-50/50`
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
                    ${isActive
                                            ? `bg-gradient-to-br from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg shadow-${tab.color}-500/25`
                                            : 'bg-slate-100 text-slate-500'
                                        }`}
                                    >
                                        <Icon size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className={`font-bold ${isActive ? `text-${tab.color}-600` : 'text-slate-700'}`}>{tab.label}</p>
                                        <p className={`text-xs ${isActive ? `text-${tab.color}-500` : 'text-slate-400'}`}>{tab.labelBn}</p>
                                    </div>
                                    {isActive && (
                                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Step Indicator */}
                    <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                            <span className={`px-3 py-1 rounded-full font-semibold ${activeTab === 'course' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
                                ?. Course
                            </span>
                            <span className="text-slate-300">?</span>
                            <span className={`px-3 py-1 rounded-full font-semibold ${activeTab === 'module' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-500'}`}>
                                ?. Module
                            </span>
                            <span className="text-slate-300">?</span>
                            <span className={`px-3 py-1 rounded-full font-semibold ${activeTab === 'lesson' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-500'}`}>
                                ?. Lesson
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="animate-fadeIn">
                    {activeTab === 'course' && <CourseCreateTab onSuccess={() => setActiveTab('module')} />}
                    {activeTab === 'module' && <ModuleCreateTab onSuccess={() => setActiveTab('lesson')} />}
                    {activeTab === 'lesson' && <LessonCreateTab />}
                </div>

            </div>
        </div>
    );
}
