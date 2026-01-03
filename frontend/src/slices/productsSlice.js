import { createSlice } from "@reduxjs/toolkit";



const productsSlice = createSlice({
    name: "products",
    initialState: {
        loading: false,
        products: [],
        productsCount: 0,
        resPerPage: 0
    },
    reducers: {
        productsRequest(state, action) {
            return {
                loading: true
            }
        },
        productsSuccess(state, action) {
            return {
                loading: false,
                products: action.payload.products,
                productsCount: action.payload.count,
                resPerPage: action.payload.resPerPage
            }
        },
        productsFail(state, action) {
            return {
                loading: false,
                error: action.payload
            }
        },
        adminProductsRequest(state, action) {
            return {
                loading: true
            }
        },
        adminProductsSuccess(state, action) {
            return {
                loading: false,
                products: action.payload.products,
            }
        },
        adminProductsFail(state, action) {
            return {
                loading: false,
                error: action.payload
            }
        },
        clearError(state) {
            return {
                ...state,
                error: null
            }
        },
    }
});


const { actions, reducer } = productsSlice;

export const { productsRequest, productsSuccess, productsFail, adminProductsRequest, adminProductsSuccess, adminProductsFail, clearError } = actions;

export default reducer;