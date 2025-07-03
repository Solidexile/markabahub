const Story = require('../models/Story');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a story
// @route   POST /api/stories
// @access  Private
exports.createStory = asyncHandler(async (req, res, next) => {
  const { caption } = req.body;
  
  if (!req.file) {
    return next(new ErrorResponse('Please upload a media file', 400));
  }

  const story = await Story.create({
    user: req.user.id,
    media: req.file.path,
    mediaType: req.file.mimetype.startsWith('video') ? 'video' : 'image',
    caption
  });

  await story.populate('user', 'name avatar username');

  res.status(201).json(story);
});

// @desc    Get stories from friends
// @route   GET /api/stories
// @access  Private
exports.getStories = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('friends');
  
  // Get IDs of friends and user themselves
  const friendIds = user.friends.map(friend => friend._id);
  const allUserIds = [...friendIds, req.user.id];

  // Get stories from friends and user
  const stories = await Story.find({
    user: { $in: allUserIds }
  })
  .populate('user', 'name avatar username')
  .sort('-createdAt');

  // Group stories by user
  const storiesByUser = {};
  stories.forEach(story => {
    if (!storiesByUser[story.user._id]) {
      storiesByUser[story.user._id] = {
        user: story.user,
        stories: []
      };
    }
    storiesByUser[story.user._id].stories.push(story);
  });

  res.json(Object.values(storiesByUser));
});

// @desc    View a story
// @route   PUT /api/stories/:id/view
// @access  Private
exports.viewStory = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new ErrorResponse('Story not found', 404));
  }

  // Check if user has already viewed the story
  if (!story.hasViewed(req.user.id)) {
    story.viewers.push({ user: req.user.id });
    await story.save();
  }

  res.json(story);
});

// @desc    Delete a story
// @route   DELETE /api/stories/:id
// @access  Private
exports.deleteStory = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new ErrorResponse('Story not found', 404));
  }

  // Check if user owns the story
  if (story.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this story', 401));
  }

  await story.remove();

  res.json({ success: true });
});