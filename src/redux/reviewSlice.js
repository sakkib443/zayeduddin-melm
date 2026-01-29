import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "@/config/api";

// Fetch reviews for a specific product
export const fetchProductReviews = createAsyncThunk(
    "reviews/fetchProductReviews",
    async ({ productId, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}?page=${page}&limit=${limit}`, {
                cache: "no-store",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to fetch reviews");
            return result.data; // Expected { reviews: [], avgRating: 4.5 }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Submit a new review
export const submitReview = createAsyncThunk(
    "reviews/submitReview",
    async (reviewData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication required");

            const response = await fetch(`${API_BASE_URL}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reviewData),
            });
            const result = await response.json();
            if (!response.ok) {
                let errorMessage = result.message || "Failed to submit review";
                if (result.errorMessages && result.errorMessages.length > 0) {
                    errorMessage = result.errorMessages.map(e => e.message).join('. ');
                }
                throw new Error(errorMessage);
            }
            return result.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Mark review as helpful
export const markReviewHelpful = createAsyncThunk(
    "reviews/markHelpful",
    async (reviewId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, {
                method: "POST",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to mark as helpful");
            return { reviewId, helpfulCount: result.data.helpfulCount };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch user's own reviews
export const fetchMyReviews = createAsyncThunk(
    "reviews/fetchMyReviews",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication required");

            const response = await fetch(`${API_BASE_URL}/reviews/my`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store',
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to fetch your reviews");
            return result.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Admin: Fetch All Reviews
export const fetchAllReviews = createAsyncThunk(
    "reviews/fetchAllReviews",
    async ({ page = 1, limit = 10, status = "" }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication required");

            let url = `${API_BASE_URL}/reviews/admin/all?page=${page}&limit=${limit}`;
            if (status) url += `&status=${status}`;

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to fetch reviews");
            return result; // Expected { data: [], meta: { total: ... } }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Admin: Update Review Status
export const updateReviewStatus = createAsyncThunk(
    "reviews/updateStatus",
    async ({ reviewId, status }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/reviews/admin/${reviewId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to update status");
            return result.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update user's own review
export const updateReview = createAsyncThunk(
    "reviews/updateReview",
    async ({ reviewId, data }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to update review");
            return result.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete Review (Admin or Owner)
export const deleteReview = createAsyncThunk(
    "reviews/deleteReview",
    async (reviewId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to delete review");
            return reviewId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const reviewSlice = createSlice({
    name: "reviews",
    initialState: {
        reviews: [], // Product page reviews
        adminReviews: [], // Admin dashboard reviews
        avgRating: 0,
        totalReviews: 0,
        adminTotalReviews: 0,
        loading: false,
        submitLoading: false,
        error: null,
        submitError: null,
        submitSuccess: false,
        myReviews: [],
    },
    reducers: {
        resetSubmitState: (state) => {
            state.submitLoading = false;
            state.submitError = null;
            state.submitSuccess = false;
        },
        clearReviews: (state) => {
            state.reviews = [];
            state.avgRating = 0;
            state.totalReviews = 0;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Product Reviews
        builder.addCase(fetchProductReviews.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProductReviews.fulfilled, (state, action) => {
            state.loading = false;
            state.reviews = action.payload.reviews;
            state.avgRating = action.payload.avgRating;
            state.totalReviews = action.meta?.total || action.payload.reviews.length;
        });
        builder.addCase(fetchProductReviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Submit Review
        builder.addCase(submitReview.pending, (state) => {
            state.submitLoading = true;
            state.submitError = null;
            state.submitSuccess = false;
        });
        builder.addCase(submitReview.fulfilled, (state, action) => {
            state.submitLoading = false;
            state.submitSuccess = true;
            if (action.payload.status === 'approved') {
                state.reviews.unshift(action.payload);
            }
        });
        builder.addCase(submitReview.rejected, (state, action) => {
            state.submitLoading = false;
            state.submitError = action.payload;
        });

        // Mark Helpful
        builder.addCase(markReviewHelpful.fulfilled, (state, action) => {
            const index = state.reviews.findIndex(r => r._id === action.payload.reviewId);
            if (index !== -1) {
                state.reviews[index].helpfulCount = action.payload.helpfulCount;
            }
        });

        // Fetch My Reviews
        builder.addCase(fetchMyReviews.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchMyReviews.fulfilled, (state, action) => {
            state.loading = false;
            state.myReviews = action.payload;
        });
        builder.addCase(fetchMyReviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Admin: Fetch All Reviews
        builder.addCase(fetchAllReviews.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAllReviews.fulfilled, (state, action) => {
            state.loading = false;
            state.adminReviews = action.payload.data;
            state.adminTotalReviews = action.payload.meta.total;
        });
        builder.addCase(fetchAllReviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Admin: Update Status
        builder.addCase(updateReviewStatus.fulfilled, (state, action) => {
            const index = state.adminReviews.findIndex(r => r._id === action.payload._id);
            if (index !== -1) {
                state.adminReviews[index] = action.payload;
            }
        });

        // Admin: Delete Review
        builder.addCase(deleteReview.fulfilled, (state, action) => {
            state.adminReviews = state.adminReviews.filter(r => r._id !== action.payload);
            // Also remove from reviews list if present
            state.reviews = state.reviews.filter(r => r._id !== action.payload);
            state.myReviews = state.myReviews.filter(r => r._id !== action.payload);
        });

        // Update Review (User)
        builder.addCase(updateReview.fulfilled, (state, action) => {
            const index = state.myReviews.findIndex(r => r._id === action.payload._id);
            if (index !== -1) {
                // Preserve productDetails which isn't returned by update
                const existing = state.myReviews[index];
                state.myReviews[index] = { ...action.payload, productDetails: existing.productDetails };
            }
        });
    },
});

export const { resetSubmitState, clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
