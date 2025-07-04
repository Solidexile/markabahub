const Friend = require('../models/Friend');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

// @desc    Send friend request
// @route   POST /api/friends/request
// @access  Private
exports.sendFriendRequest = asyncHandler(async (req, res, next) => {
  const { recipientId } = req.body;
  const requesterId = req.user.id;

  // Check if recipient exists
  const recipient = await User.findByPk(recipientId);
  if (!recipient) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Check if trying to add self
  if (recipientId === requesterId) {
    return next(new ErrorResponse('Cannot send friend request to yourself', 400));
  }

  // Check if friend request already exists
  const existingRequest = await Friend.findOne({
    where: {
      [Op.or]: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    }
  });

  if (existingRequest) {
    return next(new ErrorResponse('Friend request already exists', 400));
  }

  // Create new friend request
  const friendRequest = await Friend.create({
    requester: requesterId,
    recipient: recipientId,
    status: 'pending'
  });

  res.status(201).json(friendRequest);
});

// @desc    Respond to friend request
// @route   PUT /api/friends/respond/:requestId
// @access  Private
exports.respondToRequest = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const { action } = req.body; // 'accept', 'decline', or 'block'
  const userId = req.user.id;

  const friendRequest = await Friend.findByPk(requestId);
  if (!friendRequest) {
    return next(new ErrorResponse('Friend request not found', 404));
  }

  // Check if user is the recipient
  if (friendRequest.recipient !== userId) {
    return next(new ErrorResponse('Not authorized to respond to this request', 401));
  }

  // Update status based on action
  if (action === 'accept') {
    friendRequest.status = 'accepted';
  } else if (action === 'decline') {
    friendRequest.status = 'declined';
  } else if (action === 'block') {
    friendRequest.status = 'blocked';
  } else {
    return next(new ErrorResponse('Invalid action', 400));
  }

  await friendRequest.save();

  res.json(friendRequest);
});

// @desc    Get all friends
// @route   GET /api/friends
// @access  Private
exports.getFriends = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const friends = await Friend.findAll({
    where: {
      [Op.or]: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    }
  });

  // Transform to get friend objects
  const friendIds = friends.map(friendship => {
    return friendship.requester === userId 
      ? friendship.recipient 
      : friendship.requester;
  });

  const friendList = await User.findAll({
    where: { id: { [Op.in]: friendIds } },
    attributes: ['id', 'name', 'avatar', 'username']
  });

  res.json(friendList);
});

// @desc    Get pending friend requests
// @route   GET /api/friends/requests
// @access  Private
exports.getFriendRequests = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const requests = await Friend.findAll({
    where: {
      recipient: userId,
      status: 'pending'
    }
  });

  res.json(requests);
});

// @desc    Get friend status between users
// @route   GET /api/friends/status/:userId
// @access  Private
exports.getFriendStatus = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const otherUserId = req.params.userId;

  const status = await Friend.findOne({
    where: {
      [Op.or]: [
        { requester: userId, recipient: otherUserId },
        { requester: otherUserId, recipient: userId }
      ]
    }
  });

  res.json({ status: status ? status.status : 'none' });
});

// @desc    Remove friend
// @route   DELETE /api/friends/:friendId
// @access  Private
exports.removeFriend = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const friendId = req.params.friendId;

  const friendship = await Friend.findOne({
    where: {
      [Op.or]: [
        { requester: userId, recipient: friendId },
        { requester: friendId, recipient: userId }
      ]
    }
  });

  if (!friendship) {
    return next(new ErrorResponse('Friendship not found', 404));
  }

  await friendship.destroy();

  res.json({ success: true });
});