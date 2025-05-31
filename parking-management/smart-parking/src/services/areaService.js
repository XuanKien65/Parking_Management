import api from './api';

const areaService = {
  // Get all areas
  getAllAreas: async () => {
    try {
      const response = await api.get('/areas');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get area by ID
  getAreaById: async (id) => {
    try {
      const response = await api.get(`/areas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get available areas
  getAvailableAreas: async () => {
    try {
      const response = await api.get('/areas/available');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default areaService; 