const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const bookingRoutes = require('./booking');
const paymentRoutes = require('./payment');
const areaRoutes = require('./area');
const adminRoutes = require('./adminRoutes');

// Use auth routes
router.use('/auth', authRoutes);

// Use booking routes
router.use('/booking', bookingRoutes);

// Use payment routes
router.use('/payment', paymentRoutes);

// Use area routes
router.use('/areas', areaRoutes);

// Use admin routes
router.use('/admin', adminRoutes);

module.exports = router;
