const Story = require('../models/Story');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

// @desc    Create a story
// @route   POST /api/stories
// @access  Private
exports.createStory = asyncHandler(async (req, res, next) => {
  const { caption } = req.body;
  
  if (!req.file) {
    return next(new ErrorResponse('Please upload a media file', 400));
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  const story = await Story.create({
    userId: req.user.id,
    media: req.file.path,
    mediaType: req.file.mimetype.startsWith('video') ? 'video' : 'image',
    caption,
    expiresAt,
    viewers: [],
  });

  await story.populate('user', 'name avatar username');

  res.status(201).json(story);
});

// @desc    Get stories from friends
// @route   GET /api/stories
// @access  Private
exports.getStories = asyncHandler(async (req, res, next) => {
  // For now, just get all stories for the user (expand to friends if needed)
  const stories = await Story.findAll({
    where: {
      [Op.or]: [
        { userId: req.user.id },
        // Add logic for friends' stories if you have a friends table/relationship
      ],
      expiresAt: { [Op.gt]: new Date() },
    },
    order: [['createdAt', 'DESC']],
  });
  res.json(stories);
});

// @desc    View a story
// @route   PUT /api/stories/:id/view
// @access  Private
exports.viewStory = asyncHandler(async (req, res, next) => {
  const story = await Story.findByPk(req.params.id);

  if (!story) {
    return next(new ErrorResponse('Story not found', 404));
  }

  let viewers = story.viewers || [];
  if (!viewers.some(v => v.userId === req.user.id)) {
    viewers.push({ userId: req.user.id, viewedAt: new Date() });
    story.viewers = viewers;
    await story.save();
  }

  res.json(story);
});

// @desc    Delete a story
// @route   DELETE /api/stories/:id
// @access  Private
exports.deleteStory = asyncHandler(async (req, res, next) => {
  const story = await Story.findByPk(req.params.id);

  if (!story) {
    return next(new ErrorResponse('Story not found', 404));
  }

  if (story.userId !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this story', 401));
  }

  await story.destroy();

  res.json({ success: true });
});