const User = require('../models/User');

const authMiddleware = {
  // Check if user is authenticated
  isAuthenticated: async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      console.log('Token received:', token);
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const user = await User.findOne({ token });
      console.log('User found:', user);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Check if user is admin
  isAdmin: async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      console.log('Admin check - Token:', token);
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const user = await User.findOne({ token });
      console.log('Admin check - User:', user);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      if (user.role !== 'admin') {
        console.log('User role:', user.role);
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Admin middleware error:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = authMiddleware; 