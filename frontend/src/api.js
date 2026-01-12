import axios from 'axios';

// Dynamic base URL to support www, non-www, and localhost
const getBaseUrl = () => {
    // If running in Capacitor (Native), use absolute URL
    // We detect this by checking if window.Capacitor is defined or if protocol is not http(s)
    const isNative = window.Capacitor?.isNativePlatform();

    // Check if we are in development (localhost)
    if (import.meta.env.MODE === 'development') {
        return 'http://localhost:8000';
    }

    // PRODUCTION LOGIC
    if (isNative) {
        // Native App must point to remote server
        return 'https://aumtech.ai';
    } else {
        // Web App (Vercel) uses relative path
        return '';
    }
};

const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle 401 and 402
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 402) {
                // Subscription required - Dispatch event to be caught by UI
                window.dispatchEvent(new CustomEvent('subscription-required'));
            } else if (error.response.status === 401) {
                // Unauthorized - potential expired token
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
