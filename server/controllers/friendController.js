const Friend = require('../models/Friend');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Send friend request
// @route   POST /api/friends/request
// @access  Private
exports.sendFriendRequest = asyncHandler(async (req, res, next) => {
  const { recipientId } = req.body;
  const requesterId = req.user.id;

  // Check if recipient exists
  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Check if trying to add self
  if (recipientId === requesterId) {
    return next(new ErrorResponse('Cannot send friend request to yourself', 400));
  }

  // Check if friend request already exists
  const existingRequest = await Friend.findOne({
    $or: [
      { requester: requesterId, recipient: recipientId },
      { requester: recipientId, recipient: requesterId }
    ]
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

  // Populate the requester and recipient details
  await friendRequest.populate('requester', 'name avatar');
  await friendRequest.populate('recipient', 'name avatar');

  res.status(201).json(friendRequest);
});

// @desc    Respond to friend request
// @route   PUT /api/friends/respond/:requestId
// @access  Private
exports.respondToRequest = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const { action } = req.body; // 'accept', 'decline', or 'block'
  const userId = req.user.id;

  const friendRequest = await Friend.findById(requestId)
    .populate('requester', 'name avatar')
    .populate('recipient', 'name avatar');

  if (!friendRequest) {
    return next(new ErrorResponse('Friend request not found', 404));
  }

  // Check if user is the recipient
  if (friendRequest.recipient._id.toString() !== userId) {
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

  const friends = await Friend.find({
    $or: [
      { requester: userId, status: 'accepted' },
      { recipient: userId, status: 'accepted' }
    ]
  })
  .populate('requester', 'name avatar username')
  .populate('recipient', 'name avatar username');

  // Transform to get friend objects
  const friendList = friends.map(friendship => {
    return friendship.requester._id.toString() === userId 
      ? friendship.recipient 
      : friendship.requester;
  });

  res.json(friendList);
});

// @desc    Get pending friend requests
// @route   GET /api/friends/requests
// @access  Private
exports.getFriendRequests = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const requests = await Friend.find({
    recipient: userId,
    status: 'pending'
  }).populate('requester', 'name avatar username');

  res.json(requests);
});

// @desc    Get friend status between users
// @route   GET /api/friends/status/:userId
// @access  Private
exports.getFriendStatus = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const otherUserId = req.params.userId;

  const status = await Friend.getFriendStatus(userId, otherUserId);

  res.json({ status });
});

// @desc    Remove friend
// @route   DELETE /api/friends/:friendId
// @access  Private
exports.removeFriend = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const friendId = req.params.friendId;

  const friendship = await Friend.findOneAndDelete({
    $or: [
      { requester: userId, recipient: friendId },
      { requester: friendId, recipient: userId }
    ]
  });

  if (!friendship) {
    return next(new ErrorResponse('Friendship not found', 404));
  }

  res.json({ success: true });
});