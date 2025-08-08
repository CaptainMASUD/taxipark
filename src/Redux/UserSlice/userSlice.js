// src/Redux/UserSlice/UserSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false, // Initialize loading state
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.currentUser = null; // Reset current user on logout
        },
    },
});

export const { signInStart, signInSuccess, signInError, logout } = userSlice.actions;

export default userSlice.reducer;
