import axios from 'axios';
import { adminProductsFail, adminProductsRequest, adminProductsSuccess, productsFail, productsRequest, productsSuccess } from '../slices/productsSlice';
import { createReviewFail, createReviewRequest, createReviewSuccess, deleteProductFail, deleteProductRequest, deleteProductSuccess, deleteReviewFail, deleteReviewRequest, deleteReviewSuccess, newProductFail, newProductRequest, newProductSuccess, productFail, productRequest, productSuccess, reviewsFail, reviewsRequest, reviewsSuccess, updateProductFail, updateProductRequest, updateProductSuccess } from '../slices/productSlice';


export const getProducts = (keyword = "", price = [1, 1000], category, rating, page = 1) => async (dispatch) => {

    try {
        dispatch(productsRequest())
        let link = `/api/v1/products?page=${page}`;

        if (price) {
            link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`
        }
        if (keyword) {
            link += `&keyword=${keyword}`
        }
        if (category) {
            link += `&category=${category}`
        }
        if (rating) {
            link += `&ratings=${rating}`
        }
        const { data } = await axios.get(link);

        dispatch(productsSuccess(data));
    } catch (error) {

        dispatch(productsFail(error.response?.data?.message || error.message));

    }

}
export const getProduct = id => async (dispatch) => {

    try {
        dispatch(productRequest())
        const { data } = await axios.get(`/api/v1/product/${id}`);

        dispatch(productSuccess(data));

    } catch (error) {

        dispatch(productFail(error.response?.data?.message || error.message));

    }
}
export const createReview = (formData) => async (dispatch) => {
    try {
        dispatch(createReviewRequest());

        const isFormData = formData instanceof FormData;
        const config = {
            withCredentials: true,
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
        };

        const payload = isFormData ? formData : JSON.stringify(formData);

        const { data } = await axios.put('/api/v1/review', payload, config);

        dispatch(createReviewSuccess(data));
    } catch (error) {
        dispatch(createReviewFail(
            error.response?.data?.message || error.message
        ));
    }
};

export const getAdminProducts = () => async (dispatch) => {
    try {
        dispatch(adminProductsRequest(''))
        const { data } = await axios.get(`/api/v1/admin/products`);

        dispatch(adminProductsSuccess(data));
    } catch (error) {

        dispatch(adminProductsFail(error.response?.data?.message || error.message));

    }
}
export const createNewProduct = (productData) => async (dispatch) => {
    try {
        dispatch(newProductRequest());

        const { data } = await axios.post(
            "/api/v1/admin/product/new",
            productData,
            {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            }
        );

        dispatch(newProductSuccess(data));
    } catch (error) {
        dispatch(
            newProductFail(error.response?.data?.message || error.message)
        );
    }
};


export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch(deleteProductRequest())
        await axios.delete(`/api/v1/admin/products/${id}`);

        dispatch(deleteProductSuccess());
    } catch (error) {
        dispatch(deleteProductFail(error.message));

    }
}
export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch(updateProductRequest())
        const { data } = await axios.put(`/api/v1/admin/products/${id}`, productData);

        dispatch(updateProductSuccess(data));
    } catch (error) {
        dispatch(updateProductFail(error.response?.data?.message || error.message));

    }
}
export const getReviews = (id) => async (dispatch) => {

    try {
        dispatch(reviewsRequest())
        const { data } = await axios.get(`/api/v1/admin/reviews`, { params: { id }, withCredentials: true });

        dispatch(reviewsSuccess(data.reviews));

    } catch (error) {

        dispatch(reviewsFail(error.response?.data?.message || error.message));

    }
}
export const deleteReview = (productId, id) => async (dispatch) => {

    try {
        dispatch(deleteReviewRequest())
        await axios.delete(`/api/v1/admin/review`, { params: { productId, id }, withCredentials: true });

        dispatch(deleteReviewSuccess());

    } catch (error) {

        dispatch(deleteReviewFail(error.response?.data?.message || error.message));

    }
}