import apiClient from '@/lib/api/client';
import { API_CONFIG } from '@/lib/constants/config';

// In-memory cache for school lists keyed by query params
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const listCache = new Map(); // key -> { data, timestamp }

function buildListKey(params = {}) {
  const page = params.page ?? 1;
  const rawLimit = params.limit ?? 10;
  const limit = Math.min(Number(rawLimit) || 10, 50);
  const search = params.search || '';
  const location = params.location || '';
  const is_active = params.is_active ?? 'all';
  const sort_by = params.sort_by || '';
  const sort_order = params.sort_order || '';
  return `page=${page}&limit=${limit}&search=${search}&location=${location}&is_active=${is_active}&sort_by=${sort_by}&sort_order=${sort_order}`;
}

function isFresh(entry) {
  return entry && entry.timestamp && (Date.now() - entry.timestamp < CACHE_TTL_MS);
}

function cacheList(params, data) {
  listCache.set(buildListKey(params), { data, timestamp: Date.now() });
}

function invalidateListCache() {
  listCache.clear();
}

export async function getSchools(params = {}) {
  try {
    const key = buildListKey(params);
    const cached = listCache.get(key);
    const noCache = !!params.noCache;
    if (!noCache && isFresh(cached)) {
      return { success: true, ...cached.data, cached: true };
    }

    const response = await apiClient.get('/schools', { params: {
      page: params.page ?? 1,
      limit: Math.min(Number(params.limit ?? 10) || 10, 50),
      search: params.search || undefined,
      location: params.location || undefined,
      is_active: params.is_active && params.is_active !== 'all' ? params.is_active : undefined,
      sort_by: params.sort_by || undefined,
      sort_order: params.sort_order || undefined,
    } });

    if (response?.success) {
      const payload = { data: response.data, message: response.message };
      cacheList(params, payload);
      return { success: true, ...payload };
    }
    return { success: false, error: response?.error?.message || 'Failed to load schools' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function getSchoolById(schoolId) {
  try {
    const response = await apiClient.get(`/schools/${schoolId}`);
    if (response?.success) {
      return { success: true, data: response.data.school, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to load school' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function createSchool(schoolData) {
  try {
    // POST JSON payload per spec; logo upload handled via uploadSchoolLogo
    const response = await apiClient.post('/schools', schoolData);
    if (response?.success) {
      invalidateListCache();
      return { success: true, data: response.data, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to create school', code: response?.error?.code };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status, data: error.data };
  }
}

export async function updateSchool(schoolId, updates) {
  try {
    // PUT JSON payload per spec; logo upload handled via uploadSchoolLogo
    const response = await apiClient.put(`/schools/${schoolId}`, updates);
    if (response?.success) {
      invalidateListCache();
      return { success: true, data: response.data, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to update school', code: response?.error?.code };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status, data: error.data };
  }
}

export async function deleteSchool(schoolId) {
  try {
    const response = await apiClient.delete(`/schools/${schoolId}`);
    if (response?.success) {
      invalidateListCache();
      return { success: true, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to delete school' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function uploadSchoolLogo(schoolId, logoFile) {
  try {
    const formData = new FormData();
    formData.append('logo', logoFile);
    const response = await apiClient.put(`/schools/${schoolId}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (response?.success) {
      return { success: true, data: response.data, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to upload logo' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function getSchoolStatistics(schoolId, dateFrom, dateTo) {
  try {
    const response = await apiClient.get(`/schools/${schoolId}/statistics`, {
      params: {
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      },
    });
    if (response?.success) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response?.error?.message || 'Failed to load statistics' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

const schoolService = {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  uploadSchoolLogo,
  getSchoolStatistics,
};

export default schoolService;
