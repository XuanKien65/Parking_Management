import api from './api';

const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/booking', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's bookings
  getUserBookings: async (userId) => {
    try {
      const response = await api.get(`/booking/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get booking by ID
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/booking/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.patch(`/booking/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default bookingService; 