import apiClient from '../client';

/**
 * Fetch dashboard data for the given date range.
 * @param {Object} params
 * @param {string} params.date_from - Start date (YYYY-MM-DD)
 * @param {string} params.date_to - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Dashboard API response
 */
export async function getDashboardData({ date_from, date_to }) {
  try {
    const response = await apiClient.get('/dashboard', {
      params: { date_from, date_to },
    });
    if (response.success) {
      return { success: true, data: response.data, message: response.message };
    }
    return { success: false, error: response.error || 'Failed to fetch dashboard data' };
  } catch (error) {
    return { success: false, error: error.message || 'An error occurred while fetching dashboard data' };
  }
}