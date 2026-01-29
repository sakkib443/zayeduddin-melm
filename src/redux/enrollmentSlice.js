import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from "@/config/api";

export const fetchMyEnrollments = createAsyncThunk(
    'enrollment/fetchMyEnrollments',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/enrollments/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Enrollment fetch error:', data.message);
                return rejectWithValue(data.message || 'Failed to fetch enrollments');
            }
            console.log('Enrollments fetched successfully:', data.data?.length, 'found');
            return data.data;
        } catch (error) {
            console.error('Enrollment fetch exception:', error.message);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMyStats = createAsyncThunk(
    'enrollment/fetchMyStats',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/enrollments/my/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch stats');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateLessonProgress = createAsyncThunk(
    'enrollment/updateProgress',
    async ({ courseId, lessonId }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/enrollments/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ courseId, lessonId })
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Failed to update progress');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const enrollmentSlice = createSlice({
    name: 'enrollment',
    initialState: {
        enrollments: [],
        stats: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyEnrollments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
                state.loading = false;
                state.enrollments = action.payload;
            })
            .addCase(fetchMyEnrollments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            })
            .addCase(updateLessonProgress.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateLessonProgress.fulfilled, (state, action) => {
                state.loading = false;
                // Update specific enrollment in the list
                const index = state.enrollments.findIndex(e => e.course?._id === action.payload.course);
                if (index !== -1) {
                    state.enrollments[index] = { ...state.enrollments[index], ...action.payload };
                }
            })
            .addCase(updateLessonProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default enrollmentSlice.reducer;
