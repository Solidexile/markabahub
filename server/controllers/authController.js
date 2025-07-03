// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

// Helper function
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '5d' }
  );
};

// Controller Methods
const authController = {
  register: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ErrorResponse('Validation failed', 400, errors.array()));
      }

      const { name, email, password } = req.body;
      
      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return next(new ErrorResponse('User already exists', 400));
      }

      // Create user
      user = new User({
        name,
        email,
        password,
        username: email.split('@')[0] + Math.floor(Math.random() * 1000)
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Return token
      const token = generateToken(user);
      res.status(201).json({ success: true, token });
    } catch (err) {
      next(new ErrorResponse('Registration failed', 500));
    }
  },

  login: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ErrorResponse('Validation failed', 400, errors.array()));
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
      }

      const token = generateToken(user);
      res.json({ success: true, token });
    } catch (err) {
      next(new ErrorResponse('Login failed', 500));
    }
  },

  getMe: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json({ success: true, data: user });
    } catch (err) {
      next(new ErrorResponse('Server error', 500));
    }
  },

  googleLogin: async (req, res, next) => {
    try {
      const { uid, email, displayName, photoURL } = req.body;
      let user = await User.findOne({ email });

      if (!user) {
        user = new User({
          uid,
          email,
          name: displayName,
          avatar: photoURL,
          username: email.split('@')[0] + Math.floor(Math.random() * 1000),
          provider: 'google',
          password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
          verified: true
        });
        await user.save();
      }

      const token = generateToken(user);
      res.json({ success: true, token });
    } catch (err) {
      next(new ErrorResponse('Google auth failed', 500));
    }
  },

  logout: async (req, res, next) => {
    res.json({ success: true, message: 'Logged out successfully' });
  }
};

module.exports = authController;