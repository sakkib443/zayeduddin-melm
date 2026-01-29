"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllReviews, updateReviewStatus, deleteReview } from "@/redux/reviewSlice";
import { FiCheck, FiX, FiTrash2, FiSearch, FiFilter, FiStar, FiMessageSquare } from "react-icons/fi";

const AdminReviewsPage = () => {
  const dispatch = useDispatch();
  const { adminReviews: reviews, loading, adminTotalReviews: total } = useSelector((state) => state.reviews);
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllReviews({ page, limit: 10, status: filterStatus }));
  }, [dispatch, page, filterStatus]);

  const handleStatusUpdate = (id, status) => {
    if (confirm(`Are you sure you want to ${status} this review?`)) {
      dispatch(updateReviewStatus({ reviewId: id, status }));
    }
  };

  const handleDelete = (id) => {
    if (confirm("Delete this review? This cannot be undone.")) {
      dispatch(deleteReview(id));
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      approved: "bg-emerald-50 text-emerald-600",
      rejected: "bg-red-50 text-red-600",
      pending: "bg-amber-50 text-amber-600",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const filteredReviews = reviews.filter(r =>
    r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-md border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-md flex items-center justify-center">
            <FiMessageSquare className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Reviews</h1>
            <p className="text-sm text-slate-500">{total} total reviews</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: FiMessageSquare, color: 'text-slate-600' },
          { label: 'Pending', value: stats.pending, icon: FiStar, color: 'text-amber-500' },
          { label: 'Approved', value: stats.approved, icon: FiCheck, color: 'text-emerald-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={stat.color} size={18} />
              <span className="text-xl font-semibold text-slate-800 dark:text-white">{stat.value}</span>
            </div>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm transition-colors"
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-amber-400 outline-none text-sm appearance-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Product</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Review</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-slate-400 text-sm">
                    Loading reviews...
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-slate-400 text-sm">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <span className="text-xs text-blue-500 font-medium">{review.productType}</span>
                        <p className="text-sm font-medium text-slate-800 dark:text-white line-clamp-1 max-w-[150px]">
                          {review.productDetails?.title || 'Unknown Product'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                          {review.user?.firstName?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {review.user?.firstName} {review.user?.lastName}
                          </p>
                          <p className="text-xs text-slate-400">{review.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{review.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-2">{review.comment}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                        {review.isVerifiedPurchase && (
                          <span className="ml-2 text-emerald-500">✓ Verified</span>
                        )}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-slate-800 dark:text-white">{review.rating}</span>
                        <FiStar className="text-amber-400 fill-current" size={14} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={review.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {review.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(review._id, 'approved')}
                              className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Approve"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(review._id, 'rejected')}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                              title="Reject"
                            >
                              <FiX size={16} />
                            </button>
                          </>
                        )}
                        {review.status === 'rejected' && (
                          <button
                            onClick={() => handleStatusUpdate(review._id, 'approved')}
                            className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Approve"
                          >
                            <FiCheck size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
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
        <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Page {page} of {Math.ceil(total / 10) || 1}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-slate-700 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Previous
            </button>
            <button
              disabled={page * 10 >= total}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-slate-700 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewsPage;
