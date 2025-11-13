import apiClient from '@/lib/api/client';

// Evaluations Service: list, detail, and export functionality for School Admin

// Normalize backend response for list endpoint
function normalizeListResponse(response) {
  const raw = response?.data ?? response;
  const evaluations = raw?.evaluations
    ?? raw?.items
    ?? raw?.results
    ?? (Array.isArray(raw) ? raw : []);
  const pagination = raw?.pagination ?? raw?.meta ?? null;
  const summary = raw?.summary ?? null;
  return { evaluations, pagination, summary };
}

export async function getEvaluations(params = {}) {
  try {
    const query = {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      student_id: params.student_id || undefined,
      teacher_id: params.teacher_id || undefined,
      program_id: params.program_id || undefined,
      level_id: params.level_id || undefined,
      // Backend expects performance_category; accept both for compatibility
      performance_category: params.performance || params.performance_category || undefined,
      date_from: params.date_from || undefined,
      date_to: params.date_to || undefined,
      sort_by: params.sort_by || 'evaluated_at',
      sort_order: params.sort_order || 'desc',
      search: params.search || undefined, // backend may support search by student name/roll
    };

    const response = await apiClient.get('/evaluations', { params: query });
    if (response?.success) {
      const normalized = normalizeListResponse(response);
      return { success: true, data: normalized, message: response?.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to load evaluations' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function getEvaluationById(evaluationId) {
  try {
    if (!evaluationId) return { success: false, error: 'Evaluation ID is required' };
    const response = await apiClient.get(`/evaluations/${evaluationId}`);
    if (response?.success) {
      const evaluation = response?.data?.evaluation ?? response?.data;
      return { success: true, data: evaluation, message: response?.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to load evaluation', status: response?.status };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function exportEvaluations(filters = {}) {
  try {
    // Export current filtered results as CSV
  const response = await apiClient.get('/evaluations/export', {
    params: {
      page: filters.page ?? undefined, // usually export all filtered, not paginated
      limit: filters.limit ?? undefined,
      student_id: filters.student_id || undefined,
      teacher_id: filters.teacher_id || undefined,
      program_id: filters.program_id || undefined,
      level_id: filters.level_id || undefined,
      performance_category: filters.performance || filters.performance_category || undefined,
      date_from: filters.date_from || undefined,
      date_to: filters.date_to || undefined,
      sort_by: filters.sort_by || undefined,
      sort_order: filters.sort_order || undefined,
      search: filters.search || undefined,
      format: 'csv',
    },
      responseType: 'blob',
    });

    const blob = response; // axios interceptor returns response.data which is the blob
    const filename = `evaluations_${new Date().toISOString().slice(0,10)}.csv`;
    if (typeof window !== 'undefined') {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

const evaluationService = {
  getEvaluations,
  getEvaluationById,
  exportEvaluations,
};

export default evaluationService;