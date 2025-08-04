// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api/auth', // proxied to http://localhost:5000/api/auth
  withCredentials: false,
});
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const registerUser = (data) => API.post('/register', data);
export const loginUser = (data) => API.post('/login', data);
export const getAllUsers = () => API.get('/users');