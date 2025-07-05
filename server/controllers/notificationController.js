const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.findAll({
    where: {
      recipient: req.user.id
    },
    order: [['createdAt', 'DESC']],
    limit: 20,
    include: [{
      model: User,
      as: 'sender',
      attributes: ['id', 'name', 'avatar', 'username']
    }]
  });

  res.json(notifications);
});

// @desc    Mark notifications as read
// @route   PUT /api/notifications/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  await Notification.update(
    { read: true },
    {
      where: {
        recipient: req.user.id,
        read: false
      }
    }
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

    // Get sender info
    const sender = await User.findByPk(senderId, {
      attributes: ['id', 'name', 'avatar', 'username']
    });

    return { ...notification.toJSON(), sender };
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findByPk(req.params.id);

  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  // Check if user owns the notification
  if (notification.recipient !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 401));
  }

  await notification.destroy();

  res.json({ success: true });
});