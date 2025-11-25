import apiClient from '../client';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../constants/config';
import { setCookie, getCookie, deleteAllAuthCookies } from '../../utils/cookieUtils';

export const authService = {
  async login(email, password, rememberMe = true) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      // Check success flag
      if (response.success && response.data) {
        const { access_token, refresh_token, user } = response.data;
        
        // Store tokens and user data based on rememberMe
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
        storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
        storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

        // Also store tokens in cookies for middleware access
        const days = rememberMe ? 30 : 1;
        setCookie('lsg_access_token', access_token, days);
        setCookie('lsg_refresh_token', refresh_token, days);
        setCookie('lsg_user_data', JSON.stringify(user), days);

        return { 
          success: true, 
          user,
          message: response.message,
          requirePasswordChange: user.is_password_temporary
        };
      }
      
      return { success: false, error: 'Invalid response format' };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code,
        requirePasswordChange: error.code === 'PASSWORD_CHANGE_REQUIRED',
        data: error.data, // For cases like PASSWORD_CHANGE_REQUIRED
      };
    }
  },

  async logout() {
    try {
      // Call logout API
      await apiClient.post(API_ENDPOINTS.LOGOUT);
      console.log('Logout API called successfully');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API fails
    } finally {
      // Always clear local storage
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      // Clear cookies
      deleteAllAuthCookies();
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ME);
      
      if (response.success && response.data) {
        const user = response.data.user;
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        return { success: true, user };
      }
      
      return { success: false, error: 'Invalid response' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (response.success) {
        return { success: true, message: response.message };
      }
      
      return { success: false, error: 'Failed to change password' };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }
  },

  async forgotPassword(email) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, {
        email,
      });

      if (response.success) {
        return { success: true, message: response.message };
      }
      
      return { success: false, error: 'Failed to send reset email' };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  async resetPassword(token, newPassword, confirmPassword) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, {
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (response.success) {
        return { success: true, message: response.message };
      }
      
      return { success: false, error: 'Failed to reset password' };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }
  },

  getStoredUser() {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA) ?? sessionStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    
    return !!(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));
  },

  getAccessToken() {
    if (typeof window === 'undefined') return null;
    
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ?? sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  clearStorage() {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },
};