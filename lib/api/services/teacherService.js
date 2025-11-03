import apiClient from '../client';

export const teacherService = {
  /**
   * Get all teachers with optional filters and pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.search - Search term for teacher name or email
   * @param {string} params.school_id - Filter by school ID
   * @param {string} params.sort_by - Sort field (default: 'full_name')
   * @param {string} params.sort_order - Sort order 'asc' or 'desc' (default: 'asc')
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async getTeachers(params = {}) {
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
      const url = queryString ? `/teachers?${queryString}` : '/teachers';
      
      const response = await apiClient.get(url);
      
      console.log('Teachers API Response:', response);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Teachers retrieved successfully'
        };
      }
      
      return {
        success: false,
        error: response.error || 'Failed to fetch teachers'
      };
    } catch (error) {
      console.error('Teacher service error:', error);
      return {
        success: false,
        error: error.message || 'An error occurred while fetching teachers',
        code: error.code
      };
    }
  },

  /**
   * Get a specific teacher by ID
   * @param {string|number} teacherId - Teacher ID
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async getTeacherById(teacherId) {
    try {
      const response = await apiClient.get(`/teachers/${teacherId}`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      }
      
      return {
        success: false,
        error: response.error || 'Failed to fetch teacher'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred while fetching the teacher',
        code: error.code
      };
    }
  },

  /**
   * Create a new teacher
   * @param {Object} teacherData - Teacher data object
   * Expected structure: {
   *   full_name: string,
   *   email: string,
   *   phone: string,
   *   qualifications: string,
   *   experience_years: number,
   *   bio: string
   * }
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async createTeacher(teacherData) {
    try {
      // Validate required fields
      const requiredFields = ['full_name', 'email'];
      const missingFields = requiredFields.filter(field => !teacherData[field]);
      
      if (missingFields.length > 0) {
        return {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(teacherData.email)) {
        return {
          success: false,
          error: 'Invalid email format'
        };
      }

      // Validate experience_years if provided
      if (teacherData.experience_years !== undefined && 
          (typeof teacherData.experience_years !== 'number' || 
           teacherData.experience_years < 0 || 
           teacherData.experience_years > 50)) {
        return {
          success: false,
          error: 'Experience years must be a number between 0 and 50'
        };
      }

      // Prepare the data structure for API
      const apiData = {
        full_name: teacherData.full_name,
        email: teacherData.email,
        phone: teacherData.phone || '',
        qualifications: teacherData.qualifications || '',
        experience_years: teacherData.experience_years || 0,
        bio: teacherData.bio || ''
      };

      const response = await apiClient.post('/teachers', apiData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Teacher created successfully'
        };
      }
      
      return {
        success: false,
        error: response.error || 'Failed to create teacher'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred while creating the teacher',
        code: error.code
      };
    }
  },

  /**
   * Update a teacher
   * @param {string|number} teacherId - Teacher ID
   * @param {Object} teacherData - Updated teacher data
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async updateTeacher(teacherId, teacherData) {
    try {
      // Validate required fields if they are being updated
      if (teacherData.full_name !== undefined && !teacherData.full_name?.trim()) {
        return {
          success: false,
          error: 'Full name is required'
        };
      }

      // Validate email format if email is being updated
      if (teacherData.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(teacherData.email)) {
          return {
            success: false,
            error: 'Invalid email format'
          };
        }
      }

      // Validate experience_years if provided
      if (teacherData.experience_years !== undefined && 
          (typeof teacherData.experience_years !== 'number' || 
           teacherData.experience_years < 0 || 
           teacherData.experience_years > 50)) {
        return {
          success: false,
          error: 'Experience years must be a number between 0 and 50'
        };
      }

      console.log('Making PUT request to:', `/teachers/${teacherId}`);
      console.log('Request data:', teacherData);
      
      const response = await apiClient.put(`/teachers/${teacherId}`, teacherData);
      console.log('Raw API response:', response);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Teacher updated successfully'
        };
      }
      
      return {
        success: false,
        error: response.error || 'Failed to update teacher'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred while updating the teacher',
        code: error.code
      };
    }
  },

  /**
   * Delete a teacher
   * @param {string|number} teacherId - Teacher ID
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async deleteTeacher(teacherId) {
    try {
      const response = await apiClient.delete(`/teachers/${teacherId}`);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Teacher deleted successfully'
        };
      }
      
      return {
        success: false,
        error: response.error || 'Failed to delete teacher'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred while deleting the teacher',
        code: error.code
      };
    }
  }
};