'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../api/services/authService';
import { ROUTES, USER_ROLES } from '../constants/config';
import { setupTokenExpiryCheck, clearAuthData } from '../utils/tokenUtils';
import { useWebSocketStatus } from '@/app/providers/WebSocketProvider';
import { toast } from 'sonner';
import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';
import { setCookie } from '../utils/cookieUtils';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { reconnect, disconnect } = useWebSocketStatus() || {};

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      setupTokenExpiryCheck(() => {
        handleTokenExpiry();
      });
    }
  }, [user]);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = (typeof window !== 'undefined')
        ? (localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ?? sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN))
        : null;
      if (!refreshToken) return { success: false };
      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, { refresh_token: refreshToken }, { headers: { 'Content-Type': 'application/json' } });
      if (response?.data?.success && response.data?.data?.access_token) {
        const newToken = response.data.data.access_token;
        const useSession = !!sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (useSession) {
          sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
        } else {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
        }
        setCookie('lsg_access_token', newToken, useSession ? 1 : 30);
        return { success: true, access_token: newToken };
      }
      return { success: false };
    } catch (e) {
      return { success: false, error: e?.message };
    }
  };

  const handleTokenExpiry = async () => {
    const res = await refreshAccessToken();
    if (res.success) {
      try { reconnect?.(); } catch {}
      try {
        setupTokenExpiryCheck(() => {
          handleTokenExpiry();
        });
      } catch {}
      return;
    }
    clearAuthData();
    setUser(null);
    router.push(ROUTES.LOGIN);
  };

  const checkAuth = async () => {
    try {
      const isAuth = authService.isAuthenticated();
      
      if (isAuth) {
        const storedUser = authService.getStoredUser();
        
        if (storedUser) {
          setUser(storedUser);
          try { reconnect?.(); } catch {}
        } else {
          // Fetch user from API
          const result = await authService.getCurrentUser();
          if (result.success) {
            setUser(result.user);
            try { reconnect?.(); } catch {}
          } else {
            await authService.logout();
            router.push(ROUTES.LOGIN);
          }
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, rememberMe = true) => {
    const result = await authService.login(email, password, rememberMe);
    
    if (result.success) {
      setUser(result.user);
      try { reconnect?.(); } catch {}

      try {
        if (result.user?.is_password_temporary || result.requirePasswordChange) {
          toast.warning('You are using a temporary password. We recommend changing it.');
        }
      } catch {}
      
      // Redirect based on role
      if (result.user.role === USER_ROLES.SUPER_ADMIN) {
        router.push(ROUTES.SUPER_ADMIN_DASHBOARD);
      } else if (result.user.role === USER_ROLES.SCHOOL_ADMIN) {
        router.push(ROUTES.SCHOOL_ADMIN_DASHBOARD);
      }
    }
    
    return result;
  };

  const logout = async () => {
    try {
      try { disconnect?.(); } catch {}
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push(ROUTES.LOGIN);
      router.refresh(); // Force refresh to clear any cached data
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('lsg_user_data', JSON.stringify(userData));
  };

  const refreshUser = async () => {
    try {
      const result = await authService.getCurrentUser();
      if (result.success) {
        setUser(result.user);
        return result.user;
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
    return null;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isSuperAdmin = () => {
    return hasRole(USER_ROLES.SUPER_ADMIN);
  };

  const isSchoolAdmin = () => {
    return hasRole(USER_ROLES.SCHOOL_ADMIN);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        refreshUser,
        hasRole,
        isSuperAdmin,
        isSchoolAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}