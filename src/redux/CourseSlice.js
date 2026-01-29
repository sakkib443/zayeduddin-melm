import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "@/config/api";

// Fetch all courses
export const fetchCoursesData = createAsyncThunk(
  "courses/fetchCoursesData",
  async () => {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch courses");
    const result = await response.json();
    return result.data;
  }
);

// Fetch single course by ID
export const fetchSingleCourse = createAsyncThunk(
  "courses/fetchSingleCourse",
  async (id) => {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      cache: "no-store",
      headers,
    });
    if (!response.ok) throw new Error("Failed to fetch course detail");
    const result = await response.json();
    return result.data;
  }
);

export const toggleCourseLike = createAsyncThunk(
  "courses/toggleCourseLike",
  async (id) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Please login to like");

    const response = await fetch(`${API_BASE_URL}/courses/${id}/toggle-like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to toggle like");
    }
    return result.data;
  }
);

// Fetch course content for student (enrolled only)
export const fetchCourseContent = createAsyncThunk(
  "courses/fetchCourseContent",
  async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/courses/${id}/content`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch course content");
    }
    const result = await response.json();
    return result.data;
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    currentCourse: null,
    loading: false,
    contentLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursesData.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCoursesData.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCoursesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // fetchSingleCourse
      .addCase(fetchSingleCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchSingleCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // fetchCourseContent
      .addCase(fetchCourseContent.pending, (state) => { state.contentLoading = true; })
      .addCase(fetchCourseContent.fulfilled, (state, action) => {
        state.contentLoading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseContent.rejected, (state, action) => {
        state.contentLoading = false;
        state.error = action.error.message;
      })
      .addCase(toggleCourseLike.fulfilled, (state, action) => {
        if (state.currentCourse) {
          state.currentCourse.isLiked = action.payload.isLiked;
          state.currentCourse.likeCount = action.payload.likeCount;
        }
      })
      .addCase(toggleCourseLike.rejected, (state, action) => {
        console.error("Toggle like failed:", action.error.message);
      });
  },
});

export default courseSlice.reducer;
