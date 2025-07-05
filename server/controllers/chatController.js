const Chat = require('../models/Chat');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

// @desc    Get all chats for a user
// @route   GET /api/chat
// @access  Private
exports.getChats = asyncHandler(async (req, res, next) => {
  const chats = await Chat.findAll({
    where: {
      participants: {
        [Op.contains]: [req.user.id]
      }
    },
    order: [['updatedAt', 'DESC']]
  });

  // Populate participants and messages with user data
  const populatedChats = await Promise.all(chats.map(async (chat) => {
    const participantUsers = await User.findAll({
      where: { id: chat.participants },
      attributes: ['id', 'name', 'avatar', 'username']
    });

    const messagesWithUsers = await Promise.all(chat.messages.map(async (message) => {
      const sender = await User.findByPk(message.sender, {
        attributes: ['id', 'name', 'avatar']
      });
      return { ...message, sender };
    }));

    return {
      ...chat.toJSON(),
      participants: participantUsers,
      messages: messagesWithUsers
    };
  }));

  res.json(populatedChats);
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
    where: {
      participants: {
        [Op.contains]: [req.user.id, userId]
      }
    }
  });

  if (!chat) {
    // Create new chat
    chat = await Chat.create({
      participants: [req.user.id, userId],
      messages: []
    });
  }

  // Populate participants and messages
  const participantUsers = await User.findAll({
    where: { id: chat.participants },
    attributes: ['id', 'name', 'avatar', 'username']
  });

  const messagesWithUsers = await Promise.all(chat.messages.map(async (message) => {
    const sender = await User.findByPk(message.sender, {
      attributes: ['id', 'name', 'avatar']
    });
    return { ...message, sender };
  }));

  const populatedChat = {
    ...chat.toJSON(),
    participants: participantUsers,
    messages: messagesWithUsers
  };

  res.json(populatedChat);
});

// @desc    Send a message
// @route   POST /api/chat/:chatId/message
// @access  Private
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return next(new ErrorResponse('Message content is required', 400));
  }

  const chat = await Chat.findByPk(req.params.chatId);

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
    read: false,
    createdAt: new Date()
  };

  const updatedMessages = [...chat.messages, message];
  await chat.update({ messages: updatedMessages });

  // Get sender info
  const sender = await User.findByPk(req.user.id, {
    attributes: ['id', 'name', 'avatar']
  });

  const newMessage = { ...message, sender };
  
  res.status(201).json(newMessage);
});

// @desc    Mark messages as read
// @route   PUT /api/chat/:chatId/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findByPk(req.params.chatId);

  if (!chat) {
    return next(new ErrorResponse('Chat not found', 404));
  }

  // Mark all unread messages from other participants as read
  const updatedMessages = chat.messages.map(message => {
    if (!message.read && message.sender !== req.user.id) {
      return { ...message, read: true };
    }
    return message;
  });

  await chat.update({ messages: updatedMessages });

  res.json({ success: true });
});