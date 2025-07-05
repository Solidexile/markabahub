const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const { protect } = require('../middleware/auth');

// Send friend request
router.post('/request', protect, friendController.sendFriendRequest);

// Respond to friend request
router.put('/respond/:requestId', protect, friendController.respondToRequest);

// Get all friends
router.get('/', protect, friendController.getFriends);

// Get pending friend requests
router.get('/requests', protect, friendController.getFriendRequests);

// Get friend status between users
router.get('/status/:userId', protect, friendController.getFriendStatus);

// Remove friend
router.delete('/:friendId', protect, friendController.removeFriend);

module.exports = router;