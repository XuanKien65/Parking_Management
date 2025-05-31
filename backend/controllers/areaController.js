const Area = require('../models/Areas');

const areaController = {
  // Create new area
  createArea: async (req, res) => {
    try {
      const { areaId, name, totalSpaces, availableSpaces, pricePerHour, status = 'active' } = req.body;

      // Validate required fields
      if (!areaId || !name || !totalSpaces || !availableSpaces || !pricePerHour) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          required: ['areaId', 'name', 'totalSpaces', 'availableSpaces', 'pricePerHour']
        });
      }

      // Check if area already exists
      const existingArea = await Area.findById(areaId);
      if (existingArea) {
        return res.status(400).json({ message: 'Area already exists' });
      }

      // Create new area
      const newArea = await Area.create({
        areaId,
        name,
        totalSpaces,
        availableSpaces,
        pricePerHour,
        status
      });

      res.status(201).json({
        message: 'Area created successfully',
        area: newArea
      });
    } catch (error) {
      console.error('Create area error:', error);
      res.status(500).json({ 
        message: 'Error creating area',
        error: error.message 
      });
    }
  },

  // Get all areas
  getAllAreas: async (req, res) => {
    try {
      const areas = await Area.findAll();
      res.json(areas);
    } catch (error) {
      console.error('Get all areas error:', error);
      res.status(500).json({ 
        message: 'Error fetching areas',
        error: error.message 
      });
    }
  },

  // Get area by ID
  getAreaById: async (req, res) => {
    try {
      const { id } = req.params;
      const area = await Area.findById(id);

      if (!area) {
        return res.status(404).json({ message: 'Area not found' });
      }

      res.json(area);
    } catch (error) {
      console.error('Get area error:', error);
      res.status(500).json({ 
        message: 'Error fetching area',
        error: error.message 
      });
    }
  },

  // Get available areas
  getAvailableAreas: async (req, res) => {
    try {
      const areas = await Area.findAll();
      const availableAreas = areas.filter(area => 
        area.status === 'active' && area.availableSpaces > 0
      );
      res.json(availableAreas);
    } catch (error) {
      console.error('Get available areas error:', error);
      res.status(500).json({ 
        message: 'Error fetching available areas',
        error: error.message 
      });
    }
  }
};

module.exports = areaController; 