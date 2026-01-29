'use client';
import { API_URL } from '@/config/api';
import React, { useEffect, useState } from 'react';
import {
    FiUserCheck, FiSearch, FiRefreshCw, FiX,
    FiChevronLeft, FiChevronRight, FiBook, FiCalendar,
    FiMail, FiPhone, FiEye, FiAward, FiClock,
    FiCheckCircle, FiXCircle, FiUsers, FiTrendingUp
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function EnrollmentsPage() {
    const { isDark } = useTheme();
    const [enrollments, setEnrollments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchEnrollments();
        fetchCourses();
    }, []);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/enrollments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setEnrollments(data.data || []);
        } catch (err) {
            console.error('Error fetching enrollments:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/courses/admin/all?limit=100`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setCourses(data.data || []);
        } catch (err) {
            console.error('Error fetching courses:', err);
        }
    };

    // Filter enrollments
    const filteredEnrollments = enrollments.filter(enroll => {
        const matchesSearch =
            enroll.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enroll.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enroll.course?.title?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !statusFilter || enroll.status === statusFilter;
        const matchesCourse = !courseFilter || enroll.course?._id === courseFilter;

        let matchesDate = true;
        if (dateFilter) {
            const enrollDate = new Date(enroll.enrolledAt);
            const today = new Date();
            if (dateFilter === 'today') {
                matchesDate = enrollDate.toDateString() === today.toDateString();
            } else if (dateFilter === 'week') {
                const weekAgo = new Date(today.setDate(today.getDate() - 7));
                matchesDate = enrollDate >= weekAgo;
            } else if (dateFilter === 'month') {
                const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
                matchesDate = enrollDate >= monthAgo;
            }
        }

        return matchesSearch && matchesStatus && matchesCourse && matchesDate;
    });

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);
    const paginatedEnrollments = filteredEnrollments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setCourseFilter('');
        setDateFilter('');
        setCurrentPage(1);
    };

    const hasActiveFilters = searchTerm || statusFilter || courseFilter || dateFilter;

    const openDetails = (enrollment) => {
        setSelectedEnrollment(enrollment);
        setShowDetailsModal(true);
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        };
        return styles[status] || styles.active;
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
        });
    };

    const stats = {
        total: enrollments.length,
        active: enrollments.filter(e => e.status === 'active').length,
        completed: enrollments.filter(e => e.status === 'completed').length,
        expired: enrollments.filter(e => e.status === 'expired').length,
    };

    return (
        <div className={`p-6 space-y-6 min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Enrollments
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        View and manage all course enrollments
                    </p>
                </div>
                <button
                    onClick={fetchEnrollments}
                    disabled={loading}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md border font-medium transition-colors ${isDark
                        ? 'border-slate-600 text-gray-300 hover:bg-slate-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        } disabled:opacity-50`}
                >
                    <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-md bg-indigo-500 flex items-center justify-center">
                            <FiUsers className="text-white" size={18} />
                        </div>
                        <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total}</span>
                    </div>
                    <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Enrollments</p>
                </div>
                <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-md bg-green-500 flex items-center justify-center">
                            <FiCheckCircle className="text-white" size={18} />
                        </div>
                        <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.active}</span>
                    </div>
                    <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Active</p>
                </div>
                <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-md bg-blue-500 flex items-center justify-center">
                            <FiAward className="text-white" size={18} />
                        </div>
                        <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.completed}</span>
                    </div>
                    <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Completed</p>
                </div>
                <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-md bg-red-500 flex items-center justify-center">
                            <FiXCircle className="text-white" size={18} />
                        </div>
                        <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.expired}</span>
                    </div>
                    <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Expired</p>
                </div>
            </div>

            {/* Filters */}
            <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                            type="text"
                            placeholder="Search by student name, email, or course..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-md border font-normal ${isDark
                                ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className={`px-4 py-2.5 rounded-md border font-normal ${isDark
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    {/* Course Filter */}
                    <select
                        value={courseFilter}
                        onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}
                        className={`px-4 py-2.5 rounded-md border font-normal min-w-[200px] ${isDark
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                        <option value="">All Courses</option>
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.title?.substring(0, 30)}{course.title?.length > 30 ? '...' : ''}
                            </option>
                        ))}
                    </select>

                    {/* Date Filter */}
                    <select
                        value={dateFilter}
                        onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                        className={`px-4 py-2.5 rounded-md border font-normal ${isDark
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                        <option value="">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className={`px-4 py-2.5 rounded-md border font-medium text-red-500 ${isDark
                                ? 'border-red-900/30 hover:bg-red-900/20'
                                : 'border-red-200 hover:bg-red-50'
                                } transition-colors`}
                        >
                            <FiX size={16} />
                        </button>
                    )}
                </div>

                {hasActiveFilters && (
                    <p className={`mt-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Showing {filteredEnrollments.length} of {enrollments.length} enrollments
                    </p>
                )}
            </div>

            {/* Table */}
            <div className={`rounded-md border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={isDark ? 'bg-slate-700' : 'bg-gray-50'}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Student</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Course</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Enrolled Date</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Progress</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                                <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-200'}`}>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="px-6 py-4">
                                            <div className={`h-12 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                                        </td>
                                    </tr>
                                ))
                            ) : paginatedEnrollments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <FiUserCheck className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                                        <p className={`mt-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No enrollments found</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedEnrollments.map((enroll) => (
                                    <tr key={enroll._id} className={`${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} transition-colors`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {enroll.student?.avatar ? (
                                                    <img src={enroll.student.avatar} alt={enroll.student.name} className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                                                        {enroll.student?.name?.charAt(0) || enroll.user?.firstName?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {enroll.student?.name || `${enroll.user?.firstName || ''} ${enroll.user?.lastName || ''}`.trim() || 'Unknown'}
                                                    </p>
                                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {enroll.student?.email || enroll.user?.email || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 max-w-[250px]">
                                                {enroll.course?.thumbnail && (
                                                    <img src={enroll.course.thumbnail} alt={enroll.course.title} className="w-12 h-8 rounded object-cover" />
                                                )}
                                                <span className={`text-sm font-normal truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {enroll.course?.title || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <FiCalendar className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                                <span className={`text-sm font-normal ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {formatDate(enroll.enrolledAt)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 max-w-[100px]">
                                                    <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-600' : 'bg-gray-200'}`}>
                                                        <div className={`h-full rounded-full transition-all ${enroll.progress >= 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                                                            style={{ width: `${Math.min(enroll.progress || 0, 100)}%` }} />
                                                    </div>
                                                </div>
                                                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{enroll.progress || 0}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(enroll.status)}`}>
                                                {enroll.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() => openDetails(enroll)}
                                                    className={`p-2 rounded-md transition-colors ${isDark ? 'hover:bg-slate-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                                                    title="View Details"
                                                >
                                                    <FiEye size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={`px-6 py-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <p className={`text-sm font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredEnrollments.length)} of {filteredEnrollments.length}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-md border transition-colors disabled:opacity-50 ${isDark
                                        ? 'border-slate-600 hover:bg-slate-700 text-gray-300'
                                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <FiChevronLeft size={16} />
                                </button>
                                <span className={`px-3 py-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-md border transition-colors disabled:opacity-50 ${isDark
                                        ? 'border-slate-600 hover:bg-slate-700 text-gray-300'
                                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <FiChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedEnrollment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-md ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        {/* Modal Header */}
                        <div className={`sticky top-0 flex items-center justify-between p-4 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Enrollment Details</h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className={`p-2 rounded-md transition-colors ${isDark ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Student Info */}
                            <div>
                                <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Student Information</h4>
                                <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        {selectedEnrollment.student?.avatar || selectedEnrollment.user?.avatar ? (
                                            <img src={selectedEnrollment.student?.avatar || selectedEnrollment.user?.avatar}
                                                alt={selectedEnrollment.student?.name || selectedEnrollment.user?.firstName}
                                                className="w-16 h-16 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl font-medium">
                                                {selectedEnrollment.student?.name?.charAt(0) || selectedEnrollment.user?.firstName?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                        <div>
                                            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {selectedEnrollment.student?.name || `${selectedEnrollment.user?.firstName || ''} ${selectedEnrollment.user?.lastName || ''}`.trim() || 'Unknown'}
                                            </p>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                ID: {selectedEnrollment.student?._id?.slice(-8) || selectedEnrollment.user?._id?.slice(-8) || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2">
                                            <FiMail className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {selectedEnrollment.student?.email || selectedEnrollment.user?.email || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiPhone className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {selectedEnrollment.student?.phone || selectedEnrollment.user?.phone || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Course Info */}
                            <div>
                                <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Course Information</h4>
                                <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-start gap-4">
                                        {selectedEnrollment.course?.thumbnail && (
                                            <img src={selectedEnrollment.course.thumbnail} alt={selectedEnrollment.course.title}
                                                className="w-24 h-16 rounded object-cover" />
                                        )}
                                        <div className="flex-1">
                                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {selectedEnrollment.course?.title || 'N/A'}
                                            </p>
                                            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {selectedEnrollment.course?.courseType || 'online'} • {selectedEnrollment.course?.level || 'beginner'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enrollment Details */}
                            <div>
                                <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Enrollment Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FiCalendar className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Enrolled Date</span>
                                        </div>
                                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatDate(selectedEnrollment.enrolledAt)}</p>
                                    </div>
                                    <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FiClock className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Last Accessed</span>
                                        </div>
                                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatDate(selectedEnrollment.lastAccessedAt)}</p>
                                    </div>
                                    <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FiTrendingUp className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Progress</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`flex-1 h-2 rounded-full ${isDark ? 'bg-slate-600' : 'bg-gray-200'}`}>
                                                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${selectedEnrollment.progress || 0}%` }} />
                                            </div>
                                            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedEnrollment.progress || 0}%</span>
                                        </div>
                                    </div>
                                    <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FiBook className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Lessons Completed</span>
                                        </div>
                                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {selectedEnrollment.completedLessons || 0} / {selectedEnrollment.totalLessons || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status & Certificate */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Status</span>
                                    <div className="mt-1">
                                        <span className={`px-3 py-1.5 text-sm font-medium rounded-full capitalize ${getStatusBadge(selectedEnrollment.status)}`}>
                                            {selectedEnrollment.status || 'active'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Certificate</span>
                                    <div className="mt-1">
                                        <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${selectedEnrollment.certificateEligible
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                            {selectedEnrollment.certificateEligible ? 'Eligible' : 'Not Eligible'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className={`sticky bottom-0 flex justify-end gap-3 p-4 border-t ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className={`px-4 py-2 rounded-md border font-medium ${isDark
                                    ? 'border-slate-600 text-gray-300 hover:bg-slate-700'
                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

