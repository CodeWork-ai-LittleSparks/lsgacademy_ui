import apiClient from '@/lib/api/client';

// In-memory cache for teacher lists keyed by query params
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const listCache = new Map(); // key -> { data, timestamp }

function deriveStatus(params = {}) {
  const { status } = params || {};
  if (typeof status === 'string') {
    const s = status.toLowerCase();
    if (s === 'active' || s === 'inactive') return s;
    if (s === 'true') return 'active';
    if (s === 'false') return 'inactive';
    return undefined;
  }
  if (typeof status === 'boolean') {
    return status ? 'active' : 'inactive';
  }
  return undefined; // allow "all"
}

function buildListKey(params = {}) {
  const page = params.page ?? 1;
  const rawLimit = params.limit ?? 10; // default 10 per requirement
  const limit = Math.min(Number(rawLimit) || 10, 50);
  const search = params.search || '';
  const program_id = params.program_id || '';
  const status = deriveStatus(params) ?? 'all';
  const sort_by = params.sort_by || 'name';
  const sort_order = params.sort_order || 'asc';
  return `page=${page}&limit=${limit}&search=${search}&program_id=${program_id}&status=${status}&sort_by=${sort_by}&sort_order=${sort_order}`;
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

export async function getTeachers(params = {}) {
  try {
    const key = buildListKey(params);
    const cached = listCache.get(key);
    const noCache = !!params.noCache;
    if (!noCache && isFresh(cached)) {
      return { success: true, ...cached.data, cached: true };
    }

    const response = await apiClient.get('/teachers', {
      params: {
        page: params.page ?? 1,
        limit: Math.min(Number(params.limit ?? 10) || 10, 50),
        search: params.search || undefined,
        program_id: params.program_id || undefined,
        status: deriveStatus(params),
        sort_by: params.sort_by || 'name',
        sort_order: params.sort_order || 'asc',
      },
    });

    const rawData = response?.data ?? response;
    const teachers = rawData?.teachers
      ?? rawData?.items
      ?? rawData?.list
      ?? rawData?.results
      ?? (Array.isArray(rawData) ? rawData : []);
    const pagination = rawData?.pagination ?? rawData?.meta ?? null;

    if (response?.success || Array.isArray(teachers)) {
      const payload = { data: { teachers: teachers || [], pagination }, message: response?.message };
      cacheList(params, payload);
      return { success: true, ...payload };
    }
    return { success: false, error: response?.error?.message || 'Failed to load teachers' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function getTeacherById(teacherId) {
  try {
    const response = await apiClient.get(`/teachers/${teacherId}`);
    if (response?.success) {
      const teacher = response?.data?.teacher ?? response?.data;
      return { success: true, data: teacher, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to load teacher', status: response?.status };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

function normalizeAndValidateTeacherFields(input = {}, { requireAll = false } = {}) {
  const out = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9]{10,15}$/; // simple E.164-ish

  function put(k, v) {
    if (typeof v !== 'undefined' && v !== null) out[k] = v;
  }

  const name = typeof input.full_name === 'string' ? input.full_name.trim() : input.full_name;
  if (requireAll || typeof name !== 'undefined') {
    if (!name || name.length < 3 || name.length > 255) throw new Error('Full name must be 3-255 characters');
    put('full_name', name);
  }

  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : input.email;
  if (requireAll || typeof email !== 'undefined') {
    if (!email || !emailRegex.test(email)) throw new Error('Valid email is required');
    put('email', email);
  }

  const phone = typeof input.phone === 'string' ? input.phone.trim() : input.phone;
  if (requireAll || typeof phone !== 'undefined') {
    if (!phone || !phoneRegex.test(phone)) throw new Error('Valid phone number is required');
    put('phone', phone);
  }

  // Optional bio field used in update API
  const bio = typeof input.bio === 'string' ? input.bio.trim() : input.bio;
  if (typeof bio !== 'undefined') {
    if (bio && bio.length > 1000) throw new Error('Bio must be up to 1000 characters');
    put('bio', bio);
  }

  const quals = typeof input.qualifications === 'string' ? input.qualifications.trim() : input.qualifications;
  if (typeof quals !== 'undefined' && quals !== '') {
    if (quals.length < 3 || quals.length > 500) throw new Error('Qualifications must be 3-500 characters');
    put('qualifications', quals);
  } else if (requireAll) {
    // optional on create according to spec; skip when requireAll
  }

  if (typeof input.experience_years !== 'undefined' && input.experience_years !== null && input.experience_years !== '') {
    const exp = Number(input.experience_years);
    if (!Number.isInteger(exp) || exp < 0 || exp > 50) throw new Error('Experience years must be an integer between 0 and 50');
    put('experience_years', exp);
  }

  if (typeof input.is_active !== 'undefined') {
    put('is_active', !!input.is_active);
  }

  return out;
}

export async function createTeacher(teacherData) {
  try {
    const payload = normalizeAndValidateTeacherFields(teacherData, { requireAll: true });
    const response = await apiClient.post('/teachers', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (response?.success) {
      invalidateListCache();
      return { success: true, data: response.data, message: response.message || 'Teacher created successfully' };
    }
    return { success: false, error: response?.error?.message || 'Failed to create teacher', code: response?.error?.code };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status, data: error.data };
  }
}

export async function updateTeacher(teacherId, updates = {}) {
  try {
    const payload = normalizeAndValidateTeacherFields(updates, { requireAll: false });
    // Only send if at least one field
    if (Object.keys(payload).length === 0) {
      return { success: true, data: null, message: 'No changes detected' };
    }
    const response = await apiClient.put(`/teachers/${teacherId}`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (response?.success) {
      invalidateListCache();
      return { success: true, data: response.data?.teacher ?? response.data, message: response.message || 'Teacher updated successfully' };
    }
    return { success: false, error: response?.error?.message || 'Failed to update teacher', code: response?.error?.code };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status, data: error.data };
  }
}

export async function deleteTeacher(teacherId) {
  try {
    const response = await apiClient.delete(`/teachers/${teacherId}`);
    if (response?.success) {
      invalidateListCache();
      return { success: true, message: response.message || 'Teacher deactivated successfully', data: response.data };
    }
    return { success: false, error: response?.error?.message || 'Failed to deactivate teacher' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function assignProgram(teacherId, programId) {
  try {
    const response = await apiClient.post(`/teachers/${teacherId}/programs/${programId}/assign`, {}, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (response?.success) {
      return { success: true, data: response.data, message: response.message || 'Program assigned successfully' };
    }
    return { success: false, error: response?.error?.message || 'Failed to assign program' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function checkEmailUnique(email) {
  try {
    const response = await apiClient.get('/teachers', { params: { search: email, limit: 1 } });
    const teachers = response?.data?.teachers || [];
    const exists = Array.isArray(teachers) && teachers.some((t) => String(t?.user?.email).toLowerCase() === String(email).toLowerCase());
    return { success: true, data: { isUnique: !exists } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

const teacherService = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  assignProgram,
  checkEmailUnique,
};

export default teacherService;
