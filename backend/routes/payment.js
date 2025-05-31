const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Payment routes
router.post('/', paymentController.createPayment);
router.get('/user/:userId', paymentController.getUserPayments);
router.get('/:id', paymentController.getPaymentById);
router.patch('/:id/status', paymentController.updatePaymentStatus);

module.exports = router; 