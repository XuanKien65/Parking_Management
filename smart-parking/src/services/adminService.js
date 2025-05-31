import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

const adminService = {
  // User management
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      console.log('Get all users response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  },

  // Area management
  getAllAreas: async () => {
    try {
      const response = await axios.get(`${API_URL}/areas`);
      console.log('Get all areas response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getAllAreas:', error);
      throw error;
    }
  },

  createArea: async (areaData) => {
    try {
      const response = await axios.post(`${API_URL}/areas`, areaData);
      console.log('Create area response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in createArea:', error);
      throw error;
    }
  },

  updateArea: async (areaId, areaData) => {
    try {
      const response = await axios.put(`${API_URL}/areas/${areaId}`, areaData);
      console.log('Update area response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in updateArea:', error);
      throw error;
    }
  },

  deleteArea: async (areaId) => {
    try {
      const response = await axios.delete(`${API_URL}/areas/${areaId}`);
      console.log('Delete area response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in deleteArea:', error);
      throw error;
    }
  },

  // Payment management
  getAllPayments: async () => {
    try {
      const response = await axios.get(`${API_URL}/payments`);
      console.log('Get all payments response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getAllPayments:', error);
      throw error;
    }
  },

  // Booking management
  getAllBookings: async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings`);
      console.log('Get all bookings response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getAllBookings:', error);
      throw error;
    }
  },

  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await axios.put(`${API_URL}/bookings/${bookingId}/status`, { status });
      console.log('Update booking status response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in updateBookingStatus:', error);
      throw error;
    }
  },

  deleteBooking: async (bookingId) => {
    try {
      const response = await axios.delete(`${API_URL}/bookings/${bookingId}`);
      console.log('Delete booking response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in deleteBooking:', error);
      throw error;
    }
  }
};

export default adminService; 