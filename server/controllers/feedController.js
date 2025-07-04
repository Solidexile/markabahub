const Post = require('../models/Post');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

// @desc    Get news feed
// @route   GET /api/feed
// @access  Private
exports.getNewsFeed = asyncHandler(async (req, res, next) => {
  // For now, just get all public posts and the user's own posts (expand to friends if you add a friends table/relationship)
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const where = {
    [Op.or]: [
      { privacy: 'public' },
      { userId: req.user.id },
      // Add logic for friends' posts if you have a friends table/relationship
    ]
  };

  const { rows: posts, count: total } = await Post.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });

  res.json({
    success: true,
    count: posts.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: posts
  });
});

// @desc    Get trending posts
// @route   GET /api/feed/trending
// @access  Private
exports.getTrendingPosts = asyncHandler(async (req, res, next) => {
  // For now, get the most recent posts (expand to most liked/commented if you add those fields)
  const posts = await Post.findAll({
    where: {
      createdAt: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    },
    order: [['createdAt', 'DESC']],
    limit: 10
  });

  res.json({
    success: true,
    count: posts.length,
    data: posts
  });
});