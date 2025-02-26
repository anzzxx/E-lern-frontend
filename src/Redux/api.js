import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';
const api = axios.create({
    baseURL: BASE_URL,  // Update base URL if needed
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

        // console.log(`Refreshing token with: ${refreshToken}`);
       
        
        const response = await axios.post(`${BASE_URL}api/token/refresh/`, {
            refresh: refreshToken,
        });

        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh); // Save new refresh token if rotation is enabled

        refreshSubscribers.forEach((callback) => callback(response.data.access));
        refreshSubscribers = [];

        return response.data.access;
    } catch (error) {
        console.error('Token refresh failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // window.location.href = "/login";  // Redirect to login page
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
            }
        }

        return Promise.reject(error);
    }
);


export default api;

