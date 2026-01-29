import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "@/config/api";

export const fetchWebsites = createAsyncThunk(
    "websites/fetchWebsites",
    async () => {
        const response = await fetch(`${API_BASE_URL}/websites`, {
            cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch websites");
        const result = await response.json();
        return result.data;
    }
);

export const fetchWebsiteById = createAsyncThunk(
    "websites/fetchWebsiteById",
    async (id) => {
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/websites/${id}`, {
            cache: "no-store",
            headers,
        });
        if (!response.ok) throw new Error("Failed to fetch website detail");
        const result = await response.json();
        return result.data;
    }
);

export const toggleWebsiteLike = createAsyncThunk(
    "websites/toggleWebsiteLike",
    async (id) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please login to like");

        const response = await fetch(`${API_BASE_URL}/websites/${id}/toggle-like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const result = await response.json();
        console.log("Toggle like response:", response.status, result);

        if (!response.ok) {
            throw new Error(result.message || "Failed to toggle like");
        }
        return result.data;
    }
);

const websiteSlice = createSlice({
    name: "websites",
    initialState: {
        websiteList: [],
        singleWebsite: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWebsites.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchWebsites.fulfilled, (state, action) => {
                state.loading = false;
                state.websiteList = action.payload;
            })
            .addCase(fetchWebsites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchWebsiteById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchWebsiteById.fulfilled, (state, action) => {
                state.loading = false;
                state.singleWebsite = action.payload;
            })
            .addCase(fetchWebsiteById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(toggleWebsiteLike.fulfilled, (state, action) => {
                if (state.singleWebsite) {
                    state.singleWebsite.isLiked = action.payload.isLiked;
                    state.singleWebsite.likeCount = action.payload.likeCount;
                }
            })
            .addCase(toggleWebsiteLike.rejected, (state, action) => {
                console.error("Toggle like failed:", action.error.message);
            });
    },
});

export default websiteSlice.reducer;
