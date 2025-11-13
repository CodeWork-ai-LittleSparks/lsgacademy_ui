import apiClient from '@/lib/api/client';

// Cache report types (10 minutes)
const TYPES_CACHE_TTL_MS = 10 * 60 * 1000;
let typesCache = { data: null, timestamp: 0 };

export async function getReportTypes({ noCache = false } = {}) {
  try {
    const fresh = typesCache.data && (Date.now() - typesCache.timestamp) < TYPES_CACHE_TTL_MS;
    if (!noCache && fresh) {
      return { success: true, data: typesCache.data, cached: true };
    }

    const response = await apiClient.get('/reports/types');
    if (response?.success) {
      const normalized = {
        reportTypes: response.data?.report_types || [],
        formats: response.data?.formats || [],
        filters: response.data?.available_filters || {},
        roleAccess: response.data?.role_access || {},
      };
      typesCache = { data: normalized, timestamp: Date.now() };
      return { success: true, data: normalized };
    }
    return { success: false, error: response?.error?.message || 'Failed to load report types' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

function isValidUUID(v) {
  return typeof v === 'string' && /^[0-9a-fA-F-]{36}$/.test(v);
}

function validateFilters(filters = {}) {
  const out = { ...filters };
  // Trim strings
  ['date_from', 'date_to', 'school_id', 'program_id', 'level_id', 'teacher_id', 'student_id', 'performance_category'].forEach((k) => {
    if (typeof out[k] === 'string') out[k] = out[k].trim();
  });
  // UUID validation (optional fields)
  ['school_id', 'program_id', 'level_id', 'teacher_id', 'student_id'].forEach((k) => {
    if (out[k] && !isValidUUID(out[k])) throw new Error(`Invalid UUID for ${k}`);
  });
  // Grade must be integer if provided
  if (typeof out.grade !== 'undefined' && out.grade !== null) {
    const g = Number(out.grade);
    if (!Number.isInteger(g) || g < 1 || g > 12) throw new Error('Grade must be an integer between 1 and 12');
    out.grade = g;
  }
  return out;
}

export async function generateReport(reportType, format, filters = {}) {
  try {
    if (!reportType) return { success: false, error: 'Please select a report type' };
    if (!format) return { success: false, error: 'Please select a format' };

    const validatedFilters = validateFilters(filters);
    // Basic date validation
    const df = new Date(validatedFilters.date_from);
    const dt = new Date(validatedFilters.date_to);
    if (!(df instanceof Date) || isNaN(df)) return { success: false, error: 'Start date is required' };
    if (!(dt instanceof Date) || isNaN(dt)) return { success: false, error: 'End date is required' };
    if (df > dt) return { success: false, error: 'End date must be after start date' };
    const rangeDays = Math.ceil((dt - df) / (1000 * 60 * 60 * 24));
    if (rangeDays > 365) return { success: false, error: 'Date range cannot exceed 1 year' };

    const response = await apiClient.post('/reports', {
      report_type: reportType,
      format,
      filters: validatedFilters,
    });

    if (response?.success) {
      const d = response.data || {};
      return {
        success: true,
        data: {
          reportId: d.report_id,
          reportType: d.report_type,
          format: d.format,
          generatedAt: d.generated_at,
          downloadUrl: d.download_url,
          expiresAt: d.expires_at,
          recordsCount: d.records_count,
        },
        message: response.message || 'Report generated successfully',
      };
    }
    return { success: false, error: response?.error?.message || 'Failed to generate report' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function downloadReport(reportId, format) {
  try {
    if (!reportId) return { success: false, error: 'Report ID is required' };
    const response = await apiClient.get(`/reports/download/${reportId}`, {
      params: { format: format || undefined },
      responseType: 'blob',
    });
    const blob = response; // interceptor returns response.data, which is the blob

    const filename = `report_${reportId}.${format || 'csv'}`;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

// Local storage history helpers
const HISTORY_KEY = 'lsg_academy_reports_history';

function readHistory() {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(HISTORY_KEY) : null;
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeHistory(list) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {}
}

export function getReportHistory() {
  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  let list = readHistory();
  // Cleanup: remove older than 30 days and expired
  list = list.filter((r) => {
    const gen = new Date(r.generatedAt).getTime();
    const exp = new Date(r.expiresAt).getTime();
    const fresh = (now - gen) <= thirtyDaysMs;
    const notExpired = !exp || exp > now;
    return fresh || notExpired; // keep recent and active/expired entries within window
  });
  // Limit to 50
  if (list.length > 50) list = list.slice(0, 50);
  writeHistory(list);
  return list;
}

export function saveReportToHistory(item) {
  const list = readHistory();
  const next = [item, ...list].slice(0, 50);
  writeHistory(next);
  return next;
}

export function deleteReportFromHistory(reportId) {
  const list = readHistory();
  const next = list.filter((r) => r.reportId !== reportId);
  writeHistory(next);
  return next;
}

const reportService = {
  getReportTypes,
  generateReport,
  downloadReport,
  getReportHistory,
  saveReportToHistory,
  deleteReportFromHistory,
};

export default reportService;

