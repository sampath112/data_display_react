// src/services/api.js
import axios from 'axios';

// Create API instance
const API = axios.create({
  baseURL: '/api/auth',
  withCredentials: false,
});

// Optional: Debug interceptors
API.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log('🟢 API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('🔴 API Error:', error.message, error.response?.data);
    return Promise.reject(error);
  }
);

// Export API methods
export const registerUser = (data) => API.post('/register', data);
export const loginUser = (data) => API.post('/login', data);
export const getAllUsers = () => API.get('/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);