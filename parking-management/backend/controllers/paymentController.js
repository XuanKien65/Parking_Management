const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

const paymentController = {
  // Create payment
  createPayment: async (req, res) => {
    try {
      const { bookingId, userId, amount, paymentMethod } = req.body;

      // Validate required fields
      if (!bookingId || !userId || !amount || !paymentMethod) {
        return res.status(400).json({
          message: 'Missing required fields',
          required: ['bookingId', 'userId', 'amount', 'paymentMethod']
        });
      }

      // Check if booking exists
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Create payment
      const newPayment = await Payment.create({
        bookingId,
        userId,
        amount,
        paymentMethod
      });

      res.status(201).json({
        message: 'Payment created successfully',
        payment: newPayment
      });
    } catch (error) {
      console.error('Create payment error:', error);
      res.status(500).json({
        message: 'Error creating payment',
        error: error.message
      });
    }
  },

  // Get user payments
  getUserPayments: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const payments = await Payment.findByUserId(userId);
      res.json(payments);
    } catch (error) {
      console.error('Get user payments error:', error);
      res.status(500).json({
        message: 'Error fetching user payments',
        error: error.message
      });
    }
  },

  // Get payment by ID
  getPaymentById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Payment ID is required' });
      }

      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      res.json(payment);
    } catch (error) {
      console.error('Get payment error:', error);
      res.status(500).json({
        message: 'Error fetching payment',
        error: error.message
      });
    }
  },

  // Update payment status
  updatePaymentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Payment ID is required' });
      }

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status',
          validStatuses
        });
      }

      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      const updated = await Payment.updateStatus(id, status);
      if (!updated) {
        return res.status(400).json({ message: 'Failed to update payment status' });
      }

      res.json({
        message: 'Payment status updated successfully',
        payment: { ...payment, status }
      });
    } catch (error) {
      console.error('Update payment status error:', error);
      res.status(500).json({
        message: 'Error updating payment status',
        error: error.message
      });
    }
  }
};

module.exports = paymentController; 