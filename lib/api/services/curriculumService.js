import apiClient from '@/lib/api/client';

// Curriculum Service: Levels and Milestones
// Normalizes backend responses and provides a clean API for pages.

export async function getProgramLevels(programId) {
  try {
    const response = await apiClient.get(`/programs/${programId}/levels`);
    if (response?.success) {
      const program = response?.data?.program ?? null;
      const levels = response?.data?.levels ?? [];
      return { success: true, data: { program, levels }, message: response?.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to load program levels' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function getLevelDetails(levelId) {
  try {
    const response = await apiClient.get(`/levels/${levelId}`);
    if (response?.success) {
      const level = response?.data?.level ?? response?.data ?? null;
      const milestones = response?.data?.milestones ?? [];
      const statistics = response?.data?.statistics ?? null;
      return { success: true, data: { level, milestones, statistics }, message: response?.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to load level details' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function createOrUpdateLevel(programId, levelNumber, levelData) {
  try {
    const payload = {
      program_id: programId,
      level_number: levelNumber,
      level_name: levelData?.level_name,
      description: levelData?.description,
    };
    const response = await apiClient.post('/levels', payload);
    if (response?.success) {
      return { success: true, data: response?.data, message: response?.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to create/update level' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function updateLevel(levelId, updates = {}) {
  try {
    const response = await apiClient.put(`/levels/${levelId}`, updates);
    if (response?.success) {
      return { success: true, data: response?.data, message: response?.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to update level' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function clearLevelContent(levelId) {
  try {
    const response = await apiClient.delete(`/levels/${levelId}`);
    if (response?.success) {
      return { success: true, message: response?.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to clear level content' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function getMilestones(levelId) {
  try {
    const response = await apiClient.get(`/levels/${levelId}/milestones`);
    if (response?.success) {
      const milestones = response?.data ?? [];
      return { success: true, data: milestones, message: response?.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to load milestones' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function createMilestone(levelId, milestoneData) {
  try {
    const response = await apiClient.post(`/levels/${levelId}/milestones`, milestoneData);
    if (response?.success) {
      return { success: true, data: response?.data, message: response?.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to create milestone' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function updateMilestone(milestoneId, updates) {
  try {
    const response = await apiClient.put(`/milestones/${milestoneId}`, updates);
    if (response?.success) {
      return { success: true, data: response?.data, message: response?.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to update milestone' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function deleteMilestone(milestoneId, { force = false } = {}) {
  try {
    const response = await apiClient.delete(`/milestones/${milestoneId}${force ? '?force=true' : ''}`);
    if (response?.success) {
      return { success: true, message: response?.message };
    }
    return { success: false, error: response?.error?.message || 'Failed to delete milestone' };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

export async function reorderMilestones(levelId, newOrder) {
  // Fallback implementation: update each milestone's order_index.
  try {
    for (const item of newOrder) {
      const res = await updateMilestone(item.milestone_id, { order_index: item.order_index });
      if (!res.success) {
        return { success: false, error: res.error || 'Failed to reorder milestones' };
      }
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message, code: error.code, status: error.status };
  }
}

const curriculumService = {
  getProgramLevels,
  getLevelDetails,
  createOrUpdateLevel,
  updateLevel,
  clearLevelContent,
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  reorderMilestones,
};

export default curriculumService;

