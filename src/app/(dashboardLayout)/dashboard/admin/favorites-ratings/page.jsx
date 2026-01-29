'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReviews, deleteReview } from '@/redux/reviewSlice';
import { FiHeart, FiStar, FiSearch, FiEye, FiPackage, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';
import Link from 'next/link';

export default function FavoritesRatingsPage() {
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { adminReviews: reviews, loading: reviewsLoading, adminTotalReviews: totalReviews } = useSelector((state) => state.reviews);

  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [activeTab, setActiveTab] = useState('favorites');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoadingFavorites(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/wishlist/all`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        });
        const data = await res.json();
        if (data.success) {
          setFavorites(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoadingFavorites(false);
      }
    };
    fetchFavorites();
  }, []);

  useEffect(() => {
    if (activeTab === 'ratings') {
      dispatch(fetchAllReviews({ page: 1, limit: 100, status: 'approved' }));
    }
  }, [dispatch, activeTab]);

  const filteredFavorites = favorites
    .filter(fav =>
      (fav.product?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (fav.user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (fav.user?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredReviews = reviews.filter(r =>
    (r.productDetails?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (r.user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (r.comment?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const totalFavorites = favorites.length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    setDeletingReviewId(reviewToDelete._id);
    try {
      await dispatch(deleteReview(reviewToDelete._id)).unwrap();
      setShowDeleteModal(false);
      setReviewToDelete(null);
    } catch (error) {
      console.error('Delete review error:', error);
      alert('Failed to delete review: ' + error);
    } finally {
      setDeletingReviewId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-md ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
            <FiHeart className="text-rose-500" size={20} />
          </div>
          <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Likes & Ratings
          </h1>
        </div>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          View all product likes and customer ratings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
              <FiHeart className="text-rose-500" size={18} />
            </div>
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Likes</p>
              <p className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{totalFavorites}</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
              <FiStar className="text-amber-500" size={18} />
            </div>
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Reviews</p>
              <p className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{totalReviews}</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <FiStar className="text-emerald-500" size={18} />
            </div>
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Average Rating</p>
              <div className="flex items-center gap-2">
                <p className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{avgRating}</p>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={12} className={i < Math.round(avgRating) ? 'fill-current' : 'text-gray-300'} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-rose-500 ${
              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900'
            }`}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'favorites'
                ? 'bg-rose-500 text-white'
                : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FiHeart size={16} />
            Likes ({totalFavorites})
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'ratings'
                ? 'bg-amber-500 text-white'
                : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FiStar size={16} />
            Reviews ({totalReviews})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`rounded-md border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        {activeTab === 'favorites' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? 'bg-slate-700/50' : 'bg-gray-50'}>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Product</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Type</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Likes</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Liked By</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Date</th>
                  <th className={`px-4 py-3 text-right text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                {loadingFavorites ? (
                  <tr>
                    <td colSpan="6" className={`px-4 py-8 text-center text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      Loading favorites...
                    </td>
                  </tr>
                ) : filteredFavorites.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={`px-4 py-8 text-center ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      <FiHeart size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No favorites found</p>
                    </td>
                  </tr>
                ) : (
                  filteredFavorites.map((fav) => (
                    <tr key={fav._id} className={isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {fav.product?.images?.[0] || fav.product?.thumbnail ? (
                            <img
                              src={fav.product?.images?.[0] || fav.product?.thumbnail}
                              alt=""
                              className="w-10 h-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-md flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                              <FiPackage className={isDark ? 'text-slate-500' : 'text-gray-400'} size={16} />
                            </div>
                          )}
                          <div>
                            <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {fav.product?.title || 'Unknown Product'}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                              ৳{fav.product?.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          fav.productType === 'course' 
                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                            : fav.productType === 'website'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
                        }`}>
                          {fav.productType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FiHeart className="text-rose-500 fill-current" size={14} />
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {fav.product?.likeCount || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-medium ${
                            isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {fav.user?.firstName?.[0] || fav.user?.email?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {fav.user?.firstName} {fav.user?.lastName}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                              {fav.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                          {new Date(fav.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/${fav.productType === 'course' ? 'courses' : fav.productType}/${fav.product?._id}`}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium ${
                            isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                        >
                          <FiEye size={14} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? 'bg-slate-700/50' : 'bg-gray-50'}>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Product</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>User</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Review</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Rating</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Date</th>
                  <th className={`px-4 py-3 text-right text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
                {reviewsLoading ? (
                  <tr>
                    <td colSpan="6" className={`px-4 py-8 text-center text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      Loading reviews...
                    </td>
                  </tr>
                ) : filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={`px-4 py-8 text-center ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      <FiStar size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No reviews found</p>
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr key={review._id} className={isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-3">
                        <div>
                          <span className="text-xs text-rose-500 font-medium uppercase">{review.productType}</span>
                          <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {review.productDetails?.title || 'Unknown Product'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-medium ${
                            isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {review.user?.firstName?.[0]}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {review.user?.firstName} {review.user?.lastName}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                              {review.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{review.title}</p>
                        <p className={`text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{review.comment}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-gray-300'} />
                          ))}
                          <span className={`ml-1 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{review.rating}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteClick(review)}
                          disabled={deletingReviewId === review._id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 disabled:opacity-50"
                        >
                          <FiTrash2 size={14} />
                          {deletingReviewId === review._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-5 rounded-md shadow-lg max-w-md w-full mx-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-md bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <FiTrash2 className="text-red-500" size={20} />
              </div>
              <div>
                <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Delete Review</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>This action cannot be undone</p>
              </div>
            </div>
            <p className={`text-sm mb-5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              Are you sure you want to delete this review by <strong>{reviewToDelete?.user?.firstName} {reviewToDelete?.user?.lastName}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingReviewId}
                className="px-4 py-2 text-sm font-medium rounded-md bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
              >
                {deletingReviewId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
