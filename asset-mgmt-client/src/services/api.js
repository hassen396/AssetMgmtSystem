import axios from 'axios';
import { config } from '../config';

const baseURL = config.api.baseURL;

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
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
        const response = await axios.post(`${baseURL}/auth/refresh-token`);
        
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
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
  create: (data) => api.post('/assets/create', data),
  update: (id, data) => api.put(`/assets/${id}`, data),
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
  refresh: (refreshToken) => api.post('/auth/refresh-token'),
};
