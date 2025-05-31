const User = require('../models/User');
const crypto = require('crypto');

const registerController = {
  register: async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Generate token
      const token = crypto.randomBytes(32).toString('hex');

      // Create new user
      const user = new User({
        name,
        email,
        password,
        phone,
        role: 'user',
        token
      });

      await user.save();

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = registerController; 