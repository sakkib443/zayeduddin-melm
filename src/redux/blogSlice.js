import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "@/config/api";

// Fetch all blogs
export const fetchBlogs = createAsyncThunk(
    "blogs/fetchBlogs",
    async (params = {}) => {
        const { page = 1, limit = 3, searchTerm = "", category = "" } = params;
        let url = `${API_BASE_URL}/blogs?page=${page}&limit=${limit}`;
        if (searchTerm) url += `&searchTerm=${searchTerm}`;
        if (category) url += `&category=${category}`;

        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch blogs");
        const result = await response.json();
        return result.data;
    }
);

// Fetch a single blog by ID or Slug
export const fetchBlogDetail = createAsyncThunk(
    "blogs/fetchBlogDetail",
    async (slug) => {
        const response = await fetch(`${API_BASE_URL}/blogs/slug/${slug}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch blog details");
        const result = await response.json();
        return result.data;
    }
);

const blogSlice = createSlice({
    name: "blogs",
    initialState: {
        blogList: [],
        singleBlog: null,
        loading: false,
        error: null,
        pagination: {
            page: 1,
            total: 0,
            limit: 3
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogList = action.payload; // Assuming action.payload is the array of blogs
                // If meta exists: state.pagination = action.payload.meta;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchBlogDetail.fulfilled, (state, action) => {
                state.singleBlog = action.payload;
            });
    },
});

export default blogSlice.reducer;
