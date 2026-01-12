import axios from 'axios';

// Dynamic base URL
const getBaseUrl = () => {
    const origin = window.location.origin;
    const protocol = window.location.protocol;

    // Development Environment
    if (import.meta.env.MODE === 'development') {
        return 'http://localhost:8000';
    }

    // Native App (Capacitor/Ionic/File)
    // Identify by protocol (capacitor: or file:) or specific native origins
    if (protocol === 'capacitor:' || protocol === 'file:' || origin.includes('localhost')) {
        // Double check this isn't local dev server on port 5173
        if (!origin.includes(':5173')) {
            return 'https://studentsuccess-nu.vercel.app';
        }
    }

    // Fallback for Standard Web App (Relative path)
    return '';
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
