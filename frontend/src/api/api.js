// =====================================================================
// FRONTEND-ONLY CONVERSION STATUS: NOT CURRENTLY USED
// =====================================================================
// Every service and api file in this project (src/services/*,
// src/api/productApi.js, src/api/categoryApi.js) now reads/writes local
// dummy data instead of calling this client — nothing in the app
// imports this file anymore, and the app makes zero network requests.
//
// It's kept, unmodified, on purpose: this is a fully working axios
// client with request auth headers and a JWT refresh-token retry
// flow already wired up. When a real backend exists, reconnecting it
// is mostly a matter of swapping the local-data calls in each
// service/api file back to `api.get/post/put/delete(...)` — this file
// needs no changes to support that.
// =====================================================================

import axios from "axios";

const API_BASE_URL = "https://ecobazar-api.onrender.com/api";
// const API_BASE_URL = "http://localhost:5000/api";
// https://ecobazar-api.onrender.com

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const publicRoutes = ["/auth/login", "/auth/refresh"];

    const isPublicRoute = publicRoutes.some((route) => originalRequest.url?.includes(route));

    if (error.response?.status === 401 && !originalRequest._retry && !isPublicRoute) {

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        const currentPath = window.location.pathname;

        const protectedRoutes = ["/dashboard", "/settings", "/order-details/:id", "/checkout", "/order-history", "/payment/success", "/payment/failed", "/payment/cancelled", "/admin-dashboard"];
        const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));

        if (currentPath.startsWith("/admin")) {
          window.location.href = "/admin";
        } else if (isProtectedRoute) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;