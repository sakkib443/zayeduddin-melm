import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from "@/config/api";

export const fetchMyDownloads = createAsyncThunk(
    'download/fetchMyDownloads',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/downloads`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch downloads');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const generateDownloadLink = createAsyncThunk(
    'download/generateDownloadLink',
    async (downloadId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/downloads/${downloadId}/link`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Failed to generate link');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const downloadSlice = createSlice({
    name: 'download',
    initialState: {
        downloads: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyDownloads.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyDownloads.fulfilled, (state, action) => {
                state.loading = false;
                state.downloads = action.payload;
            })
            .addCase(fetchMyDownloads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default downloadSlice.reducer;
