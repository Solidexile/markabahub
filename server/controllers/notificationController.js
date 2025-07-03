const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({
    recipient: req.user.id
  })
  .sort('-createdAt')
  .limit(20)
  .populate('sender', 'name avatar username');

  res.json(notifications);
});

// @desc    Mark notifications as read
// @route   PUT /api/notifications/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user.id, read: false },
    { $set: { read: true } }
  );

  res.json({ success: true });
});

// @desc    Create notification (internal use)
// @access  Private
exports.createNotification = async (recipientId, senderId, type, content, relatedItem = null) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      content,
      relatedItem
    });

    // Populate sender info
    await notification.populate('sender', 'name avatar username');

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  // Check if user owns the notification
  if (!notification.recipient.equals(req.user.id)) {
    return next(new ErrorResponse('Not authorized', 401));
  }

  await notification.remove();

  res.json({ success: true });
});