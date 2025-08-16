import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Intercepts every request and adds the Authorization header if a token exists
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepts responses and handles 401 errors globally
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // For example, remove the token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            // This will force a reload and redirect to the login page
            window.location.href = '/'; 
        }
        return Promise.reject(error);
    }
);

export default instance;