const User = require('../models/User');
const Area = require('../models/Areas');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

const adminController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all areas
  getAllAreas: async (req, res) => {
    try {
      const areas = await Area.findAll();
      res.json(areas);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new area
  createArea: async (req, res) => {
    try {
      const { name, totalSpaces, pricePerHour } = req.body;
      const area = await Area.create({ name, totalSpaces, pricePerHour });
      res.status(201).json(area);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update area
  updateArea: async (req, res) => {
    try {
      const { areaId } = req.params;
      const { name, totalSpaces, pricePerHour } = req.body;

      const area = await Area.findById(areaId);
      if (!area) {
        return res.status(404).json({ message: 'Area not found' });
      }

      await Area.update(areaId, { name, totalSpaces, pricePerHour });
      res.json({ message: 'Area updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete area
  deleteArea: async (req, res) => {
    try {
      const { areaId } = req.params;
      const area = await Area.findById(areaId);
      if (!area) {
        return res.status(404).json({ message: 'Area not found' });
      }

      await Area.delete(areaId);
      res.json({ message: 'Area deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all payments
  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.findAll();
      const paymentsWithDetails = await Promise.all(payments.map(async (payment) => {
        const booking = await Booking.findById(payment.bookingId);
        const user = await User.findById(booking.userId);
        return {
          ...payment,
          userName: user.name,
          bookingTime: booking.startTime
        };
      }));
      res.json(paymentsWithDetails);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all bookings
  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.findAll();
      const bookingsWithDetails = await Promise.all(bookings.map(async (booking) => {
        const user = await User.findById(booking.userId);
        const area = await Area.findById(booking.areaId);
        return {
          ...booking,
          userName: user.name,
          areaName: area.name
        };
      }));
      res.json(bookingsWithDetails);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update booking status
  updateBookingStatus: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      await Booking.updateStatus(bookingId, status);
      res.json({ message: 'Booking status updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete booking
  deleteBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      await Booking.delete(bookingId);
      res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = adminController; 