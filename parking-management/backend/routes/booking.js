const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Booking routes
router.post('/', bookingController.createBooking);
router.get('/user/:userId', bookingController.getUserBookings);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id/status', bookingController.updateBookingStatus);

module.exports = router; 