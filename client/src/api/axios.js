import axios from "axios";

const API = axios.create({
  baseURL: "https://society-management-system-qcfx.onrender.com/api",
});

// Add token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;