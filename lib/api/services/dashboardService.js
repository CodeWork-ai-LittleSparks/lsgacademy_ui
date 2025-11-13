import apiClient from '@/lib/api/client';
import { API_CONFIG } from '@/lib/constants/config';

// Simple in-memory cache scoped to this module
let cache = {
  data: null,
  metadata: null,
  timestamp: 0,
  dateRange: null,
};

const FIVE_MINUTES = 5 * 60 * 1000;

function isCacheValid(dateRange) {
  if (!cache.data || !cache.timestamp || !cache.dateRange) return false;
  const sameRange = cache.dateRange?.from === dateRange?.from && cache.dateRange?.to === dateRange?.to;
  const fresh = Date.now() - cache.timestamp < FIVE_MINUTES;
  return sameRange && fresh;
}

function buildParams(dateFrom, dateTo) {
  const params = {};
  if (dateFrom) params.date_from = dateFrom;
  if (dateTo) params.date_to = dateTo;
  return params;
}

async function getDashboardData(dateFrom, dateTo, { force = false } = {}) {
  const dateRange = { from: dateFrom || null, to: dateTo || null };

  if (!force && isCacheValid(dateRange)) {
    return { data: cache.data, metadata: cache.metadata, durationMs: null };
  }

  try {
    const start = Date.now();
    const result = await apiClient.get('/dashboard', { params: buildParams(dateFrom, dateTo) });
    const durationMs = Date.now() - start;

    if (!result?.success) {
      const message = result?.error?.message || 'Failed to load dashboard';
      const code = result?.error?.code || 'UNKNOWN_ERROR';
      const err = new Error(message);
      err.code = code;
      throw err;
    }

    cache = { data: result.data, metadata: result.metadata, timestamp: Date.now(), dateRange };
    return { data: result.data, metadata: result.metadata, durationMs };
  } catch (error) {
    // apiClient already normalizes many errors, but ensure a consistent throw
    if (error?.status === 401) {
      // Let global handler redirect; propagate error for UI feedback
      throw Object.assign(new Error('Unauthorized'), { code: 'UNAUTHORIZED', status: 401 });
    }
    if (error?.status === 403) {
      throw Object.assign(new Error('Access denied'), { code: 'FORBIDDEN', status: 403 });
    }
    if (error?.status >= 500) {
      throw Object.assign(new Error('Server error'), { code: 'SERVER_ERROR', status: error.status });
    }
    const msg = error?.message || 'Network error';
    throw Object.assign(new Error(msg), { code: error?.code || 'NETWORK_ERROR', status: error?.status });
  }
}

async function refreshDashboard() {
  const { from, to } = cache.dateRange || {};
  return getDashboardData(from, to, { force: true });
}

// School Admin specific alias for clarity and role-based usage in pages
export async function getSchoolAdminDashboard(dateFrom, dateTo) {
  const res = await getDashboardData(dateFrom, dateTo);
  return res; // { data, metadata, durationMs }
}

export async function refreshSchoolAdminDashboard() {
  return refreshDashboard();
}

const dashboardService = {
  getDashboardData,
  refreshDashboard,
  getSchoolAdminDashboard,
  refreshSchoolAdminDashboard,
};

export default dashboardService;
