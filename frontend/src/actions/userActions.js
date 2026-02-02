import {
    clearError,
    forgetPasswordFail,
    forgetPasswordRequest,
    forgetPasswordSuccess,
    loadUserFail,
    loadUserRequest,
    loadUserSuccess,
    loginFail,
    loginRequest,
    loginSuccess,
    logOutSuccess,
    registerFail,
    registerRequest,
    registerSuccess,
    resetPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    updatePasswordFail,
    updatePasswordRequest,
    updatePasswordSuccess,
    updateProfileFail,
    updateProfileRequest,
    updateProfileSuccess
} from '../slices/authSlice'
import axios from 'axios';
import {
    deleteUserFail,
    deleteUserRequest,
    deleteUserSuccess,
    updateUserFail,
    updateUserRequest,
    updateUserSuccess,
    userFail,
    userRequest,
    usersFail,
    usersRequest,
    usersSuccess,
    userSuccess,
} from '../slices/userSlice';


export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(loginRequest())
        const { data } = await axios.post(`/api/v1/login`, { email, password }, { withCredentials: true })
        dispatch(loginSuccess(data.user));
    }
    catch (error) {
        dispatch(
            loginFail(
                error.response?.data?.message || error.message
            )
        )

    }
}

export const clearAuthError = () => (dispatch) => {
    dispatch(clearError());
};

export const register = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest())
        const config = { withCredentials: true };
        if (!(userData instanceof FormData)) {
            config.headers = { 'Content-type': 'application/json' };
        }

        const { data } = await axios.post(`/api/v1/register`, userData, config);
        dispatch(registerSuccess(data.user));
    }
    catch (error) {
        dispatch(
            registerFail(
                error.response?.data?.message || error.message
            )
        )

    }
}
export const loadUser = () => async (dispatch) => {
    try {
        dispatch(loadUserRequest())

        const { data } = await axios.get(`/api/v1/myprofile`, {
            withCredentials: true
        });
        dispatch(loadUserSuccess(data.user));
    }
    catch (error) {
        dispatch(
            loadUserFail(
                error.response?.data?.message || error.message
            )
        );
    }
}
export const logout = () => async (dispatch) => {
    try {
        await axios.get(`/api/v1/logout`, { withCredentials: true });
        dispatch(logOutSuccess());
    }
    catch (error) {
        dispatch(logOutFail(error.response?.data?.message || error.message));
    }
}
export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch(updateProfileRequest())
        const config = { withCredentials: true };
        if (!(userData instanceof FormData)) {
            config.headers = { 'Content-type': 'application/json' };
        }
        else {
            config.headers = { 'Content-type': "multipart/form-data" };
        }

        const { data } = await axios.put(`/api/v1/update`, userData, config);
        dispatch(updateProfileSuccess(data));
    }
    catch (error) {
        dispatch(
            updateProfileFail(
                error.response?.data?.message || error.message
            )
        )

    }
}
export const updatePassword = (data) => async (dispatch) => {
    try {
        dispatch(updatePasswordRequest());

        await axios.put(
            `/api/v1/password/change`,
            data,
            {
                headers: { 'Content-type': 'application/json' },
                withCredentials: true
            }
        );

        dispatch(updatePasswordSuccess());

    } catch (error) {
        dispatch(
            updatePasswordFail(
                error.response?.data?.message || error.message
            )
        );
    }
};
export const forgetPassword = (formData) => async (dispatch) => {
    try {
        dispatch(forgetPasswordRequest())

        const { data } = await axios.post(
            `/api/v1/password/forget`,
            formData,
            {
                headers: { 'Content-type': 'application/json' },
                withCredentials: true
            }
        );

        dispatch(forgetPasswordSuccess(data));
    }
    catch (error) {
        dispatch(
            forgetPasswordFail(
                error.response?.data?.message || error.message
            )
        )

    }
}
export const resetPassword = (token, formData) => async (dispatch) => {
    try {
        dispatch(resetPasswordRequest())

        const { data } = await axios.post(`/api/v1/password/reset/${token}`,
            formData,
            {
                headers: { 'Content-type': 'application/json' },
                withCredentials: true
            });
        dispatch(resetPasswordSuccess(data));
    }
    catch (error) {
        dispatch(
            resetPasswordFail(
                error.response?.data?.message || error.message
            )
        )

    }
}
export const getUsers = () => async (dispatch) => {
    try {
        dispatch(usersRequest())

        const { data } = await axios.get(`/api/v1/admin/users`, {
            withCredentials: true
        });
        dispatch(usersSuccess({ users: data.users }));
    }
    catch (error) {
        dispatch(
            usersFail(
                error.response?.data?.message || error.message
            )
        );
    }
}
export const getUser = (id) => async (dispatch) => {
    try {
        dispatch(userRequest())

        const { data } = await axios.get(`/api/v1/admin/user/${id}`, {
            withCredentials: true
        });
        // userSuccess expects payload shaped as { user: ... }
        dispatch(userSuccess({ user: data.user }));
    }
    catch (error) {
        dispatch(
            userFail(
                error.response?.data?.message || error.message
            )
        );
    }
}
export const deleteUser = (id) => async (dispatch) => {
    try {
        dispatch(deleteUserRequest())
        await axios.delete(`/api/v1/admin/user/${id}`, {
            withCredentials: true
        });
        dispatch(deleteUserSuccess());
    }
    catch (error) {
        dispatch(
            deleteUserFail(
                error.response?.data?.message || error.message
            )
        );
    }
}
export const updateUser = (id,formData) => async (dispatch) => {
    try {
        dispatch(updateUserRequest());

        const isFormData = formData instanceof FormData;
        const config = {
            withCredentials: true,
            headers: isFormData ? { 'Content-type': 'multipart/form-data' } : { 'Content-type': 'application/json' }
        };

        await axios.put(
            `/api/v1/admin/user/${id}`,
            formData,
            config
        );

        dispatch(updateUserSuccess());

    } catch (error) {
        dispatch(
            updateUserFail(
                error.response?.data?.message || error.message
            )
        );
    }
};