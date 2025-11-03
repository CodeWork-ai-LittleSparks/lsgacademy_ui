'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../api/services/authService';
import { ROUTES, USER_ROLES } from '../constants/config';
import { setupTokenExpiryCheck, clearAuthData } from '../utils/tokenUtils';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Set up automatic logout on token expiry
    if (user) {
      setupTokenExpiryCheck(() => {
        handleAutoLogout();
      });
    }
  }, [user]);

  const handleAutoLogout = () => {
    console.log('Auto logout triggered due to token expiry');
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
        } else {
          // Fetch user from API
          const result = await authService.getCurrentUser();
          if (result.success) {
            setUser(result.user);
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

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    
    if (result.success) {
      setUser(result.user);
      
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