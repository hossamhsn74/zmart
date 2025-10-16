import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/api/v1", // API Gateway base URL
  headers: { "Content-Type": "application/json" },
});

// Add interceptor to attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Optional: Add a response interceptor for logging or error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
export default api;
