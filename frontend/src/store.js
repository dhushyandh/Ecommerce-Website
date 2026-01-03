import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import productReducer from './slices/productSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';



const store = configureStore({
    reducer: {
        productsState: productsReducer,
        productState: productReducer,
        authState: authReducer,
        cartState: cartReducer,
        orderState: orderReducer,
        userState: userReducer,
    }
})

export default store;