import axios from 'axios';
import { loginSuccess, logout } from "../Redux/Slices/authSlice";
import store from "../Redux/Store";

export const BASE_URL = 'https://api.elern.shop/';
export const STATIC_URL = 'https://api.elern.shop';
// http://127.0.0.1:8000
// http://127.0.0.1:8000/
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let refreshSubscribers = [];

// Function to handle failed refresh and cleanup
const handleFailedRefresh = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    store.dispatch(logout());
    // Optional: Redirect to login page if needed
    // window.location.href = '/login';
};

// Function to handle refresh token
const refreshToken = async () => {
    if (isRefreshing) {
        return new Promise((resolve) => {
            refreshSubscribers.push(resolve);
        });
    }

    isRefreshing = true;
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            handleFailedRefresh();
            throw new Error('No refresh token found');
        }

        const response = await axios.post(`${BASE_URL}api/token/refresh/`, {
            refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        const newRefreshToken = response.data.refresh || refreshToken;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Dispatch the new token to Redux store (works with your existing loginSlice)
        const currentState = store.getState().auth;
        store.dispatch(
            loginSuccess({
                user: currentState.user, // Preserve existing user data
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                role: currentState.role, // Preserve existing role
            })
        );

        // Resolve all pending requests with the new token
        refreshSubscribers.forEach((callback) => callback(newAccessToken));
        refreshSubscribers = [];

        return newAccessToken;
    } catch (error) {
        console.error('Token refresh failed:', error);

        if (error.response?.status === 401 || error.response?.status === 400) {
            console.error('Refresh token is invalid or expired');
            handleFailedRefresh();
        }

        throw error;
    } finally {
        isRefreshing = false;
    }
};

// Request interceptor to attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Only attempt refresh on 401 errors and not retried requests
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        return Promise.reject(error);
    }
);

export default api;