import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        isAuthenticated: false,
        isAuthChecked: false,
        user: null,
        error: null,
        isUpdated: false,
        isForgotEmailSent: false,
        isPasswordReset: false,
        message: null
    },
    reducers: {


        loginRequest(state) {
            state.loading = true;
        },
        loginSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        loginFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },


        registerRequest(state) {
            state.loading = true;
        },
        registerSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        registerFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        loadUserRequest(state) {
            state.isAuthChecked = false;
        },
        loadUserSuccess(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.isAuthChecked = true;
        },
        loadUserFail(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.isAuthChecked = true;
        },

        logOutSuccess(state) {
            state.isAuthenticated = false;
            state.user = null;
        },
        logOutFail(state, action) {
            state.error = action.payload;
        },

        updateProfileRequest(state) {
            state.loading = true;
            state.isUpdated = false;
        },
        updateProfileSuccess(state, action) {
            state.loading = false;
            state.user = action.payload;
            state.isUpdated = true;
        },
        updateProfileFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearUpdateProfile(state) {
            state.isUpdated = false;
        },

        updatePasswordRequest(state) {
            state.loading = true;
            state.isUpdated = false;
        },
        updatePasswordSuccess(state) {
            state.loading = false;
            state.isUpdated = true;
        },
        updatePasswordFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        forgetPasswordRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
            state.isForgotEmailSent = false;
        },
        forgetPasswordSuccess(state, action) {
            state.loading = false;
            state.isForgotEmailSent = true;
            state.message = action.payload.message;
        },
        forgetPasswordFail(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.isForgotEmailSent = false;
        },

        resetPasswordRequest(state) {
            state.loading = true;
            state.isUpdated = false;
            state.isPasswordReset = false;
            state.error = null;
        },
        resetPasswordSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.isPasswordReset = true;
        },
        resetPasswordFail(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.isPasswordReset = false;
        },

        clearPasswordReset(state) {
            state.isPasswordReset = false;
        },

        clearForgotEmailSent(state) {
            state.isForgotEmailSent = false;
            state.message = null;
        },

        clearError(state) {
            state.error = null;
        }
    }
});

export const {
    loginRequest,
    loginSuccess,
    loginFail,
    registerRequest,
    registerSuccess,
    registerFail,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logOutSuccess,
    logOutFail,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail,
    clearUpdateProfile,
    updatePasswordRequest,
    updatePasswordSuccess,
    updatePasswordFail,
    forgetPasswordRequest,
    forgetPasswordSuccess,
    forgetPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFail,
    clearPasswordReset,
    clearForgotEmailSent,
    clearError
} = authSlice.actions;

export default authSlice.reducer;
