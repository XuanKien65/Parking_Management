const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// User management routes
router.get('/users', adminController.getAllUsers);

// Area management routes
router.get('/areas', adminController.getAllAreas);
router.post('/areas', adminController.createArea);
router.put('/areas/:areaId', adminController.updateArea);
router.delete('/areas/:areaId', adminController.deleteArea);

// Payment management routes
router.get('/payments', adminController.getAllPayments);

// Booking management routes
router.get('/bookings', adminController.getAllBookings);
router.put('/bookings/:bookingId/status', adminController.updateBookingStatus);
router.delete('/bookings/:bookingId', adminController.deleteBooking);

module.exports = router; 