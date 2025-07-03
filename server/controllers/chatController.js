const Chat = require('../models/Chat');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all chats for a user
// @route   GET /api/chat
// @access  Private
exports.getChats = asyncHandler(async (req, res, next) => {
  const chats = await Chat.find({
    participants: req.user.id
  })
  .populate('participants', 'name avatar username')
  .populate('messages.sender', 'name avatar')
  .sort('-updatedAt');

  res.json(chats);
});

// @desc    Create or access a chat
// @route   POST /api/chat
// @access  Private
exports.accessChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return next(new ErrorResponse('User ID is required', 400));
  }

  // Check if chat already exists
  let chat = await Chat.findOne({
    participants: {
      $all: [req.user.id, userId],
      $size: 2
    }
  })
  .populate('participants', 'name avatar username')
  .populate('messages.sender', 'name avatar');

  if (!chat) {
    // Create new chat
    chat = await Chat.create({
      participants: [req.user.id, userId]
    });
    
    await chat.populate('participants', 'name avatar username');
  }

  res.json(chat);
});

// @desc    Send a message
// @route   POST /api/chat/:chatId/message
// @access  Private
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return next(new ErrorResponse('Message content is required', 400));
  }

  const chat = await Chat.findById(req.params.chatId);

  if (!chat) {
    return next(new ErrorResponse('Chat not found', 404));
  }

  // Check if user is a participant
  if (!chat.participants.includes(req.user.id)) {
    return next(new ErrorResponse('Not authorized', 401));
  }

  // Add message
  const message = {
    sender: req.user.id,
    content,
    read: false
  };

  chat.messages.push(message);
  await chat.save();

  // Populate sender info
  await chat.populate('messages.sender', 'name avatar');

  const newMessage = chat.messages[chat.messages.length - 1];
  
  res.status(201).json(newMessage);
});

// @desc    Mark messages as read
// @route   PUT /api/chat/:chatId/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.chatId);

  if (!chat) {
    return next(new ErrorResponse('Chat not found', 404));
  }

  // Mark all unread messages from other participants as read
  chat.messages.forEach(message => {
    if (!message.read && !message.sender.equals(req.user.id)) {
      message.read = true;
    }
  });

  await chat.save();

  res.json({ success: true });
});