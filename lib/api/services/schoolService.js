import apiClient from '../client';

export const schoolService = {
  /**
   * Create a new school
   * @param {Object} schoolData - School data object
   * @param {string} schoolData.name - School name
   * @param {string} schoolData.location - School location
   * @param {string} schoolData.contact_person - Contact person name
   * @param {string} schoolData.contact_email - Contact email
   * @param {string} schoolData.contact_phone - Contact phone
   * @param {string} schoolData.address - School address
   * @param {Object} schoolData.school_admin - School admin details
   * @param {string} schoolData.school_admin.full_name - Admin full name
   * @param {string} schoolData.school_admin.email - Admin email
   * @param {string} schoolData.school_admin.phone - Admin phone
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async createSchool(schoolData) {
    try {
      const response = await apiClient.post('/schools/', schoolData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'School created successfully'
        };
      }
      
      return {
        success: false,
        error: response.error || 'Failed to create school'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred while creating the school',
        code: error.code
      };
    }
  },

  /**
   * Get all schools with optional filters
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async getSchools(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params if provided
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const queryString = params.toString();
      const url = queryString ? `/schools/?${queryString}` : '/schools/';
      
      const response = await apiClient.get(url);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      }
      
      return {
        success: false,
        error: response.error || 'Failed to fetch schools'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred while fetching schools',
        code: error.code
      };
    }
  },

  /**
   * Get a specific school by ID
   * @param {string|number} schoolId - School ID
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async getSchoolById(schoolId) {
    try {
      const response = await apiClient.get(`/schools/${schoolId}`);
      console.log('API Response:', response);
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      }
      
      return {
        success: false,
        error: response.error || 'Failed to fetch school'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred while fetching the school',
        code: error.code
      };
    }
  },

  /**
   * Update an existing school
   * @param {string|number} schoolId - School ID
   * @param {Object} schoolData - Updated school data
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async updateSchool(schoolId, schoolData) {
    try {
      const response = await apiClient.put(`/schools/${schoolId}`, schoolData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'School updated successfully'
        };
      }
      
      return {
        success: false,
        error: response.error || 'Failed to update school'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred while updating the school',
        code: error.code
      };
    }
  },

  /**
   * Delete a school
   * @param {string|number} schoolId - School ID
   * @returns {Promise<Object>} Response object with success flag and data
   */
  async deleteSchool(schoolId) {
    try {
      const response = await apiClient.delete(`/schools/${schoolId}`);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'School deleted successfully'
        };
      }
      
      return {
        success: false,
        error: response.error || 'Failed to delete school'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred while deleting the school',
        code: error.code
      };
    }
  }
};