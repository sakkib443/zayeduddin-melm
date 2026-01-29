"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyReviews, deleteReview } from "@/redux/reviewSlice";
import { FiStar, FiCalendar, FiTrash2, FiMessageSquare } from "react-icons/fi";
import { LuLayoutGrid } from "react-icons/lu";
import { useTheme } from "@/providers/ThemeProvider";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const UserReviewsPage = () => {
    const dispatch = useDispatch();
    const { isDark } = useTheme();
    const { myReviews, loading } = useSelector((state) => state.reviews);

    useEffect(() => {
        dispatch(fetchMyReviews());
    }, [dispatch]);

    const [editingReview, setEditingReview] = React.useState(null);

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this review?")) {
            dispatch(deleteReview(id)).then(() => {
                dispatch(fetchMyReviews());
            });
        }
    };

    return (
        <div className={`p-6 md:p-8 min-h-screen ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <header className="mb-8 flex items-center justify-between border-b pb-6 border-slate-200/50 dark:border-slate-800/50">
                <div>
                    <h1 className="text-3xl font-bold font-outfit bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent inline-block">
                        My Reviews
                    </h1>
                    <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Manage and track all your product feedback
                    </p>
                </div>
                <div className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-white shadow-sm border border-slate-100 text-slate-600'}`}>
                    Total Reviews: <span className="font-bold text-red-500">{myReviews.length}</span>
                </div>
            </header>

            {loading ? (
                <div className="grid gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`p-6 rounded-2xl border animate-pulse ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                            <div className="flex gap-4">
                                <div className="w-16 h-16 bg-slate-200/50 dark:bg-slate-800 rounded-xl" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 bg-slate-200/50 dark:bg-slate-800 rounded w-1/4"></div>
                                    <div className="h-4 bg-slate-200/50 dark:bg-slate-800 rounded w-3/4"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : myReviews.length > 0 ? (
                <div className="grid gap-6">
                    {myReviews.map((review) => (
                        <div
                            key={review._id}
                            className={`group relative p-6 rounded-2xl border transition-all duration-300 ${isDark
                                ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                                : 'bg-white border-slate-100 hover:border-red-100 hover:shadow-lg hover:shadow-red-500/5'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                                {/* Product Thumbnail (Left on Desktop) */}
                                {review.productDetails && (
                                    <Link
                                        href={`/${review.productType === 'course' ? 'courses' : review.productType === 'software' ? 'software' : 'website'}/${review.productDetails.slug || review.product}`}
                                        className="shrink-0 group/card w-full md:w-32"
                                    >
                                        <div className="aspect-square md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                                            <img
                                                src={review.productDetails.thumbnail || review.productDetails.image || "/images/placeholder.png"}
                                                alt={review.productDetails.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors" />
                                        </div>
                                    </Link>
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                        {/* Product Title & Type */}
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg truncate md:max-w-md" title={review.productDetails?.title}>
                                                {review.productDetails?.title || 'Unknown Product'}
                                            </h3>
                                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                                                }`}>
                                                {review.productType}
                                            </span>
                                        </div>

                                        {/* Status Badge */}
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${review.status === 'approved'
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : review.status === 'rejected'
                                                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${review.status === 'approved' ? 'bg-emerald-500' : review.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                                                }`} />
                                            {review.status === 'approved' ? 'Published' : review.status === 'rejected' ? 'Rejected' : 'Pending'}
                                        </span>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <FiStar
                                                key={s}
                                                className={`w-4 h-4 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"}`}
                                            />
                                        ))}
                                    </div>

                                    {/* User Review Text */}
                                    <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                        {review.title && <h4 className="font-bold text-sm mb-1">{review.title}</h4>}
                                        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                            "{review.comment}"
                                        </p>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <FiCalendar className="text-slate-400" />
                                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingReview(review)}
                                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${isDark
                                                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                                    }`}
                                            >
                                                Edit
                                            </button>
                                            <Link
                                                href={`/${review.productType === 'course' ? 'courses' : review.productType === 'software' ? 'software' : 'website'}/${review.productDetails?.slug || review.product}`}
                                                className={`p-2 rounded-lg transition-colors ${isDark
                                                    ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                                                    : 'hover:bg-slate-100 text-slate-400 hover:text-red-600'
                                                    }`}
                                                title="View Product"
                                            >
                                                <FiMessageSquare size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className={`p-2 rounded-lg transition-colors ${isDark
                                                    ? 'hover:bg-rose-500/10 text-slate-400 hover:text-rose-500'
                                                    : 'hover:bg-rose-50 text-slate-400 hover:text-rose-600'
                                                    }`}
                                                title="Delete Review"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={`flex flex-col items-center justify-center py-20 px-4 rounded-3xl border border-dashed text-center ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-red-400/20 to-amber-400/20 flex items-center justify-center mb-6">
                        <LuLayoutGrid className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 font-outfit">No Reviews Yet</h3>
                    <p className={`max-w-xs mx-auto mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Unlock your voice! Enroll in courses or purchase products to start sharing your experiences with the community.
                    </p>
                    <Link
                        href="/"
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:scale-105 transition-all"
                    >
                        Explore Marketplace
                    </Link>
                </div>
            )}

            {/* Edit Review Modal */}
            {editingReview && (
                <EditReviewModal review={editingReview} onClose={() => setEditingReview(null)} />
            )}
        </div>
    );
};

// Inline EditReviewModal Component
import { useState } from 'react';
import { updateReview } from "@/redux/reviewSlice";
import { LuX, LuLoader } from "react-icons/lu";

const EditReviewModal = ({ review, onClose }) => {
    const dispatch = useDispatch();
    const { isDark } = useTheme();
    const [formData, setFormData] = useState({
        rating: review.rating,
        title: review.title || '',
        comment: review.comment || ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await dispatch(updateReview({ reviewId: review._id, data: formData })).unwrap();
            onClose();
            // Ideally we re-fetch effectively or the updateReview reducer handles optimistic/local update.
            // But let's trigger a fetch to be safe as well, though specific reducer in slice handles it for myReviews.
        } catch (err) {
            alert('Failed to update review: ' + err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold font-outfit">Edit Review</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <LuX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <FiStar
                                        size={28}
                                        className={`${star <= formData.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:bg-slate-800' : 'bg-slate-50 border-slate-200 focus:bg-white'
                                }`}
                            placeholder="Review title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Review</label>
                        <textarea
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            rows={4}
                            required
                            className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none ${isDark ? 'bg-slate-800 border-slate-700 focus:bg-slate-800' : 'bg-slate-50 border-slate-200 focus:bg-white'
                                }`}
                            placeholder="Share your experience..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-amber-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitting && <LuLoader className="animate-spin" />}
                            Update Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserReviewsPage;
