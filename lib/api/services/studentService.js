import apiClient from '../client';

export const studentService = {
  /**
   * Get all students with optional filters and pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 16)
   * @param {string} params.search - Search term for student name or email
   * @param {string} params.school_id - Filter by school ID
   * @param {string} params.sort_by - Sort field (default: 'full_name')
   * @param {string} params.sort_order - Sort order 'asc' or 'desc' (default: 'asc')
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async getStudents(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add sorting parameters
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);
      
      // Add filtering parameters
      if (params.search) queryParams.append('search', params.search);
      if (params.school_id) queryParams.append('school_id', params.school_id);
      if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);
      
      const queryString = queryParams.toString();
      const url = queryString ? `/students?${queryString}` : '/students';
      
      console.log('Making request to:', url);
      
      const response = await apiClient.get(url);
      
      console.log('Students API Response:', response);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Students retrieved successfully'
        };
      }
      
      return {
        success: false,
        error: response.error || 'Failed to fetch students'
      };
    } catch (error) {
      console.error('Student service error:', error);
      return {
        success: false,
        error: error.message || 'An error occurred while fetching students',
        code: error.code
      };
    }
  },

  /**
   * Get student by ID
   * @param {string} studentId - Student ID
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async getStudentById(studentId) {
    try {
      if (!studentId) {
        return {
          success: false,
          error: 'Student ID is required'
        };
      }

      const response = await apiClient.get(`/students/${studentId}`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Student retrieved successfully'
        };
      }
      
      return {
        success: false,
        error: response.error || 'Failed to fetch student'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred while fetching student',
        code: error.code
      };
    }
  }
};