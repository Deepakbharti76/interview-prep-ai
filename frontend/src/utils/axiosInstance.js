import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 अगर token expire / invalid हो
    if (error.response?.status === 401) {
      console.log("Unauthorized - Logging out");

      localStorage.removeItem("token");

      // redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;