import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from "@/config/api";

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Failed to create order');
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMyOrders = createAsyncThunk(
    'order/fetchMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/orders/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch orders');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetOrderState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createOrder.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
