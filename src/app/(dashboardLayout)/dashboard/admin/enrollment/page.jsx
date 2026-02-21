'use client';
import { API_URL } from '@/config/api';
import React, { useEffect, useState } from 'react';
import {
    FiUserCheck, FiSearch, FiRefreshCw, FiX,
    FiChevronLeft, FiChevronRight, FiBook, FiCalendar,
    FiMail, FiPhone, FiEye, FiAward, FiClock,
    FiCheckCircle, FiXCircle, FiUsers, FiTrendingUp, FiGrid
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import toast from 'react-hot-toast';

export default function EnrollmentsPage() {
    const { isDark } = useTheme();
    const [enrollments, setEnrollments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingBatch, setUpdatingBatch] = useState(null); // enrollmentId being updated
    const [batchConfirm, setBatchConfirm] = useState(null); // { enrollmentId, newBatchId, studentName, courseName, oldBatchName, newBatchName }
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [batchFilter, setBatchFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchEnrollments();
        fetchCourses();
        fetchBatches();
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

    const fetchBatches = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/batches`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setBatches(data.data || []);
        } catch (err) {
            console.error('Error fetching batches:', err);
        }
    };

    // Show confirmation before batch change
    const requestBatchChange = (enrollmentId, newBatchId) => {
        const enroll = enrollments.find(e => e._id === enrollmentId);
        if (!enroll) return;

        const studentName = getStudentName(enroll);
        const courseName = enroll.course?.title || 'Unknown Course';
        const oldBatchName = enroll.batch?.batchName || null;
        const newBatch = batches.find(b => b._id === newBatchId);
        const newBatchName = newBatch?.batchName || null;

        setBatchConfirm({
            enrollmentId,
            newBatchId: newBatchId || null,
            studentName,
            courseName,
            oldBatchName,
            newBatchName,
        });
    };

    // Actually perform batch change after confirmation
    const confirmBatchChange = async () => {
        if (!batchConfirm) return;
        const { enrollmentId, newBatchId } = batchConfirm;
        setBatchConfirm(null);
        try {
            setUpdatingBatch(enrollmentId);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/enrollments/admin/${enrollmentId}/batch`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ batchId: newBatchId || null })
            });
            const data = await res.json();
            if (data.success) {
                setEnrollments(prev => prev.map(e =>
                    e._id === enrollmentId ? { ...e, batch: data.data?.batch || null } : e
                ));
                if (selectedEnrollment?._id === enrollmentId) {
                    setSelectedEnrollment(prev => ({ ...prev, batch: data.data?.batch || null }));
                }
                toast.success(newBatchId ? 'Batch updated successfully!' : 'Batch removed!');
            } else {
                toast.error(data.message || 'Failed to update batch');
            }
        } catch (err) {
            console.error('Error updating batch:', err);
            toast.error('Failed to update batch');
        } finally {
            setUpdatingBatch(null);
        }
    };

    // Helper to get student full name
    const getStudentName = (enroll) => {
        if (enroll.student?.firstName) {
            return `${enroll.student.firstName} ${enroll.student.lastName || ''}`.trim();
        }
        if (enroll.student?.name) return enroll.student.name;
        return 'Unknown';
    };

    const getStudentInitial = (enroll) => {
        if (enroll.student?.firstName) return enroll.student.firstName.charAt(0);
        if (enroll.student?.name) return enroll.student.name.charAt(0);
        return 'U';
    };

    // Get batches for a specific course
    const getBatchesForCourse = (courseId) => {
        if (!courseId) return batches;
        return batches.filter(b => b.course === courseId || b.course?._id === courseId);
    };

    // Filter enrollments
    const filteredEnrollments = enrollments.filter(enroll => {
        const studentName = getStudentName(enroll).toLowerCase();
        const matchesSearch =
            studentName.includes(searchTerm.toLowerCase()) ||
            enroll.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enroll.course?.title?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !statusFilter || enroll.status === statusFilter;
        const matchesCourse = !courseFilter || enroll.course?._id === courseFilter;
        const matchesBatch = !batchFilter || enroll.batch?._id === batchFilter;

        let matchesDate = true;
        if (dateFilter) {
            const enrollDate = new Date(enroll.enrolledAt);
            const now = new Date();
            if (dateFilter === 'today') {
                matchesDate = enrollDate.toDateString() === now.toDateString();
            } else if (dateFilter === 'week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                matchesDate = enrollDate >= weekAgo;
            } else if (dateFilter === 'month') {
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                matchesDate = enrollDate >= monthAgo;
            }
        }

        return matchesSearch && matchesStatus && matchesCourse && matchesBatch && matchesDate;
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
        setBatchFilter('');
        setDateFilter('');
        setCurrentPage(1);
    };

    const hasActiveFilters = searchTerm || statusFilter || courseFilter || batchFilter || dateFilter;

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
                        <div className="w-10 h-10 rounded-md bg-[#021E14] flex items-center justify-center">
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
                                } focus:outline-none focus:ring-2 focus:ring-[#021E14]`}
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className={`px-4 py-2.5 rounded-md border font-normal ${isDark
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-[#021E14]`}
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
                        className={`px-4 py-2.5 rounded-md border font-normal min-w-[180px] ${isDark
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-[#021E14]`}
                    >
                        <option value="">All Courses</option>
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.title?.substring(0, 30)}{course.title?.length > 30 ? '...' : ''}
                            </option>
                        ))}
                    </select>

                    {/* Batch Filter */}
                    <select
                        value={batchFilter}
                        onChange={(e) => { setBatchFilter(e.target.value); setCurrentPage(1); }}
                        className={`px-4 py-2.5 rounded-md border font-normal min-w-[160px] ${isDark
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-[#021E14]`}
                    >
                        <option value="">All Batches</option>
                        {batches.map((batch) => (
                            <option key={batch._id} value={batch._id}>
                                {batch.batchName?.substring(0, 25)}{batch.batchName?.length > 25 ? '...' : ''}
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
                            } focus:outline-none focus:ring-2 focus:ring-[#021E14]`}
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
                            className={`px-4 py-2.5 rounded-md border font-medium transition-colors ${isDark
                                ? 'border-red-500/30 text-red-400 hover:bg-red-900/20'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                }`}
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
                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Student</th>
                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Course</th>
                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Batch</th>
                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Enrolled Date</th>
                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Progress</th>
                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                                <th className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-200'}`}>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={7} className="px-4 py-4">
                                            <div className={`h-12 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                                        </td>
                                    </tr>
                                ))
                            ) : paginatedEnrollments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center">
                                        <FiUserCheck className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                                        <p className={`mt-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No enrollments found</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedEnrollments.map((enroll) => {
                                    const courseBatches = getBatchesForCourse(enroll.course?._id);
                                    return (
                                        <tr key={enroll._id} className={`${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} transition-colors`}>
                                            {/* Student */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {enroll.student?.avatar ? (
                                                        <img src={enroll.student.avatar} alt={getStudentName(enroll)} className="w-9 h-9 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-full bg-[#021E14] flex items-center justify-center text-white text-sm font-medium">
                                                            {getStudentInitial(enroll)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            {getStudentName(enroll)}
                                                        </p>
                                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {enroll.student?.email || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Course */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2 max-w-[200px]">
                                                    {enroll.course?.thumbnail && (
                                                        <img src={enroll.course.thumbnail} alt={enroll.course.title} className="w-10 h-7 rounded object-cover shrink-0" />
                                                    )}
                                                    <span className={`text-sm font-normal truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {enroll.course?.title || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            {/* Batch - Selectable */}
                                            <td className="px-4 py-3">
                                                <select
                                                    value={enroll.batch?._id || ''}
                                                    onChange={(e) => requestBatchChange(enroll._id, e.target.value)}
                                                    disabled={updatingBatch === enroll._id}
                                                    className={`text-xs px-2 py-1.5 rounded-md border cursor-pointer min-w-[130px] ${updatingBatch === enroll._id ? 'opacity-50' : ''} ${isDark
                                                        ? 'bg-slate-700 border-slate-600 text-gray-300 hover:border-indigo-500'
                                                        : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-400'
                                                        } focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors`}
                                                >
                                                    <option value="">No Batch</option>
                                                    {(courseBatches.length > 0 ? courseBatches : batches).map((batch) => (
                                                        <option key={batch._id} value={batch._id}>
                                                            {batch.batchName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            {/* Date */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <FiCalendar className={isDark ? 'text-gray-500' : 'text-gray-400'} size={13} />
                                                    <span className={`text-sm font-normal ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        {formatDate(enroll.enrolledAt)}
                                                    </span>
                                                </div>
                                            </td>
                                            {/* Progress */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`flex-1 max-w-[80px] h-1.5 rounded-full ${isDark ? 'bg-slate-600' : 'bg-gray-200'}`}>
                                                        <div className={`h-full rounded-full transition-all ${enroll.progress >= 100 ? 'bg-green-500' : 'bg-emerald-500'}`}
                                                            style={{ width: `${Math.min(enroll.progress || 0, 100)}%` }} />
                                                    </div>
                                                    <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{enroll.progress || 0}%</span>
                                                </div>
                                            </td>
                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(enroll.status)}`}>
                                                    {enroll.status || 'active'}
                                                </span>
                                            </td>
                                            {/* Actions */}
                                            <td className="px-4 py-3">
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
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={`px-4 py-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
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
                                        {selectedEnrollment.student?.avatar ? (
                                            <img src={selectedEnrollment.student.avatar}
                                                alt={getStudentName(selectedEnrollment)}
                                                className="w-16 h-16 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-[#021E14] flex items-center justify-center text-white text-xl font-medium">
                                                {getStudentInitial(selectedEnrollment)}
                                            </div>
                                        )}
                                        <div>
                                            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {getStudentName(selectedEnrollment)}
                                            </p>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                ID: {selectedEnrollment.student?._id?.slice(-8) || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2">
                                            <FiMail className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {selectedEnrollment.student?.email || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiPhone className={isDark ? 'text-gray-400' : 'text-gray-500'} size={14} />
                                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {selectedEnrollment.student?.phone || 'N/A'}
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

                            {/* Batch Info - with change option */}
                            <div>
                                <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Batch Assignment</h4>
                                <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${isDark ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
                                            <FiGrid className={isDark ? 'text-indigo-400' : 'text-indigo-600'} size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <label className={`text-xs font-medium mb-1.5 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Select Batch
                                            </label>
                                            <select
                                                value={selectedEnrollment.batch?._id || ''}
                                                onChange={(e) => requestBatchChange(selectedEnrollment._id, e.target.value)}
                                                disabled={updatingBatch === selectedEnrollment._id}
                                                className={`w-full text-sm px-3 py-2 rounded-md border ${updatingBatch === selectedEnrollment._id ? 'opacity-50' : ''} ${isDark
                                                    ? 'bg-slate-600 border-slate-500 text-white hover:border-indigo-500'
                                                    : 'bg-white border-gray-300 text-gray-900 hover:border-indigo-400'
                                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors cursor-pointer`}
                                            >
                                                <option value="">No Batch Assigned</option>
                                                {(() => {
                                                    const cBatches = getBatchesForCourse(selectedEnrollment.course?._id);
                                                    return (cBatches.length > 0 ? cBatches : batches).map((batch) => (
                                                        <option key={batch._id} value={batch._id}>
                                                            {batch.batchName}{batch.status ? ` (${batch.status})` : ''}
                                                        </option>
                                                    ));
                                                })()}
                                            </select>
                                        </div>
                                    </div>
                                    {selectedEnrollment.batch && (
                                        <div className={`mt-3 pt-3 border-t ${isDark ? 'border-slate-600' : 'border-gray-200'}`}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {selectedEnrollment.batch.batchName}
                                                    </p>
                                                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        Status: <span className="capitalize">{selectedEnrollment.batch.status}</span>
                                                        {selectedEnrollment.batch.startDate && ` • Started: ${formatDate(selectedEnrollment.batch.startDate)}`}
                                                        {selectedEnrollment.batch.endDate && ` • Ends: ${formatDate(selectedEnrollment.batch.endDate)}`}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => requestBatchChange(selectedEnrollment._id, '')}
                                                    disabled={updatingBatch === selectedEnrollment._id}
                                                    className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${isDark
                                                        ? 'text-red-400 hover:bg-red-900/20 border border-red-500/30'
                                                        : 'text-red-600 hover:bg-red-50 border border-red-200'
                                                        }`}
                                                    title="Remove from batch"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
                                                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${selectedEnrollment.progress || 0}%` }} />
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

            {/* Batch Change Confirmation Modal */}
            {batchConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className={`w-full max-w-md rounded-lg shadow-2xl ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                        <div className="p-6 text-center">
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
                                <FiGrid className={isDark ? 'text-indigo-400' : 'text-indigo-600'} size={32} />
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Confirm Batch Change
                            </h3>
                            <div className={`text-sm space-y-3 p-4 rounded-md mb-6 text-left ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                    <span className="font-semibold block mb-1">Student:</span>
                                    {batchConfirm.studentName}
                                </p>
                                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                    <span className="font-semibold block mb-1">Course:</span>
                                    {batchConfirm.courseName}
                                </p>
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-slate-600">
                                    <div className="flex-1">
                                        <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Current</span>
                                        <p className="font-medium h-5">{batchConfirm.oldBatchName || 'None'}</p>
                                    </div>
                                    <div className="shrink-0 text-gray-400">→</div>
                                    <div className="flex-1">
                                        <span className="text-[10px] uppercase font-bold text-indigo-500">New</span>
                                        <p className="font-medium h-5 text-indigo-600 dark:text-indigo-400">{batchConfirm.newBatchName || 'None'}</p>
                                    </div>
                                </div>
                            </div>
                            <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Are you sure you want to {batchConfirm.newBatchId ? 'change' : 'remove'} the batch for this student?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setBatchConfirm(null)}
                                    className={`flex-1 px-4 py-2.5 rounded-md font-medium transition-colors ${isDark
                                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmBatchChange}
                                    className="flex-1 px-4 py-2.5 rounded-md font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
