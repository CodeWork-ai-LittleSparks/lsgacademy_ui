import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Backend returns: { success: true, data: {...} }
    // Return the whole response for checking success flag
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          // Make refresh request WITHOUT interceptor to avoid infinite loop
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          // IMPORTANT: Backend response structure is { success: true, data: { access_token: "..." } }
          if (response.data.success) {
            const newToken = response.data.data.access_token;
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
            
            // Update cookies as well for middleware compatibility
            if (typeof window !== 'undefined') {
              const { setCookie } = await import('../utils/cookieUtils');
              setCookie('lsg_access_token', newToken, 30); // 30 minutes
            }
            
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear everything and redirect
        localStorage.clear();
        if (typeof window !== 'undefined') {
          const { deleteAllAuthCookies } = await import('../utils/cookieUtils');
          deleteAllAuthCookies();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Extract error from backend format
    const errorData = error.response?.data;
    return Promise.reject({
      message: errorData?.error?.message || error.message || 'An error occurred',
      code: errorData?.error?.code || 'UNKNOWN_ERROR',
      status: error.response?.status,
      data: errorData?.data, // For cases like PASSWORD_CHANGE_REQUIRED
    });
  }
);

export default apiClient;