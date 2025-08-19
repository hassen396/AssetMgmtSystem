import axios from 'axios';
import { config } from '../config';

const baseURL = config.api.baseURL;

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies to be included in all requests
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // The refresh token is sent automatically as an HTTP-only cookie
        const response = await axios.post(`${baseURL}/auth/refresh-token`, {}, {
          withCredentials: true // Important for cookies to be included
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        // If refresh token is invalid or expired, clear local storage and redirect to login
        console.error('Token refresh failed:', error);
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Asset API calls
export const assetAPI = {
  getAll: () => api.get('/assets'),
  getAvailable: () => api.get('/assets/available'),
  getById: (id) => api.get(`/assets/${id}`),
   create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/assets/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
    update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.put(`/assets/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/assets/${id}`),
};

// Asset Request API calls
export const requestAPI = {
  getAll: () => api.get('/requests'),
  getMyRequests: () => api.get('/requests/my-requests'),
  getById: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  approve: (id) => api.post(`/requests/${id}/approve`),
  reject: (id) => api.post(`/requests/${id}/reject`),
};

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  me: () => api.get('/auth/profile'),
  refresh: () => api.post('/auth/refresh-token', {}), // No need to pass refresh token as it's in the cookie
  logout: () => api.post('/auth/logout', {}), // Add logout endpoint to clear the refresh token cookie
};
