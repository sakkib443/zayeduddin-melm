'use client';

import React, { useState } from 'react';
import { FiBookOpen, FiLayers, FiPlay, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

// Import the tab components
import CourseCreateTab from '@/components/Admin/course/CourseCreateTab';
import ModuleCreateTab from '@/components/Admin/course/ModuleCreateTab';
import LessonCreateTab from '@/components/Admin/course/LessonCreateTab';

export default function CreateCoursePage() {
  const [activeTab, setActiveTab] = useState('course');

  const tabs = [
    { id: 'course', label: 'Create Course', labelBn: 'কোর্স তৈরি', icon: FiBookOpen, color: 'indigo' },
    { id: 'module', label: 'Create Module', labelBn: 'মড্যুল তৈরি', icon: FiLayers, color: 'purple' },
    { id: 'lesson', label: 'Create Lesson', labelBn: 'লেসন তৈরি', icon: FiPlay, color: 'rose' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6 pb-20">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/admin/course" className="p-2.5 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-sm transition-all">
              <FiArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">Course Management</h1>
              <p className="text-slate-500 text-sm mt-0.5">Create and manage your courses, modules, and lessons</p>
            </div>
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div className="bg-white rounded-md border border-slate-200 shadow-sm mb-6 overflow-hidden">
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 font-medium text-sm transition-all relative
                    ${isActive
                      ? 'text-[#021E14] bg-[#021E14]/50'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-all
                    ${isActive
                      ? 'bg-[#021E14] text-white'
                      : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold text-sm ${isActive ? 'text-[#021E14]' : 'text-slate-700'}`}>{tab.label}</p>
                    <p className={`text-xs ${isActive ? 'text-[#021E14]' : 'text-slate-400'}`}>{tab.labelBn}</p>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#021E14]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Step Indicator */}
          <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className={`px-3 py-1 rounded-md font-medium ${activeTab === 'course' ? 'bg-[#021E14] text-[#01140D]' : 'bg-slate-200 text-slate-500'}`}>
                1. Course
              </span>
              <span className="text-slate-300">→</span>
              <span className={`px-3 py-1 rounded-md font-medium ${activeTab === 'module' ? 'bg-[#021E14] text-[#021E14]' : 'bg-slate-200 text-slate-500'}`}>
                2. Module
              </span>
              <span className="text-slate-300">→</span>
              <span className={`px-3 py-1 rounded-md font-medium ${activeTab === 'lesson' ? 'bg-[#021E14] text-[#021E14]' : 'bg-slate-200 text-slate-500'}`}>
                3. Lesson
              </span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'course' && <CourseCreateTab onSuccess={() => setActiveTab('module')} />}
          {activeTab === 'module' && <ModuleCreateTab onSuccess={() => setActiveTab('lesson')} />}
          {activeTab === 'lesson' && <LessonCreateTab />}
        </div>

      </div>
    </div>
  );
}
