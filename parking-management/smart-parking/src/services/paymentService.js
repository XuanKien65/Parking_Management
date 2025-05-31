import api from './api';

const paymentService = {
  // Create new payment
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payment', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's payments
  getUserPayments: async (userId) => {
    try {
      const response = await api.get(`/payment/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get payment by ID
  getPaymentById: async (id) => {
    try {
      const response = await api.get(`/payment/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update payment status
  updatePaymentStatus: async (id, status) => {
    try {
      const response = await api.patch(`/payment/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default paymentService; 