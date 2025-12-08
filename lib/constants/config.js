const baseHost = 'https://api.dev.lsgacademy.in';
export const API_CONFIG = {
  BASE_URL: `${baseHost}/api/v1`,
  TIMEOUT: 20000,
};

export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  CHANGE_PASSWORD: '/change-password',
  
  // Super Admin routes
  SUPER_ADMIN_DASHBOARD: '/dashboard',
  SUPER_ADMIN_SCHOOLS: '/schools',
  SUPER_ADMIN_PROGRAMS: '/programs',
  SUPER_ADMIN_CURRICULUM: '/curriculum',
  SUPER_ADMIN_REPORTS: '/reports',
  SUPER_ADMIN_SETTINGS: '/settings',
  
  // School Admin routes
  SCHOOL_ADMIN_DASHBOARD: '/school-dashboard',
  SCHOOL_ADMIN_TEACHERS: '/teachers',
  SCHOOL_ADMIN_STUDENTS: '/students',
  SCHOOL_ADMIN_EVALUATIONS: '/evaluations',
  SCHOOL_ADMIN_PROGRAMS: '/Programs',
  SCHOOL_ADMIN_REPORTS: '/school-reports',
  SCHOOL_ADMIN_SETTINGS: '/school-settings',
};

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ME: '/auth/me',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'lsg_access_token',
  REFRESH_TOKEN: 'lsg_refresh_token',
  USER_DATA: 'lsg_user_data',
};

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  SCHOOL_ADMIN: 'school_admin',
};

export const ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_INACTIVE: 'ACCOUNT_INACTIVE',
  PASSWORD_CHANGE_REQUIRED: 'PASSWORD_CHANGE_REQUIRED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};
