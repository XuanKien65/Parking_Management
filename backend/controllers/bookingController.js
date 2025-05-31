const Booking = require('../models/Booking');
const Area = require('../models/Areas');

const bookingController = {
  // Create booking
  createBooking: async (req, res) => {
    try {
      const { userId, areaId, startTime, endTime } = req.body;

      // Validate required fields
      if (!userId || !areaId || !startTime || !endTime) {
        return res.status(400).json({
          message: 'Missing required fields',
          required: ['userId', 'areaId', 'startTime', 'endTime']
        });
      }

      // Check if area exists and has available spaces
      const area = await Area.findById(areaId);
      if (!area) {
        return res.status(404).json({ message: 'Parking area not found' });
      }

      if (area.availableSpaces <= 0) {
        return res.status(400).json({ message: 'No available spaces in this area' });
      }

      // Create booking
      const newBooking = await Booking.create({
        userId,
        areaId,
        startTime,
        endTime
      });

      // Update available spaces
      await Area.updateAvailableSpaces(areaId, area.availableSpaces - 1);

      res.status(201).json({
        message: 'Booking created successfully',
        booking: newBooking
      });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({
        message: 'Error creating booking',
        error: error.message
      });
    }
  },

  // Get user bookings
  getUserBookings: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const bookings = await Booking.findByUserId(userId);
      res.json(bookings);
    } catch (error) {
      console.error('Get user bookings error:', error);
      res.status(500).json({
        message: 'Error fetching user bookings',
        error: error.message
      });
    }
  },

  // Get booking by ID
  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Booking ID is required' });
      }

      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.json(booking);
    } catch (error) {
      console.error('Get booking error:', error);
      res.status(500).json({
        message: 'Error fetching booking',
        error: error.message
      });
    }
  },

  // Update booking status
  updateBookingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Booking ID is required' });
      }

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status',
          validStatuses
        });
      }

      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      const updated = await Booking.updateStatus(id, status);
      if (!updated) {
        return res.status(400).json({ message: 'Failed to update booking status' });
      }

      // If booking is cancelled or completed, increase available spaces
      if (status === 'cancelled' || status === 'completed') {
        const area = await Area.findById(booking.areaId);
        if (area) {
          await Area.updateAvailableSpaces(booking.areaId, area.availableSpaces + 1);
        }
      }

      res.json({
        message: 'Booking status updated successfully',
        booking: { ...booking, status }
      });
    } catch (error) {
      console.error('Update booking status error:', error);
      res.status(500).json({
        message: 'Error updating booking status',
        error: error.message
      });
    }
  }
};

module.exports = bookingController; 