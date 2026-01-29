'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiEdit2, FiTrash2, FiPlus, FiSearch, FiBook, FiStar,
  FiGrid, FiList, FiUsers, FiLayers, FiRefreshCw, FiCheckCircle, FiClock
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';

export default function CoursesPage() {
  const { isDark } = useTheme();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  const loadCourses = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCourses(data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCourses((prev) => prev.filter((course) => course._id !== id));
      } else {
        alert('Failed to delete course');
      }
    } catch (error) {
      alert('Network error!');
    }
  };

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.instructorName?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    totalEnrollments: courses.reduce((sum, c) => sum + (c.totalEnrollments || 0), 0),
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-amber-500 flex items-center justify-center">
            <FiBook className="text-white" size={18} />
          </div>
          <div>
            <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Courses</h1>
            <p className={`text-sm font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Manage all courses</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadCourses}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-normal border transition-all ${isDark
              ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link href="/dashboard/admin/course/create">
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-sm font-normal transition-all">
              <FiPlus size={14} />
              Add Course
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-amber-500 rounded-md flex items-center justify-center">
              <FiBook className="text-white" size={16} />
            </div>
            <span className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stats.total}</span>
          </div>
          <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Courses</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-md flex items-center justify-center">
              <FiCheckCircle className="text-white" size={16} />
            </div>
            <span className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stats.published}</span>
          </div>
          <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Published</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-blue-600 rounded-md flex items-center justify-center">
              <FiUsers className="text-white" size={16} />
            </div>
            <span className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stats.totalEnrollments.toLocaleString()}</span>
          </div>
          <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Enrollments</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-gray-500 rounded-md flex items-center justify-center">
              <FiClock className="text-white" size={16} />
            </div>
            <span className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stats.draft}</span>
          </div>
          <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Drafts</p>
        </div>
      </div>

      {/* Search & View Toggle */}
      <div className={`flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="relative flex-1">
          <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} size={16} />
          <input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-md border text-sm font-normal ${isDark
              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
              : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
              } focus:outline-none focus:border-amber-500`}
          />
        </div>
        <div className={`flex items-center gap-1 p-1 rounded-md ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${viewMode === 'grid'
              ? (isDark ? 'bg-slate-600 text-white' : 'bg-white text-gray-800 shadow-sm')
              : (isDark ? 'text-slate-400' : 'text-gray-500')
              }`}
          >
            <FiGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all ${viewMode === 'list'
              ? (isDark ? 'bg-slate-600 text-white' : 'bg-white text-gray-800 shadow-sm')
              : (isDark ? 'text-slate-400' : 'text-gray-500')
              }`}
          >
            <FiList size={16} />
          </button>
        </div>
      </div>

      {/* Course List */}
      {loading ? (
        <div className={`flex items-center justify-center py-16 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`text-center py-16 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <FiBook className={`mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} size={40} />
          <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>No courses found</h3>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Create your first course</p>
          <Link href="/dashboard/admin/course/create">
            <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-normal mx-auto">
              <FiPlus size={14} /> Add Course
            </button>
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((course) => (
            <div key={course._id} className={`rounded-md border overflow-hidden transition-all ${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>
              <div className="relative h-40 overflow-hidden bg-gray-100">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                    <FiBook className={isDark ? 'text-slate-500' : 'text-gray-300'} size={40} />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${isDark ? 'bg-slate-900/80 text-white' : 'bg-white/90 text-gray-800'}`}>
                    {course.courseType}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${course.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'}`}>
                    {course.status}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-gray-900/80 text-amber-400 text-sm font-medium rounded">
                  ৳{(course.discountPrice || course.price || 0).toLocaleString()}
                </div>
              </div>

              <div className="p-4">
                <h3 className={`text-sm font-semibold line-clamp-2 mb-3 min-h-[40px] ${isDark ? 'text-white' : 'text-gray-800'}`}>{course.title}</h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 text-xs rounded ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>{course.level}</span>
                  <span className={`px-2 py-0.5 text-xs rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>{course.language}</span>
                </div>

                <div className={`flex items-center justify-between py-3 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    <FiUsers size={12} /> {course.totalEnrollments || 0}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                    <FiStar size={12} fill="currentColor" /> {course.averageRating || '5.0'}
                  </div>
                </div>
              </div>

              <div className={`flex p-2 gap-2 ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <Link
                  href={`/dashboard/admin/course/modules/${course._id}`}
                  className={`flex-1 py-2 text-center rounded-md text-xs font-medium transition-all ${isDark ? 'bg-slate-600 text-indigo-400 hover:bg-indigo-600 hover:text-white' : 'bg-white border border-gray-200 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                >
                  Modules
                </Link>
                <Link
                  href={`/dashboard/admin/course/edit/${course._id}`}
                  className={`flex-1 py-2 text-center rounded-md text-xs font-medium transition-all ${isDark ? 'bg-slate-600 text-slate-300 hover:bg-slate-500' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="px-3 py-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`rounded-md border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-200'}`}>
            {filtered.map((course) => (
              <div key={course._id} className={`flex flex-col md:flex-row md:items-center gap-4 p-4 transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`}>
                <div className={`w-28 h-20 rounded-md overflow-hidden flex-shrink-0 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiBook className={isDark ? 'text-slate-500' : 'text-gray-300'} size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{course.title}</h3>
                  <div className={`text-xs mt-1 flex flex-wrap items-center gap-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    <span className={`px-2 py-0.5 rounded ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>{course.level}</span>
                    <span className={`px-2 py-0.5 rounded ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>{course.courseType}</span>
                    <span className="flex items-center gap-1"><FiUsers size={12} /> {course.totalEnrollments || 0}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>৳{(course.price || 0).toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${course.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{course.status}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/admin/course/modules/${course._id}`} className={`p-2 rounded-md transition-all ${isDark ? 'bg-slate-700 text-indigo-400 hover:bg-indigo-600 hover:text-white' : 'bg-gray-100 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}>
                    <FiLayers size={16} />
                  </Link>
                  <Link href={`/dashboard/admin/course/edit/${course._id}`} className={`p-2 rounded-md transition-all ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <FiEdit2 size={16} />
                  </Link>
                  <button onClick={() => handleDelete(course._id)} className="p-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
