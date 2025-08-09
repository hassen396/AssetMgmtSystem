import axios from "axios";

// For Vite projects, use import.meta.env; for Create React App, process.env is available
const API_URL = import.meta.env.VITE_API_URL || "https://localhost:5051/api";

const api = axios.create({
  baseURL: API_URL,
});

// attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
