import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        loading: false,
        product: {},
        isReviewSubmitted: false,
        isProductCreated: false,
        isProductDeleted: false,
        isProductUpdated: false,
        isReviewDeleted: false,
        reviews: [],
    },
    reducers: {
        productRequest(state) {
            state.loading = true;
        },
        productSuccess(state, action) {
            state.loading = false;
            const payload = action.payload || {};
            state.product = payload.product || payload;
        },
        productFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        createReviewRequest(state) {
            state.loading = true;
        },
        createReviewSuccess(state) {
            state.loading = false;
            state.isReviewSubmitted = true;
        },
        createReviewFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearReviewSubmitted(state) {
            state.isReviewSubmitted = false;
        },
        clearError(state) {
            state.error = null;
        },
        clearProduct(state) {
            state.product = null;
        },
        newProductRequest(state) {
            state.loading = true;
        },
        newProductSuccess(state, action) {
            state.loading = false;
            const payload = action.payload || {};
            state.product = payload.product || payload;
            state.isProductCreated = true;
        },
        newProductFail(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.isProductCreated = false;
        },
        clearProductCreated(state) {
            state.isProductCreated = false;
        },
        deleteProductRequest(state) {
            state.loading = true;
        },
        deleteProductSuccess(state) {
            state.loading = false;
            state.isProductDeleted = true;
        },
        deleteProductFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearProductDeleted(state) {
            state.isProductDeleted = false;
        },
        updateProductRequest(state) {
            state.loading = true;
        },
        updateProductSuccess(state, action) {
            state.loading = false;
            const payload = action.payload || {};
            state.product = payload.product || payload;
            state.isProductUpdated = true;
        },
        updateProductFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearProductUpdated(state) {
            state.isProductUpdated = false;
        },
        reviewsRequest(state) {
            state.loading = true;
        },
        reviewsSuccess(state, action) {
            state.loading = false;
            const payload = action.payload || [];
            state.reviews = payload;
        },
        reviewsFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        deleteReviewRequest(state) {
            state.loading = true;
        },
        deleteReviewSuccess(state, action) {
            state.loading = false;
            state.isReviewDeleted = true;
        },
        deleteReviewFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearReviewDeleted(state){
            state.isReviewDeleted = false;
        }
    }
});

export const { productRequest,
    productSuccess,
    productFail,
    createReviewRequest,
    createReviewSuccess,
    createReviewFail,
    clearError,
    clearReviewSubmitted,
    clearProduct,
    newProductRequest,
    newProductFail,
    newProductSuccess,
    clearProductCreated,
    deleteProductRequest,
    deleteProductSuccess,
    deleteProductFail,
    clearProductDeleted,
    updateProductRequest,
    updateProductSuccess,
    updateProductFail,
    clearProductUpdated,
    reviewsRequest,
    reviewsSuccess,
    reviewsFail,
    deleteReviewRequest,
    deleteReviewSuccess,
    deleteReviewFail,
    clearReviewDeleted

} = productSlice.actions;
export default productSlice.reducer;
