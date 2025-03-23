import axios from 'axios';
import { loginSuccess } from "../Redux/Slices/authSlice";
import  store  from "../Redux/Store";  // Import Redux store to access dispatch globally

const BASE_URL = 'http://127.0.0.1:8000/';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let refreshSubscribers = [];

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
        if (!refreshToken) throw new Error('No refresh token found');

        const response = await axios.post(`${BASE_URL}api/token/refresh/`, {
            refresh: refreshToken,
        });

        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh); // Save new refresh token if rotation is enabled
       

       
        // Dispatch the new token to Redux store
        store.dispatch(
            loginSuccess({
                user:response.data.user, 
                accessToken: response.data.access,
                refreshToken: response.data.refresh,
            })
        );

        refreshSubscribers.forEach((callback) => callback(response.data.access));
        refreshSubscribers = [];

        return response.data.access;
    } catch (error) {
        console.error('Token refresh failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = "/login";  // Redirect to login page
    } finally {
        isRefreshing = false;
    }
};

// ✅ Attach Access Token Automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// ✅ Auto-Refresh Token on Expired Access Token
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshToken();
                if (newToken) {
                    localStorage.setItem('accessToken', newToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh attempt failed:', refreshError);
                window.location.href = "/login";  // Redirect to login page
            }
        }

        return Promise.reject(error);
    }
);

export default api;
