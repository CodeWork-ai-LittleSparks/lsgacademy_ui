import apiClient from '@/lib/api/client';
import { getStudents as getStudentsList } from '@/lib/api/services/studentService';
import { getProgramLevels as getLevelsViaCurriculum } from '@/lib/api/services/curriculumService';

// In-memory cache for program lists keyed by query params
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const listCache = new Map(); // key -> { data, timestamp }
const categoriesCache = { data: null, timestamp: 0 };

// Derive API-compatible status value from various inputs
function deriveStatus(params = {}) {
  const { status, is_active } = params || {};
  if (typeof status !== 'undefined' && status !== null) {
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
  }
  if (typeof is_active !== 'undefined' && is_active !== null) {
    if (typeof is_active === 'string') {
      const s = is_active.toLowerCase();
      if (s === 'active') return 'active';
      if (s === 'inactive') return 'inactive';
      if (s === 'true') return 'active';
      if (s === 'false') return 'inactive';
      return undefined;
    }
    if (typeof is_active === 'boolean') {
      return is_active ? 'active' : 'inactive';
    }
  }
  return undefined;
}

function buildListKey(params = {}) {
  const page = params.page ?? 1;
  const rawLimit = params.limit ?? 10;
  const allowedMax = 100;
  const limit = Math.min(Number(rawLimit) || 10, allowedMax);
  const search = params.search || '';
  const category_id = params.category_id || '';
  const status = deriveStatus(params) ?? 'all';
  return `page=${page}&limit=${limit}&search=${search}&category_id=${category_id}&status=${status}`;
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

export async function getPrograms(params = {}) {
  try {
    const key = buildListKey(params);
    const cached = listCache.get(key);
    const noCache = !!params.noCache;
    if (!noCache && isFresh(cached)) {
      return { success: true, ...cached.data, cached: true };
    }

    const response = await apiClient.get('/programs', {
      params: {
        page: params.page ?? 1,
        limit: Math.min(Number(params.limit ?? 10) || 10, 100),
        search: params.search || undefined,
        category_id: params.category_id || undefined,
        status: deriveStatus(params),
      },
    });

    // Some backends omit a boolean `success` flag for list endpoints.
    // Normalize the payload so callers consistently receive { data: { programs, pagination } }.
    const hasSuccessFlag = typeof response?.success !== 'undefined' ? !!response.success : null;
    const rawData = response?.data ?? response;
    const programsList = rawData?.programs
      ?? rawData?.items
      ?? rawData?.list
      ?? rawData?.results
      ?? (Array.isArray(rawData) ? rawData : null);
    const pagination = rawData?.pagination ?? rawData?.meta ?? null;

    if (hasSuccessFlag === true || Array.isArray(programsList)) {
      const normalized = { programs: programsList ?? (rawData?.programs || rawData?.items || rawData?.list || rawData?.results || []), pagination };
      const payload = { data: normalized, message: response?.message };
      cacheList(params, payload);
      return { success: true, ...payload };
    }
    return { success: false, error: response?.error?.message || 'Failed to load programs' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

// School Admin: alias for clarity when fetching school-filtered programs
export async function getSchoolPrograms(params = {}) {
  return getPrograms(params);
}

// Browse: fetch all active programs (assigned + unassigned)
// Backend may return all active programs for School Admin browse context.
export async function getAllPrograms(params = {}) {
  const merged = { ...params };
  // Default to active programs in browse context unless explicitly provided
  if (typeof deriveStatus(params) === 'undefined') merged.status = 'active';
  return getPrograms(merged);
}

export async function getProgramById(programId) {
  try {
    const response = await apiClient.get(`/programs/${programId}`);
    if (response?.success) {
      const program = response?.data?.program ?? response?.data;
      return { success: true, data: program, message: response.message };
    }
    // 404 shape handled by interceptor
    return { success: false, error: response?.error?.message || 'Failed to load program', status: response?.status };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

// Assign a program to the current school (idempotent)
export async function assignProgramToSchool(programId) {
  try {
    const response = await apiClient.post(`/programs/${programId}/assign`, {}, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (response?.success) {
      // Refresh lists so assignment state reflects immediately
      invalidateListCache();
      return { success: true, data: response.data, message: response.message || 'Program assigned to your school successfully' };
    }
    return { success: false, error: response?.error?.message || 'Failed to assign program', code: response?.error?.code };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status, data: error.data };
  }
}

// Levels for a program (wrapper kept here for convenience)
export async function getProgramLevels(programId) {
  try {
    // Prefer curriculum service implementation to keep normalization consistent
    const res = await getLevelsViaCurriculum(programId);
    return res;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Enroll students into a program
export async function enrollStudents(programId, enrollmentData) {
  try {
    const { student_ids, teacher_id, enrollment_date } = enrollmentData || {};

    if (!Array.isArray(student_ids) || student_ids.length === 0) {
      return { success: false, error: 'At least one student must be selected' };
    }
    if (!teacher_id) {
      return { success: false, error: 'Teacher is required' };
    }
    if (!enrollment_date) {
      return { success: false, error: 'Enrollment date is required' };
    }

    const payload = {
      student_ids,
      teacher_id,
      enrollment_date,
    };

    const response = await apiClient.post(`/programs/${programId}/enroll`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response?.success) {
      return { success: true, data: response.data, message: response.message || 'Students enrolled successfully' };
    }
    return { success: false, error: response?.error?.message || 'Enrollment failed', code: response?.error?.code };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status, data: error.data };
  }
}

// Helper: get students not enrolled in a specific program
export async function getEligibleStudents(programId, { page = 1, limit = 50, search, grade } = {}) {
  try {
    // Fetch active students (paged)
    const allRes = await getStudentsList({ page, limit, search, grade, is_active: true });
    if (!allRes?.success) return { success: false, error: allRes?.error || 'Failed to load students' };
    const all = allRes?.data?.students || [];

    // Fetch currently enrolled in this program (to mark and filter)
    const enrolledRes = await getStudentsList({ page: 1, limit: 200, program_id: programId, is_active: true });
    const enrolled = enrolledRes?.success ? (enrolledRes?.data?.students || []) : [];
    const enrolledSet = new Set(enrolled.map((s) => s?.id));

    const eligible = all.filter((s) => !enrolledSet.has(s?.id));

    return {
      success: true,
      data: {
        eligible_students: eligible,
        total_candidates: all.length,
        enrolled_in_program_ids: Array.from(enrolledSet),
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createProgram(formData, thumbnailFile) {
  try {
    const fd = new FormData();
    // Append text fields
    fd.append('name', formData.name);
    fd.append('category_id', formData.category_id);
    fd.append('description', formData.description);
    fd.append('total_levels', String(formData.total_levels));
    fd.append('age_from', String(formData.age_from));
    fd.append('age_to', String(formData.age_to));
    if (typeof formData.is_active !== 'undefined') {
      fd.append('is_active', String(!!formData.is_active));
    }
    // Append thumbnail (required on create)
    if (thumbnailFile) {
      fd.append('thumbnail', thumbnailFile);
    }

    const response = await apiClient.post('/programs', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response?.success) {
      invalidateListCache();
      return { success: true, data: response.data, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to create program', code: response?.error?.code };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status, data: error.data };
  }
}

export async function updateProgram(programId, updates = {}, thumbnailFile) {
  try {
    const fd = new FormData();
    // Append only provided fields
    if (typeof updates.name !== 'undefined') fd.append('name', updates.name);
    if (typeof updates.category_id !== 'undefined') fd.append('category_id', updates.category_id);
    if (typeof updates.description !== 'undefined') fd.append('description', updates.description);
    if (typeof updates.total_levels !== 'undefined') fd.append('total_levels', String(updates.total_levels));
    if (typeof updates.age_from !== 'undefined') fd.append('age_from', String(updates.age_from));
    if (typeof updates.age_to !== 'undefined') fd.append('age_to', String(updates.age_to));
    if (typeof updates.is_active !== 'undefined') fd.append('is_active', String(!!updates.is_active));
    if (thumbnailFile) fd.append('thumbnail', thumbnailFile);

    const response = await apiClient.put(`/programs/${programId}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response?.success) {
      invalidateListCache();
      return { success: true, data: response.data, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to update program', code: response?.error?.code };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status, data: error.data };
  }
}

export async function deleteProgram(programId) {
  try {
    const response = await apiClient.delete(`/programs/${programId}`);
    if (response?.success) {
      invalidateListCache();
      return { success: true, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to delete program' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function getCategories({ noCache = false } = {}) {
  try {
    if (!noCache && isFresh(categoriesCache)) {
      return { success: true, data: categoriesCache.data, cached: true };
    }
    // Use Next.js proxy route to avoid browser CORS issues (same-origin request)
    const response = await fetch('/api/public/categories', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    }).then((r) => r.json());

    if (response?.success) {
      categoriesCache.data = response.data?.categories || response.data;
      categoriesCache.timestamp = Date.now();
      return { success: true, data: categoriesCache.data };
    }
    // Some public endpoints may return a raw array without a success flag
    if (Array.isArray(response)) {
      categoriesCache.data = response;
      categoriesCache.timestamp = Date.now();
      return { success: true, data: categoriesCache.data };
    }
    return { success: false, error: response?.error?.message || 'Failed to load categories' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

// Create a new category
export async function createCategory(categoryData) {
  try {
    const response = await apiClient.post('/categories', categoryData);
    if (response?.success) {
      // Invalidate cached categories to reflect the new item
      categoriesCache.timestamp = 0;
      return { success: true, data: response.data, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to create category', code: response?.error?.code };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status, data: error.data };
  }
}

// Update an existing category
export async function updateCategory(categoryId, updates = {}) {
  try {
    const response = await apiClient.put(`/categories/${categoryId}`, updates);
    if (response?.success) {
      // Invalidate cached categories to reflect updates
      categoriesCache.timestamp = 0;
      return { success: true, data: response.data, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to update category', code: response?.error?.code };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status, data: error.data };
  }
}

const programService = {
  getPrograms,
  getSchoolPrograms,
  getAllPrograms,
  getProgramById,
  assignProgramToSchool,
  getProgramLevels,
  enrollStudents,
  getEligibleStudents,
  createProgram,
  updateProgram,
  deleteProgram,
  getCategories,
  createCategory,
  updateCategory,
};

export default programService;
