import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orderDetail: {},
        userOrders: [],
        adminOrders: [],
        loading: false,
        isOrderDeleted: false,
        isOrderUpdated: false,
    },
    reducers: {
        createOrderRequest(state) {
            state.loading = false;
        },
        createOrderSuccess(state, action) {
            state.loading = false;
            state.orderDetail = action.payload.order;
        },
        createOrderFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        userOrdersRequest(state) {
            state.loading = true;
        },
        userOrdersSuccess(state, action) {
            state.loading = false;
            state.userOrders = action.payload.orders;
        },
        userOrdersFail(state, action) {
            state.loading = false,
            state.error = action.payload;
        },
        orderDetailRequest(state) {
            state.loading = true;
        },
        orderDetailSuccess(state, action) {
            state.loading = false;
            state.orderDetail = action.payload.order
        },
        orderDetailFail(state, action) {
            state.loading = false,
            state.error = action.payload;
        },
        // ADMIN ORDERS
        adminOrdersRequest(state) {
            state.loading = true;
        },
        adminOrdersSuccess(state, action) {
            state.loading = false;
            state.adminOrders = action.payload.orders;
        },
        adminOrdersFail(state, action) {
            state.loading = false,
            state.error = action.payload;
        },
        deleteOrderRequest(state) {
            state.loading = true;
        },
        deleteOrderSuccess(state) {
            state.loading = false;
            state.isOrderDeleted = true;
        },
        deleteOrderFail(state, action) {
            state.loading = false,
            state.error = action.payload;
        },
        clearOrderDeleted(state) {
            state.isOrderDeleted = false;
        },
        updateOrderRequest(state) {
            state.loading = true;
        },
        updateOrderSuccess(state) {
            state.loading = false;
            state.isOrderUpdated = true;
        },
        updateOrderFail(state, action) {
            state.loading = false,
            state.error = action.payload;
        },
        clearOrderUpdated(state) {
            state.isOrderUpdated = false;
        },
    },
}
);

export const {
    createOrderRequest,
    createOrderSuccess,
    createOrderFail,
    clearError,
    userOrdersRequest,
    userOrdersSuccess,
    userOrdersFail,
    orderDetailRequest,
    orderDetailSuccess,
    orderDetailFail,
    adminOrdersRequest,
    adminOrdersSuccess,
    adminOrdersFail,
    deleteOrderRequest,
    deleteOrderSuccess,
    deleteOrderFail,
    clearOrderDeleted,
    updateOrderRequest,
    updateOrderSuccess,
    updateOrderFail,
    clearOrderUpdated,
} = orderSlice.actions;

export default orderSlice.reducer;
