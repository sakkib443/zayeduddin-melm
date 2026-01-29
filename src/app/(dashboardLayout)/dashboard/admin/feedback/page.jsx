'use client';

import React, { useState } from 'react';
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiEye, FiStar, FiMessageSquare, FiChevronDown } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function FeedbackPage() {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  const feedbacks = [
    {
      id: 1,
      userName: 'Ahmed Khan',
      course: 'Web Development Mastery',
      rating: 5,
      message: 'Excellent course! Very comprehensive and well-structured. Instructor explains everything clearly.',
      submittedDate: 'Dec 12, 2024',
      status: 'Published',
      helpful: 24,
    },
    {
      id: 2,
      userName: 'Fatima Begum',
      course: 'Digital Marketing Pro',
      rating: 4,
      message: 'Good course with practical examples. Some topics could be explained more deeply.',
      submittedDate: 'Dec 11, 2024',
      status: 'Published',
      helpful: 12,
    },
    {
      id: 3,
      userName: 'Rajon Roy',
      course: 'UI/UX Design Advanced',
      rating: 5,
      message: 'Best design course I have ever taken. Highly recommended for everyone.',
      submittedDate: 'Dec 10, 2024',
      status: 'Published',
      helpful: 18,
    },
    {
      id: 4,
      userName: 'Maria Garcia',
      course: 'Python Data Science',
      rating: 3,
      message: 'Course is good but needs more real-world projects and datasets.',
      submittedDate: 'Dec 09, 2024',
      status: 'Pending',
      helpful: 5,
    },
    {
      id: 5,
      userName: 'John Smith',
      course: 'Business Analytics',
      rating: 4,
      message: 'Very informative and practical. Looking forward to more advanced topics.',
      submittedDate: 'Dec 08, 2024',
      status: 'Published',
      helpful: 15,
    },
  ];

  const filteredFeedbacks = feedbacks.filter(fb =>
    fb.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fb.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fb.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Published':
        return 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400';
      case 'Rejected':
        return 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400';
      default:
        return 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  const getRatingStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            size={14}
            className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const stats = {
    total: feedbacks.length,
    avgRating: (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1),
    published: feedbacks.filter(fb => fb.status === 'Published').length,
    pending: feedbacks.filter(fb => fb.status === 'Pending').length,
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-md ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
            <FiMessageSquare className="text-amber-500" size={20} />
          </div>
          <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Feedback & Reviews
          </h1>
        </div>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          Manage student reviews and course feedback
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Feedback</p>
          <p className={`text-2xl font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Avg Rating</p>
          <p className="text-2xl font-semibold mt-1 text-amber-500">{stats.avgRating}/5</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Published</p>
          <p className="text-2xl font-semibold mt-1 text-green-500">{stats.published}</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Pending</p>
          <p className="text-2xl font-semibold mt-1 text-yellow-500">{stats.pending}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={16} />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900'
            }`}
          />
        </div>
        <button className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border ${
          isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}>
          <FiFilter size={16} />
          <span>Filter</span>
          <FiChevronDown size={14} />
        </button>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{feedback.userName}</p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{feedback.course}</p>
              </div>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusStyle(feedback.status)}`}>
                {feedback.status}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              {getRatingStars(feedback.rating)}
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                {feedback.rating}.0 out of 5
              </span>
            </div>

            {/* Message */}
            <p className={`text-sm italic ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              &quot;{feedback.message}&quot;
            </p>

            {/* Footer */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 mt-3 border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
              <div className="flex items-center gap-4">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  {feedback.submittedDate}
                </span>
                <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  <FiMessageSquare size={14} />
                  {feedback.helpful} found helpful
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-blue-400' : 'hover:bg-gray-100 text-gray-400 hover:text-blue-500'}`}>
                  <FiEye size={16} />
                </button>
                <button className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-orange-400' : 'hover:bg-gray-100 text-gray-400 hover:text-orange-500'}`}>
                  <FiEdit2 size={16} />
                </button>
                <button className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'}`}>
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks
        </p>
        <div className="flex gap-2">
          <button className={`px-3 py-1.5 text-xs rounded-md border ${
            isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}>
            Previous
          </button>
          <button className="px-3 py-1.5 text-xs rounded-md bg-amber-500 text-white">1</button>
          <button className={`px-3 py-1.5 text-xs rounded-md border ${
            isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}>
            2
          </button>
          <button className={`px-3 py-1.5 text-xs rounded-md border ${
            isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
