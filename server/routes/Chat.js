const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getChats,
  accessChat,
  sendMessage,
  markAsRead
} = require('../controllers/chatController');

router.route('/')
  .get(protect, getChats)
  .post(protect, accessChat);

router.route('/:chatId/message')
  .post(protect, sendMessage);

router.route('/:chatId/read')
  .put(protect, markAsRead);

module.exports = router;