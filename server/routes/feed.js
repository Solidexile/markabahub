const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const { protect } = require('../middleware/auth');

// Get news feed
router.get('/', protect, feedController.getNewsFeed);
// Get trending posts
router.get('/trending', protect, feedController.getTrendingPosts);

module.exports = router; 