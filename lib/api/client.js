import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';
import { getCookie, deleteAllAuthCookies } from '../utils/cookieUtils';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

const readToken = (key) => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key) ?? sessionStorage.getItem(key) ?? null;
};

const writeToken = (key, value) => {
  if (typeof window === 'undefined') return;
  const useSession = !!sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (useSession) {
    sessionStorage.setItem(key, value);
  } else {
    localStorage.setItem(key, value);
  }
};

const clearAllTokens = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = readToken(STORAGE_KEYS.ACCESS_TOKEN) || getCookie('lsg_access_token');
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
    const status = error.response?.status;
    const errorData = error.response?.data;
    const isForbiddenUnauth = status === 403 && (
      errorData?.error?.code === 'FORBIDDEN' ||
      String(errorData?.error?.message || '').toLowerCase().includes('not authenticated')
    );

    if ((status === 401 || isForbiddenUnauth) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = readToken(STORAGE_KEYS.REFRESH_TOKEN);
        
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
            writeToken(STORAGE_KEYS.ACCESS_TOKEN, newToken);
            
            // Update cookies as well for middleware compatibility
            if (typeof window !== 'undefined') {
              const { setCookie } = await import('../utils/cookieUtils');
              setCookie('lsg_access_token', newToken, 30);
            }
            
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        clearAllTokens();
        deleteAllAuthCookies();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject({
      message: errorData?.error?.message || error.message || 'An error occurred',
      code: errorData?.error?.code || 'UNKNOWN_ERROR',
      status: error.response?.status,
      data: errorData?.data, // For cases like PASSWORD_CHANGE_REQUIRED
    });
  }
);

export default apiClient;

// Public API client: no auth headers, no refresh logic.
// Use this for endpoints that are accessible without token (e.g., GET /categories).
export const publicApiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

publicApiClient.interceptors.response.use(
  (response) => {
    // Return the raw backend payload to match apiClient behavior
    return response.data;
  },
  async (error) => {
    // No refresh logic for public client; just normalize error shape
    const errorData = error.response?.data;
    return Promise.reject({
      message: errorData?.error?.message || error.message || 'An error occurred',
      code: errorData?.error?.code || 'UNKNOWN_ERROR',
      status: error.response?.status,
      data: errorData?.data,
    });
  }
);
