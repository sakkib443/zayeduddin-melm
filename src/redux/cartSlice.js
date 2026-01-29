import { createSlice } from '@reduxjs/toolkit';

// SSR-safe: always initialize with empty state
const initialState = {
    items: [],
    totalAmount: 0,
    isHydrated: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Hydrate cart from localStorage on client-side mount
        hydrateCart: (state) => {
            if (typeof window !== 'undefined' && !state.isHydrated) {
                try {
                    const savedItems = localStorage.getItem('cartItems');
                    const savedTotal = localStorage.getItem('cartTotal');
                    state.items = savedItems ? JSON.parse(savedItems) : [];
                    state.totalAmount = savedTotal ? Number(savedTotal) : 0;
                    state.isHydrated = true;
                } catch (error) {
                    console.error('Error hydrating cart:', error);
                    state.items = [];
                    state.totalAmount = 0;
                    state.isHydrated = true;
                }
            }
        },
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);

            if (!existingItem) {
                state.items.push(newItem);
                state.totalAmount += newItem.price;

                if (typeof window !== 'undefined') {
                    localStorage.setItem('cartItems', JSON.stringify(state.items));
                    localStorage.setItem('cartTotal', state.totalAmount.toString());
                }
            }
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.items = state.items.filter((item) => item.id !== id);
                state.totalAmount -= existingItem.price;

                if (typeof window !== 'undefined') {
                    localStorage.setItem('cartItems', JSON.stringify(state.items));
                    localStorage.setItem('cartTotal', state.totalAmount.toString());
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;

            if (typeof window !== 'undefined') {
                localStorage.removeItem('cartItems');
                localStorage.removeItem('cartTotal');
            }
        },
    },
});

export const { addToCart, removeFromCart, clearCart, hydrateCart } = cartSlice.actions;
export default cartSlice.reducer;
