import apiClient, { publicApiClient } from '@/lib/api/client';

// Settings Service: handles profile, security, categories, performance categories, and school info

// PROFILE
export async function getProfile() {
  try {
    const res = await apiClient.get('/profile');
    if (res?.success) return { success: true, data: res.data };
    return { success: false, error: res?.error?.message || 'Failed to load profile' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

// Upload profile picture using specialized endpoint
export async function uploadProfilePicture(file) {
  try {
    if (!file) return { success: false, error: 'No file selected' };
    const form = new FormData();
    form.append('file', file);

    const res = await apiClient.post('/upload/profile-picture', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res?.success) {
      const d = res.data || {};
      return {
        success: true,
        data: {
          file_url: d.file_url,
          file_name: d.file_name,
          file_size: d.file_size,
          file_type: d.file_type,
        },
        message: res.message || 'Profile picture uploaded successfully',
      };
    }
    return { success: false, error: res?.error?.message || 'Failed to upload profile picture' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function updateProfile(profileData = {}, profilePicture) {
  try {
    const form = new FormData();
    // Append primitive fields from profileData
    Object.entries(profileData || {}).forEach(([k, v]) => {
      if (typeof v === 'undefined' || v === null) return;
      form.append(k, v);
    });
    if (profilePicture) form.append('profile_picture', profilePicture);

    const res = await apiClient.put('/profile', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res?.success) return { success: true, data: res.data, message: res.message || 'Profile updated successfully' };
    return { success: false, error: res?.error?.message || 'Failed to update profile' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

// ACCOUNT SECURITY
export async function changePassword(passwords = {}) {
  try {
    const body = {
      current_password: passwords.current_password || passwords.current || '',
      new_password: passwords.new_password || passwords.new || '',
      confirm_password: passwords.confirm_password || passwords.confirm || '',
    };
    const res = await apiClient.post('/auth/change-password', body);
    if (res?.success) return { success: true, message: res.message || 'Password changed successfully' };
    return { success: false, error: res?.error?.message || 'Failed to change password' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

// CATEGORIES (Super Admin)
export async function getCategories() {
  try {
    const res = await apiClient.get('/categories');
    if (res?.success) return { success: true, data: res.data?.categories || [], total: res.data?.total };
    return { success: false, error: res?.error?.message || 'Failed to load categories' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function createCategory(categoryData = {}) {
  try {
    const body = {
      name: categoryData.name,
      description: categoryData.description,
      color: categoryData.color,
      icon: categoryData.icon || undefined,
    };
    const res = await apiClient.post('/categories', body);
    if (res?.success) return { success: true, data: res.data, message: res.message || 'Category created successfully' };
    return { success: false, error: res?.error?.message || 'Failed to create category' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function updateCategory(categoryId, updates = {}) {
  try {
    if (!categoryId) return { success: false, error: 'Category ID is required' };
    const res = await apiClient.put(`/categories/${categoryId}`, updates);
    if (res?.success) return { success: true, data: res.data, message: res.message || 'Category updated successfully' };
    return { success: false, error: res?.error?.message || 'Failed to update category' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function deleteCategory(categoryId) {
  try {
    if (!categoryId) return { success: false, error: 'Category ID is required' };
    const res = await apiClient.delete(`/categories/${categoryId}`);
    if (res?.success) return { success: true, message: res.message || 'Category deleted successfully' };
    return { success: false, error: res?.error?.message || 'Failed to delete category' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

// PERFORMANCE CATEGORIES (Super Admin)
export async function getPerformanceCategories() {
  try {
    const res = await apiClient.get('/categories/performance');
    if (res?.success) return { success: true, data: res.data?.performance_categories || [] };
    return { success: false, error: res?.error?.message || 'Failed to load performance categories' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function updatePerformanceCategories(categories = []) {
  try {
    const payload = { categories };
    const res = await apiClient.put('/categories/performance', payload);
    if (res?.success) return { success: true, data: res.data, message: res.message || 'Performance categories updated successfully' };
    return { success: false, error: res?.error?.message || 'Failed to update performance categories' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

// SCHOOL (School Admin)
export async function getSchool(schoolId) {
  try {
    if (!schoolId) return { success: false, error: 'School ID is required' };
    const res = await apiClient.get(`/schools/${schoolId}`);
    if (res?.success) return { success: true, data: res.data?.school || res.data };
    return { success: false, error: res?.error?.message || 'Failed to load school' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function updateSchool(schoolId, updates = {}) {
  try {
    if (!schoolId) return { success: false, error: 'School ID is required' };
    const res = await apiClient.put(`/schools/${schoolId}`, updates);
    if (res?.success) return { success: true, data: res.data?.school || res.data, message: res.message || 'School updated successfully' };
    return { success: false, error: res?.error?.message || 'Failed to update school' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

const settingsService = {
  getProfile,
  uploadProfilePicture,
  updateProfile,
  changePassword,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getPerformanceCategories,
  updatePerformanceCategories,
  getSchool,
  updateSchool,
};

export default settingsService;
