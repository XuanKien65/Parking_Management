const User = require('../models/User');

const authController = {
  // Register
  register: async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      const userId = await User.create({
        name,
        email,
        password,
        phone
      });

      const user = await User.findById(userId);

      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare password
      if (password !== user.password) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Logout
  logout: async (req, res) => {
    try {
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      const userId = req.user.id; // Assuming you have authentication middleware
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = authController; 