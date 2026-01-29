import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "@/config/api";

// Fetch all approved design templates
export const fetchDesignTemplates = createAsyncThunk(
    "designTemplates/fetchDesignTemplates",
    async (params = {}) => {
        const { category, templateType, searchTerm, limit = 8 } = params;
        let url = `${API_BASE_URL}/design-templates?limit=${limit}`;

        if (category && category !== 'all') url += `&category=${category}`;
        if (templateType) url += `&templateType=${templateType}`;
        if (searchTerm) url += `&searchTerm=${searchTerm}`;

        const response = await fetch(url, {
            cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch design templates");
        const result = await response.json();
        return result.data;
    }
);

// Fetch categories for design templates
export const fetchDesignCategories = createAsyncThunk(
    "designTemplates/fetchDesignCategories",
    async () => {
        const response = await fetch(`${API_BASE_URL}/categories?type=design-template`, {
            cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch design categories");
        const result = await response.json();
        return result.data;
    }
);

const designTemplateSlice = createSlice({
    name: "designTemplates",
    initialState: {
        items: [],
        categories: [],
        loading: false,
        catLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDesignTemplates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDesignTemplates.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchDesignTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchDesignCategories.pending, (state) => {
                state.catLoading = true;
            })
            .addCase(fetchDesignCategories.fulfilled, (state, action) => {
                state.catLoading = false;
                state.categories = action.payload;
            })
            .addCase(fetchDesignCategories.rejected, (state, action) => {
                state.catLoading = false;
            });
    },
});

export default designTemplateSlice.reducer;
