import { deleteAllAuthCookies } from './cookieUtils';

// Utility functions for JWT token management
export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const getTimeUntilExpiry = (token) => {
  if (!token) return 0;
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return 0;
  
  const currentTime = Date.now() / 1000;
  return Math.max(0, decoded.exp - currentTime);
};

export const setupTokenExpiryCheck = (onExpiry) => {
  const token = localStorage.getItem('lsg_access_token');
  if (!token) return;
  
  const timeUntilExpiry = getTimeUntilExpiry(token);
  
  if (timeUntilExpiry <= 0) {
    onExpiry();
    return;
  }
  
  // Set timeout for token expiry (convert seconds to milliseconds)
  const timeoutId = setTimeout(() => {
    onExpiry();
  }, timeUntilExpiry * 1000);
  
  return timeoutId;
};

export const clearAuthData = () => {
  // Clear localStorage
  localStorage.removeItem('lsg_access_token');
  localStorage.removeItem('lsg_refresh_token');
  localStorage.removeItem('lsg_user_data');
  
  // Clear cookies
  deleteAllAuthCookies();
};