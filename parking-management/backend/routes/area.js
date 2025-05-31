const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');

// Area routes
router.post('/', areaController.createArea);
router.get('/', areaController.getAllAreas);
router.get('/available', areaController.getAvailableAreas);
router.get('/:id', areaController.getAreaById);

module.exports = router; 