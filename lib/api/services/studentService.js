import apiClient from '@/lib/api/client';

// In-memory cache for student lists keyed by query params
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes per requirements
const listCache = new Map(); // key -> { data, timestamp }

function buildListKey(params = {}) {
  const page = params.page ?? 1;
  const rawLimit = params.limit ?? 10;
  const limit = Math.min(Number(rawLimit) || 10, 50);
  const search = params.search || '';
  const grade = params.grade || '';
  const program_id = params.program_id || '';
  const performance = params.performance || '';
  const is_active = typeof params.is_active === 'undefined' ? 'all' : String(params.is_active);
  return `page=${page}&limit=${limit}&search=${search}&grade=${grade}&program_id=${program_id}&performance=${performance}&is_active=${is_active}`;
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

export async function getStudents(params = {}) {
  try {
    const key = buildListKey(params);
    const cached = listCache.get(key);
    const noCache = !!params.noCache;
    if (!noCache && isFresh(cached)) {
      return { success: true, ...cached.data, cached: true };
    }

    const response = await apiClient.get('/students', {
      params: {
        page: params.page ?? 1,
        limit: Math.min(Number(params.limit ?? 10) || 10, 50),
        search: params.search || undefined,
        grade: params.grade || undefined,
        program_id: params.program_id || undefined,
        performance: params.performance || undefined,
        is_active: typeof params.is_active === 'undefined' ? undefined : params.is_active,
      },
    });

    const rawData = response?.data ?? response;
    const students = rawData?.students
      ?? rawData?.items
      ?? rawData?.list
      ?? rawData?.results
      ?? (Array.isArray(rawData) ? rawData : []);
    const pagination = rawData?.pagination ?? rawData?.meta ?? null;

    if (response?.success || Array.isArray(students)) {
      const payload = { data: { students: students || [], pagination }, message: response?.message };
      cacheList(params, payload);
      return { success: true, ...payload };
    }
    return { success: false, error: response?.error?.message || 'Failed to load students' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function getStudentById(studentId) {
  try {
    const response = await apiClient.get(`/students/${studentId}`);
    if (response?.success) {
      const student = response?.data?.student ?? response?.data;
      return { success: true, data: student, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to load student', status: response?.status };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

// Normalize and validate student fields according to API spec
function normalizeAndValidateStudentFields(values = {}) {
  const out = {};
  const put = (k, v) => { if (typeof v !== 'undefined' && v !== null) out[k] = v; };

  // Full name (optional for update, validate when provided)
  if (typeof values.full_name !== 'undefined') {
    const name = String(values.full_name).trim();
    if (name && name.length < 3) throw new Error('Full name must be at least 3 characters');
    if (name && name.length > 255) throw new Error('Full name must be at most 255 characters');
    put('full_name', name);
  }

  // Roll number (optional)
  if (typeof values.roll_number !== 'undefined') {
    const roll = String(values.roll_number).trim();
    if (!roll) throw new Error('Roll number cannot be empty');
    if (roll.length > 50) throw new Error('Roll number must be at most 50 characters');
    put('roll_number', roll);
  }

  // Grade: integer between 1 and 12
  if (typeof values.grade !== 'undefined') {
    const g = Number(values.grade);
    if (!Number.isInteger(g) || g < 1 || g > 12) throw new Error('Grade must be an integer between 1 and 12');
    put('grade', String(g));
  }

  // Date of birth: YYYY-MM-DD and not in future
  if (typeof values.date_of_birth !== 'undefined') {
    const dob = String(values.date_of_birth).trim();
    if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) throw new Error('Date of birth must be in YYYY-MM-DD format');
    if (dob) {
      const d = new Date(dob);
      if (Number.isNaN(d.getTime())) throw new Error('Invalid date of birth');
      if (d.getTime() > Date.now()) throw new Error('Date of birth cannot be in the future');
    }
    put('date_of_birth', dob);
  }

  // Gender: Male | Female | Other (normalize casing)
  if (typeof values.gender !== 'undefined') {
    const raw = String(values.gender).trim().toLowerCase();
    const map = { male: 'Male', female: 'Female', other: 'Other' };
    const gender = map[raw];
    if (!gender) throw new Error('Gender must be Male, Female, or Other');
    put('gender', gender);
  }

  // Parent details (optional)
  if (typeof values.parent_name !== 'undefined') {
    const pName = String(values.parent_name).trim();
    if (pName && pName.length < 3) throw new Error('Parent name must be at least 3 characters');
    if (pName && pName.length > 255) throw new Error('Parent name must be at most 255 characters');
    put('parent_name', pName);
  }

  if (typeof values.parent_phone !== 'undefined') {
    const phone = String(values.parent_phone).trim();
    if (phone && !/^\+\d{10,15}$/.test(phone)) throw new Error('Parent phone must be + followed by 10-15 digits');
    put('parent_phone', phone);
  }

  if (typeof values.parent_email !== 'undefined') {
    const email = String(values.parent_email).trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Parent email is invalid');
    put('parent_email', email);
  }

  if (typeof values.address !== 'undefined') {
    const addr = String(values.address).trim();
    put('address', addr);
  }

  if (typeof values.is_active !== 'undefined') {
    put('is_active', String(!!values.is_active));
  }

  return out;
}

export async function createStudent(formData, photoFile) {
  try {
    const normalized = normalizeAndValidateStudentFields(formData);
    const fd = new FormData();
    // Required fields
    fd.append('full_name', normalized.full_name ?? String(formData.full_name || '').trim());
    fd.append('roll_number', normalized.roll_number ?? String(formData.roll_number || '').trim());
    fd.append('grade', normalized.grade ?? String(formData.grade));
    fd.append('date_of_birth', normalized.date_of_birth ?? String(formData.date_of_birth));
    fd.append('gender', normalized.gender ?? String(formData.gender));
    // Optional fields
    if (typeof normalized.parent_name !== 'undefined') fd.append('parent_name', normalized.parent_name);
    if (typeof normalized.parent_phone !== 'undefined') fd.append('parent_phone', normalized.parent_phone);
    if (typeof normalized.parent_email !== 'undefined') fd.append('parent_email', normalized.parent_email);
    if (typeof normalized.address !== 'undefined') fd.append('address', normalized.address);
    if (typeof normalized.is_active !== 'undefined') fd.append('is_active', normalized.is_active);
    if (photoFile) fd.append('photo', photoFile);

    const response = await apiClient.post('/students', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response?.success) {
      invalidateListCache();
      return { success: true, data: response.data?.student ?? response.data, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to create student', code: response?.error?.code };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status, data: error.data };
  }
}

export async function updateStudent(studentId, updates = {}, photoFile) {
  try {
    const normalized = normalizeAndValidateStudentFields(updates);
    const fd = new FormData();
    Object.entries(normalized).forEach(([k, v]) => fd.append(k, v));
    if (photoFile) fd.append('photo', photoFile);

    const response = await apiClient.put(`/students/${studentId}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response?.success) {
      invalidateListCache();
      return { success: true, data: response.data?.student ?? response.data, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to update student', code: response?.error?.code };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status, data: error.data };
  }
}

export async function deleteStudent(studentId) {
  try {
    const response = await apiClient.delete(`/students/${studentId}`);
    if (response?.success) {
      invalidateListCache();
      return { success: true, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to delete student' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function importStudents(csvFile) {
  try {
    const fd = new FormData();
    fd.append('file', csvFile);
    const response = await apiClient.post('/students/import', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (response?.success) {
      invalidateListCache();
      return { success: true, data: response.data, message: response.message };
    }
    return { success: false, error: response?.error?.message || 'Import failed', code: response?.error?.code };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status, data: error.data };
  }
}

export async function checkRollNumberUnique(rollNumber) {
  try {
    // Fallback approach: search students and check exact match
    const response = await apiClient.get('/students', { params: { search: rollNumber, limit: 1 } });
    const students = response?.data?.students || [];
    const exists = Array.isArray(students) && students.some((s) => String(s.roll_number).toLowerCase() === String(rollNumber).toLowerCase());
    return { success: true, data: { isUnique: !exists } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export function downloadImportTemplate() {
  const header = ['full_name','roll_number','grade','date_of_birth','gender','parent_name','parent_phone','parent_email','address'];
  const samples = [
    ['Amit Kumar','10001','5','2015-05-10','male','Sunil Kumar','+919876543210','parent1@email.com','House 123, Street 4, City'],
    ['Sara Khan','10002','6','2014-09-22','female','Rehman Khan','+919876500000','','Near Park, District, City'],
    ['Alex John','10003','4','2016-01-15','other','Mary John','+919876511111','mary@example.com','Village Road, City'],
  ];
  const rows = [header, ...samples];
  const csv = rows.map((r) => r.map((cell) => {
    const val = cell == null ? '' : String(cell);
    const needsQuotes = val.includes(',') || val.includes('\n') || /"/.test(val);
    return needsQuotes ? '"' + val.replace(/"/g, '""') + '"' : val;
  }).join(',')).join('\n');

  if (typeof window !== 'undefined') {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  return { success: true };
}

const studentService = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  importStudents,
  checkRollNumberUnique,
  downloadImportTemplate,
};

export default studentService;
