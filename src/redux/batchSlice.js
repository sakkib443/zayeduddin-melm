import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from "@/config/api";

// Fetch my enrolled batches (for students)
export const fetchMyBatches = createAsyncThunk(
    'batch/fetchMyBatches',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            console.log('=== fetchMyBatches called ===');
            console.log('API URL:', `${API_BASE_URL}/batches/my-batches`);
            console.log('Token exists:', !!token);

            const response = await fetch(`${API_BASE_URL}/batches/my-batches`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                console.error('My batches fetch error:', data.message);
                return rejectWithValue(data.message || 'Failed to fetch my batches');
            }
            console.log('My batches fetched successfully:', data.data?.length, 'found');
            console.log('Batches:', data.data);
            return data.data;
        } catch (error) {
            console.error('My batches fetch exception:', error.message);
            return rejectWithValue(error.message);
        }
    }
);


const batchSlice = createSlice({
    name: 'batch',
    initialState: {
        myBatches: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyBatches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyBatches.fulfilled, (state, action) => {
                state.loading = false;
                state.myBatches = action.payload || [];
            })
            .addCase(fetchMyBatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default batchSlice.reducer;
