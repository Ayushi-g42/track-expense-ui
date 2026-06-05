import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    // '':process.env.JWT_SECRET_KEY

  },
  withCredentials: true, // Needed if backend uses cookies
});

// Optional: Add request interceptor if we store token in localStorage
api.interceptors.request.use(
  (config) => {
    // We could attach token from localStorage if we are not relying exclusively on httpOnly cookies
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
