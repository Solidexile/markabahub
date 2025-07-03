// server/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Debug: Verify controller methods exist
console.log('Auth Controller Methods:', {
  register: typeof authController.register,
  login: typeof authController.login,
  getMe: typeof authController.getMe,
  googleLogin: typeof authController.googleLogin,
  logout: typeof authController.logout
});

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);

// Protected routes
router.get('/me', protect, authController.getMe);
router.get('/logout', protect, authController.logout);

module.exports = router;